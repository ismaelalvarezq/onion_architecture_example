const Joi = require('joi');

const getPlanSchema = Joi.object({
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
})
.messages({ "object.unknown": "Variable no permitida." });

const getPlanConfigSummarySchema = Joi.object({
  idPlanConfig:
    Joi.string()
    .guid()
    .required()
    .messages({
      "string.required": "El id del plan es obligatorio.",
      "string.base": "El id del plan debe ser un texto.",
      "string.empty": "El id del plan no puede estar vacío.",
      "string.guid": "El id del plan debe tener un formato válido."
    }),
})
.messages({ "object.unknown": "Variable no permitida." });

const incrementTicketSchema = Joi.object({
  idPlanSummary:
    Joi.string()
    .guid()
    .required()
    .messages({
      "string.required": "El id del resumen plan es obligatorio.",
      "string.base": "El id del resumen plan debe ser un texto.",
      "string.empty": "El id del resumen plan no puede estar vacío.",
      "string.guid": "El id del resumen plan debe tener un formato válido."
    }),
})
.messages({ "object.unknown": "Variable no permitida." });

const checkTotalSchema = Joi.object({
  idCompany:
    Joi.string()
    .guid()
    .required()
    .messages({
      "string.required": "El id de la compañia es obligatorio.",
      "string.base": "El id de la compañia debe ser un texto.",
      "string.empty": "El id de la compañia no puede estar vacío.",
      "string.guid": "El id de la compañia debe tener un formato válido."
    }),
})
.messages({ "object.unknown": "Variable no permitida." });

const createUpdatePlanSchema = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la Id del plan." })
    })
    .messages({
      "string.base": "'La Id debe ser un texto.",
      "string.empty": "La Id no puede estar vacía.",
      "string.guid": "El id del plan debe tener un formato válido."
    }),

  name:
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
  
  price:
    Joi.number()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El precio es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El precio debe ser un número.",
      "number.empty": "El precio no puede estar vacío.",
    }),

  canUseWhatsApp:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseWhatsApp es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseWhatsApp debe ser un booleano.",
      "boolean.empty": "El campo canUseWhatsApp no puede estar vacío.",
    }),

  canUseFacebook:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseFacebook es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseFacebook debe ser un booleano.",
      "boolean.empty": "El campo canUseFacebook no puede estar vacío.",
    }),

  canUseWebchat:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseWebchat es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseWebchat debe ser un booleano.",
      "boolean.empty": "El campo canUseWebchat no puede estar vacío.",
    }),

  maxNConversations:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo maxNConversations es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo maxNConversations debe ser un número entero.",
      "number.empty": "El campo maxNConversations no puede estar vacío.",
      "number.integer": "El campo maxNConversations debe ser un número entero.",
    }),

  canRemoveBubbleLogo:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canRemoveBubbleLogo es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canRemoveBubbleLogo debe ser un booleano.",
      "boolean.empty": "El campo canRemoveBubbleLogo no puede estar vacío.",
    }),

  canUseSchedule:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseSchedule es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseSchedule debe ser un booleano.",
      "boolean.empty": "El campo canUseSchedule no puede estar vacío.",
    }),

  canUseSurvey:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseSurvey es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseSurvey debe ser un booleano.",
      "boolean.empty": "El campo canUseSurvey no puede estar vacío.",
    }),

  canUseAutoResponse:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseAutoResponse es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseAutoResponse debe ser un booleano.",
      "boolean.empty": "El campo canUseAutoResponse no puede estar vacío.",
    }),

  canUseChatgpt:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseChatgpt es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseChatgpt debe ser un booleano.",
      "boolean.empty": "El campo canUseChatgpt no puede estar vacío.",
    }),
  
  maxNAgents:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo maxNAgents es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo maxNAgents debe ser un número entero.",
      "number.empty": "El campo maxNAgents no puede estar vacío.",
      "number.integer": "El campo maxNAgents debe ser un número entero.",
    }),

  maxNAdmins:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo maxNAdmins es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo maxNAdmins debe ser un número entero.",
      "number.empty": "El campo maxNAdmins no puede estar vacío.",
      "number.integer": "El campo maxNAdmins debe ser un número entero.",
    }),
  
  canUseDashboard:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseDashboard es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseDashboard debe ser un booleano.",
      "boolean.empty": "El campo canUseDashboard no puede estar vacío.",
    }),

  canUseTemplate:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseTemplate es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseTemplate debe ser un booleano.",
      "boolean.empty": "El campo canUseTemplate no puede estar vacío.",
    }),

  canUseContactManagement:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseContactManagement es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseContactManagement debe ser un booleano.",
      "boolean.empty": "El campo canUseContactManagement no puede estar vacío.",
    }),

  canUseChatHistory:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseChatHistory es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseChatHistory debe ser un booleano.",
      "boolean.empty": "El campo canUseChatHistory no puede estar vacío.",
    }),

  canUseOutboundWhatsApp:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseOutboundWhatsApp es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseOutboundWhatsApp debe ser un booleano.",
      "boolean.empty": "El campo canUseOutboundWhatsApp no puede estar vacío.",
    }),

  canUseBeAware:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo canUseBeAware es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo canUseBeAware debe ser un booleano.",
      "boolean.empty": "El campo canUseBeAware no puede estar vacío.",
    }),
  
}).messages({
  "object.unknown": "El campo {#key} no es permitido.",
});

