const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');

const currentComponent = "chat";
const agentStore = require('../../components/agent/store.js');
const clientStore = require('../../components/client/store.js')
const clientController = require('../../components/client/controller.js')
const ticketStatusController = require('../../components/ticket_status/controller.js');
const catchAsync = require('../../utils/catchAsync.js');
const constants = require('../../constants.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaChat } = require('../../helper/validator/schemas/chat');


const getChat = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getChat] Missing params");

  const chat = await store.getChat(req.params.id);

  if (constants.agents.types.AGENT === req.ctx.user.type && chat?.idAgent !== req.ctx.user.id) {
    throw new ForbiddenError(null, "No se puede acceder a chats de otros agentes.", "[getChat] forbidden error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && chat?.client.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se puede acceder a chats de otras compañías.", "[getChat] forbidden error");
  }

  response.success(req, res, chat, "response", 200);
});

const getChats = catchAsync(async (req, res, next) => {
  var filterItems = {};
  var orderBy = [];
  var query = {};

  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).map((key) => {
      if (key != "offset" && key != "limit" && key != "orderBy") {
        filterItems[key] = req.query[key];
      } else if (key == "orderBy") {
        orderItems = req.query[key].split(",");
        orderItems.map((orderItem) => {
          var item = orderItem.split(" ");
          orderBy.push({ "attribute": item[0], "type": item[1] });
        });
      }
    });
  }

  if (Object.keys(filterItems).length > 0) {
    query["where"] = {};
    await Promise.all(
    Object.keys(filterItems).map( async (key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if (variableType == "String" && !key.startsWith("id")) {
        query["where"][key] = { "contains": filterItems[key], mode: "insensitive" };
      } else if (variableType == "Int") {
        query["where"][key] = parseInt(filterItems[key]);
      } else {

        if(key == "name"){
          const clientsId = []

          const nameSections = filterItems[key].split(" ");
          const clients = await clientStore.getClients({
            where: {
              AND: nameSections.map((word) => ({
                OR: [{ firstName: { "contains": `${word}`, mode: "insensitive" } }, { lastName: { "contains": `${word}`, mode: "insensitive" } }],
              }))
            }
          });
          clients.items.forEach((e) => { clientsId.push(e.id) });
          query["where"]["idClient"] = { in: clientsId };
        }else{
          query["where"][key] = filterItems[key];
        }
      }
      })
    )
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
    });
  } else {
    query["orderBy"] = { "id": "asc" };
  }

  const chats = await store.getChats(query);
  response.success(req, res, chats, "response", 200);
});

const createChat = catchAsync(async (req, res, next) => {
  let chat = req.body;

  validator(schemaChat, chat, "Post");

  const newChat = await store.createChat(chat);
  response.success(req, res, newChat, "response", 201)
});

const updateChat = catchAsync(async (req, res, next) => {
  let chat = req.body;
  chat.id = req.params.id;

  validator(schemaChat, chat, "Patch");

  const updatedChat = await store.updateChat(chat);
  response.success(req, res, updatedChat, "response", 200);
});

const deleteChat = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteChat] Missing params");

  const deletedChat = await store.deleteChat(req.params.id);
  response.success(req, res, deletedChat, "response", 200);
});

const getPreviews = catchAsync(async (req, res, next) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const filterItems = {};
  const orders = [];
  let idCompany = null;

  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).map((key) => {
      if (key != "offset" && key != "limit" && key != "orderBy") {
        filterItems[key] = req.query[key];
      } else if (key == "orderBy") {
        orderItems = req.query[key].split(",");
        orderItems.map((orderItem) => {
          const item = orderItem.split(" ");
          orders.push({ attribute: item[0], type: item[1] });
        });
      }
    });
  }

  if ([constants.agents.types.AGENT].includes(req.ctx.user.type) && req.params.idAgent !== req.ctx.user.id) {
    throw new ForbiddenError(null, "No se puede acceder a tickets de otros agentes.", "[getPreviews] forbidden error");
  }

  const agent = await agentStore.getAgent(req.params.idAgent);

  if ([constants.agents.types.ADMIN].includes(req.ctx.user.type) && agent.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se puede acceder a tickets de otras compañias.", "[getPreviews] forbidden error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    idCompany = req.ctx.user.idCompany;
  }

  if ([constants.agents.types.SYSTEM].includes(req.ctx.user.type)) {
    idCompany = agent.idCompany;
  }

  const idAgent = req.params.idAgent;
  const offset = req.query.offset;
  const limit = req.query.limit;

  const query = { where: { idAgent: idAgent } };
  let queryMongo = {};
  const clientData = {};
  queryMongo["activeTicket"] = true;
  const activeStatuses = await ticketStatusController.getActiveStatuses(idCompany);
  queryMongo["statusList"] = JSON.stringify(
    activeStatuses.map((status) => status.id)
  );

  await clientController.checkBlockedClients();

  // ! Por ahora son 10000, originalmente eran 10
  query["skip"] = parseInt(offset) || 0;
  query["take"] = parseInt(limit) || 10000;

  if (Object.keys(filterItems).length > 0) {
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if (variableType == "String" && !key.startsWith("id")) {
        query["where"][key] = {
          contains: filterItems[key],
          mode: "insensitive",
        };
      } else if (key == "name_id") {
        if (filterItems[key].match(/^[0-9a-fA-F]{24}$/)) {
          clientData["idTicket"] = filterItems[key];
          queryMongo["_id"] = filterItems[key];
          delete filterItems[key];
        } else if (filterItems[key].match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)) {
          clientData["id"] = filterItems[key];
          query.where.client = {
            id: filterItems[key],
          };
          delete filterItems[key];
        } else {
          clientData["name"] = filterItems[key].toLowerCase();
          const nameSections = filterItems[key].split(" ");
          query["where"]["client"] = {
            AND: nameSections.map((word) => ({ OR: [{
              firstName: { contains: `${word}`, mode: "insensitive" },
            }, {
                lastName: { contains: `${word}`, mode: "insensitive" },
              }]
            })),
          };
          delete filterItems[key];
        }
        if (filterItems["client.idChannel"]) {
          clientData["idChannel"] = filterItems["client.idChannel"];
        }
      } else if (
        key.startsWith("agent.") ||
        (key.startsWith("client.") && !filterItems["name_id"])
      ) {
        var foreignModel = key.split(".")[0];
        var foreignKey = key.split(".")[1];
        if (foreignKey.startsWith("id")) {
          query["where"][foreignModel] = {
            [foreignKey]: filterItems[key],
          };
        } else {
          const nameSections = filterItems[key].split(" ");
          query["where"][foreignModel] = {
            AND: nameSections.map((word) => ({
              [foreignKey]: { contains: `${word}`, mode: "insensitive" },
            })),
          };
        }
      } else if (key.startsWith("ticket.")) {
        queryMongo["offset"] = query["skip"];
        queryMongo["limit"] = query["take"];
        var foreignKey = key.split(".")[1];
        if (foreignKey != "_id") {
          foreignKey =
            "id" + foreignKey.charAt(0).toUpperCase() + foreignKey.slice(1);
        }
        queryMongo[foreignKey] = filterItems[key];
      } else if (key == "onlyUnseenMessages") {
        queryMongo["offset"] = query["skip"];
        queryMongo["limit"] = query["take"];
        queryMongo["onlyUnseenMessages"] = true;
        queryMongo["idAgent"] = idAgent;
      }
    });
  }

  query["orderBy"] = [];
  if (orders.length > 0) {
    orders.map((orderItem) => {
      query["orderBy"].push({ [orderItem.attribute]: orderItem.type });
    });
  } else {
    query["orderBy"] = { id: "asc" };
  }

  query["include"] = {
    agent: true,
    client: {
      include: {
        notes: {
          orderBy: { updatedAt: "desc" },
          include: {
            agent: { select: { id: true, firstName: true, lastName: true, type: true } },
          }
        },
        blocking_history: true,
      },
    },
  };

  //! Ahora querymMongo siempre llevará 2 keys minimo, activeTicket=true y statusList
  //! Estas keys son para indicar que se esta haciendo un getTickets desde getPreviews y que solo retorne los tickets con status Abierto, Pendiente Usuario o Agente
  //! extraQuerys valida que aparte de esas 2 keys obligatorias vengas alguna otra como ticket.id por ej. esto influirá en el flujo del store
  let extraQuerys = Object.keys(queryMongo).length > 2 ? true : false;
  queryMongo = getQuery("ticket", null, queryMongo);
  const results = await store.getPreviews(idAgent, query, queryMongo, extraQuerys, clientData);
  response.success(req, res, { url: fullUrl, results }, "paginatedResponse", 200);
});

const validateChat = catchAsync(async (req, res, next) => {
  const data = {
    isValid: true, 
    details: [],
    idChat: null}

  const agent = await agentStore.getAgent(req.query.idAgent);
  const client = await clientStore.getClient({where:{id: req.query.idClient}});
  const chat = await store.getChats({where:{idAgent: req.query.idAgent, idClient: req.query.idClient}});

  if(agent.idCompany != client.idCompany){
    data.isValid = false;
    data.details.push(constants.DETAILS_MATCH_COMPANY);
  }

  if(!chat || chat.length < 1){
    data.isValid = false;
    data.details.push(constants.DETAILS_MATCH_CHAT);
  }

  if(chat && chat.length === 1){
    data.idChat = chat[0].id;
  }

  response.success(req, res, data ,"response", 200);
});

function getQuery (model, param, queryParams) {
  let query = "/" + model + "/";

  if (param) query += param;

  if (queryParams) {
    query += "?";
    Object.keys(queryParams).forEach((item) => {
      if (queryParams[item]) {
        query += ( item + "=" + queryParams[item] + "&" );
      }
    });
    query = query.slice(0, -1);
  }
  
  return query;
}


module.exports = {
  getChat,
  getChats,
  createChat,
  updateChat,
  deleteChat,
  getQuery,
  getPreviews,
  validateChat
}
