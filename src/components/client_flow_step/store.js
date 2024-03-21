const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getClientFlowStep(id) {
  return prisma.client_flow_step.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del flujo del cliente.", "[getClientFlowStep] Bad request");
    });
}

async function getClientFlowsStep(query) {
  return prisma.client_flow_step.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los flujos del cliente.", "[getBlocks] Bad request");
    });
}

const createClientFlowStep = async (clientFlowStep, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.client_flow_step.create({ data: clientFlowStep })
};

async function updateClientFlowStep(clientFlowStep) {
  return prisma.client_flow_step.update({ "where": { "id": clientFlowStep.id }, "data": clientFlowStep })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del flujo del cliente.", "[updateClientFlowStep] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del flujo del cliente.", "[updateClientFlowStep] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del flujo del cliente.", "[updateClientFlowStep] Bad request");
      }
    });
}

async function deleteClientFlowStep(id) {
  return prisma.client_flow_step.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del flujo del cliente.", "[deleteClientFlowStep] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del flujo del cliente.", "[deleteClientFlowStep] Bad request");
      }
    });
}


module.exports = {
  getClientFlowStep,
  getClientFlowsStep,
  createClientFlowStep,
  updateClientFlowStep,
  deleteClientFlowStep
}
