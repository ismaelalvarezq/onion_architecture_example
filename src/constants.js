const constants = {
  outboundCampaign: {
    statuses: {
      REVIEWING: "REVIEWING",
      SENT: "SENT",
      FAILED: "FAILED",
      CANCELLED: "CANCELLED",
    },
  },
  message: {
    statuses: {
      PENDING: "Pendiente",
      SENT: "Enviado",
      DELIVERED: "Entregado",
      RECEIVED: "Recibido",
      SEEN: "Visto",
      FAILED: "Falló",
    },
  },
  clientImportFile: {
    state: {
      CREATED: "CREATED",
      COMPLETED: "COMPLETED",
      FAILED: "FAILED",
    },
  },
  envVar: {
    type: {
      FACEBOOK_PAGE_ACCESS_TOKEN: "FACEBOOK_PAGE_ACCESS_TOKEN",
      FACEBOOK_PAGE_ID: "FACEBOOK_PAGE_ID",
      FACEBOOK_VERIFY_TOKEN: "FACEBOOK_VERIFY_TOKEN",
      FACEBOOK_VERSION: "FACEBOOK_VERSION",
      WHATSAPP_ACCESS_TOKEN: "WHATSAPP_ACCESS_TOKEN",
      WHATSAPP_BUSINESS_ACCOUNT_ID: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      WHATSAPP_PHONE_NUMBER_ID: "WHATSAPP_PHONE_NUMBER_ID",
      WHATSAPP_VERIFY_TOKEN: "WHATSAPP_VERIFY_TOKEN",
      WHATSAPP_VERSION: "WHATSAPP_VERSION",
      WHATSAPP_APP_ID: "WHATSAPP_APP_ID",
      WEBCHAT_ACCESS_TOKEN: "WEBCHAT_ACCESS_TOKEN",
    },
  },
  messages: {
    types: {
      TEXT: "TEXT",
      AUDIO: "AUDIO",
      VIDEO: "VIDEO",
      IMAGE: "IMAGE",
      FILE: "FILE",
    },
  },
  avatar: {
    COLORS: ['#FF7875', '#FF9C6E', '#FFC069', '#FFD666', '#FFF566', '#D3F261', '#95DE64', '#5CDBD3', '#69C0FF', '#85A5FF', '#B37FEB', '#FF85C0'],
  },
  agents: {
    trust: {
      ADMIN: "chatti_admin",
      AGENT: "chatti_agent",
    },
    types: {
      AGENT: "Agent",
      ADMIN: "Admin",
      SYSTEM: "System",
      BOT: "Bot",
    },
    status: {
      ENABLED: "enabled",
      DISABLED: "disabled",
    },
    ateneaStatus: {
      ENABLED: "enable",
      DISABLED: "disable",
    },
    isConnected: {
      TRUE: true,
      FALSE: false,
    },
    action: {
      ENABLE: "enable",
      DISABLE: "disable",
    }
  },
  client: {
    state: {
      AVAILABLE: "Disponible",
      BLOCKED: "Bloqueado",
    },
    type: {
      LOGGED: "Logged",
      GUEST: "Guest",
      NEW: "New",
    }
  },
  channel: {
    type: {
      FACEBOOK: "Facebook",
      WHATSAPP: "WhatsApp",
      WEBCHAT: "Webchat",
      INSTAGRAM: "Instagram",
    },
    name: {
      TEST: "Channel Pruebas",
    }
  },
  company: {
    name: {
      TEST: "Pruebas Unitarias",
    }
  },
  blockingHistory: {
    type: {
      AVAILABLE: "Disponible",
      TEMPORAL: "Temporal",
      PERMANENT: "Permanente",
    },
  },
  ticketCategory: {
    name: {
      CONGRATULATIONS: "Felicitaciones",
      CLAIM: "Reclamo",
      REPORT_INCIDENT: "Reportar Incidencia",
      GENERAL_QUERY: "Consulta General",
      TECHNICAL_SUPPORT: "Soporte Técnico",
      NO_CATEGORY: "Sin categoría",
    },
  },
  ticketPriority: {
    name: {
      NO_PRIORITY: "Sin prioridad",
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
    },
  },
  ticketStatus: {
    typeStatus: {
      ACTIVE: "active",
      INACTIVE: "inactive",
    },
    name: {
      OPEN: "Abierto",
      PENDING_USER: "Pendiente Usuario",
      ON_HOLD: "En Espera",
      EXPIRED_USER: "Caducado Usuario",
      EXPIRED_AGENT: "Caducado Agente",
      BLOCKED: "Bloqueado",
      REASSIGNED: "Reasignado",
      SOLVED: "Resuelto",
    },
  },
  templateCategories: {
    name: {
      NO_CATEGORY: "Sin categoría",
    }
  },
  systemMessage: {
    messageType: {
      TEXT: "text",
      PlAINTEXT: "plainText",
    },
    emiterType: {
      SYSTEM: "System",
    }
  },
  areas: {
    name: {
      NO_AREA: "Sin area",
    }
  },
  pagination: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
  },
  timeZone: {
    chile: "America/Santiago",
  },
  dashboardTickets: {
    orderBy: {
      PRIORITYASC: "priority asc",
      PRIORITYDESC: "priority desc",
      DATEASC: "date asc",
      DATEDESC: "date desc",
      STATUSASC: "status asc",
      STATUSDESC: "status desc",
      CATEGORYASC: "category asc",
      CATEGORYDESC: "category desc",
      CLIENTASC: "fullName asc",
      CLIENTDESC: "fullName desc",
      CHANNELTYPEASC: "channelType asc",
      CHANNELTYPEDESC: "channelType desc",
      AGENTASC: "agent asc",
      AGENTDESC: "agent desc",
    }
  },
  file: {
    type: {
      JPG: "image/jpg",
      JPEG: "image/jpeg",
      PNG: "image/png",
    },
    invalidType: {
      MP3: "audio/mpeg",
      WAV: "audio/wav",
      OGG: "audio/ogg",
      AAC: "audio/aac",
      MP4: "video/mp4",
      AVI: "video/x-msvideo",
      MOV: "video/quicktime",
      WMV: "video/x-ms-wmv",
      FLV: "video/x-flv",
      WEBM: "video/webm",
      TXT: "text/plain",
      CSV: "text/csv",
      PDF: "application/pdf",
      DOC: "application/msword",
      DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
  },
  scheduleRange: {
    action: {
      CREATE: "create",
      UPDATE: "update",
      DELETE: "delete",
    },
  },
  feedback: {
    type: {
      ESB: "esb",
      NPS: "nps",
      CSAT: "csat"
    }
  },
  DETAILS_MATCH_COMPANY: "Companies don't match",
  DETAILS_MATCH_CHAT: "Chat doesn't exist",
};

module.exports = constants;
