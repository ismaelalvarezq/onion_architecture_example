const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getTokenCreateUser, createUserAtenea, updateUserAtenea, deleteUserRole } = require('../auth/store');
const { getPlanConfigByCompany } = require('../plan/store');

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const constants = require('../../constants.js');
const { generateSignedUrl } = require('../../helper/filesS3');
const { formatTime } = require("../../utils/timeUtils.js");

const getBot = async (idCompany) => {
  const bot = await prisma.agent.findFirst({
    where: {
      type: constants.agents.types.BOT,
      areas: {
        some: {
          area: {
            idCompany
          },
        }
      },
    },
  });
  return bot;
}

const getAllAgents = async() => {
  const allAgents = await prisma.agent.findMany();
  return allAgents;
}

const getAgent = async (id) => {
  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      areas: {
        include: {
          area: true,
        }
      },
    }
  });
  if (agent) {
    agent.idCompany = agent.areas[0].area.idCompany;
    agent.fullname = `${agent.firstName}` + (agent.lastName ? ` ${agent.lastName}` : '');
  }
  return agent;
};

const getAgentByIdExternal = async (idExternal) => {
  const agent = await prisma.agent.findFirst(
    {
      where: {
        idExternal: idExternal,
      },
      include: {
        areas: {
          include: {
            area: true,
          }
        },
        scheduleDay: {
          orderBy: {
            weekDay: 'asc',
          },
          include: {
            scheduleRanges: {
              orderBy: {
                startTime: 'asc',
              }
            }
          }
        }
      }
    }
  )
  if (agent) {
    agent.idCompany = agent.areas[0].area.idCompany;
    agent.fullname = `${agent.firstName}` + (agent.lastName ? ` ${agent.lastName}` : '');
    const planConfig = await getPlanConfigByCompany(agent.idCompany);
    if (!planConfig) {
      throw new BadRequestError(null, 'No se encontró el plan de la compañía', '[getAgentByIdExternal] Not found');
    }
    agent.planConfig = planConfig;
  }

  if (agent?.avatarUrl){
    const url = await generateSignedUrl(agent.avatarUrl);
    agent.avatarUrl = url;
  }

  return {
    ...agent,
    scheduleDay: agent?.scheduleDay?.map((scheduleDay) => {
      const { id, weekDay, isActive, scheduleRanges } = scheduleDay;
      return {
        id,
        weekDay,
        isActive,
        scheduleRanges: scheduleRanges.map((range) => {
          const { id, startTime, endTime } = range;
          return {
            id,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
          };
        })
      };
    })
  };
};

const getAgents = async (query) => {
  const idCompany = query.where.idCompany;
  if (idCompany) {
    query.where.areas = {
      every: {
        area: {
          idCompany,
        },
      },
    };
    delete query.where.idCompany;
  }

  query = {
    ...query,
    include: {
      areas: {
        include: {
          area: true,
        }
      },
    }
  };

  let agents = await prisma.agent.findMany(query);

  agents = agents.map((agent) => ({
    ...agent,
    idCompany: agent.areas[0].area.idCompany,
    fullname: `${agent.firstName}` + (agent.lastName ? ` ${agent.lastName}` : ''),
  }))

  delete query["skip"];
  delete query["take"];
  delete query["include"];

  query["_count"] = { id: true };

  const totalAgents = (await prisma.agent.aggregate(query))._count.id;

  return { items: agents, total_items: totalAgents };
};

const getAvailableAgents = async (idCompany) => {
  let query = {
    where: {
      AND: [
          {
            areas: {
              every: {
                area: {
                  idCompany,
                },
              }
            },
          },
          {
            available: true,
          },
          {
            isConnected: true,
          },
          {
            OR: [
              {type: constants.agents.types.AGENT},
              {type: constants.agents.types.ADMIN},
            ],
          }
        ]
    },
    include: {
      areas: {
        include: {
          area: true,
        }
      },
    }
  }

  return await prisma.agent.findMany(query);
};