const createUpdatePlanConfigSchema = Joi.object({
  id:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la Id del plan." })
    })
    .messages({
      "string.base": "'La Id debe ser un texto.",
      "string.empty": "La Id no puede estar vacía.",
      "string.guid": "El id del plan debe tener un formato válido."
    }),
  
  idPlan:
    Joi.string()
    .guid()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta la Id del plan." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El id del plan debe ser un texto.",
      "string.empty": "El id del plan no puede estar vacío.",
      "string.guid": "El id del plan debe tener un formato válido.",
    }),

  idCompany:
    Joi.string()
    .guid()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta la Id de la compañía." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El id de la compañía debe ser un texto.",
      "string.empty": "El id de la compañía no puede estar vacío.",
      "string.guid": "El id de la compañía debe tener un formato válido.",
    }),
  
  isActive:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isActive es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isActive debe ser un booleano.",
      "boolean.empty": "El campo isActive no puede estar vacío.",
    }),

  name:
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
  
  price:
    Joi.number()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El precio es un campo requerido." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El precio debe ser un número.",
      "number.empty": "El precio no puede estar vacío.",
    }),

  channelWhatsApp:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo channelWhatsApp es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo channelWhatsApp debe ser un booleano.",
      "boolean.empty": "El campo channelWhatsApp no puede estar vacío.",
    }),

  channelFacebook:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo channelFacebook es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo channelFacebook debe ser un booleano.",
      "boolean.empty": "El campo channelFacebook no puede estar vacío.",
    }),

  channelWebchat:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo channelWebchat es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo channelWebchat debe ser un booleano.",
      "boolean.empty": "El campo channelWebchat no puede estar vacío.",
    }),

  nConversations:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo nConversations es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo nConversations debe ser un número entero.",
      "number.empty": "El campo nConversations no puede estar vacío.",
      "number.integer": "El campo nConversations debe ser un número entero.",
    }),

  removeBubbleLogo:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo removeBubbleLogo es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo removeBubbleLogo debe ser un booleano.",
      "boolean.empty": "El campo removeBubbleLogo no puede estar vacío.",
    }),

  attentionSchedule:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo attentionSchedule es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo attentionSchedule debe ser un booleano.",
      "boolean.empty": "El campo attentionSchedule no puede estar vacío.",
    }),

  satisfactionSurvey:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo satisfactionSurvey es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo satisfactionSurvey debe ser un booleano.",
      "boolean.empty": "El campo satisfactionSurvey no puede estar vacío.",
    }),

  automaticResponse:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo automaticResponse es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo automaticResponse debe ser un booleano.",
      "boolean.empty": "El campo automaticResponse no puede estar vacío.",
    }),

  chatgpt:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo chatgpt es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo chatgpt debe ser un booleano.",
      "boolean.empty": "El campo chatgpt no puede estar vacío.",
    }),
  
  nAgents:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo nAgents es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo nAgents debe ser un número entero.",
      "number.empty": "El campo nAgents no puede estar vacío.",
      "number.integer": "El campo nAgents debe ser un número entero.",
    }),

  nAdmins:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo nAdmins es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El campo nAdmins debe ser un número entero.",
      "number.empty": "El campo nAdmins no puede estar vacío.",
      "number.integer": "El campo nAdmins debe ser un número entero.",
    }),
  
  isDashboard:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isDashboard es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isDashboard debe ser un booleano.",
      "boolean.empty": "El campo isDashboard no puede estar vacío.",
    }),

  isTemplate:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isTemplate es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isTemplate debe ser un booleano.",
      "boolean.empty": "El campo isTemplate no puede estar vacío.",
    }),

  isContactManagement:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isContactManagement es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isContactManagement debe ser un booleano.",
      "boolean.empty": "El campo isContactManagement no puede estar vacío.",
    }),

  isChatHistory:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isChatHistory es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isChatHistory debe ser un booleano.",
      "boolean.empty": "El campo isChatHistory no puede estar vacío.",
    }),

  isOutboundWhatsApp:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isOutboundWhatsApp es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isOutboundWhatsApp debe ser un booleano.",
      "boolean.empty": "El campo isOutboundWhatsApp no puede estar vacío.",
    }),

  isBeAware:
    Joi.boolean()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "El campo isBeAware es obligatorio." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "boolean.base": "El campo isBeAware debe ser un booleano.",
      "boolean.empty": "El campo isBeAware no puede estar vacío.",
    }),
  
}).messages({
  "object.unknown": "El campo {#key} no es permitido.",
});

