const Joi = require('joi');

const schemaChannel = Joi.object({
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

  idCompany:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id de la compañía" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id de la compañía debe ser un texto.",
      "string.empty": "La id de la compañía no puede estar vacía.",
      "string.guid": "La id de la compañía ingresada no es válida."
    }),

  name:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el nombre." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 50 caracteres."
    }),

  type:
    Joi.string()
    .valid("Facebook", "Instagram", "Webchat", "WhatsApp")
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el tipo." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El tipo debe ser un texto.",
      "string.empty": "El tipo no puede estar vacío.",
      "any.only": "El tipo debe ser uno de los siguientes: Facebook, Instagram, Webchat, WhatsApp."
    }),

  imageUrl:
    Joi.string()
    .allow(null)
    .uri({ scheme: ["http", "https"] })
    .max(250)
    .optional()
    .messages({
      "string.uri": "La url de la imagen debe ser una url válida.",
      "string.uriCustomScheme": "La url de la imagen debe ser una url válida.",
      "string.base": "La url de la imagen debe ser un texto.",
      "string.empty": "La url de la imagen no puede estar vacía.",
      "string.max": "La url de la imagen no puede tener más de 250 caracteres.",
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("name", "type", "token", "imageUrl").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaChannel };
