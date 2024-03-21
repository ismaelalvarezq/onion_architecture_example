const store = require('./store.js');
const { checkActiveTicket, checkSameCompany } = require('../../helper/authorization.js');

const validatorSchema = require('../../validator.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaClient } = require('../../helper/validator/schemas/client.js');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');
const constants = require('../../constants.js');
const catchAsync = require('../../utils/catchAsync.js');

const currentComponent = "client";
const avatarColors = constants.avatar.COLORS;

const { randomAvatarColor } = require('../../utils/randomAvatarColor.js');

const createClient = catchAsync(async (req, res, next) => {
  let client = req.body;

  validator(schemaClient, client, "Post");

  let words = client.firstName.split(" ");
  client.firstName = words.map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
  words = client.lastName.split(" ");
  client.lastName = words.map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
  client.initials = `${client.firstName ? client.firstName[0] : ''}${client.lastName ? client.lastName[0] : ''}`;
  client.avatarColor = randomAvatarColor();

  const newClient = await store.createClient(client);
  response.success(req, res, newClient, "response", 201);
});

const hasActiveTicket = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[hasActiveTicket] Missing params");

  await checkSameCompany(req.ctx.user.idCompany, req.params.id);

  try {
    await checkActiveTicket(req.ctx.user.id, req.params.id);
    response.success(req, res, [{ hasActiveTicket: true }], "response", 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      response.success(req, res, [{ hasActiveTicket: false }], "response", 200);
    } else {
      throw error;
    }
  }
});

const getClient = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getClient] Missing params");

  var query = {
    where: { id: req.params.id },
    include: {
      notes: {
        select: { id: true, title: true, description: true, agent: { select: { id: true, firstName: true, lastName: true, type: true } } },
      },
      channel: { select: { type: true } },
    },
  };

  const client = await store.getClient(query);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && req.ctx.user.idCompany !== client.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener contactos de otras compañías.", "[getClient] forbidden error");
  }
  response.success(req, res, client, "response", 200);
});

const getClients = catchAsync(async (req, res, next) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var filterItems = {};
  var orderBy = [];
  var query = {};

  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).map((key) => {
      if (key != "id" && key != "offset" && key != "limit" && key != "orderBy") {
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

  await checkBlockedClients();

  query["skip"] = parseInt(req.query.offset) || 0;
  query["take"] = parseInt(req.query.limit) || 100;

  if (Object.keys(filterItems).length > 0) {
    query["where"] = {};
    query["where"]["AND"] = [];
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if ((variableType == "String" || key === "name") && !key.startsWith("id") && key != "userIdChannel") {
        if (key == "name") {
          const nameSections = filterItems[key].split(" ");
          query["where"]["AND"].push(
            ...nameSections.map((word) => ({
              OR: [
                { firstName: { contains: `${word}`, mode: "insensitive" } },
                { lastName: { contains: `${word}`, mode: "insensitive" } },
              ],
            }))
          );
        } else {
          query["where"]["AND"].push({
            [key]: { contains: filterItems[key], mode: "insensitive" },
          });
        }
      } else if (key.startsWith("channel.")) {
        var foreignModel = key.split(".")[0];
        var foreignKey = key.split(".")[1];
        if (foreignKey.startsWith("id")) {
          query["where"][foreignModel] = {
            [foreignKey]: filterItems[key]
          }
        } else {
          query["where"][foreignModel] = {
            [foreignKey]: { "contains": filterItems[key], "mode": "insensitive" }
          }
        }
      } else if (variableType == "Int") {
        query["where"][key] = parseInt(filterItems[key]);
      } else {
        if(key != "blocking_history"){
          query["where"][key] = filterItems[key];
        }
      }
    });
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      if(orderItem.attribute != "blockType" && orderItem.attribute != "blockDate"){
        if (orderItem.attribute == "channel") {
          query["orderBy"].push({ [orderItem.attribute]: {type: orderItem.type}})
        } else if (orderItem.attribute == "fullName") {
          query["orderBy"].push({ "firstName": orderItem.type }, { "lastName": orderItem.type });
        } else {
          query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
        }
      } else {
        delete query["skip"]; delete query["take"];
      }
    });
  } else {
    query["orderBy"] = { "updatedAt": "asc" };
  }

  query["include"] = {
    "notes": {
      "select": {
        "id": true,
        "title": true,
        "description": true,
        "createdAt": true,
        "updatedAt": true,
        agent: { select: { id: true, firstName: true, lastName: true, type: true } } },
      "orderBy": { "updatedAt": "desc" }
    },
    "channel": {
      "select": { "id": true, "idCompany": true, "type": true }
    },
    "blocking_history": filterItems.hasOwnProperty("blocking_history")
  };

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    const idCompany = req.ctx.user.idCompany;

    if (!query.where.channel) { query.where.channel = {} }
    query.where.channel.idCompany = idCompany;
  };

  if (query.where?.outboundCampaignId) {
    query.where.outboundCampaigns = {
      some: { outboundCampaign: { id: query.where.outboundCampaignId } },
    };
    query.include = {
      ...query.include,
      outboundCampaigns: {
        select: {
          customVariables: true,
        },
        where: {
          outboundCampaign: { id: query.where.outboundCampaignId },
        },
      },
    };
    delete query.where.outboundCampaignId;
  }

  const clients = await store.getClients(query);
  orderBy.map(async (orderItem) => {
    if (orderItem.attribute == "blockType" || orderItem.attribute == "blockDate") {
      clients.items = await orderByBlockingHistory(clients.items, orderItem.attribute, orderItem.type, req.query.offset, req.query.limit);
    }
  });
  response.success(req, res, { "url": fullUrl, "results": clients }, "paginatedResponse", 200);
})

const updateClient = catchAsync(async (req, res, next) => {
  let client = req.body;
  client.id = req.params.id;

  validator(schemaClient, client, "Patch");

  if (client?.state && client.state != constants.client.state.AVAILABLE) {
    const isBlockedError = await isClientBlockedError(client.id);
    if (isBlockedError) {
      throw new BadRequestError(null, "Faltan parámetros requeridos.", "[updateClient] Missing params");
    }
  }

  if (client?.state && req.ctx.user.type === constants.agents.types.AGENT && !await isClientBlockedByCurrentAgent(client.id, req.ctx.user.id)) {
    throw new BadRequestError(null, "Error en los parámetros.", "[updateClient] Client blocked by another Agent");
  }

  // Si se actualiza 'name', se debe volver a generar las iniciales
  if (client.firstName) {
    const words = client.firstName.split(" ");
    client.firstName = words.map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
  }
  if (client.lastName) {
    const words = client.lastName.split(" ");
    client.lastName = words.map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
  }
  if (client.firstName || client.lastName) {
    client.initials = `${client.firstName ? client.firstName[0] : ""}${client.lastName ? client.lastName[0] : ""}`;
  }
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, client.id);
  }

  const updatedClient = await store.updateClient(client);
  response.success(req, res, updatedClient, "response", 200);
})

const deleteClient = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteAgent] Missing 'Id'");

  const deletedClient = await store.deleteClient(req.params.id);
  response.success(req, res, deletedClient, "response", 200);
});

async function isClientBlockedError(idClient) {
  const blockingHistory = await store.getBlockedClient(idClient);
  let lastBan = blockingHistory.pop();

  if (lastBan?.type) {
    if (lastBan?.type != constants.blockingHistory.type.PERMANENT) {
      let now = new Date();
      let blockDate = new Date(lastBan. dateUnblock);
      return (blockDate < now);
    } else {
      return false;
    }
  }else{
    return true;
  }
}

async function isClientBlockedByCurrentAgent(idClient, idAgent) {
  const blockingHistory = await store.getBlockedClient(idClient);
  let lastBan = blockingHistory.pop();

  return (lastBan && lastBan.createdBy === idAgent);
}

async function checkBlockedClients() {
  const clients = await store.getBlockedClients();

  clients?.forEach((client) => {
    let lastBan = client.blocking_history.pop()
    if(lastBan?.type){
      if(lastBan.type != constants.blockingHistory.type.PERMANENT && lastBan?.dateUnblock){
        let now = new Date();
        let blockDate = new Date(lastBan.dateUnblock);
        if (blockDate < now) {
          store.updateClient({ "id": client.id, "state": constants.client.state.AVAILABLE })
        }
      }
    }
  })
}

async function orderByBlockingHistory(items, attribute, type, offset, limit){
  if(attribute == "blockType"){
    if(type == "asc")  items.sort((a, b) => (a.blocking_history[a.blocking_history.length-1].type > b.blocking_history[b.blocking_history.length-1].type ) ? 1 : -1)
    if(type == "desc") items.sort((a, b) => (b.blocking_history[b.blocking_history.length-1].type > a.blocking_history[a.blocking_history.length-1].type ) ? 1 : -1)
  }

  if(attribute == "blockDate"){
    if(type == "asc")  items.sort((a, b) => (a.blocking_history[a.blocking_history.length-1].createdAt > b.blocking_history[b.blocking_history.length-1].createdAt ) ? 1 : -1)
    if(type == "desc") items.sort((a, b) => (b.blocking_history[b.blocking_history.length-1].createdAt > a.blocking_history[a.blocking_history.length-1].createdAt ) ? 1 : -1)
  }

  return items.slice(offset,offset + limit);
}


module.exports = {
  createClient,
  hasActiveTicket,
  getClient,
  getClients,
  updateClient,
  deleteClient,
  checkBlockedClients
}
