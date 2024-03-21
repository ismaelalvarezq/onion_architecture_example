const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const beAwareResolver = require('../be_aware/resolver.js')
const { validator } = require('../../helper/validator/index.js');
const { schema } = require('../../helper/validator/schemas/agent');
const { schemaChangeAgentAvailability } = require('../../helper/validator/schemas/changeAgentAvailability');
const { schemaAvatarAgent } = require('../../helper/validator/schemas/avatarAgent');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');
const constants = require('../../constants.js');
const catchAsync = require('../../utils/catchAsync.js');
const currentComponent = "agent";
const avatarColors = constants.avatar.COLORS;
const { storeFileS3, generateSignedUrl, deleteFileS3 } = require('../../helper/filesS3');
const { validateSchedule } = require('../scheduleDay/controller.js');

const createAgent = catchAsync(async (req, res, next) => {
  let agent = req.body;

  validator(schema, agent, "Post");

  if (agent.age) { agent.age = parseInt(agent.age) }
  if (!agent.status) { agent.status = constants.agents.status.ENABLED }
  if (!agent.type) { agent.type = constants.agents.types.AGENT }

  const password = agent.email.split("@")[0];
  agent.password = password;

  agent.initials = `${agent.firstName ? agent.firstName[0] : ''}${agent.lastName ? agent.lastName[0] : ''}`.toUpperCase();
  agent.avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  if (req.ctx.user.type === constants.agents.types.ADMIN && agent.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden crear agentes en otras compañías.", "[createAgent] forbidden error");
  }

  const newAgent = await store.createAgent(agent);
  response.success(req, res, newAgent, "response", 201);
});

const getAgent = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getAgent] Missing params");
  const agent = await store.getAgent(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && req.ctx.user.idCompany !== agent.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener agentes de otras compañías.", "[getAgent] forbidden error");
  }

  if (agent?.avatarUrl) {
    const url = await generateSignedUrl(agent.avatarUrl);
    agent.avatarUrl = url;
  }

  delete agent?.password;
  response.success(req, res, agent, "response", 200);
});

const getAgents = catchAsync(async (req, res, next) => {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let filterItems = {};
  let orderBy = [];
  let query = {};

  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).map((key) => {
      if (key != "offset" && key != "limit" && key != "orderBy" && key != "password") {
        filterItems[key] = req.query[key];
      } else if (key == "orderBy") {
        orderItems = req.query[key].split(",");
        orderItems.map((orderItem) => {
          var item = orderItem.split(" ");
          orderBy.push({ "attribute": item[0], "type": item[1] });
        });
      }
    });
  }

  query["skip"] = parseInt(req.query.offset) || 0;
  query["take"] = parseInt(req.query.limit) || 100;

  if (Object.keys(filterItems).length > 0) {
    query["where"] = {};
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if ((variableType == "String" || key === "name") && !key.startsWith("id")) {
        if (key === "name") {
          const nameSections = filterItems[key].split(" ");
          query["where"] = {
            "AND": nameSections.map((word) => ({ OR: [{ firstName: { "contains": `${word}`, mode: "insensitive" } }, { lastName: { "contains": `${word}`, mode: "insensitive" } }] }))
          };
        } else {
          query["where"][key] = { "contains": filterItems[key], mode: "insensitive" };
        }
      } else if (variableType == "Int") {
        query["where"][key] = parseInt(filterItems[key]);
      } else {
        query["where"][key] = filterItems[key];
      }
    });
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      if (orderItem.attribute == "fullName") {
        query["orderBy"].push({ "firstName": orderItem.type }, { "lastName": orderItem.type });
      } else {
        query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
      }
    });
  } else {
    query["orderBy"] = { "id": "asc" };
  }

  if (req.query.idCompany) {
    query.where = {
      ...query.where,
      areas: {
        some: {
          area: {
            idCompany: req.query.idCompany,
          }
        }
      }
    };
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    query.where = {
      ...query.where,
      areas: {
        some: {
          area: {
            idCompany: req.ctx.user.idCompany,
          }
        }
      }
    };
  };

  if (req.query.idArea) {
    delete query.where.idArea;
    if (query.where?.areas?.some?.area) {
      query.where.areas.some.area.id = req.query.idArea;
    } else {
      query.where = {
        ...query.where,
        areas: {
          some: {
            area: {
              id: req.query.idArea,
            },
          },
        },
      };
    }
  }

  if (req.query.available) {
    query.where = {
      ...query.where,
      available: req.query.available === "true" ? true : false,
    }
  }

  if (req.query.isConnected) {
    query.where = {
      ...query.where,
      isConnected: req.query.isConnected === "true" ? true : false,
    }
  }

  const agents = await store.getAgents(query);

  agents.items.map((agent) => {
    delete agent.password;
    delete agent.avatarUrl;
  });
  response.success(req, res, { "url": fullUrl, "results": agents }, "paginatedResponse", 200);
});

