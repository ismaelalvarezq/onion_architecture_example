const Joi = require('joi');
const constants = require('../../../constants');

const schemaAttentionFeedback = Joi.object({
  id:
    Joi.string()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la Id del feedback." })
    })
    .messages({
      "string.base": "'La Id debe ser un texto.",
      "string.empty": "La Id no puede estar vacía.",
    }),

  idClient:
    Joi.string()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "La Id del cliente es requerida." }),
      Patch: (schema) => schema.forbidden(),
    })
    .messages({
      "string.base": "La Id de cliente debe ser un texto.",
      "string.empty": "La Id de cliente no puede estar vacío."
    }),

  idAgent:
    Joi.string()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "La Id del agente es requerida." }),
      Patch: (schema) => schema.forbidden(),
    })
    .messages({
      "string.base": "La Id de agente debe ser un texto.",
      "string.empty": "La Id de agente no puede estar vacío."
    }),

  type:
    Joi.string()
    .valid(...Object.values(constants.feedback.type))
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El tipo es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "any.only": `El tipo puede ser ${Object.values(constants.feedback.type).join(", ")}.`,
    }),

  value:
    Joi.number()
    .alter({
      Post: (schema) => schema.required().messages({ "any.unknown": "El value es un campo requerido." }),
      Patch: (schema) => schema.forbidden(),
    })
    .when('type', {
      is: constants.feedback.type.ESB,
      then: Joi.number().integer().min(1).max(2).required().messages({
        "string.base": "El campo estado debe ser un entero",
        "any.only": "'Value' solo puede ser '1 o 2 para ESB', '1-5 para CSAT' y '1-10 para NPS.",
      }),
    })
    .when('type', {
      is: constants.feedback.type.CSAT,
      then: Joi.number().integer().min(1).max(5).required().messages({
        "string.base": "El campo estado debe ser un entero",
        "any.only": "'Value' solo puede ser '1 o 2 para ESB', '1-5 para CSAT' y '1-10 para NPS.",
      }),
    })
    .when('type', {
      is: constants.feedback.type.NPS,
      then: Joi.number().integer().min(1).max(10).required().messages({
        "string.base": "El campo estado debe ser un entero",
        "any.only": "'Value' solo puede ser '1 o 2 para ESB', '1-5 para CSAT' y '1-10 para NPS.",
      }),
    }),
  
  message:
    Joi.string()
    .alter({
      Post: (schema) => schema.optional(),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El mensaje debe ser un texto.",
    }),
});


module.exports = { schemaAttentionFeedback };