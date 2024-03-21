const Joi = require('joi');
const { ticketPriority } = require("../../../constants");

const schemaTicketPriority = Joi.object({
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
    .valid(...Object.values(ticketPriority.name))
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

  weight:
    Joi.number()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el peso." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "number.base": "El peso debe ser un número entero.",
      "number.empty": "El peso no puede estar vacío.",
      "number.integer": "El peso debe ser un número entero."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idCompany", "name", "weight").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaTicketPriority };
