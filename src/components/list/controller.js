const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const { validator } = require("../../helper/validator/index.js");
const listStore = require("../list/store");
const { listSchema } = require("../../helper/validator/schemas/list");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../../exceptions.js");
const constants = require("../../constants.js");
const { formatRequest } = require("../../utils/formatRequest.js");
const { getClient } = require("../client/store.js");


const createList = catchAsync(async (req, res, next) => {
  const listData = req.body;

  validator(listSchema, listData, "Post");

  if (
    constants.agents.types.ADMIN === req.ctx.user.type &&
    listData.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(null, "No puedes crear una lista para otra compañía.");
  }

  const channels = new Set();
  for (let idClient of listData.clients) {
    const client = await getClient({ where: { id: idClient } });

    if (!client) {
      throw new BadRequestError(null, "Cliente id: " + idClient + " no existe.");
    }
    if (
      constants.agents.types.ADMIN === req.ctx.user.type &&
      client.idCompany !== req.ctx.user.idCompany
    ) {
      throw new ForbiddenError(null, "No puedes crear una lista con clientes de otra compañía.");
    }
    channels.add(client.idChannel);
  }
  if (channels.size > 1) throw new BadRequestError(null, "Los clientes deben ser del mismo canal.");

  const newList = await listStore.createList(listData);
  response.success(req, res, newList, "response", 201);
});

const getList = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "No se envió el Id de la lista.");

  const list = await listStore.getList(req.params.id);
  if (!list) throw new NotFoundError(null, "No se encontró la lista.");

  if (
    constants.agents.types.ADMIN === req.ctx.user.type &&
    list.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(null, "No se puede obtener una lista de otra compañía.");
  }

  response.success(req, res, list, "response", 200);
});

const getLists = catchAsync(async (req, res, next) => {
  const { filters, orders } = formatRequest(req);

  if (constants.agents.types.ADMIN === req.ctx.user.type) {
    filters.idCompany = req.ctx.user.idCompany;
  }

  const lists = await listStore.getLists(filters, orders);
  response.success(req, res, lists, "response", 200);
});

const updateList = catchAsync(async (req, res, next) => {
  const listData = req.body;
  listData.id = req.params.id;

  validator(listSchema, listData, "Patch");

  const list = await listStore.getList(listData.id);
  if (!list) throw new NotFoundError(null, "No se encontro la lista.");

  if (
    constants.agents.types.ADMIN === req.ctx.user.type &&
    listData.idCompany !== req.ctx.user.idCompany &&
    list.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(null, "No puedes modificar la lista para que sea de otra compañía.");
  }

  for (let idClient of listData.clients) {
    const client = await getClient({ where: { id: idClient } });

    if (!client) {
      throw new BadRequestError(null, "Cliente id: " + idClient + " no existe.");
    }
    if (
      constants.agents.types.ADMIN === req.ctx.user.type &&
      client.idCompany !== req.ctx.user.idCompany
    ) {
      throw new ForbiddenError(null, "No puedes modificar una lista con clientes de otra compañía.");
    }
  }

  const updatedList = await listStore.updateList(listData);
  response.success(req, res, updatedList, "response", 200);
});

const deleteList = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError(null, "No se envio el id de la lista.");

  const list = await listStore.getList(id);
  if (!list) throw new NotFoundError(null, "No se encontro la lista.");
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    ) &&
    list.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden eliminar listas de otra compañía."
    );
  }

  const deletedList = await listStore.deleteList(id);

  response.success(req, res, deletedList, "response", 200);
});

const getClientsOnList = catchAsync(async (req, res, next) => {
  if (!req.params.idList) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getClientsOnList] Missing 'idList'");
  }

  const clients = await listStore.getClientsOnList(req.params.idList);

  response.success(req, res, clients, "response", 200);
});

module.exports = {
  getList,
  getLists,
  createList,
  updateList,
  deleteList,
  getClientsOnList,
};
