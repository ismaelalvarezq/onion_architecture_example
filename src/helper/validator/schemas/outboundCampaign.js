const Joi = require("joi");
const constants = require("../../../constants");

const outboundCampaignSchema = Joi.object({
  id: Joi.string()
    .guid()
    .alter({
      Post: (schema) =>
        schema.forbidden().messages({
          "any.unknown": "No se puede asignar manualmente la id.",
        }),
      Patch: (schema) =>
        schema.required().messages({ "any.required": "Falta la id." }),
    })
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida.",
    }),

  templateIdChannel: Joi.string()
    .guid()
    .alter({
      Post: (schema) =>
        schema.required().messages({ "any.required": "Falta la id del canal de la plantilla" }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "La id del canal de la plantilla debe ser un texto.",
      "string.empty": "La id del canal de la plantilla no puede estar vacía.",
    }),

  idNode: Joi.string()
    .max(36)
    .alter({
      Post: (schema) =>
        schema.required().messages({ "any.required": "Falta la id del nodo" }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "La id del nodo debe ser un texto.",
      "string.empty": "La id del nodo no puede estar vacía.",
      "string.max": "La id del nodo no puede tener más de 36 caracteres.",
    }),

  name: Joi.string()
    .max(200)
    .alter({
      Post: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta el nombre de la campaña." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El nombre de la campaña debe ser un texto.",
      "string.empty": "El nombre de la campaña no puede estar vacío.",
      "string.max":
        "El nombre de la campaña no puede tener más de 200 caracteres.",
    }),

  startDate: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha.",
      "date.empty": "La fecha de inicio no puede estar vacía.",
      "date.required": "La fecha de inicio es requerida.",
    }),

  endDate: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha.",
      "date.empty": "La fecha de fin no puede estar vacía.",
      "date.required": "La fecha de fin es requerida.",
    }),
})
  .messages({ "object.unknown": "Variable no permitida." })
  .alter({
    Patch: (schema) =>
      schema.or("name", "idNode").messages({
        "object.missing": "Debe enviar al menos un campo a editar.",
      }),
  });

const outboundCampaignClientsSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().guid().required().messages({
      "string.base": "La id del cliente debe ser un texto.",
      "string.empty": "La id del cliente no puede estar vacía.",
      "string.guid": "La id del cliente ingresada no es válida.",
      "string.required": "El id del cliente es requerido.",
    }),
    customVariables: Joi.object().optional().messages({
      "object.base": "Las variables personalizadas deben ser un objeto.",
    }),
  })
);

module.exports = {
  outboundCampaignSchema,
  outboundCampaignClientsSchema,
};
