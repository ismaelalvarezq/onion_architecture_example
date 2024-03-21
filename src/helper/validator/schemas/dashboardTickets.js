const Joi = require('joi');
const {dashboardTickets} = require('../../../constants.js');

const schemaDashboardTickets = Joi.object({
  name_id:
    Joi.string()
    .optional()
    .messages({
      "string.base": "La id debe ser un texto.",
    }),

  page_size:
    Joi.number()
    .required()
    .messages({
      "number.base": "page_size debe ser un numero.",
      "number.empty": "page_size no puede estar vacío.",
    }),

  page_number:
    Joi.number()
    .required()
    .messages({
      "number.base": "page_number debe ser un numero.",
      "number.empty": "page_number no puede estar vacío.",
    }),
  
  activeTicket:
    Joi.boolean()
    .required()
    .messages({
      "activeTicket.base": "activeTicket debe ser un booleano.",
      "activeTicket.empty": "activeTicket no puede estar vacío.",
    }),
  
  orderBy:
    Joi.string()
    .optional()
    .valid(...Object.values(dashboardTickets.orderBy))
    .messages({
      "string.base": "orderBy debe ser un texto.",
      "string.empty": "orderBy no puede estar vacío.",
    }),
})
.messages({ "object.unknown": "Variable no permitida." });


module.exports = { schemaDashboardTickets };
