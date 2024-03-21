const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getTicketCategory(id) {
  return prisma.ticket_category.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de la categoría de ticket.", "[getTicketCategory] Bad request");
    });
}

async function getTicketsCategories(query) {
  return prisma.ticket_category.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las categorías de ticket.", "[getTicketsCategories] Bad request");
    });
}

function createTicketCategory(ticketCategory) {
  return prisma.ticket_category.create({ "data": ticketCategory })
    .catch((error) => {
      if (error.code == "P2003") {  // Not found por la clave foránea
        throw new NotFoundError(error, "Error en la creación de la categoría de ticket.", "[createTicketCategory] Error with FK: " + error.meta.field_name);

      } else {  // Los demás con 500
        throw new InternalServerError(error, "Error en la creación de la categoría de ticket.", "[createTicketCategory] Bad request");
      }
    });
}

const createManyTicketCategories = async (categories, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  const createdCategories = await prismaClient.ticket_category.createMany({
    data: categories,
  });
  return createdCategories;
};

function updateTicketCategory(ticketCategory) {
  return prisma.ticket_category.update({ "where": { "id": ticketCategory.id }, "data": ticketCategory })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización de la categoría de ticket.", "[updateTicketCategory] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización de la categoría de ticket.", "[updateTicketCategory] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización de la categoría de ticket.", "[updateTicketCategory] Bad request");
      }
    });
}

function deleteTicketCategory(id) {
  return prisma.ticket_category.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la categoría de ticket.", "[deleteTicketCategory] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la categoría de ticket.", "[deleteTicketCategory] Bad request");
      }
    });
}


module.exports = {
  getTicketCategory,
  getTicketsCategories,
  createTicketCategory,
  createManyTicketCategories,
  updateTicketCategory,
  deleteTicketCategory
}
