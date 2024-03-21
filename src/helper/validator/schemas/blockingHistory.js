const Joi = require('joi');
const { blockingHistory } = require("../../../constants");

const schemaBlockingHistory = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la id." })
    })
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida"
    }),

  idClient:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del cliente" }),
      Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede editar la id del cliente." })
    })
    .messages({
      "string.base": "La id del cliente debe ser un texto.",
      "string.empty": "La id del cliente no puede estar vacío.",
      "string.guid": "La id del cliente ingresada no es válida"
    }),

  type:
    Joi.string()
    .valid(...Object.values(blockingHistory.type))
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el tipo" }),
      Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede editar el tipo." })
    })
    .messages({
      "string.base": "El tipo debe ser un texto.",
      "string.empty": "El tipo no puede estar vacío.",
      "string.valid": "El tipo ingresado no es válido"
    }),

  reason:
    Joi.string()
    .allow(null)
    .optional()
    .max(250)
    .messages({
      "string.base": "La razón del bloqueo debe ser un texto",
      "string.empty": "La razón del bloqueo no puede estsr vacía",
    }),

  timeBlocked:
    Joi.string()
    .messages({
      "string.base": "El tiempo bloqueado debe ser un texto",
      "string.empty": "El tiempo bloqueado no puede estsr vacío",
    }),

  dateUnblock:
    Joi.date()
    .allow(null)
    .optional()
    .messages({
      "date.base": "La fecha de desbloqueo debe ser una fecha",
    }),

  createdBy:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del administrador o agente que creó el bloqueo" }),
      Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede editar la id del administrador o agente que creó el bloqueo." })
    })
    .messages({
      "string.base": "La id del administrador o agente que creó el bloqueo debe ser un texto.",
      "string.empty": "La id del administrador o agente que creó el bloqueo no puede estar vacío.",
      "string.guid": "La id del administrador o agente que creó el bloqueo ingresada no es válida"
    }),
})
.messages({ "object.unknown": "Variable no permitida" })
.alter({
  Patch: (schema) => schema.or("name", "color").messages({ "object.missing": "Debe enviar al menos un campo a editar" }),
});


module.exports = { schemaBlockingHistory };
