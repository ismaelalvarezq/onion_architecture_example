const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const { schemaWebchatTheme } = require('../../helper/validator/schemas/webchatTheme');

const currentComponent = "webchat_theme";


const getTheme = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[getTheme] Missing params"
    );

  const theme = await store.getTheme(req.params.id);

  response.success(req, res, theme, "response", 200);
});

const getThemes = catchAsync(async(req, res, next) => {
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

  const themes = await store.getThemes(query);

  response.success(req, res, themes, "response", 200);
});

const createTheme = catchAsync(async(req, res, next) => {
  let theme = req.body;

  validator(schemaWebchatTheme, theme, "Post");

  const newTheme = await store.createTheme(theme);

  response.success(req, res, newTheme, "response", 201);
});

const updateTheme = catchAsync(async(req, res, next) => {
  let theme = req.body;
  theme.id = req.params.id;

  validator(schemaWebchatTheme, theme, "Patch");

  const updatedTheme = await store.updateTheme(theme);

  response.success(req, res, updatedTheme, "response", 200);
});

const deleteTheme = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteTheme] Missing 'Id'"
    );

  const deletedTheme = await store.deleteTheme(req.params.id);

  response.success(req, res, deletedTheme, "response", 200);
});


module.exports = {
  getTheme,
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme
}
