const Joi = require('joi');
const { file } = require('../../../constants');

const schemaAvatarAgent = Joi.object({

  id:
    Joi.string()
    .guid()
    .required()
    .messages({
        "string.base": "La Id debe ser un texto.",
        "string.empty": "La Id no puede estar vacía.",
        "string.guid": "La Id debe ser un GUID.",
        "any.required": "Falta la Id del agente.",
    }),

  file:
    Joi
    .required()
    .messages({
        "any.required": "El archivo es requerido.",
    }),

  fileName:
    Joi.string()
    .messages({
      "string.base": "Nombre de imagen debe ser un texto.",
      "string.empty": "Nombre de imagen no puede estar vacío.",
    }),

  type:
    Joi.string()
    .required()
    .valid(...Object.values(file.type))
    .custom((value, helpers) => {
      if (Object.values(file.invalidType).includes(value)) {
          return helpers.message('No esta permitido enviar audios o videos.');
      }
      return value;
    })
    .messages({
    "string.base": "El tipo debe ser un texto.",
    "string.empty": "El tipo  no puede estar vacío.",
    "any.only": "El tipo de imagen debe ser uno de los siguientes: Jpeg, Jpg, Png"
    }),
});


module.exports = { schemaAvatarAgent };
