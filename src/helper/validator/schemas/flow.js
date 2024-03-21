const Joi = require('joi');

const schemaFlow = Joi.object({
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

  jsonFile:
    Joi.string()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el jsonFile." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El jsonFile debe ser un texto.",
      "string.empty": "El jsonFile no puede estar vacío."
    }),

  trigger:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el trigger." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El trigger debe ser un texto.",
      "string.empty": "El trigger no puede estar vacío.",
      "string.max": "El trigger no puede tener más de 50 caracteres."
    }),

    channels: Joi.array()
      .min(1)
      .required()
      .items(
        Joi.string()
          .guid()
          .messages({
            "string.base": "La id del canal debe ser un texto.",
            "string.empty": "La id del canal no puede estar vacía.",
            "string.guid": "La id del canal ingresada no es válida.",
          })
      )
      .messages({
        "any.required": "Debe enviar al menos un canal.",
        "array.min": "Debe enviar al menos un canal.",
        "array.base": "El campo channels debe ser un array.",
      }),

})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("jsonFile", "trigger", "channels").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaFlow };
