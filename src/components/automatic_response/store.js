const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAutomaticResponses(filters) {
  const where = {};
  if (filters.idCompany) {
    where.idCompany = filters.idCompany;
  }
  if (filters.automaticResponseTypeId) {
    where.automaticResponseType = { id: filters.automaticResponseTypeId };
  }
  const automaticResponses = await prisma.automatic_response.findMany({
    where,
    include: {
      automaticResponseType: true,
    },
  });
  return automaticResponses;
};

async function getAutomaticResponse(id) {
  const automaticResponse = await prisma.automatic_response.findUnique({ where: { id } });
  return automaticResponse;
}

async function updateAutomaticResponse(id, data) {
  const automaticResponse = await prisma.automatic_response.update({
    where: { id },
    data,
    include: {
      automaticResponseType: true,
    },
  });
  return automaticResponse;
}

async function createManyAutomaticResponses(automaticResponses, transaction) {
  const prismaClient = transaction ? transaction : prisma;
  const createdAutomaticResponses = await prismaClient.automatic_response.createMany({
    data: automaticResponses,
  });
  return createdAutomaticResponses;
}

module.exports = {
  getAutomaticResponses,
  getAutomaticResponse,
  updateAutomaticResponse,
  createManyAutomaticResponses,
}