const createUpdatePlanSummarySchema = Joi.object({
  idPlanSummary:
    Joi.string()
    .guid()
    .alter({
      Post : (schema) => schema.forbidden().messages({ "any.unknown": "No se puede asignar manualmente la Id." }),
      Patch: (schema) => schema.required().messages({ "any.required": "Falta la Id del resumen del plan." })
    })
    .messages({
      "string.base": "'La Id debe ser un texto.",
      "string.empty": "La Id no puede estar vacía.",
      "string.guid": "El id del resumen del plan debe tener un formato válido."
    }),
  
  idPlanConfig:
    Joi.string()
    .guid()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta la Id del plan." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "string.base": "El id del plan debe ser un texto.",
      "string.empty": "El id del plan no puede estar vacío.",
      "string.guid": "El id del plan debe tener un formato válido.",
    }),
  
  ticketsCount:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta el conteo de tickets." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El conteo de tickets debe ser un número entero.",
      "number.empty": "El conteo de tickets no puede estar vacío.",
      "number.integer": "El conteo de tickets debe ser un número entero.",
    }),

  extraConversations:
    Joi.number()
    .integer()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta el conteo de conversaciones extras." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "number.base": "El conteo de conversaciones extras debe ser un número entero.",
      "number.empty": "El conteo de conversaciones extras no puede estar vacío.",
      "number.integer": "El conteo de conversaciones extras debe ser un número entero.",
    }),
  
  month:
    Joi.date()
    .alter({
      Post: (schema) => schema.required().messages({ "any.required": "Falta el mes." }),
      Patch: (schema) => schema.optional(),
    })
    .messages({
      "date.base": "El mes debe ser una fecha.",
      "date.empty": "El mes no puede estar vacío.",
    }),

});




module.exports = { getPlanSchema, getPlanConfigSummarySchema, createUpdatePlanSchema, createUpdatePlanConfigSchema, createUpdatePlanSummarySchema, checkTotalSchema, incrementTicketSchema };
