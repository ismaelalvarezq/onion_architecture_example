const Joi = require('joi');

const schemaNewPassword = Joi.object({
  email:
    Joi.string()
    .email()
    .alter({
      Put: (schema) => schema.required().messages({ "any.required": "El email es requerido" }),
    })
    .messages({
      "string.base": "El email debe ser un texto.",
      "string.empty": "El email no puede estar vacío.",
      "string.email": "El email debe ser un email válido."
    }),

  old_password:
    Joi.string()
    .min(6)
    .alter({
      Put: (schema) => schema.required().messages({ "any.required": "La password antigua es requerida" }),
    })
    .messages({
      "string.base": "La password antigua debe ser un texto.",
      "string.empty": "La password antigua no puede estar vacío.",
      "string.min": "La password antigua debe tener al menos 6 carácteres."
    }),

  new_password:
    Joi.string()
    .min(6)
    .alter({
      Put: (schema) => schema.required().messages({ "any.required": "La password nueva es un campo requerido." }),
    })
    .messages({
      "string.base": "La password nueva debe ser un texto.",
      "string.empty": "La password nueva no puede estar vacío.",
      "string.min": "La password nueva debe tener al menos 6 carácteres."
    }),
})


module.exports = { schemaNewPassword };
