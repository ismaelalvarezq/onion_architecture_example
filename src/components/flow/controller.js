const store = require('./store.js');
const envVarComponent = require('../env_var/store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaFlow } = require('../../helper/validator/schemas/flow');

const { getChannel } = require('../channel/store.js');

const currentComponent = "flow";


const getFlow = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getFlow] Missing params"
    );

  const flow = await store.getFlow(req.params.id);
  response.success(req, res, flow, "response", 200);
});

const getFlows = catchAsync(async (req, res, next) => {
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

  if (filterItems.idChannel) {
    delete query.where.idChannel;
    query.where.channels = { some: { idChannel: filterItems.idChannel } };
  }

  query["include"] = { "channels": { "include": { "channel": true } } };
  const flows = await store.getFlows(query);

  response.success(req, res, flows, "response", 200);
});

const createFlow = catchAsync(async (req, res, next) => {
  let flow = req.body;

  validator(schemaFlow, flow, "Post");

  for (let idChannel of flow.channels) {
    const channel = await getChannel(idChannel);

    if (!channel) {
      throw new BadRequestError(null, "Id de Canal: " + idChannel + " no existe.");
    }
  }

  const newFlow = await store.createFlow(flow);
  response.success(req, res, newFlow, "response", 201);
});

const updateFlow = catchAsync(async (req, res, next) => {
  let flow = req.body;
  flow.id = req.params.id;

  validator(schemaFlow, flow, "Patch");

  const updatedFlow = await store.updateFlow(flow);

  response.success(req, res, updatedFlow, "response", 200);
});

const deleteFlow = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteFlow] Missing 'Id'"
    );

  const deletedFlow = await store.deleteFlow(req.params.id);

  response.success(req, res, deletedFlow, "response", 200);
});

const getConfigJson = catchAsync(async (req, res, next) => {
  if (!req.params.token)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getConfigJson] Missing 'Token'"
    );

  const envVarQuery = {
    where: { value: req.params.token }
  };
  if (req.query.channelType) {
    envVarQuery.where.channel = {
      type: req.query.channelType,
    };
  }
  const envVar = await envVarComponent.getEnvVars(envVarQuery);
  const query = {};
  query["where"] = {
    channels: {
      some: { channel: { id: envVar[0].idChannel } },
    },
  };

  const configJson = await store.getConfigJson(query);

  response.success(req, res, configJson, "response", 200);
});


module.exports = {
  getFlow,
  getFlows,
  createFlow,
  updateFlow,
  deleteFlow,

  getConfigJson
}
