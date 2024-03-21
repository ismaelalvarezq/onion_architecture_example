const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError } = require('../../exceptions.js');

const mongoTicket = require("../mongo_ticket/resolver.js");
const { getQuery } = require('../chat/controller.js');
const constants = require('../../constants.js');
const logger = require('../../helper/logger.js');

async function getDashboardTicketStatus(idAgent, startDate, endDate) {
  const stats = {
    new: 0,
    open: 0,
    pendingUser: 0,
    onHold: 0,
    expiredUser: 0,
    expiredAgent: 0,
    blocked: 0,
    reassigned: 0,
    solved: 0,
  };

  let queryMongo = getQuery("ticket", null, { exclude: "message", idAgent, startDate, endDate });

  const [tickets, status] = await Promise.all([getTickets(queryMongo), getTicketStatus()]);

  const statusMap = new Map();
  status.forEach(e => { statusMap.set(e.id, e.name) })

  for (let ticket of tickets.data) {
    if (ticket) {
      switch (statusMap.get(ticket.idStatus)) {
        case constants.ticketStatus.name.OPEN:
          stats.open++
          break;
        case constants.ticketStatus.name.PENDING_USER:
          stats.pendingUser++
          break;
        case constants.ticketStatus.name.ON_HOLD:
          stats.onHold++
          break;
        case constants.ticketStatus.name.EXPIRED_USER:
          stats.expiredUser++
          break;
        case constants.ticketStatus.name.EXPIRED_AGENT:
          stats.expiredAgent++
          break;
        case constants.ticketStatus.name.BLOCKED:
          stats.blocked++
          break;
        case constants.ticketStatus.name.REASSIGNED:
          stats.reassigned++
          break;
        case constants.ticketStatus.name.SOLVED:
          stats.solved++
          break;
        default:
          logger.error(`${statusMap.get(ticket.idStatus)} no manejado.`)
      }
    }
  }
  return stats;
}

async function getTickets(queryMongo) {
  return await mongoTicket.getTickets(queryMongo)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los tickets.", "[getTickets] Bad request");
    });
}

async function getChats(chatFilters) {
  return await prisma.chat.findMany(chatFilters)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los chats.", "[getChats] Bad request");
    });
}

async function getClients(query) {
  return await prisma.client.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los clientes.", "[getClients] Bad request");
    });
}

async function getTicketStatus() {
  return await prisma.ticket_status.findMany()
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los estados de los tickets.", "[getTicketStatus] Bad request");
    });
}

async function getTicketCategories() {
  return await prisma.ticket_category.findMany()
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las categorías de los tickets.", "[getTicketCategories] Bad request");
    });
}


module.exports = {
  getDashboardTicketStatus,
  getTickets,
  getChats,
  getTicketStatus,
  getTicketCategories,
  getClients
}
