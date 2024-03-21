const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const { validator } = require("../../helper/validator/index.js");
const areaStore = require("../area/store.js");
const {
  areaSchema,
} = require("../../helper/validator/schemas/area.js");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../../exceptions.js");
const constants = require("../../constants.js");
const { formatRequest } = require("../../utils/formatRequest.js");

const createArea = catchAsync(async (req, res, next) => {
  const areaData = req.body;
  validator(areaSchema, areaData, "Post");
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) &&
    areaData.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se puede crear un area en otra compañía.",
    );
  }
  const newArea = await areaStore.createArea(areaData);
  response.success(req, res, newArea, "response", 201);
});

const getArea = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    throw new BadRequestError(
      null,
      "No se envio el id del area.",
    );
  const area = await areaStore.getArea(id);
  if (!area)
    throw new NotFoundError(
      null,
      "No se encontro el area.",
    );
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) &&
    area.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se puede obtener un area de otra compañía.",
    );
  }
  response.success(req, res, area, "response", 200);
});

const getAreas = catchAsync(async (req, res, next) => {
  const { filters, orders } = formatRequest(req);

  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type)) {
    filters.idCompany = req.ctx.user.idCompany;
  }

  const areas = await areaStore.getAreas(filters, orders);
  response.success(req, res, areas, "response", 200);
});

const updateArea = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const areaData = req.body;
  areaData.id = id;

  validator(areaSchema, areaData, "Patch");

  const area = await areaStore.getArea(id);
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) &&
    area.idCompany !== req.ctx.user.idCompany &&
    areaData.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden editar areas de otra compañía.",
    );
  }

  const updatedArea = await areaStore.updateArea(id, areaData);

  response.success(req, res, updatedArea, "response", 200);
});

const deleteArea = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    throw new BadRequestError(
      null,
      "No se envio el id del area.",
    );

  const area = await areaStore.getArea(id);
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) &&
    area.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden eliminar areas de otra compañía.",
    );
  }

  const deletedArea = await areaStore.deleteArea(id);

  response.success(req, res, deletedArea, "response", 200);
});

module.exports = {
  createArea,
  getArea,
  getAreas,
  updateArea,
  deleteArea,
};
