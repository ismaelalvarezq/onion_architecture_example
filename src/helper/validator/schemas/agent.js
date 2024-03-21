const Joi = require('joi');
const constants = require('../../../constants');


const schema = Joi.object({
  id:
    Joi.string()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la Id del agente." })
    })
    .messages({
      "string.base": "'La Id debe ser un texto.",
      "string.empty": "La Id no puede estar vacía.",
    }),

  idCompany:
    Joi.string()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "La compañia es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "La compañia debe ser un texto.",
      "string.empty": "La compañia no puede estar vacío."
    }),

  idExternal:
    Joi.number()
    .integer()
    .allow(null)
    .optional()
    .alter({
      Post: (schema) => schema.forbidden().messages({ "any.unknown": "El id externo no puede ser creado." }),
      Patch: (schema) => schema.forbidden().messages({ "any.unknown": "El id externo no puede ser editado." }),
    })
    .messages({
      "number.integer": "El id externo debe ser un numero entero.",
    }),

  firstName:
    Joi.string()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El nombre es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .max(50)
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 50 carácteres.",
    }),

  lastName:
    Joi.string()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El apellido es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .max(50)
    .messages({
      "string.base": "El apellido debe ser un texto.",
      "string.empty": "El apellido no puede estar vacío.",
      "string.max": "El apellido no puede tener más de 50 carácteres.",
    }),

  type:
    Joi.string()
    .valid(...Object.values(constants.agents.types))
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El tipo es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .max(50)
    .messages({
      "string.base": "El tipo debe ser un texto.",
      "string.empty": "El tipo no puede estar vacío.",
      "string.max": "El tipo no puede tener más de 50 carácteres.",
      "any.only": `El tipo puede ser ${Object.values(constants.agents.types).join(", ")}.`,
    }),

  status:
    Joi.string()
    .valid('enable', 'disable')
    .alter({
      Post: (schema) => schema.forbidden().messages({ "any.unknown": "El estado no se debe enviar en creación." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El campo estado debe ser un string.",
      "any.only": "'status' solo puede ser 'enable' o 'disable'.",
    }),

  isConnected:
  Joi.string()
  .valid(...Object.values(constants.agents.isConnected))
  .alter({
    Post: (schema) => schema.forbidden().messages({ "any.unknown": "El estado no se debe enviar en creación." }),
    Patch: (schema) => schema.optional(),
  })
  .messages({
    "string.base": "El campo estado debe ser un booleano.",
    "any.only": "'status' solo puede ser 'true' o 'false'.",
  }),
  
  
  initials:
    Joi.string()
    .max(2)
    .messages({
      "string.base": "El nombre de usuario debe ser un texto.",
      "string.empty": "El nombre de usuario no puede estar vacío.",
      "string.max": "El nombre de usuario no puede tener más de 2 carácteres.",
    }),

  phone:
    Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .messages({
      "string.base": "El telefono debe ser un texto.",
      "string.empty": "El telefono no puede estar vacío.",
      "string.max": "El telefono no puede tener más de 50 carácteres.",
    }),

  email:
    Joi.string()
    .email()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El email es un campo requerido." }),
      Patch: (schema) => schema.forbidden().messages({ "any.unknown": "El email no puede ser editado." }),
    })
    .max(100)
    .messages({
      "string.base": "El correo debe ser un texto.",
      "string.empty": "El correo no puede estar vacío.",
      "string.max": "El correo no puede tener más de 100 carácteres.",
      "string.email": "El correo debe tener un formato válido.",
    }),

  age:
    Joi.number()
    .allow(null)
    .optional()
    .integer()
    .min(0)
    .messages({
      "number.base": "La edad debe ser un número.",
      "number.integer": "La edad debe ser un numero entero.",
      "number.min": "La edad debe ser mayor o igual a 0.",
    }),
  
  rut:
    Joi.string()
    .allow(null)
    .optional()
    .max(50)
    .messages({
      "string.base": "El rut debe ser un texto.",
      "string.empty": "El rut no puede estar vacío.",
      "string.max": "El rut no puede tener más de 50 carácteres.",
    }),

  gender:
    Joi.string()
    .allow(null)
    .max(50)
    .messages({
      "string.base": "El genero debe ser un texto.",
      "string.empty": "El genero no puede estar vacío.",
      "string.max": "El genero no puede tener más de 50 carácteres.",
    }),

  avatarColor:
    Joi.string()
    .hex(),

  avatarUrl:
    Joi.string()
    .allow(null)
    .uri({ scheme: ["http", "https"] })
    .max(250)
    .optional()
    .messages({
      "string.uri": "La url del avatar debe ser una url válida.",
      "string.uriCustomScheme": "La url del avatar debe ser una url válida.",
      "string.base": "El link del avatar debe ser un texto.",
      "string.empty": "El link del avatar no puede estar vacío.",
      "string.max": "El link del avatar no puede tener más de 250 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida" })
.alter({
  Patch: (schema) => schema.or(
    "idCompany",
    "firstName",
    "lastName",
    "type",
    "status",
    "isConnected",
    "password",
    "initials",
    "phone",
    "age",
    "rut",
    "gender",
    "avatarColor",
    "avatarUrl"
  ).messages({ "object.missing": "Debe enviar al menos un campo para actualizar"}),
});


module.exports = { schema };

