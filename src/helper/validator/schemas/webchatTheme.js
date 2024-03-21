const Joi = require('joi');

const schemaWebchatTheme = Joi.object({
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

  idCompany:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id de la compañía" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id de la compañía debe ser un texto.",
      "string.empty": "La id de la compañía no puede estar vacía.",
      "string.guid": "La id de la compañía ingresada no es válida."
    }),

  companyName:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el nombre de la compañía." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El nombre de la compañía debe ser un texto.",
      "string.empty": "El nombre de la compañía no puede estar vacío.",
      "string.max": "El nombre de la compañía no puede tener más de 50 caracteres."
    }),

  webUrl:
    Joi.string()
    .uri({ scheme: ["http", "https"] })
    .max(250)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la link de la web." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.uri": "La url de la web debe ser una url válida.",
      "string.uriCustomScheme": "La url de la web debe ser una url válida.",
      "string.base": "la link de la web debe ser un texto.",
      "string.empty": "la link de la web no puede estar vacío.",
      "string.max": "la link de la web no puede tener más de 250 caracteres."
    }),

  backgroundColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color de fondo." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color de fondo debe ser un texto",
      "string.empty": "El color de fondo no puede estar vacío",
      "object.regex": "El color de fondo debe ser un código válido"
    }),

  textColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color del texto." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color del texto debe ser un texto",
      "string.empty": "El color del texto no puede estar vacío",
      "object.regex": "El color del texto debe ser un código válido"
    }),

  backgroundMessageColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color de fondo del mensaje." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color de fondo del mensaje debe ser un texto",
      "string.empty": "El color de fondo del mensaje no puede estar vacío",
      "object.regex": "El color de fondo del mensaje debe ser un código válido"
    }),

  textMessageColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color del texto del mensaje." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color del texto del mensaje debe ser un texto",
      "string.empty": "El color del texto del mensaje no puede estar vacío",
      "object.regex": "El color del texto del mensaje debe ser un código válido"
    }),

  mainButtonColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color del botón principal." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color del botón principal debe ser un texto",
      "string.empty": "El color del botón principal no puede estar vacío",
      "object.regex": "El color del botón principal debe ser un código válido"
    }),

  acccentButtonColor:
    Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el color de acento." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El color de acento debe ser un texto",
      "string.empty": "El color de acento no puede estar vacío",
      "object.regex": "El color de acento debe ser un código válido"
    }),

  defaultOpen:
    Joi.boolean()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta seleccionar si se abrirá por defecto la burbuja." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "boolean.base": "La opción para abrir por defecto no es válida",
    }),

  viewOnMobile:
    Joi.boolean()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta seleccionar si se podrá visualizar en escritorio." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "boolean.base": "La opción para visualizar en escritorio no es válida",
    }),

  viewOnDesktop:
    Joi.boolean()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta seleccionar si se podrá visualizar en móbiles" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "boolean.base": "La opción para visualizar en móbiles no es válida",
    }),

  position:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la posición." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La posición debe ser un texto.",
      "string.empty": "La posición no puede estar vacío.",
      "string.max": "La posición no puede tener más de 50 caracteres."
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idCompany", "companyName", "webUrl", "backgroundColor", "textColor", "backgroundMessageColor", "textMessageColor", "mainButtonColor", "acccentButtonColor", "defaultOpen", "viewOnMobile", "viewOnDesktop", "position").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaWebchatTheme };
