const store = require('./store.js');
const validatorSchema = require('../../validator.js');
const constants = require('../../constants.js');

const response = require('../../network/response.js');
const { BadRequestError, InternalServerError, NotFoundError, ForbiddenError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');

const currentComponent = "category";
const { validator } = require('../../helper/validator/index.js');
const { schemaCategory } = require('../../helper/validator/schemas/category');


const checkCategory = catchAsync(async (req, res, next) => {
  var results = {
    hasDependency: false,
    title: "",
    message: "",
  };

  const categoryData = await store.getCategory(req.params.id);

  if (!categoryData) {
    throw new NotFoundError(null, "No existe la categoria.", "[checkCategory] error");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && categoryData.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden verificar categorías de otras compañías.", "[checkCategory] forbidden error");
  }
  
  const dependencies = await checkDependencies(req.params.id);
  if (dependencies.catchError) {
    throw new InternalServerError(null, "Error inesperado", "[checkCategory] error")
  }

  if (dependencies.idCategory === null) {
    throw new BadRequestError(null, "No existe la categoria.", "[checkCategory] error");
  }

  if (dependencies.countCategory > 0) {
    results = {
      hasDependency: true,
      count: dependencies.countCategory,
      nameCategory: dependencies.category.name,
    }
  }

  response.success(req, res, results, null, 200);
});

const getCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getAgent] Missing params");

  const category = await store.getCategory(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && category.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener categorías de otras compañías.", "[getCategory] forbidden error");
  }

  response.success(req, res, category, "response", 200);
});

const getCategories = catchAsync(async (req, res, next) => {
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

  const categories = await store.getCategories(query);
  response.success(req, res, categories, "response", 200);
});

const createCategory = catchAsync(async (req, res, next) => {
  let category = req.body;

  validator(schemaCategory, category, "Post");

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && category.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden crear categorías en otras compañías.", "[createCategory] forbidden error");
  }

  const newCategory = await store.createCategory(category);
  response.success(req, res, newCategory, "response", 201);
});

const updateCategory = catchAsync(async (req, res, next) => {
  let updateCategory = req.body;
  updateCategory.id = req.params.id;

  validator(schemaCategory, updateCategory, "Patch");

  const categoryData = await store.getCategory(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && categoryData.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden editar categorías de otras compañías.", "[updateCategory] forbidden error");
  }
  
  const updatedCategory = store.updateCategory(updateCategory);
  response.success(req, res, updatedCategory, "response", 200);
});

const deleteCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteCategory] Missing 'Id'");

  const categoryData = await store.getCategory(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && categoryData.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden eliminar categorías de otras compañías.", "[deleteCategory] forbidden error");
  }

  const deletedCategory = await store.deleteCategory(req.params.id);
  response.success(req, res, deletedCategory, "response", 200);
});


async function checkDependencies(id) {
  if (!id) {
    throw new BadRequestError(null, "Error en los parametros", "[checkDependencies] error or missing params")
  }

  return await store.checkDependencies(id);
}


module.exports = {
  checkCategory,
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  checkDependencies
}
