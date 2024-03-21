const Joi = require("joi");

const schemaEnableDisableAgent = Joi.object({
  idExternal: Joi.number()
    .alter({
      Put: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta id externo del agente." }),
    })
    .messages({
      "number.integer": "El id externo debe ser un número entero.",
      "number.empty": "El id externo no puede estar vacío.",
    }),

  action: Joi.string()
    .valid("enable", "disable")
    .alter({
      Put: (schema) =>
        schema
          .required()
          .messages({ "any.required": "La acción es un campo requerido." }),
    })
    .messages({
      "string.base": "La acción debe ser un texto.",
      "string.empty": "La acción no puede estar vacío.",
      "any.only": "'action' solo puede ser 'enable' o 'disable'.",
    }),
});

module.exports = { schemaEnableDisableAgent };
