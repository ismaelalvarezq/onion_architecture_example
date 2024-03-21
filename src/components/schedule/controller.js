const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaSchedule } = require('../../helper/validator/schemas/schedule');

const currentComponent = "schedule";


const getSchedule = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getSchedule] Missing params"
    );
  const schedule = await store.getSchedule(req.params.id);

  response.success(req, res, schedule, "response", 200);
});

const getSchedules = catchAsync(async(req, res, next) => {
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

  const schedules = await store.getSchedules(query);

  response.success(req, res, schedules, "response", 200);
});

const createSchedule = catchAsync(async(req, res, next) => {
  let schedule = req.body;

  validator(schemaSchedule, schedule, "Post");

  const newSchedule = await store.createSchedule(schedule);

  response.success(req, res, newSchedule, "response", 201);
});

const updateSchedule = catchAsync(async(req, res, next) => {
  let schedule = req.body;
  schedule.id = req.params.id;

  validator(schemaSchedule, schedule, "Patch");

  const updatedSchedule = await store.updateSchedule(schedule);

  response.success(req, res, updatedSchedule, "response", 200);
});

const deleteSchedule = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteSchedule] Missing 'Id'"
    );
  const deletedSchedule = await store.deleteSchedule(req.params.id);

  response.success(req, res, deletedSchedule, "response", 200);
});


module.exports = {
  getSchedule,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
}
