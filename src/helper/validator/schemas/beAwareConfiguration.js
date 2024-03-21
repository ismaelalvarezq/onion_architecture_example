const Joi = require('joi');

const beAwareConfigurationSchema = Joi.object({
  idAgent: Joi.string()
    .required()
    .messages({
      "string.base": "'La id del agente debe ser un texto.",
      "string.empty": "La id del agente no puede estar vacía.",
      "string.required": "La id del agente es obligatoria.",
    }),

  user: Joi.string()
    .required()
    .max(100)
    .messages({
      "string.base": "El usuario debe ser un texto.",
      "string.empty": "El usuario no puede estar vacío.",
      "string.max": "El usuario no puede tener más de 100 carácteres.",
      "string.required": "El usuario es obligatorio.",
    }),

  password: Joi.string()
    .required()
    .max(100)
    .messages({
        "string.base": "La contraseña debe ser un texto.",
        "string.empty": "La contraseña no puede estar vacío.",
        "string.max": "La contraseña no puede tener más de 100 carácteres.",
        "string.required": "La contraseña es obligatoria.",
    }),

  company: Joi.string()
    .required()
    .max(100)
    .messages({
        "string.base": "La compañía debe ser un texto.",
        "string.empty": "La compañía no puede estar vacío.",
        "string.max": "La compañía no puede tener más de 100 carácteres.",
        "string.required": "La compañía es obligatoria.",
    }),

  secretKey: Joi.string()
    .required()
    .max(100)
    .messages({
        "string.base": "La clave secreta debe ser un texto.",
        "string.empty": "La clave secreta no puede estar vacío.",
        "string.max": "La clave secreta no puede tener más de 100 carácteres.",
        "string.required": "La clave secreta es obligatoria.",
    }),

  clientKey: Joi.string()
    .required()
    .max(100)
    .messages({
        "string.base": "La clave de cliente debe ser un texto.",
        "string.empty": "La clave de cliente no puede estar vacío.",
        "string.max": "La clave de cliente no puede tener más de 100 carácteres.",
        "string.required": "La clave de cliente es obligatoria.",
    }),
}).messages({ "object.unknown": "Variable no permitida." });


module.exports = { beAwareConfigurationSchema };
