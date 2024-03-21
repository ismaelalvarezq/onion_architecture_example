const Joi = require("joi");

const schemaChangeAgentAvailability = Joi.object({
  id: Joi.string()
    .alter({
      Put: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta id del agente." }),
    })
    .messages({
      "string.base": "El id debe ser un número entero.",
      "string.empty": "El id no puede estar vacío.",
    }),

  available: Joi.boolean()
    .alter({
      Put: (schema) =>
        schema
          .required()
          .messages({ "any.required": "Falta campo disponible." }),
    })
    .messages({
      "boolean.base": "El campo disponible  debe ser un booleano.",
      "boolean.empty": "El campo disponible no puede estar vacío.",
    }),
});

module.exports = { schemaChangeAgentAvailability };
