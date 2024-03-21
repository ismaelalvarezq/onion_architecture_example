const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getFAQ(id) {
  return prisma.faq.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del FAQ.", "[getFAQ] Bad request");
    });
}

async function getFAQs(query) {
  return prisma.faq.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los FAQs.", "[getFAQs] Bad request");
    });
}

async function createFAQ(faq) {
  return prisma.faq.create({ "data": faq })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación del FAQ.", "[createFAQ] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación del FAQ.", "[createFAQ] Bad request");
      }
    });
}

async function updateFAQ(faq) {
  return prisma.faq.update({ "where": { "id": faq.id }, "data": faq })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del FAQ.", "[updateFAQ] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del FAQ.", "[updateFAQ] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del FAQ.", "[updateFAQ] Bad request");
      }
    });
}

async function deleteFAQ(id) {
  return prisma.faq.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del FAQ.", "[deleteFAQ] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del FAQ.", "[deleteFAQ] Bad request");
      }
    });
}


module.exports = {
  getFAQ,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
}