const createAgent = async (agent, transaction) => {
  const createAgentWithTransaction = async (transaction) => {
    const idCompany = agent.idCompany;
    delete agent.idCompany;
    const area = await transaction.area.findFirst({ where: { idCompany, name: constants.areas.name.NO_AREA } });
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(agent.password, salt);
    const newAgent = await transaction.agent.create({
      data: {
        ...agent,
        password: hashPassword,
        areas: {
          create: [{ area: { connect: { id: area.id } } }],
        }
      },
    });
    const token = await getTokenCreateUser();
    const userAtenea = await createUserAtenea(agent, token.access_token);
    if (userAtenea.status === true) {
      await transaction.agent.update({
        where: { id: newAgent.id },
        data: { idExternal: userAtenea.user.id },
      });
      newAgent.idExternal = userAtenea.user.id;
    }
    delete newAgent.password;
    newAgent.fullname = `${newAgent.firstName}` + (newAgent.lastName ? ` ${newAgent.lastName}` : '');
    return newAgent;
  }
  if (!transaction) {
    return await prisma.$transaction(createAgentWithTransaction);
  }
  return await createAgentWithTransaction(transaction);
};

const updateAgent = async (agent, authorizationAtenea, transaction) => {
  const updateAgentWithTransaction = async (transaction) => {
    const idCompany = agent.idCompany;
    delete agent.idCompany;

    const currentAgent = await getAgent(agent.id);
    let updatedAgent = await transaction.agent.update({
      where: { id: agent.id },
      data: agent,
    });

    if (idCompany && currentAgent.idCompany !== idCompany) {
      const area = await transaction.area.findFirst({
        where: { idCompany, name: constants.areas.name.NO_AREA },
      });
      if (!area) {
        throw new InternalServerError(null, "No se encontro un area para la compañía.", "[updateAgent] no area.");
      }
      await transaction.areas_on_agents.deleteMany({
        where: {
          agentId: agent.id,
        }
      });
      await transaction.areas_on_agents.create({ data: { areaId: area.id, agentId: agent.id } });
    }

    let dataAtenea = {};

    if (agent.firstName) {
      dataAtenea["name"] = agent.firstName;
    }

    if (agent.lastName) {
      dataAtenea["last_name"] = agent.lastName;
    }

    if (agent.rut) {
      dataAtenea["dni"] = agent.rut;
    }

    if (agent.type) {
      dataAtenea["role"] =
        agent.type === constants.agents.types.AGENT ||
          agent.type === constants.agents.types.BOT
          ? constants.agents.trust.AGENT
          : constants.agents.trust.ADMIN;
    }

    if (agent.avatarUrl) {
      dataAtenea["img"] = agent.avatarUrl;
    }

    if (agent.phone) {
      dataAtenea["phone_number"] = agent.phone;
    }

    if (Object.keys(dataAtenea).length > 0) {
      const token = await getTokenCreateUser();
      const userAtenea = await updateUserAtenea(updatedAgent.idExternal, dataAtenea, token.access_token);
      if (dataAtenea.role && currentAgent.type !== updatedAgent.type) {
        if (dataAtenea.role === constants.agents.trust.AGENT) {
          await deleteUserRole(constants.agents.trust.ADMIN, userAtenea.user?.id, authorizationAtenea)
        } else if (dataAtenea.role === constants.agents.trust.ADMIN) {
          await deleteUserRole(constants.agents.trust.AGENT, userAtenea.user?.id, authorizationAtenea)
        }
      }
    }

    updatedAgent = await transaction.agent.findUnique({
      where: { id: agent.id },
      include: {
        areas: {
          include: {
            area: true,
          }
        },
      }
    });
    updatedAgent.idCompany = updatedAgent.areas[0].area.idCompany;
    updatedAgent.fullname = `${updatedAgent.firstName}` + (updatedAgent.lastName ? ` ${updatedAgent.lastName}` : '');
    return updatedAgent;
  };
  if (!transaction) {
    return await prisma.$transaction(updateAgentWithTransaction);
  }
  return await updateAgentWithTransaction(transaction);
};

const updateAvatarAgent = async (idAgent, avatarUrl) => {
  return await prisma.agent.update({
    where: { id: idAgent },
    data: { avatarUrl },
  });
};

function getRoles() {
  return constants.agents.types;
}

module.exports = {
  getBot,
  getAgent,
  getAgentByIdExternal,
  getAgents,
  createAgent,
  updateAgent,
  getRoles,
  getAllAgents,
  getAvailableAgents,
  updateAvatarAgent,
}
