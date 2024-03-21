const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getTicketStatus(id) {
  return prisma.ticket_status.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del estado de ticket.", "[getTicketStatus] Bad request");
    });
}

async function getTicketStatuses(query) {
  return prisma.ticket_status.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los estados de ticket.", "[getTicketStatuses] Bad request");
    });
}

function createTicketStatus(ticketStatus) {
  return prisma.ticket_status.create({ "data": ticketStatus })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación del estado de ticket.", "[createTicketStatus] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación del estado de ticket.", "[createTicketStatus] Bad request");
      }
    });
}

const createManyTicketStatuses = async (statuses, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  const createdStatuses = await prismaClient.ticket_status.createMany({
    data: statuses,
  });
  return createdStatuses;
};

function updateTicketStatus(ticketStatus) {
  return prisma.ticket_status.update({ "where": { "id": ticketStatus.id }, "data": ticketStatus })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del estado de ticket.", "[updateTicketStatus] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del estado de ticket.", "[updateTicketStatus] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del estado de ticket.", "[updateTicketStatus] Bad request");
      }
    });
}

function deleteTicketStatus(id) {
  return prisma.ticket_status.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del estado de ticket.", "[deleteTicketStatus] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del estado de ticket.", "[deleteTicketStatus] Bad request");
      }
    });
}


module.exports = {
  getTicketStatus,
  getTicketStatuses,
  createTicketStatus,
  createManyTicketStatuses,
  updateTicketStatus,
  deleteTicketStatus
}
