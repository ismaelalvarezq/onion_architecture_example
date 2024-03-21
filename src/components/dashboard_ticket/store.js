const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mongoTicket = require("../mongo_ticket/resolver.js");


async function getTickets(queryMongo) {
  return await mongoTicket.getTicketsDashboard(queryMongo);
}

async function getChats(chatFilters) {
  return await prisma.chat.findMany(chatFilters);
}

async function getChannelType(id) {
  return await prisma.client.findFirst({ "where": { "id": id }, "include": { "channel": { "select": { "type": true } } } });
}

async function getClient(idClient) {
  return await prisma.client.findFirst({ "where": { "id": idClient },"include": { "channel": { "select": { "type": true } } } });
}

async function getAgent(idAgent) {
  return await prisma.agent.findFirst({ "where": { "id": idAgent }});
}



module.exports = {
  getTickets,
  getChats,
  getChannelType,
  getClient,
  getAgent
}