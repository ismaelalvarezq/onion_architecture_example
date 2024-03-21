const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const { config } = require('dotenv');


const getFlow = async (id) => {
  return await prisma.flow.findUnique({
    where: { id },
    include: {
      channels: {
        include: { channel: true }
      }
    }
  });
};

const getFlows = async (query) => {
  return await prisma.flow.findMany(query);
};

const createFlow = async (flow) => {
  flow.channels = {
    create: flow.channels.map((idChannel) => ({
      channel: { connect: { id: idChannel } },
    })),
  };

  return await prisma.flow.create({
    data: flow,
    include: {
      channels: {
        include: { channel: true }
      }
    }
  });
};

const updateFlow = async (flow) => {
  flow.channels = {
    deleteMany: { idFlow: flow.id },
    create: flow.channels.map((idChannel) => ({
      channel: { connect: { id: idChannel } },
    })),
  };

  return await prisma.flow.update({
    where: { id: flow.id },
    data: flow,
    include: {
      channels: {
        include: { channel: true }
      }
    }
  })
};

const deleteFlow = async (id) => {
  return await prisma.flow.delete({ where: { id: id } })
};

const getConfigJson = async (query) => {
  return prisma.flow.findMany(query)
    .then((configJson) => {
      return (configJson.length > 0) ? configJson[0].jsonFile : configJson;
    })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del json de configuración.", "[getConfigJson] Bad request");
    });
};


module.exports = {
  getFlow,
  getFlows,
  createFlow,
  updateFlow,
  deleteFlow,

  getConfigJson
}
