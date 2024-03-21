const Joi = require('joi');

const schemaCategory = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la id." })
    })
    .messages({
      "string.guid": "La id ingresada no es válida",
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía."
    }),

  idCompany:
  Joi.string()
  .guid()
  .alter({
    Post : (schema) => schema.required().messages({ "any.required": "Falta la id de la compañia." }),
    Patch: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede editar la id de la compañia." })
  })
  .messages({
    "string.base": "La id de la compañia debe ser un texto.",
    "string.empty": "La id de la compañia no puede estar vacío.",
    "string.guid": "La id de la compañia ingresada no es válida"
  }),

  name:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el nombre." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El nombre debe ser un texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.max": "El token no puede tener más de 50 caracteres"
    }),

  color:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color debe ser un texto",
      "string.empty": "El color no puede estar vacío",
      "object.regex": "El color debe ser un código válido"
    }),
})
.messages({ "object.unknown": "Variable no permitida" })
.alter({
  Patch: (schema) => schema.or("name", "color").messages({ "object.missing": "Debe enviar al menos un campo a editar" }),
});


module.exports = { schemaCategory };
