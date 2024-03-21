const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

async function getFlowFeedback(id) {
  return prisma.flow_feedback.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del feedback.", "[getFlowFeedback] Bad request");
    });
}

async function getFlowFeedbacks(query) {
  return prisma.flow_feedback.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los feedbacks.", "[getFlowFeedbacks] Bad request");
    });
}

async function getFlowFeedbackStatistics(query) {
  return prisma.flow_feedback.groupBy(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las estadísticas de los feedbacks.", "[getFlowFeedbacksStatistics] Bad request");
    }); 
}

async function createFlowFeedback(feedback, transaction) {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.flow_feedback.create({ data: feedback })
}

async function updateFlowFeedback(feedback) {
  return prisma.flow_feedback.update({ "where": { "id": feedback.id }, "data": feedback })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del feedback.", "[updateFlowFeedback] Error with FK: " + error.meta.field_name);
      }else if(error.code == "P2025"){
        throw new NotFoundError(error, "Error en la actualización del feedback.", "[updateFlowFeedback] " + error.meta.cause);
      }else{
        throw new InternalServerError(error, "Error en la actualización del feedback.", "[updateFlowFeedback] Bad request");
      }
    });
}

async function deleteFlowFeedback(id) {
  return prisma.flow_feedback.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del feedback.", "[deleteFlowFeedback] " + error.meta.cause);
      }else{
        throw new InternalServerError(error, "Error en la eliminación del feedback.", "[deleteFlowFeedback] Bad request");
      }
    });
}

module.exports = {
  getFlowFeedback,
  getFlowFeedbacks,
  createFlowFeedback,
  updateFlowFeedback,
  deleteFlowFeedback,
  getFlowFeedbackStatistics
}