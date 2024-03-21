const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getTicketPriority(id) {
  return prisma.ticket_priority.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de prioridad de ticket.", "[getTicketPriority] Bad request");
    });
}

async function getTicketsPriorities(query) {
  return prisma.ticket_priority.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las prioridades de ticket.", "[getTicketsPriorities] Bad request");
    });
}

function createTicketPriority(ticketPriority) {
  return prisma.ticket_priority.create({ "data": ticketPriority })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación de la prioridad de ticket.", "[createTicketPriority] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación de la prioridad de ticket.", "[createTicketPriority] Bad request");
      }
    });
}

const createManyTicketPriorities = async (priorities, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  const createdPriorities = await prismaClient.ticket_priority.createMany({
    data: priorities,
  });
  return createdPriorities;
};

function updateTicketPriority(ticketPriority) {
  return prisma.ticket_priority.update({ "where": { "id": ticketPriority.id }, "data": ticketPriority })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización de la prioridad de ticket.", "[updateTicketPriority] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización de la prioridad de ticket.", "[updateTicketPriority] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización de la prioridad de ticket.", "[updateTicketPriority] Bad request");
      }
    });
}

function deleteTicketPriority(id) {
  return prisma.ticket_priority.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la prioridad de ticket.", "[deleteTicketPriority] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la prioridad de ticket.", "[deleteTicketPriority] Bad request");
      }
    });
}


module.exports = {
  getTicketPriority,
  getTicketsPriorities,
  createTicketPriority,
  createManyTicketPriorities,
  updateTicketPriority,
  deleteTicketPriority
}
