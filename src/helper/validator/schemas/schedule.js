const Joi = require('joi');

const schemaSchedule = Joi.object({
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

  idAgent:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la id del agente" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "La id del agente debe ser un texto.",
      "string.empty": "La id del agente no puede estar vacía.",
      "string.guid": "La id del agente ingresada no es válida."
    }),

  token:
    Joi.string()
    .max(50)
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta el token." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "string.base": "El token debe ser un texto.",
      "string.empty": "El token no puede estar vacío.",
      "string.max": "El token no puede tener más de 50 caracteres."
    }),

  checkInTime:
    Joi.date()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la fecha de inicio." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe tener el formato YYYY-MM-DD HH:mm:ss.",
    }),

  checkOutTime:
    Joi.date()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la fecha de salida." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "date.base": "La fecha de salida debe ser una fecha válida.",
      "date.format": "La fecha de salida debe tener el formato YYYY-MM-DD HH:mm:ss.",
    }),

  launchTimeStart:
    Joi.date()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la fecha de inicio del almuerzo." }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "date.base": "La fecha de inicio del almuerzo debe ser una fecha válida.",
      "date.format": "La fecha de inicio del almuerzo debe tener el formato YYYY-MM-DD HH:mm:ss.",
    }),

  launchTimeFinish:
    Joi.date()
    .alter({
      Post : (schema) => schema.required().messages({ "any.required": "Falta la fecha de salida del almuerzo" }),
      Patch: (schema) => schema.optional()
    })
    .messages({
      "date.base": "La fecha de salida del almuerzo debe ser una fecha válida.",
      "date.format": "La fecha de salida del almuerzo debe tener el formato YYYY-MM-DD HH:mm:ss.",
    }),
})
.messages({ "object.unknown": "Variable no permitida." })
.alter({
  Patch: (schema) => schema.or("idAgent", "token", "checkInTime", "checkOutTime", "launchTimeStart", "launchTimeFinish").messages({ "object.missing": "Debe enviar al menos un campo a editar." }),
});


module.exports = { schemaSchedule };
