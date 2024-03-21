const Joi = require('joi');

const schemaChat = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la id." })
    })
    .messages({
      "string.guid": "La id ingresada no es válida.",
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía."
    }),

  idAgent:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del agente." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del agente debe ser un texto.",
      "string.empty": "La id del agente no puede estar vacía.",
      "string.guid": "La id del agente ingresada no es válida."
    }),

  idClient:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del cliente." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del cliente debe ser un texto.",
      "string.empty": "La id del cliente no puede estar vacía.",
      "string.guid": "La id del cliente ingresada no es válida."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idAgent", "idClient").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaChat };
