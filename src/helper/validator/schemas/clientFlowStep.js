const Joi = require('joi');

const schemaClientFlowStep = Joi.object({
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
      "string.guid": "La id ingresada no es válida."
    }),

  idClient:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id de la compañía" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del cliente debe ser un texto.",
      "string.empty": "La id del cliente no puede estar vacía.",
      "string.guid": "La id del cliente ingresada no es válida."
    }),

  status:
    Joi.string()
    .allow(null)
    .optional()
    .messages({
      "string.base": "La id de la compañía debe ser un texto.",
      "string.empty": "La id de la compañía no puede estar vacía.",
      "string.guid": "La id de la compañía ingresada no es válida."
    }),

  failsCount:
    Joi.number()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El conteo de errores debe ser un número entero.",
      "number.empty": "El conteo de errores no puede estar vacío.",
      "number.integer": "El conteo de errores debe ser un número entero."
    }),

  flow:
    Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .messages({
      "string.base": "El flujo debe ser un texto.",
      "string.empty": "El flujo no puede estar vacío.",
      "string.max": "El flujo no puede tener más de 50 caracteres."
    }),

  previousFlow:
    Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .messages({
      "string.base": "El flujo anterior debe ser un texto.",
      "string.empty": "El flujo anterior no puede estar vacío.",
      "string.max": "El flujo anterior no puede tener más de 50 caracteres."
    }),

  answers:
    Joi.object()
    .allow(null)
    .empty({})
    .optional()
    .messages({
      "object.base": "Las respuestas deben ser un objeto.",
    }),

  answersApi:
    Joi.object()
    .allow(null)
    .empty({})
    .optional()
    .messages({
      "object.base": "Las respuestas deben ser un objeto.",
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idClient", "status", "failsCount", "flow", "previousFlow", "answers", "answersApi").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaClientFlowStep };
