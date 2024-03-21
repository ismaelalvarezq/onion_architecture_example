const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');
const constants = require('../../constants.js');

const currentComponent = "channel";
const { validator } = require('../../helper/validator/index.js');
const { schemaChannel } = require('../../helper/validator/schemas/channel');

const createChannel = catchAsync(async (req, res, next) => {
  let channel = req.body;

  validator(schemaChannel, channel, "Post");

  const newChannel = await store.createChannel(channel);
  response.success(req, res, newChannel, "response", 201);
});

const getChannel = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getChannel] Missing params");

  const channel = await store.getChannel(req.params.id);
  if (!channel) {
    throw new BadRequestError(null, "No se encontró el canal.", "[getChannel] not found");
  }
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && channel.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener canales de otras compañías.", "[getChannel] forbidden error");
  }
  response.success(req, res, channel, "response", 200);
});

const getChannels = catchAsync(async (req, res, next) => {
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
      idCompany: req.ctx.user.idCompany,
    }
  }

  const channels = await store.getChannels(query);
  response.success(req, res, channels, "response", 200);
});

const updateChannel = catchAsync(async (req, res, next) => {
  let updateChannel = req.body;
  updateChannel.id = req.params.id;

  validator(schemaChannel, updateChannel, "Patch");

  const updatedChannel = await store.updateChannel(updateChannel);
  response.success(req, res, updatedChannel, "response", 200);
});

const deleteChannel = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteChannel] Missing 'Id'");
  
  const deletedChannel = await store.deleteChannel(req.params.id);
  response.success(req, res, deletedChannel, "response", 200);
});

module.exports = {
  getChannel,
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
}
