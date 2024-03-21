const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');

const constants = require('../../constants.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaFaq } = require('../../helper/validator/schemas/faq');

const currentComponent = "faq";


const getFAQ = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getFAQ] Missing params");

  const faq = await store.getFAQ(id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && faq.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se puede acceder a FAQ de otras compañías.", "[getFAQ] forbidden error");
  }
  response.success(req, res, faq, "response", 200);
});

const getFAQs = catchAsync(async (req, res, next) => {
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
    };
  }

  const faqs = await store.getFAQs(query);
  response.success(req, res, faqs, "response", 200);
});

const createFAQ = catchAsync(async (req, res, next) => {
  let faq = req.body;

  validator(schemaFaq, faq, "Post");

  const newFaq = await store.createFAQ(faq);
  response.success(req, res, newFaq, "response", 201);
});

const updateFAQ = catchAsync(async (req, res, next) => {
  let faq = req.body;
  faq.id = req.params.id;

  validator(schemaFaq, faq, "Patch");

  const updatedFaq = await store.updateFAQ(faq);
  response.success(req, res, updatedFaq, "response", 200);
});

const deleteFAQ = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteFAQ] Missing 'Id'");

  const deletedFaq = await store.deleteFAQ(id);
  response.success(req, res, deletedFaq, "response", 200);
});


module.exports = {
  getFAQ,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
}
