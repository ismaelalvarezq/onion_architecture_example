const Joi = require('joi');
const { client } = require("../../../constants");

const schemaClient = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la id." })
    })
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida."
    }),

  idChannel:
    Joi.string()
    .allow(null)
    .optional()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del canal" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del canal debe ser un texto.",
      "string.empty": "La id del canal no puede estar vacía.",
      "string.guid": "La id del canal ingresada no es válida."
    }),

  userIdChannel:
    Joi.string()
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el id del canal." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El id del canal debe ser un texto.",
      "string.empty": "El id del canal no puede estar vacío.",
      "string.max": "El id del canal no puede tener más de 250 caracteres."
    }),

  type:
    Joi.string()
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el tipo." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El tipo debe ser un texto.",
      "string.empty": "El tipo no puede estar vacío.",
      "string.max": "El tipo no puede tener más de 250 caracteres."
    }),

  state:
    Joi.string()
    .valid(...Object.values(client.state))
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el estado." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El estado debe ser un texto.",
      "string.empty": "El estado no puede estar vacío.",
      "string.max": "El estado no puede tener más de 250 caracteres."
    }),

  isConnected:
    Joi.boolean()
    .messages({
      "boolean.base": "La opción 'está conectado' no es válida",
    }),

  firstName:
    Joi.string()
    .max(125)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el nombre." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El nombre debe ser un texto.",
      "string.empty": "El nombre no puede estar vacío.",
      "string.max": "El nombre no puede tener más de 125 caracteres."
    }),

  lastName:
    Joi.string()
    .max(125)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el apellido." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El apellido debe ser un texto.",
      "string.empty": "El apellido no puede estar vacío.",
      "string.max": "El apellido no puede tener más de 125 caracteres."
    }),

  initials:
    Joi.string()
    .max(2)
    .optional()
    .messages({
      "string.base": "Las iniciales deben ser un texto.",
      "string.empty": "Las iniciales no pueden estar vacío.",
      "string.max": "Las iniciales no pueden tener más de 2 caracteres."
    }),

  avatarColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .messages({
      "string.base": "El color del avatar debe ser un texto",
      "string.empty": "El color del avatar no puede estar vacío",
      "object.regex": "El color del avatar debe ser un código válido"
    }),

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
})
.messages({ "object.unknown": "Variable no permitida." });

module.exports = { schemaClient };
