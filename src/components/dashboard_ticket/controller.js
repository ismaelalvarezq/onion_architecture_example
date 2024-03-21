const store = require('./store.js');
const chatController = require('../../components/chat/controller.js');
const clientController = require('../../components/client/store.js');
const statusController = require('../../components/ticket_status/controller.js');
const constants = require('../../constants.js');
const response = require('../../network/response.js');
const catchAsync = require('../../utils/catchAsync.js');
const { BadRequestError } = require('../../exceptions.js');
const {schemaDashboardTickets} = require('../../helper/validator/schemas/dashboardTickets.js');
const { validator } = require('../../helper/validator/index.js');

const getTicketsDashboard = catchAsync(async (req, res, next) => {

  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let queryMongo;
  let idCompany = null;
  const chatFilters = {};
  const orderBy = [];
  const querys = req.query;
  const queryParamsMongo = {};

  validator(schemaDashboardTickets, querys , "Get");

  if(querys.name_id){
    if (!querys.name_id.match(/^[0-9a-fA-F]{24}$/)) {
      chatFilters["where"] = {};
      const nameSections = querys.name_id.split(" ");
      chatFilters["where"]["client"] = {
        AND: nameSections.map((word) => ({ OR: [{ firstName: { contains: `${word}`, mode: "insensitive" } }, { lastName: { contains: `${word}`, mode: "insensitive" } }] }))
      };
    } else {
      queryParamsMongo["_id"] = querys.name_id;
    }
  }

  if(querys.orderBy){
    let orderItems = querys.orderBy.split(",");
    orderItems.map((orderItem) => {
      let item = orderItem.split(" ");
      orderBy.push({ "attribute": item[0], "type": item[1] });
    })
  }

  orderBy.forEach((orderItem) => {
    if (orderItem.attribute === "date") {
      queryParamsMongo["orderBy"] = `${orderItem.attribute}+${orderItem.type}`;
    }
  });

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    idCompany = req.ctx.user.idCompany;
  }

  if(req.ctx.user.type === constants.agents.types.AGENT){
    queryParamsMongo["idAgent"] = req.ctx.user.id
  }

  const ticketStatuses = (querys.activeTicket === "true") 
    ? await statusController.getActiveStatuses(idCompany) 
    : await statusController.getInactiveStatuses(idCompany);

  queryParamsMongo["statusList"] = JSON.stringify(ticketStatuses.map((status) => status.id));
  queryMongo = chatController.getQuery("ticket/tickets-dashboard", null, queryParamsMongo);

  const [tickets, chats] = await Promise.all([
    store.getTickets(queryMongo), 
    store.getChats(chatFilters)
  ]);

  const dashboard = []

  for (let ticket of tickets.data) {
    let chat = chats.find(item => item.id == ticket.idChat);

    if (chat) {
      
      const [client, agent] = await Promise.all([clientController.getClient({where:{id: chat.idClient}}), store.getAgent(ticket.idAgent)]);
      if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && client.idCompany !== req.ctx.user.idCompany) {
        continue;
      }
      dashboard.push({
        "ticketId": ticket._id,
        "notes":ticket.notes,
        "client": client,
        "agent": agent,
        "createdAt": ticket.date,
        "idStatus": ticket.idStatus,
        "idPriority": ticket.idPriority,
        "idCategory": ticket.idCategory,
      })
    }
  }

  if(orderBy.length > 0){
    let orderAtribute = orderBy[0].attribute
    let orderTtype = orderBy[0].type

    switch(orderAtribute){
      case "priority":
        sortDashboard(orderTtype, "idPriority", "weight")
      break;

      case "status":
        sortDashboard(orderTtype, "idStatus","name")
      break;

      case "category":
        sortDashboard(orderTtype, "idCategory","name")
      break;

      case "fullName":
        sortDashboard(orderTtype, "client","firstName")
      break;

      case "agent":
        sortDashboard(orderTtype, "agent","firstName")
      break;

      case "channelType":
        if(orderTtype == "asc")  dashboard.sort((a, b) => (a.client.channel.type > b.client.channel.type) ? 1 : -1)
        if(orderTtype == "desc") dashboard.sort((a, b) => (b.client.channel.type > a.client.channel.type) ? 1 : -1)
      break;
    }
  }

  function sortDashboard(type, attribute, subAtribute){
    if(type == "asc")  dashboard.sort((a, b) => (a[attribute][subAtribute] > b[attribute][subAtribute] ) ? 1 : -1)
    if(type == "desc") dashboard.sort((a, b) => (b[attribute][subAtribute] > a[attribute][subAtribute] ) ? 1 : -1)
  }

  const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  let responseDashboard = { "total_items": dashboard.length, "items": paginate(dashboard, req.query.page_size, req.query.page_number) };
  response.success(req, res, { "url": fullUrl , "results": responseDashboard }, "paginatedResponse", 200);
});


module.exports = {
  getTicketsDashboard
}