const updateAgent = catchAsync(async (req, res, next) => {
  let agent = req.body;
  agent.id = req.params.id;

  validator(schema, agent, "Patch");

  if (agent.age) { agent.age = parseInt(agent.age) };
  if (agent.firstName) { // Si se actualiza firstName o lastName, se debe volver a generar las iniciales
    agent.firstName = agent.firstName[0].toUpperCase() + agent.firstName.substring(1);
  }
  if (agent.lastName) {
    agent.lastName = agent.lastName[0].toUpperCase() + agent.lastName.substring(1);
  }
  if (agent.firstName || agent.lastName) {
    agent.initials = `${agent.firstName ? agent.firstName[0] : ''}${agent.lastName ? agent.lastName[0] : ''}`.toUpperCase();
  }
  if (req.ctx.user.type === constants.agents.types.AGENT && agent.id !== req.ctx.user.id) {
    throw new ForbiddenError(null, "No puedes editar otros agentes.", "[updateAgent] forbidden error");
  }

  const agentData = await store.getAgent(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && agentData.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden editar agentes de otras compañías.", "[updateAgent] forbidden error");
  }

  const updatedAgent = await store.updateAgent(agent, req.headers.authorization);

  delete updatedAgent.password;

  response.success(req, res, updatedAgent, "response", 200);
});

const changeAgentAvailability = catchAsync(async (req, res, next) => {
  const { available } = req.body;

  validator(schemaChangeAgentAvailability, { available, id: req.params.id }, "Put");

  const agent = { available, id: req.params.id };

  if (req.ctx.user.type === constants.agents.types.AGENT && agent.id !== req.ctx.user.id) {
    throw new ForbiddenError(null, "No puedes editar otros agentes.", "[changeAgentAvailability] forbidden error");
  }

  const agentData = await store.getAgent(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && agentData.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden editar agentes de otras compañías.", "[changeAgentAvailability] forbidden error");
  }

  const updatedAgent = await store.updateAgent(agent);
  delete updatedAgent.password;
  response.success(req, res, updatedAgent, "response", 200);
});

const getAvailableAgents = catchAsync(async (req, res, next) => {
  const availableAgents = [];
  if (!req.params.idCompany) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getAvailableAgents] Missing params");

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && req.params.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden reasignar a agentes de otras compañías.", "[getAvailableAgents] forbidden error");
  }

  const posibleAgents = await store.getAvailableAgents(req.params.idCompany);

  for await (const agent of posibleAgents) {
    let isOnSchedule = await validateSchedule(agent.id);
    if (isOnSchedule) availableAgents.push(agent);
  }
  response.success(req, res, availableAgents, "response", 200);
});

const getRoles = catchAsync(async (req, res, next) => {
  const roles = await store.getRoles();
  response.success(req, res, roles, "response", 200);
});

const getAllAgents = catchAsync(async (req, res, next) => {
  const agents = await store.getAllAgents();
  response.success(req, res, agents, "response", 200);
});

const updateAvatarAgent = catchAsync(async (req, res, next) => {
  const { mimetype, originalname } = req.file;

  const avatar = {
    file: req.file,
    id: req.params.id,
    type: mimetype,
    fileName: originalname,
  };

  validator(schemaAvatarAgent, avatar, "Put");

  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) &&
    req.params.id !== req.ctx.user.id
  ) {
    throw new ForbiddenError(
      null,
      "No puedes editar otros agentes.",
      "[updateAvatarAgent] forbidden error"
    );
  }

  const agentData = await store.getAgent(req.params.id);
  if (
    [constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(
      req.ctx.user.type
    ) &&
    agentData.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden editar agentes de otras compañías.",
      "[updateAvatarAgent] forbidden error"
    );
  }

  const key = `${avatar.id}/${agentData.idCompany}/${avatar.fileName}`;

  if (agentData.avatarUrl) {
    await deleteFileS3(agentData.avatarUrl);
  }

  await storeFileS3(avatar.file.buffer, avatar.type, key);

  const updatedAvatar = await store.updateAvatarAgent(avatar.id, key);

  if (updatedAvatar.avatarUrl) {
    const url = await generateSignedUrl(key);
    updatedAvatar.avatarUrl = url;
  }
  delete updatedAvatar.password;
  response.success(req, res, updatedAvatar, "response", 200);
});

module.exports = {
  getAgent,
  getAgents,
  createAgent,
  updateAgent,
  changeAgentAvailability,
  getRoles,
  getAllAgents,
  getAvailableAgents,
  updateAvatarAgent,
}
