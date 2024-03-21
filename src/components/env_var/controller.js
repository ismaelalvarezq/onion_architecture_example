const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const currentComponent = "env_var";
const catchAsync = require('../../utils/catchAsync.js');

const { validator } = require('../../helper/validator/index.js');
const { schemaEnVar } = require('../../helper/validator/schemas/enVar');


const getEnvVar = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getEnvVar] Missing params"
    );
  const envVar = await store.getEnvVar(req.params.id);

  response.success(req, res, envVar, "response", 200);
});

const getEnvVars = catchAsync(async(req, res, next) => {
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

  if (req.query.channelType) {
    delete query.where.channelType;
    query.where.channel = {
      type: req.query.channelType,
    };
  }

  query.include = { channel: true };

  const envVars = await store.getEnvVars(query);

  response.success(req, res, envVars, "response", 200);
});

const createEnvVar = catchAsync(async (req, res, next) => {
  let envVar = req.body;

  validator(schemaEnVar, envVar, "Post");

  const newEnvVar = await store.createEnvVar(envVar);

  response.success(req, res, newEnvVar, "response", 201);
});

const updateEnvVar = catchAsync(async (req, res, next) => {
  let envVar = req.body;
  envVar.id = req.params.id;

  validator(schemaEnVar, envVar, "Patch");

  const updatedEnvVar = await store.updateEnvVar(envVar);

  response.success(req, res, updatedEnvVar, "response", 200);
});

const deleteEnvVar = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteAgent] Missing 'Id'"
    );

  const envVar = await deleteEnvVar(req.params.id);

  response.success(req, res, envVar, "response", 200);
});

function getEnvVarByToken(req, res, next) {
  return new Promise((resolve, reject) => {
    var query = {};

    if(token){
      query["where"] = { "token": token };
      resolve(store.getEnvVarByToken(query));
    }else{
      reject("[Invalid EnvVar] Error or missing params");
    }
  });
}

module.exports = {
  getEnvVar,
  getEnvVars,
  createEnvVar,
  updateEnvVar,
  deleteEnvVar,

  getEnvVarByToken
}
