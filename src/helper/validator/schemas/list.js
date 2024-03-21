const Joi = require("joi");


const listSchema = Joi.object({
  id: Joi.string()
    .guid()
    .alter({
      Post: (schema) =>
        schema.forbidden().messages({
          "any.unknown": "No se puede asignar manualmente la id.",
        }),
      Patch: (schema) =>
        schema.required().messages({
          "any.required": "Falta la id."
        }),
    })
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida.",
    }),

  idCompany: Joi.string()
    .guid()
    .alter({
      Post: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta la id de la compañía" }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "La id de la compañía debe ser un texto.",
      "string.empty": "La id de la compañía no puede estar vacía.",
      "string.guid": "La id de la compañía ingresada no es válida.",
    }),

  name: Joi.string()
    .max(100)
    .alter({
      Post: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta el nombre del area." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El nombre de la lista debe ser un texto.",
      "string.empty": "El nombre de la lista no puede estar vacío.",
      "string.max": "El nombre de la lista no puede tener más de 100 caracteres."
    }),

  clients: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.string()
        .guid()
        .messages({
          "string.base": "La id del cliente debe ser un texto.",
          "string.empty": "La id del cliente no puede estar vacía.",
          "string.guid": "La id del cliente ingresada no es válida.",
        })
    )
    .messages({
      "any.required": "Falta la lista de clientes",
      "array.min": "No se puede crear una lista sin clientes",
      "array.base": "La lista de clientes debe ser un arreglo",
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) =>
    schema.or("name", "idCompany").messages({
      "object.missing": "Debe enviar al menos un campo a editar.",
    }),
});


module.exports = { listSchema };
