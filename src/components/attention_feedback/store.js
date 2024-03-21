const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

async function getAttentionFeedback(id) {
  return prisma.attention_feedback.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del feedback.", "[getAttentionFeedback] Bad request");
    });
}

async function getAttentionFeedbacks(query) {
  return prisma.attention_feedback.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los feedbacks.", "[getAttentionFeedbacks] Bad request");
    });
}

async function getAttentionFeedbackStatistics(query) {
  return prisma.attention_feedback.groupBy(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las estadísticas de los feedbacks.", "[getAttentionFeedbacksStatistics] Bad request");
    });
}

async function createAttentionFeedback(feedback, transaction) {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.attention_feedback.create({ data: feedback })
}

async function updateAttentionFeedback(feedback) {
  return prisma.attention_feedback.update({ "where": { "id": feedback.id }, "data": feedback })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del feedback.", "[updateAttentionFeedback] Error with FK: " + error.meta.field_name);
      }else if(error.code == "P2025"){
        throw new NotFoundError(error, "Error en la actualización del feedback.", "[updateAttentionFeedback] " + error.meta.cause);
      }else{
        throw new InternalServerError(error, "Error en la actualización del feedback.", "[updateAttentionFeedback] Bad request");
      }
    });
}

async function deleteAttentionFeedback(id) {
  return prisma.attention_feedback.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del feedback.", "[deleteAttentionFeedback] " + error.meta.cause);
      }else{
        throw new InternalServerError(error, "Error en la eliminación del feedback.", "[deleteAttentionFeedback] Bad request");
      }
    });
}

module.exports = {
  getAttentionFeedback,
  getAttentionFeedbacks,
  createAttentionFeedback,
  updateAttentionFeedback,
  deleteAttentionFeedback
}