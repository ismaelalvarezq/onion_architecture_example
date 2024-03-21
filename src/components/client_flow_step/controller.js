const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const currentComponent = "client_flow_step";
const catchAsync = require('../../utils/catchAsync.js');

const { validator } = require('../../helper/validator/index.js');
const { schemaClientFlowStep } = require('../../helper/validator/schemas/clientFlowStep');

const getClientFlowStep = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getClientFlowStep] Missing params"
    );
  const clientFlowStep = await store.getClientFlowStep(req.params.id);
  response.success(req, res, clientFlowStep, "response", 200);
});

const getClientFlowsStep = catchAsync(async(req, res, next) => {
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

      if (variableType == "String" && !key.startsWith("id") && key != "flow" && key != "previousFlow") {
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

  const clientFlowSteps = await store.getClientFlowsStep(query);

  response.success(req, res, clientFlowSteps, "response", 200)
});

const createClientFlowStep = catchAsync(async (req, res, next) => {
  let clientFlowStep = req.body;

  validator(schemaClientFlowStep, clientFlowStep, "Post");

  const clientFlowStepCreated = await store.createClientFlowStep(
    clientFlowStep
  );

  response.success(req, res, clientFlowStepCreated, "response", 201);
});

const updateClientFlowStep = catchAsync(async (req, res, next) => {
  let clientFlowStep = req.body;
  clientFlowStep.id = req.params.id;

  validator(schemaClientFlowStep, clientFlowStep, "Patch");

  if (clientFlowStep.failsCount)
    clientFlowStep.failsCount = parseInt(clientFlowStep.failsCount);

  const clientFlowStepUpdated = await store.updateClientFlowStep(
    clientFlowStep
  );
  response.success(req, res, clientFlowStepUpdated, "response", 200);
});

const deleteClientFlowStep = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteClientFlowStep] Missing params"
    );

  const deletedClientFlowStep = await store.deleteClientFlowStep(req.params.id);
  response.success(req, res, deletedClientFlowStep, "response", 200);
});


module.exports = {
  getClientFlowStep,
  getClientFlowsStep,
  createClientFlowStep,
  updateClientFlowStep,
  deleteClientFlowStep
}
