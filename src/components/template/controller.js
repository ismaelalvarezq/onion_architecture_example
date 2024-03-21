const store = require('./store.js');
const validatorSchema = require('../../validator.js');
const constants = require('../../constants.js');
const agentStore = require('../../components/agent/store.js');
const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../../exceptions.js');

const currentComponent = "template";
const defaultCategory = "Sin categoría";

const categoryComponent = require('../category/store.js');
const catchAsync = require('../../utils/catchAsync.js');

const { validator } = require('../../helper/validator/index.js');
const { schemaTemplate } = require('../../helper/validator/schemas/template');


const getTemplate = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getTemplate] Missing params");

  var query = { "where": { id: req.params.id }, "include": { "category": true } };

  const template = await store.getTemplate(query);

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && template.category.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden ver plantillas de otras compañías.", "[getTemplate] forbidden error");
  }

  response.success(req, res, template, "response", 200);
});

const getTemplates = catchAsync(async (req, res, next) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
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

  query["skip"] = parseInt(req.query.offset) || 0;
  query["take"] = parseInt(req.query.limit) || 10;

  if (Object.keys(filterItems).length > 0) {
    query["where"] = {};
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if (variableType == "String" && !key.startsWith("id")) {
        query["where"][key] = { "contains": filterItems[key], mode: "insensitive" };
      } else if (key.startsWith("category.")) {
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
        query["where"][key] = filterItems[key];
      }
    });
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      if (orderItem.attribute === 'categoryName') {
        query["orderBy"].push({ category: { name: orderItem.type } });
      } else {
        query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
      }
    });
  } else {
    query["orderBy"] = { "updatedAt": "desc" };
  }

  query["include"] = {
    "category": true
  };

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    query.where = {
      ...query.where,
      category: {
        idCompany: req.ctx.user.idCompany
      },
    }
  }

  console.log(JSON.stringify(query));

  const templates = await store.getTemplates(query);
  response.success(req, res, { "url": fullUrl, "results": templates }, "paginatedResponse", 200);
});

const createTemplate = catchAsync(async (req, res, next) => {
  let template = req.body;

  validator(schemaTemplate, template, "Post");

  if (!template.idCategory) {
    const categories = await categoryComponent.getCategories({ "where": { "name": defaultCategory } });
    template.idCategory = categories[0].id;
  }

  const templateCategory = await categoryComponent.getCategory(template.idCategory);

  if (!templateCategory) {
    throw new NotFoundError(null, "No se encontró la categoría de plantilla.", "[createTemplate] not found error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && templateCategory.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden crear plantillas en otras compañías.", "[createTemplate] forbidden error");
  }

  const newTemplate = await store.createTemplate(template);
  response.success(req, res, newTemplate, "response", 201);
});

const updateTemplate = catchAsync(async (req, res, next) => {
  let template = req.body;
  template.id = req.params.id;

  validator(schemaTemplate, template, "Patch");

  const templateData = await store.getTemplate({ where: { id: req.params.id }, include: { category: true } });

  if (!templateData.category) {
    throw new NotFoundError(null, "No se encontró la categoría.", "[updateTemplate] not found error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && templateData.category.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden editar plantillas de otras compañías.", "[updateTemplate] forbidden error");
  }

  const updatedTemplate = await store.updateTemplate(template);
  response.success(req, res, updatedTemplate, "response", 200);
});

const deleteTemplate = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteTemplate] Missing 'Id'");

  const template = await store.getTemplate({ where: { id: req.params.id }, include: { category: true } });

  if (!template.category) {
    throw new NotFoundError(null, "No se encontró la categoría.", "[deleteTemplate] not found error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && template.category.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden eliminar plantillas de otras compañías.", "[deleteTemplate] forbidden error");
  }

  const deletedTemplate = await store.deleteTemplate(req.params.id);
  response.success(req, res, deletedTemplate, "response", 200);
});


module.exports = {
  getTemplate,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
}
