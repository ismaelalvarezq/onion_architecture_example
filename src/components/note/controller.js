const store = require('./store.js');
const validator = require('../../validator.js');
const { checkSameCompany, checkActiveTicket } = require('../../helper/authorization.js');
const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');
const constants = require('../../constants.js');

const currentComponent = "note";


const getNote = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getNote] Missing params");
  const note = await store.getNote(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, note.idClient);
  }
  response.success(req, res, note, "response", 200);
});

const getNotes = catchAsync(async (req, res, next) => {
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
      var variableType = validator.getFieldType(currentComponent, key);

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
    query["orderBy"] = { "updatedAt": "desc" };
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    query.where = {
      ...query.where,
      client: {
        id: req.query.idClient,
        channel: {
          company:{
            id: req.ctx.user.idCompany
          }
        }
      },
    };
  }

  query.include = {
    agent: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        type: true,
      },
    },
  }

  const notes = await store.getNotes(query);
  response.success(req, res, notes, "response", 200);
});

const createNote = catchAsync(async (req, res, next) => {
  let note = req.body;

  if (!note.idClient || !note.title) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[createNote] Missing params");
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, note.idClient);
  }

  if ([constants.agents.types.AGENT].includes(req.ctx.user.type)) {
    await checkActiveTicket(req.ctx.user.id, note.idClient);
  }

  note.idAuthor = req.ctx.user.id;

  if (!validator.validateTypeVariablesModel(currentComponent, note)) {
    throw new BadRequestError(null, "Error en los parámetros.", "[createNote] Data types don't match");
  }

  const newNote = await store.createNote(note);
  response.success(req, res, newNote, "response", 201);
});

const updateNote = catchAsync(async (req, res, next) => {
  let note = req.body;
  note.id = req.params.id;

  if (!note.id || (!note.idClient && !note.title && !note.description)) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[updateNote] Missing params");
  }

  if (!validator.validateTypeVariablesModel(currentComponent, note)) {
    throw new BadRequestError(null, "Error en los parámetros.", "[updateNote] Data types don't match");
  }

  const noteData = await store.getNote(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, noteData.idClient);
  }
  if (noteData.idAuthor !== req.ctx.user.id && constants.agents.types.AGENT === req.ctx.user.type) {
    throw new ForbiddenError(null, "No se pueden editar notas de otros agentes.", "[updateNote] forbidden error");
  }

  const updatedNote = await store.updateNote(note);
  response.success(req, res, updatedNote, "response", 200);
});

const deleteNote = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteAgent] Missing 'Id'");

  const noteData = await store.getNote(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    await checkSameCompany(req.ctx.user.idCompany, noteData.idClient);
  }
  if (noteData.idAuthor !== req.ctx.user.id && constants.agents.types.AGENT === req.ctx.user.type) {
    throw new ForbiddenError(null, "No se pueden eliminar notas de otros agentes.", "[updateNote] forbidden error");
  }

  const deletedNote = await store.deleteNote(req.params.id);
  response.success(req, res, deletedNote, "response", 200);
});


module.exports = {
  getNote,
  getNotes,
  createNote,
  updateNote,
  deleteNote
}
