const Joi = require("joi");
const { ticketStatus } = require("../../../constants");

const schemaTicketStatus = Joi.object({
  id: Joi.string()
    .guid()
    .alter({
      Post: (schema) =>
        schema.forbidden().messages({
          "any.unknown": "No se puede asignar manualmente la id.",
        }),
      Patch: (schema) =>
        schema.required().messages({ "any.required": "Falta la id." }),
      Get: (schema) => schema.optional(),
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
      Get: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "La id de la compañía debe ser un texto.",
      "string.empty": "La id de la compañía no puede estar vacía.",
      "string.guid": "La id de la compañía ingresada no es válida.",
    }),

  name: Joi.string()
    .valid(...Object.values(ticketStatus.name))
    .max(50)
    .alter({
      Post: (schema) =>
        schema.required().messages({ "any.required": "Falta el nombre." }),
      Patch: (schema) => schema.optional(),
      Get: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 50 caracteres.",
    }),

  typeStatus: Joi.string()
  .valid(...Object.values(ticketStatus.typeStatus))
    .alter({
      Post: (schema) => schema.optional(),
      Patch: (schema) => schema.optional(),
      Get: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta el tipo de estado." }),
    })
    .valid("active", "inactive")
    .messages({
      "any.only": "'typeStatus' solo puede ser 'active' o 'inactive'.",
    }),
})
  .messages({ "object.unknown": "Variable no permitida." })
  .alter({
    Patch: (schema) =>
      schema.or("idCompany", "name").messages({
        "object.missing": "Debe enviar al menos un campo a editar.",
      }),
  });

module.exports = { schemaTicketStatus };
