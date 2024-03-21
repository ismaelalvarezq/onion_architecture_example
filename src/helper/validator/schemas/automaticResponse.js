const Joi = require('joi');

const schemaAutomaticResponse = Joi.object({
  id:
    Joi.string()
      .guid()
      .alter({
        Post: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      })
      .messages({
        "string.base": "La Id debe ser un texto.",
        "string.empty": "La Id no puede estar vacía.",
        "string.guid": "La Id debe ser un GUID.",
      }),

  idCompany:
    Joi.string()
      .guid()
      .alter({
        Post: (schema) => schema.required().messages({ "any.required": "Falta la Id de Compañía." }),
        Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede modificar la Id de Compañía." })
      })
      .messages({
        "string.base": "La Id de Compañía debe ser un texto.",
        "string.empty": "La Id de Compañía no puede estar vacía.",
        "string.guid": "La Id de Compañía debe ser un GUID.",
      }),

  idAutomaticResponseType:
    Joi.string()
      .guid()
      .alter({
        Post: (schema) => schema.required().messages({ "any.required": "Falta la Id del tipo de respuesta automática." }),
        Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede modificar la Id del tipo de respuesta automática." })
      })
      .messages({
        "string.base": "La Id del tipo de respuesta automática debe ser un texto.",
        "string.empty": "La Id del tipo de respuesta automática no puede estar vacía.",
        "string.guid": "La Id del tipo de respuesta automática debe ser un GUID.",
        "any.required": "Falta la Id del tipo de respuesta automática del.",
      }),

  message:
    Joi.string()
      .alter({
        Post: (schema) => schema.required().messages({ "any.required": "Falta el mensaje." }),
        Patch: (schema) => schema.optional()
      })
      .max(1024)
      .messages({
        "string.base": "El mensaje debe ser un texto.",
        "string.empty": "El mensaje no puede estar vacío.",
        "string.max": "El mensaje no puede tener más de 1024 caracteres.",
      }),

  isActive:
    Joi.bool()
      .alter({
        Post: (schema) => schema.required().messages({ "any.required": "Falta el estado." }),
        Patch: (schema) => schema.optional()
      })
      .messages({
        "boolean.base": "El estado debe ser un booleano.",
        "any.required": "Falta el estado.",
      }),
});

module.exports = { schemaAutomaticResponse };
