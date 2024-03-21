const store = require('./store.js');
const chatController = require('../../components/chat/controller.js');
const constants = require('../../constants.js');
const agentStore = require('../../components/agent/store.js');
const response = require('../../network/response.js');
const { ForbiddenError, BadRequestError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');

const getDashboardTicketStatus = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const { idAgent } = req.params;

  if (!idAgent) throw new BadRequestError(null, "Se necesita el id del agente.");

  if ([constants.agents.types.AGENT].includes(req.ctx.user.type) && idAgent !== req.ctx.user.id) {
    throw new ForbiddenError(null, "No se puede acceder a el dashboard de otros agentes.");
  }

  const agent = await agentStore.getAgent(idAgent);
  if ([constants.agents.types.ADMIN].includes(req.ctx.user.type) && agent.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se puede acceder a dashboard de otras compañias.");
  }

  const dashboard = await store.getDashboardTicketStatus(idAgent, startDate, endDate);
  response.success(req, res, dashboard, "response", 200);
});

const getTicketStatusTraffic = catchAsync(async (req, res, next) => {
  let idAgent = req.params.idAgent;
  let range = req.query.range;
  let graffType = req.query.graffType;

  if (!idAgent || !range || Number.isNaN(parseInt(range)) || range < 1) {
    response.success(req, res, [], "response", 200);
  }

  let dailyStats = []
  let fullTickets = []
  const barStatsList = { new: 0, open: 0, solved: 0, pendingUser: 0, onHold: 0, expiredUser: 0, expiredAgent: 0, blocked: 0 };
  queryMongo = chatController.getQuery("ticket", null, { "dateRange": dateRange(range) })
  let chatFilters = { "where": { "idAgent": idAgent } }
  const [tickets, chats, status] = await Promise.all([store.getTickets(queryMongo), store.getChats(chatFilters), store.getTicketStatus()]);

  for (let ticket of tickets.data) {
    let chat = chats.find(item => item.id == ticket.idChat)
    if (chat) {
      fullTickets.push({ _id: ticket._id, date: ticket.date, idStatus: ticket.idStatus })
    }
  }

  const statusMap = new Map();
  status.forEach(e => { statusMap.set(e.id, e.name) })

  let day = 1
  let ticketDate;
  for (let i = range - 1; i >= 0; i--) {
    let statsList = { new: 0, open: 0, solved: 0, pendingUser: 0, onHold: 0, expiredUser: 0, expiredAgent: 0, blocked: 0 };
    let date = dateRange(range - day);

    fullTickets.forEach((ticket) => {

      ticketDate = new Date(ticket.date).toISOString().substring(0, 10)
      let rangeDate = new Date(date).toISOString().substring(0, 10)

      if (ticketDate == rangeDate) {
        switch (statusMap.get(ticket.idStatus)) {
          case constants.ticketStatus.name.OPEN:
            statsList.open++
            barStatsList.open++
            break;
          case constants.ticketStatus.name.SOLVED:
            statsList.solved++
            barStatsList.solved++
            break;
          case constants.ticketStatus.name.PENDING_USER:
            statsList.pendingUser++
            barStatsList.pendingUser++
            break;
          case constants.ticketStatus.name.ON_HOLD:
            statsList.onHold++
            barStatsList.onHold++
            break;
          case constants.ticketStatus.name.EXPIRED_USER:
            statsList.expiredUser++
            barStatsList.expiredUser++
            break;
          case constants.ticketStatus.name.EXPIRED_AGENT:
            statsList.expiredAgent++
            barStatsList.expiredAgent++
            break;
          case constants.ticketStatus.name.BLOCKED:
            statsList.blocked++
            barStatsList.blocked++
            break;
        }
      }
    })
    dailyStats.push({ day: day, date: date, stats: statsList })
    day++;
  }

  if (graffType == "line") {
    response.success(req, res, dailyStats, "response", 200);
  } else {
    response.success(req, res, barStatsList, "response", 200);
  }

});

const getTicketCategoryTraffic = catchAsync(async (req, res, next) => {
  let idAgent = req.params.idAgent;
  let range = req.query.range;

  if (!idAgent || !range || Number.isNaN(parseInt(range)) || range < 1) {
    response.success(req, res, [], null, 200);
  }

  const statsList = { tecSupport: 0, claim: 0, generalConsult: 0, congratulations: 0, incidenceReport: 0 };
  let fullTickets = [];

  queryMongo = chatController.getQuery("ticket", null, { "dateRange": dateRange(range) })
  let chatFilters = { "where": { "idAgent": idAgent } }

  const [tickets, chats, categories] = await Promise.all([store.getTickets(queryMongo), store.getChats(chatFilters), store.getTicketCategories()]);

  for (let ticket of tickets.data) {
    let chat = chats.find(item => item.id == ticket.idChat)
    if (chat) {
      fullTickets.push({ _id: ticket._id, date: ticket.date, idCategory: ticket.idCategory })
    }
  }

  const categoryMap = new Map();
  categories.forEach(e => { categoryMap.set(e.id, e.name) })

  for (let ticket of fullTickets) {
    switch (categoryMap.get(ticket.idCategory)) {
      case constants.ticketCategory.name.TECHNICAL_SUPPORT:
        statsList.tecSupport++
        break;
      case constants.ticketCategory.name.CLAIM:
        statsList.claim++
        break;
      case constants.ticketCategory.name.GENERAL_QUERY:
        statsList.generalConsult++
        break;
      case constants.ticketCategory.name.CONGRATULATIONS:
        statsList.congratulations++
        break;
      case constants.ticketCategory.name.REPORT_INCIDENT:
        statsList.incidenceReport++
        break;
    }
  }

  response.success(req, res, statsList, null, 200);
});



function dateRange(range) {
  let date = new Date();
  date.setDate(date.getDate() - range)
  let pastDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

  return pastDate;
}

const getTicketChannelTraffic = catchAsync(async (req, res, next) => {
  let idAgent = req.params.idAgent;
  let range = req.query.range;

  if (!idAgent || !range || Number.isNaN(parseInt(range)) || range < 1) {
    response.success(req, res, [], null, 200);
  }

  const statsList = { facebook: 0, whatsApp: 0, instagram: 0, webchat: 0 };
  let validChats = []
  let query = {}
  query["include"] = {
    "channel": {
      "select": { "type": true }
    }
  }

  queryMongo = chatController.getQuery("ticket", null, { "dateRange": dateRange(range) })
  let chatFilters = { "where": { "idAgent": idAgent } }

  const [tickets, chats, clients] = await Promise.all([store.getTickets(queryMongo), store.getChats(chatFilters), store.getClients(query)]);

  for (let ticket of tickets.data) {
    let chat = chats.find(item => item.id == ticket.idChat)
    if (chat) { validChats.push(chat) }
  }


  for (let chatt of validChats) {
    let client = clients.find(item => item.id == chatt.idClient)

    if (client) {

      switch (client.channel.type) {
        case constants.channel.type.FACEBOOK:
          statsList.facebook++
          break;
        case constants.channel.type.INSTAGRAM:
          statsList.instagram++
          break;
        case constants.channel.type.WHATSAPP:
          statsList.whatsApp++
          break;
        case constants.channel.type.WEBCHAT:
          statsList.webchat++
          break;
      }
    }
  }

  response.success(req, res, statsList, null, 200);
});


module.exports = {
  getDashboardTicketStatus,
  getTicketStatusTraffic,
  getTicketCategoryTraffic,
  getTicketChannelTraffic
}
