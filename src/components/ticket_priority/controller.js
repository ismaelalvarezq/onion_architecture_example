const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync');
const constants = require('../../constants.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaTicketPriority } = require('../../helper/validator/schemas/ticketPriority');

const currentComponent = "ticket_priority";

const getTicketPriority = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getTicketPriority] Missing params");

  const ticketPriority = await store.getTicketPriority(req.params.id);

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && ticketPriority.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener prioridad de ticket de otras compañías.", "[getTicketPriority] forbidden error");
  }

  response.success(req, res, ticketPriority, "response", 200);
});

const getTicketsPriorities = catchAsync(async (req, res, next) => {
  let filterItems = {};
  let orderBy = [];
  let query = {};

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

  query["skip"] = parseInt(req.query.offset) || 0;
  query["take"] = parseInt(req.query.limit) || 100;

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

  const ticketsPriorities = await store.getTicketsPriorities(query);
  response.success(req, res, ticketsPriorities, "response", 200);
});

const createTicketPriority = catchAsync(async(req, res, next) => {
  let ticketPriority = req.body;

  validator(schemaTicketPriority, ticketPriority, "Post");

  const ticketPriorityCreated = await store.createTicketPriority(ticketPriority);

  response.success(req, res, ticketPriorityCreated, "response", 201);
});

const updateTicketPriority = catchAsync(async(req, res, next) => {
  let ticketPriority = req.body;
  ticketPriority.id = req.params.id;

  validator(schemaTicketPriority, ticketPriority, "Patch");

  const ticketPriorityUpdated = await store.updateTicketPriority(ticketPriority);

  response.success(req, res, ticketPriorityUpdated, "response", 200);
});

const deleteTicketPriority = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteTicketPriority] Missing 'Id'"
    );

  const deletedTicketPriority = await store.deleteTicketPriority(req.params.id);

  response.success(req, res, deletedTicketPriority, "response", 200);
});


module.exports = {
  getTicketPriority,
  getTicketsPriorities,
  createTicketPriority,
  updateTicketPriority,
  deleteTicketPriority
}
