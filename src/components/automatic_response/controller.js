const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../../exceptions.js");
const constants = require("../../constants.js");
const store = require("./store.js");
const { formatRequest } = require("../../utils/formatRequest.js");
const { validator } = require("../../helper/validator/index.js");
const { schemaAutomaticResponse } = require("../../helper/validator/schemas/automaticResponse.js");

const getAutomaticResponses = catchAsync(async (req, res) => {
  const { filters } = formatRequest(req);
  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type)) {
    filters.idCompany = req.ctx.user.idCompany;
  }
  const automaticResponses = await store.getAutomaticResponses(filters);
  response.success(req, res, automaticResponses, "response", 200);
});

const getAutomaticResponse = catchAsync(async (req, res) => {
  const automaticResponse = await store.getAutomaticResponse(req.params.id);
  if (!automaticResponse) throw new NotFoundError(null, "Respuesta automática no encontrada");
  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && automaticResponse.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, 'No tienes permisos para obtener esta respuesta automática');
  }
  if (!automaticResponse) throw new NotFoundError(null, "Respuesta automática no encontrada");
  response.success(req, res, automaticResponse, "response", 200);
});

const updateAutomaticResponse = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  if (!id) throw new BadRequestError(null, "Falta la Id de la respuesta automática");
  validator(schemaAutomaticResponse, data, "Patch")
  const automaticResponse = await store.getAutomaticResponse(id);
  if (!automaticResponse) throw new NotFoundError(null, "Respuesta automática no encontrada");
  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && automaticResponse.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, 'No tienes permisos para actualizar esta respuesta automática')
  }
  const updatedAutomaticResponse = await store.updateAutomaticResponse(id, data);
  response.success(req, res, updatedAutomaticResponse, "response", 200);
});

module.exports = {
  getAutomaticResponses,
  getAutomaticResponse,
  updateAutomaticResponse,
};
