const store = require('./store.js');
const response = require('../../network/response.js');
const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync');
const {agents, ticketStatus} = require('../../constants.js');
const { query } = require('express');

const { validator } = require('../../helper/validator/index.js');
const { schemaTicketStatus } = require('../../helper/validator/schemas/ticketStatus');

const currentComponent = "ticket_status";


const getTicketStatus = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getTicketStatus] Missing params");

  const ticketStatus = await store.getTicketStatus(req.params.id);

  if ([agents.types.AGENT, agents.types.ADMIN].includes(req.ctx.user.type) && ticketStatus.idCompany !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener estados de ticket de otras compañías.", "[getTicketStatus] forbidden error");
  }

  response.success(req, res, ticketStatus, "response", 200);
});

async function getActiveStatuses(idCompany) {
  const query = {
    where: {
      OR: [
        { name: ticketStatus.name.OPEN },
        { name: ticketStatus.name.PENDING_USER },
        { name: ticketStatus.name.ON_HOLD },
      ],
    },
  };

  if (idCompany) {
    query.where = {
      ...query.where,
      idCompany: idCompany,
    };
  }

  const ticketsStatuses = await store.getTicketStatuses(query);
  return ticketsStatuses;
}

async function getInactiveStatuses(idCompany) {
  const query = {
    where: {
      OR: [
        { name: ticketStatus.name.EXPIRED_USER },
        { name: ticketStatus.name.EXPIRED_AGENT },
        { name: ticketStatus.name.BLOCKED},
        { name: ticketStatus.name.REASSIGNED },
        { name: ticketStatus.name.SOLVED},
      ],
    },
  };

  if (idCompany) {
    query.where = {
      ...query.where,
      idCompany: idCompany,
    };
  }

  const ticketsStatuses = await store.getTicketStatuses(query);
  return ticketsStatuses;
}

const getTicketsStatuses = catchAsync(async (req, res, next) => {
  const type = req.query?.typeStatus;
  let query = {};
  if (type) {
    validator(schemaTicketStatus, { typeStatus: type }, "Get");
  }

  let idCompany = null;

  if ([agents.types.AGENT, agents.types.ADMIN].includes(req.ctx.user.type)) {
    idCompany = req.ctx.user.idCompany;
    query.where = {
      idCompany: idCompany,
    }
  } else if (req.query?.idCompany) {
    query.where = { idCompany: req.query.idCompany }
  }
  if (req.query?.name) {
    if (query.where) {
      query.where.name = req.query.name;
    } else {
      query.where = { name: req.query.name };
    }
  }

  let ticketsStatuses;
  if (type === ticketStatus.typeStatus.ACTIVE) {
    ticketsStatuses = await getActiveStatuses(idCompany);
  } else if (type == ticketStatus.typeStatus.INACTIVE) {
    ticketsStatuses = await getInactiveStatuses(idCompany);
  } else {
    ticketsStatuses = await store.getTicketStatuses(query);
  }
  response.success(req, res, ticketsStatuses, "response", 200);

});

const createTicketStatus = catchAsync(async (req, res, next) => {
  let ticketStatus = req.body;

  validator(schemaTicketStatus, ticketStatus, "Post");

  const newTicketStatus = await store.createTicketStatus(ticketStatus);

  response.success(req, res, newTicketStatus, "response", 201);
});

const updateTicketStatus = catchAsync(async (req, res, next) => {
  let ticketStatus = req.body;
  ticketStatus.id = req.params.id;

  validator(schemaTicketStatus, ticketStatus, "Patch");

  const updatedTicketStatus = await store.updateTicketStatus(ticketStatus);

  response.success(req, res, updatedTicketStatus, "response", 200);
});

const deleteTicketStatus = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteTicketStatus] Missing 'Id'"
    );

  const deletedTicketStatus = await store.deleteTicketStatus(req.params.id);

  response.success(req, res, deletedTicketStatus, "response", 200);
});


module.exports = {
  getTicketStatus,
  getTicketsStatuses,
  createTicketStatus,
  updateTicketStatus,
  deleteTicketStatus,
  getActiveStatuses,
  getInactiveStatuses,
}
