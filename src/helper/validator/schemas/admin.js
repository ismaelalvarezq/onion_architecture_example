const Joi = require('joi');

const addCompanySchema = Joi.object({
  idPlan:
    Joi.string()
    .guid()
    .required()
    .messages({
      "string.required": "El id del plan es obligatorio.",
      "string.base": "El id del plan debe ser un texto.",
      "string.empty": "El id del plan no puede estar vacío.",
      "string.guid": "El id del plan debe tener un formato válido."
    }),
  companyName:
    Joi.string()
    .required()
    .max(250)
    .messages({
      "string.required": "El nombre de la compañía es obligatorio.",
      "string.base": "El nombre de la compañía debe ser un texto.",
      "string.empty": "El nombre de la compañía no puede estar vacío.",
      "string.max": "El nombre de la compañía no puede tener más de 250 caracteres."
    }),
  fantasyName:
    Joi.string()
    .required()
    .max(250)
    .messages({
      "string.required": "El nombre de fantasia de la compañía es obligatorio.",
      "string.base": "El nombre de fantasia de la compañía debe ser un texto.",
      "string.empty": "El nombre de fantasia de la compañía no puede estar vacío.",
      "string.max": "El nombre de fantasia de la compañía no puede tener más de 250 caracteres."
    }),
  adminFirstName:
    Joi.string()
    .required()
    .max(50)
    .messages({
      "string.required": "El nombre del administrador es obligatorio.",
      "string.base": "El nombre del administrador debe ser un texto.",
      "string.empty": "El nombre del administrador no puede estar vacío.",
      "string.max": "El nombre del administrador no puede tener más de 50 caracteres.",
    }),
  adminLastName:
    Joi.string()
    .required()
    .max(50)
    .messages({
      "string.required": "El apellido del administrador es obligatorio.",
      "string.base": "El apellido del administrador debe ser un texto.",
      "string.empty": "El apellido del administrador no puede estar vacío.",
      "string.max": "El apellido del administrador no puede tener más de 50 caracteres.",
    }),
  adminEmail:
    Joi.string()
    .required()
    .email()
    .max(100)
    .messages({
      "string.required": "El correo del administrador es obligatorio.",
      "string.base": "El correo del administrador debe ser un texto.",
      "string.empty": "El correo del administrador no puede estar vacío.",
      "string.max": "El correo del administrador no puede tener más de 100 caracteres.",
      "string.email": "El correo debe tener un formato válido."
    }),
})
.messages({ "object.unknown": "Variable no permitida." });


module.exports = { addCompanySchema };
