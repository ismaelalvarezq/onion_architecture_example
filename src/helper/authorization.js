const clientStore = require('../components/client/store.js');
const chatStore = require('../components/chat/store.js');
const agentStore = require('../components/agent/store.js');
const ticketStatusController = require('../components/ticket_status/controller.js');
const ticketsResolver = require('../components/mongo_ticket/resolver.js');
const { ForbiddenError } = require('../exceptions.js');


const checkActiveTicket = async (idAgent, idClient) => {
  const agentChats = await chatStore.getChats({
    where: {
      idAgent,
      idClient,
    },
  });

  const agent = await agentStore.getAgent(idAgent);

  const activeStatuses = await ticketStatusController.getActiveStatuses(agent.idCompany);
  const activeAgentTicketsResponse = await ticketsResolver.getTicketsWithParams({
    activeTicket: true,
    statusList: JSON.stringify(activeStatuses.map((status) => status.id)),
    chatsList: JSON.stringify(agentChats.map((chat) => chat.id)),
  });
  const activeAgentTickets = activeAgentTicketsResponse.data;
  // No se puede editar un cliente si es que el agente
  // no tiene un chat con un ticket activo con el cliente
  if (!activeAgentTickets.length > 0) {
    throw new ForbiddenError(null, "No tiene un ticket activo con el cliente.", "[checkActiveTicket] forbidden error.");
  }
}

const checkSameCompany = async (agentCompanyId, idClient) => {
  const clientData = await clientStore.getClient({ where: { id: idClient } });
  if (clientData.idCompany !== agentCompanyId) {
    throw new ForbiddenError(null, "No pertenece a la misma compañía del cliente.", "[checkSameCompany] forbidden error.");
  }
}

module.exports = {
  checkActiveTicket,
  checkSameCompany,
};