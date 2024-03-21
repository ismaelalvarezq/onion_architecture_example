const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const constants = require('../../constants.js');
const { createChat, deleteChat } = require('../chat/store.js');
const { createClientFlowStep, deleteClientFlowStep } = require('../client_flow_step/store.js');
const { getBot } = require('../agent/store.js');
const { createTicket, deleteTicket } = require('../mongo_ticket/resolver.js');

async function getClient(query) {
  try {
    if (query.hasOwnProperty("include")) {
      query["include"]["channel"] = { select: { id: true, idCompany: true, type: true } };
    } else {
      query["include"] = { channel: { select: { id: true, idCompany: true, type: true } } };
    }

    let client = await prisma.client.findUnique(query)

    if (client) {
      client = {
        ...client,
        idCompany: client.channel.idCompany,
        fullname: `${client.firstName}` + (client.lastName ? ` ${client.lastName}` : ''),
      };
    }

    return client;
  } catch (error) {
    throw new BadRequestError(error, "Error en la búsqueda del cliente.", "[getClient] Bad request");
  }
}

async function getClients(query) {
  if (query.hasOwnProperty("include")) {
    query["include"]["channel"] = { "select": { "id": true, "idCompany": true, "type": true } };
  } else {
    query["include"] = { "channel": { "select": { "id": true, "idCompany": true, "type": true } } };
  }

  let clients = await prisma.client.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los clientes.", "[getClients] Bad request");
    });

  delete query["skip"]; delete query["take"]; delete query["include"];
  query["_count"] = { "id": true };
  const totalClients = (await prisma.client.aggregate(query))._count.id;

  return {
    "items": clients.map((client) => ({
      ...client,
      idCompany: client.channel.idCompany,
      fullname: `${client.firstName}` + (client.lastName ? ` ${client.lastName}` : ''),
    })), "total_items": totalClients
  };
}

const createClient = async (client, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.client.create({ data: client });
};

async function updateClient(client) {
  try {
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      include: {
        blocking_history: true,
        notes: {
          include: {
            agent: true,
          },
        },
        channel: {
          select: {
            id: true,
            idCompany: true,
            type: true,
          },
        },
      },
      data: client
    });
    if (updatedClient) {
      updatedClient.idCompany = updatedClient.channel.idCompany;
      updatedClient.fullname = `${updatedClient.firstName}` + (updatedClient.lastName ? ` ${updatedClient.lastName}` : '');
    }
    return updatedClient;
  } catch (error) {
    if (error.code == "P2003") {
      throw new NotFoundError(error, "Error en la actualización del cliente.", "[updateClient] Error with FK: " + error.meta.field_name);

    } else if (error.code == "P2025") {
      throw new NotFoundError(error, "Error en la actualización del cliente.", "[updateClient] " + error.meta.cause);

    } else {
      throw new InternalServerError(error, "Error en la actualización del cliente.", "[updateClient] Bad request");
    }
  }
}

async function deleteClient(id) {
  try {
    const deletedClient = await prisma.client.delete({ "where": { "id": id } });
    if (deletedClient) {
      deletedClient.fullname = `${deletedClient.firstName}` + (deletedClient.lastName ? ` ${deletedClient.lastName}` : '');
    }
    return deletedClient;
  } catch (error) {
    if (error.code == "P2025") {
      throw new NotFoundError(error, "Error en la eliminación del cliente.", "[deleteClient] " + error.meta.cause);

    } else {
      throw new InternalServerError(error, "Error en la eliminación del cliente.", "[deleteClient] Bad request");
    }
  }
}

async function getBlockedClients() {
  const clients = await prisma.client.findMany({ "where": { "state": constants.client.state.BLOCKED }, "include": { "blocking_history": true } });
  return clients.map((client) => ({
    ...client,
    fullname: `${client.firstName}` + (client.lastName ? ` ${client.lastName}` : ''),
  }));
}

async function getBlockedClient(clientId) {
  const blockingHistories = await prisma.blocking_history.findMany({ "where": { "idClient": clientId } });
  return blockingHistories;
}

async function createManyClientsAssignedToBot(clients) {
  const createdClientsIds = [];
  const createdChatsIds = [];
  const createdClientFlowStepsIds = [];
  const createdTicketsIds = [];
  try {
    for (let client of clients) {
      const expiredAgentStatus = await prisma.ticket_status.findFirst({
        where: {
          name: constants.ticketStatus.name.EXPIRED_AGENT,
          idCompany: client.idCompany,
        },
      });
      if (!expiredAgentStatus) throw new NotFoundError(null, "No se encontro el estado nuevo para la empresa.");
      const priorityLow = await prisma.ticket_priority.findFirst({
        where: {
          name: constants.ticketPriority.name.LOW,
          idCompany: client.idCompany,
        },
      });
      if (!priorityLow) throw new NotFoundError(null, "No se encontro la prioridad baja para la empresa.");
      const noCategory = await prisma.ticket_category.findFirst({
        where: {
          name: constants.ticketCategory.name.NO_CATEGORY,
          idCompany: client.idCompany,
        },
      });
      if (!noCategory) throw new NotFoundError(null, "No se encontro la categoria sin categoria para la empresa.");
      const bot = await getBot(client.idCompany);
      if (!bot) throw new NotFoundError(null, "No se encontro un bot para la empresa.");
      const idBot = bot.id;
      const newClient = await createClient(client);
      createdClientsIds.push(newClient.id);
      const chat = { idClient: newClient.id, idAgent: idBot };
      const newChat = await createChat(chat);
      createdChatsIds.push(newChat.id);
      const clientFlowStep = {
        idClient: newClient.id,
        status: null,
        failsCount: 0,
        flow: null,
        previousFlow: null,
        answers: {},
        answersApi: {},
      };
      const newClientFlowStep = await createClientFlowStep(clientFlowStep);
      createdClientFlowStepsIds.push(newClientFlowStep.id);
      const ticket = {
        idStatus: expiredAgentStatus.id,
        idPriority: priorityLow.id,
        idCategory: noCategory.id,
        idChat: newChat.id,
        idAgent: idBot,
        date: new Date(),
      }
      console.log("createManyClientsAssignedToBot -> ticket", ticket);
      const newTicket = await createTicket(ticket);
      createdTicketsIds.push(newTicket._id);
    }
  } catch (error) {
    await Promise.all(createdTicketsIds.map((idTicket) => deleteTicket(idTicket)));
    await Promise.all(createdClientFlowStepsIds.map((clientFlowStepId) => deleteClientFlowStep(clientFlowStepId)));
    await Promise.all(createdChatsIds.map((chatId) => deleteChat(chatId)));
    await Promise.all(createdClientsIds.map((clientId) => deleteClient(clientId)));
    throw new InternalServerError(error, "Error al crear los clientes.");
  }
}

async function createManyClients(clients) {
  const newClients = await prisma.client.createMany({ data: clients });
  return newClients.map((client) => ({
    ...client,
    fullname: `${client.firstName}` + (client.lastName ? ` ${client.lastName}` : ''),
  }));
}


module.exports = {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getBlockedClients,
  getBlockedClient,
  createManyClientsAssignedToBot,
  createManyClients,
}
