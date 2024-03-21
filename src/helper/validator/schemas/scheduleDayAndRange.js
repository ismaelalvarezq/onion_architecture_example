const Joi = require("joi");
const { scheduleRange } = require("../../../constants");
const { checkOverlap } = require("../../../utils/timeUtils.js");

const scheduleRangeSchema = Joi.object({
  id: Joi.string()
    .guid()
    .optional()
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida.",
    }),
  startTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.base': 'La hora de inicio debe ser una cadena.',
      'string.pattern.base': 'La hora de inicio debe estar en formato HH:mm.',
      'any.required': 'Falta la hora de inicio.',
    }),
  endTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.base': 'La hora de finalización debe ser una cadena.',
      'string.pattern.base': 'La hora de finalización debe estar en formato HH:mm.',
      'any.required': 'Falta la hora de finalización.',
    })
    .custom((value, helpers) => {
      const { startTime } = helpers.state.ancestors[0];

      if (value <= startTime) {
        return helpers.error('custom.endtime');
      }

      return value;
    })
    .messages({
      'custom.endtime': 'La hora de finalización debe ser posterior a la hora de inicio.',
    }),
});

const scheduleDaySchema = Joi.object({
  id: Joi.string()
    .guid()
    .alter({
      Post: (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la id." }),
      Put: (schema) => schema.required().messages({ "any.required": "Falta la id." })
    })
    .messages({
      "string.base": "La id debe ser un texto.",
      "string.empty": "La id no puede estar vacía.",
      "string.guid": "La id ingresada no es válida.",
    }),
  weekDay: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .required()
    .messages({
      'number.base': 'El día de la semana debe ser un número.',
      'number.integer': 'El día de la semana debe ser un número entero.',
      'number.min': 'El día de la semana debe ser al menos 1.',
      'number.max': 'El día de la semana debe ser como máximo 7.',
      'any.required': 'Falta el día de la semana.',
    }),
  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El valor de isActive debe ser verdadero o falso.',
      'any.required': 'Falta el valor de isActive.',
    }),
  scheduleRanges: Joi.array()
    .items(scheduleRangeSchema)
    .required()
    .messages({
      'array.base': 'El rangos de horarios debe ser un arreglo.',
    })
    .custom((value, helpers) => {
      const hasOverlap = value.some((range1, i) =>
        value.slice(i + 1).some((range2) => checkOverlap({ startTime: range1.startTime, endTime: range1.endTime }, { startTime: range2.startTime, endTime: range2.endTime }))
      );

      if (hasOverlap) {
        return helpers.error('array.overlap');
      }
      return value;
    })
    .messages({
      'array.base': 'El arreglo de rangos de horarios debe ser un arreglo.',
      'array.overlap': 'Algunos rangos de horarios se solapan.',
    }),
}).required();

const scheduleDayAndRangeSchema = Joi.object({
  idAgent: Joi.string()
    .guid()
    .required()
    .messages({
      'string.base': 'La id del agente debe ser un texto.',
      'string.empty': 'La id del agente no puede estar vacía.',
      'string.guid': 'La id del agente ingresada no es válida.',
      'any.required': 'Falta la id del agente.',

    }),
  scheduleDays: Joi.array()
    .items(scheduleDaySchema)
    .min(1)
    .required()
    .messages({
      'array.base': 'El arreglo de días de horarios debe ser un arreglo.',
      'array.min': 'Debe haber al menos un día de horario en el arreglo.',
      'any.required': 'Falta el arreglo de días de horarios.',
    }),
});



module.exports = { scheduleDayAndRangeSchema };
