const Joi = require('joi');

const schema = Joi.object({
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
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del cliente" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del cliente debe ser un texto.",
      "string.empty": "La id del cliente no puede estar vacía.",
      "string.guid": "La id del cliente ingresada no es válida."
    }),

  title:
    Joi.string()
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el título." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El título debe ser un texto.",
      "string.empty": "El título no puede estar vacío.",
      "string.max": "El título no puede tener más de 250 caracteres."
    }),

  description:
    Joi.string()
    .max(250)
    .optional()
    .messages({
      "string.base": "La descripción debe ser un texto.",
      "string.empty": "La descripción no puede estar vacío.",
      "string.max": "La descripción no puede tener más de 250 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idClient", "title", "description").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schema };
