const store = require('./store.js');
const validatorSchema = require('../../validator.js');
const { checkActiveTicket, checkSameCompany } = require('../../helper/authorization.js');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');

const currentComponent = "blocking_history";
const clientController = require('../../components/client/store.js');
const mongoController = require("../mongo_ticket/resolver.js");
const statusController = require('../ticket_status/store.js');
const agentController = require('../agent/store.js');
const chatStore = require('../chat/store.js');
const chatController = require('../chat/controller.js');
const catchAsync = require('../../utils/catchAsync.js');

const constants = require('../../constants.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaBlockingHistory } = require('../../helper/validator/schemas/blockingHistory');
const { sendSystemMessage } = require('../../components/websocket_handler/resolver.js');
const dayjs = require('dayjs');

const createBlock = catchAsync(async (req, res, next) => {
  let block = req.body;
  block.createdBy = req.ctx.user.id;

  validator(schemaBlockingHistory, block, "Post");

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, block.idClient);
  }

  if ([constants.agents.types.AGENT].includes(req.ctx.user.type)) {
    await checkActiveTicket(req.ctx.user.id, block.idClient);
  }

  if (block.timeBlocked) {
    var arrayTimeBlocked = block.timeBlocked.split(" ");
    var currentDate = new Date();

    arrayTimeBlocked.forEach((itemTimeBlocked) => {
      if (itemTimeBlocked.includes("y")) {          // Year
        currentDate.setFullYear(currentDate.getFullYear() + parseInt(itemTimeBlocked.replace("y", "")));

      } else if (itemTimeBlocked.includes("mo")) {  // Month
        currentDate.setMonth(currentDate.getMonth() + parseInt(itemTimeBlocked.replace("mo", "")));

      } else if (itemTimeBlocked.includes("d")) {   // Day
        currentDate.setDate(currentDate.getDate() + parseInt(itemTimeBlocked.replace("d", "")));

      } else if (itemTimeBlocked.includes("h")) {   // Hour
        currentDate.setHours(currentDate.getHours() + parseInt(itemTimeBlocked.replace("h", "")));

      } else if (itemTimeBlocked.includes("m")) {   // Minute
        currentDate.setMinutes(currentDate.getMinutes() + parseInt(itemTimeBlocked.replace("m", "")));
      }
    });
    block.dateUnblock = currentDate;

  } else {
    block.dateUnblock = new Date(block.dateUnblock);
  }

  const newBlock = await store.createBlock(block);
  await clientController.updateClient({ "id": block.idClient, "state": constants.client.state.BLOCKED }); 
  await handleBlockProcess(block)
  await sendBlockMessage(block);
  response.success(req, res, newBlock, "response", 201);
});

const getBlock = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getBlock] Missing params");

  const block = await store.getBlock(req.params.id);

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, block.idClient);
  }

  response.success(req, res, block);
});

const getBlocks = catchAsync(async (req, res ,next) => {
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
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if (variableType == "String" && !key.startsWith("id")) {
        query["where"][key] = { "contains": filterItems[key], mode: "insensitive" };
      } else if (variableType == "Int") {
        query["where"][key] = parseInt(filterItems[key]);
      } else {
        query["where"][key] = filterItems[key];
      }
    });
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
    });
  } else {
    query["orderBy"] = { "id": "asc" };
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    query.where = {
      ...query.where,
      client: {
        idCompany: req.ctx.user.idCompany,
      },
    }
  }

  const blocks = await store.getBlocks(query);
  response.success(req, res, blocks, "response", 200);
});

const updateBlock = catchAsync(async (req, res, next) => {
  let updateBlock = req.body;
  updateBlock.id = req.params.id;

  validator(schemaBlockingHistory, updateBlock, "Patch");

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, block.idClient);
  }
  if ([constants.agents.types.AGENT].includes(req.ctx.user.type)) {
    await checkActiveTicket(req.ctx.user.id, block.idClient);
  }

  if (updateBlock.dateUnblock) updateBlock.dateUnblock = new Date(updateBlock.dateUnblock);

  const updatedBlock = await store.updateBlock(updateBlock);
  response.success(req, res, updatedBlock, "response", 200);
});

const deleteBlock = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteBlock] Missing 'Id'");

  if (constants.agents.types.ADMIN !== req.ctx.user.type) {
    throw new ForbiddenError(null, "Solo el admin puede eliminar un registro de bloqueo.", "[deleteBlock] Forbidden error.");
  }
  const block = await store.getBlock(req.params.id);
  if ([constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, block.idClient);
  }

  const deletedBlock = await store.deleteBlock(req.params.id);
  response.success(req, res, deletedBlock, "response", 200)
});


async function handleBlockProcess(block){
  const [chat, statusList, bot] = await Promise.all([
    chatStore.getChats({where: { idClient: block.idClient }}),
    statusController.getTicketStatuses({}),
    agentController.getAgents({where:{type:constants.agents.types.BOT}})
  ]);

  let queryMongo = chatController.getQuery("ticket", null, {"idChat": chat[0].id});
  let ticket = await mongoController.getTickets(queryMongo);

  await clientController.updateClient({ "id": block.idClient, "state": constants.client.state.BLOCKED });
  await mongoController.updateTicket({ "_id": ticket.data[0]._id, "idStatus": statusList.find(e=>e.name ==  constants.ticketStatus.name.BLOCKED).id });
  await chatStore.updateChat({ "id": chat[0].id, "idAgent": bot.items[0].id});
}

async function sendBlockMessage(block){
  const client = await clientController.getClient({"where":{"id": block.idClient}, "include": {"channel": true}});

  const timeMessage = block.type === constants.blockingHistory.type.TEMPORAL
      ? `temporal. No podras mandar mensajes hasta el ${dayjs(block.dateUnblock).format("DD/MM/YYYY HH:mm")}.`
      : `permanente.`;
  const sendMessage = `Has sido bloqueado por el siguiente motivo: "${block.reason}", este bloqueo es ${timeMessage}`;

  const msgBody = {
    messageType:constants.systemMessage.messageType.PlAINTEXT,
    message:[{
      type: constants.systemMessage.messageType.TEXT,
      body: sendMessage
    }],
    sentBy:constants.systemMessage.emiterType.SYSTEM,
    emiter:constants.systemMessage.emiterType.SYSTEM,
    channelType:client.channel.type,
    destiny: client.id
  };
  await sendSystemMessage(msgBody)
};


module.exports = {
  getBlock,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock
}
