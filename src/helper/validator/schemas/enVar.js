const Joi = require('joi');

const schemaEnVar = Joi.object({
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

  idChannel:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del canal" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del canal debe ser un texto.",
      "string.empty": "La id del canal no puede estar vacía.",
      "string.guid": "La id del canal ingresada no es válida."
    }),

  value:
    Joi.string()
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el token." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El value debe ser un texto.",
      "string.empty": "El value no puede estar vacío.",
      "string.max": "El value no puede tener más de 250 caracteres."
    }),

  type:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el tipo" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El tipo debe ser un texto.",
      "string.empty": "El tipo no puede estar vacío.",
      "string.max": "El tipo no puede tener más de 50 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idChannel", "value", "type").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaEnVar };
