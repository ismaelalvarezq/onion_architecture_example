const Joi = require('joi');

const schemaClient = Joi.object({
  firstName:
    Joi.string()
    .max(125)
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 125 caracteres."
    }),
  lastName:
    Joi.string()
    .max(125)
    .messages({
      "string.base": "El apellido debe ser un texto.",
      "string.empty": "El apellido no puede estar vacío.",
      "string.max": "El apellido no puede tener más de 125 caracteres."
    }),
  phone:
    Joi.string()
    .allow(null)
    .regex(/^\+\d{11}$/)
    .max(50)
    .optional()
    .messages({
      "string.pattern.base": "El teléfono debe ser un número válido.",
      "string.base": "El teléfono debe ser un texto.",
      "string.empty": "El teléfono no puede estar vacío.",
      "string.max": "El teléfono no puede tener más de 50 caracteres."
    }),
  email:
    Joi.string()
    .allow(null)
    .email()
    .optional()
    .messages({
      "string.base": "El correo electrónico debe ser un texto.",
      "string.email": "El correo electrónico no es válido.",
      "string.empty": "El correo electrónico no puede estar vacío.",
    }),
});

module.exports = { schemaClient };
