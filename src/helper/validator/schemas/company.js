const Joi = require('joi');

const schemaCompany = Joi.object({
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

  idWebChat:
    Joi.string()
    .allow(null)
    .guid()
    .optional()
    .messages({
      "string.base": "La id del tema debe ser un texto.",
      "string.empty": "La id del tema no puede estar vacía.",
      "string.guid": "La id del tema ingresada no es válida."
    }),

  name:
    Joi.string()
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el nombre." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 250 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idWebChat", "name").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaCompany };
