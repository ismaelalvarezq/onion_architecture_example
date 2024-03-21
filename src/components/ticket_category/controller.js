const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync');
const constants = require('../../constants.js');

const { validator } = require('../../helper/validator/index.js');
const { schemaTicketCategory } = require('../../helper/validator/schemas/ticketCategory');

const currentComponent = "ticket_category";


const getTicketCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getTicketCategory] Missing params"
    );
  }

  const ticketCategory = await store.getTicketCategory(req.params.id);

  if (
    [constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(
      req.ctx.user.type
    ) &&
    ticketCategory.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden obtener categorías de ticket de otras compañías.",
      "[getTicketCategory] forbidden error"
    );
  }

  response.success(req, res, ticketCategory, "response", 200);
});

const getTicketsCategories = catchAsync(async (req, res, next) => {
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

  const ticketsCategories = await store.getTicketsCategories(query);
  response.success(req, res, ticketsCategories, "response", 200);
});

const createTicketCategory = catchAsync(async(req, res, next) => {
  let ticketCategory = req.body;

  validator(schemaTicketCategory, ticketCategory, "Post");

  const ticketCategoryCreated = await store.createTicketCategory(ticketCategory);

  response.success(req, res, ticketCategoryCreated, "response", 201);
});

const updateTicketCategory = catchAsync(async(req, res, next) => {
  let ticketCategory = req.body;
  ticketCategory.id = req.params.id;

  validator(schemaTicketCategory, ticketCategory, "Patch");

  const ticketCategoryUpdated = await store.updateTicketCategory(ticketCategory);

  response.success(req, res, ticketCategoryUpdated, "response", 200);
});

const deleteTicketCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteTicketCategory] Missing 'Id'"
    );

  const deletedTicketCategory = await store.deleteTicketCategory(req.params.id);

  response.success(req, res, deletedTicketCategory, "response", 200);
});


module.exports = {
  getTicketCategory,
  getTicketsCategories,
  createTicketCategory,
  updateTicketCategory,
  deleteTicketCategory
}
