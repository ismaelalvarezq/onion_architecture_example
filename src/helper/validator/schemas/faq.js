const Joi = require('joi');

const schemaFaq = Joi.object({
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

  title:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el título." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El título debe ser un texto.",
      "string.empty": "El título no puede estar vacío.",
      "string.max": "El título no puede tener más de 50 caracteres."
    }),

  description:
    Joi.string()
    .max(500)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el descripción." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El descripción debe ser un texto.",
      "string.empty": "El descripción no puede estar vacío.",
      "string.max": "El descripción no puede tener más de 500 caracteres."
    }),

  body:
    Joi.string()
    .max(500)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el cuerpo." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El cuerpo debe ser un texto.",
      "string.empty": "El cuerpo no puede estar vacío.",
      "string.max": "El cuerpo no puede tener más de 500 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idCompany", "title", "description", "body").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaFaq };
