const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../../exceptions.js");

const getPlan = async (id, transaction) => {
  const prismaClient = transaction ? transaction : prisma;

  return prismaClient.plan.findUnique({ where: { id: id } }).catch((error) => {
    throw new BadRequestError(
      error,
      "Error en la búsqueda del plan.",
      "[getPlan] Bad request"
    );
  });
};

const getPlans = async () => {
  return prisma.plan.findMany().catch((error) => {
    throw new BadRequestError(
      error,
      "Error en la búsqueda de los planes.",
      "[getPlans] Bad request"
    );
  });
};

const createPlan = async (plan) => {
  return prisma.plan.create({ data: plan }).catch((error) => {
    if (error.code === "P2002") {
      throw new BadRequestError(
        error,
        "Ya existe un plan con el mismo nombre.",
        "[createPlan] Bad request"
      );
    }
    throw new InternalServerError(
      error,
      "Error en la creación del plan.",
      "[createPlan] Bad request"
    );
  });
};

const updatePlan = async (plan) => {
  return prisma.plan
    .update({ where: { id: plan.id }, data: plan })
    .catch((error) => {
      if (error.code === "P2002") {
        throw new BadRequestError(
          error,
          "Ya existe un plan con el mismo nombre.",
          "[createPlan] Bad request"
        );
      } else if (error.code === "P2025") {
        throw new NotFoundError(
          error,
          "No se encontró el plan.",
          "[createPlan] Bad request"
        );
      }
      throw new InternalServerError(
        error,
        "Error en la actualización del plan.",
        "[updatePlan] Bad request"
      );
    });
};

const getPlanConfig = async (id) => {
  return prisma.plan_config.findUnique({ where: { id } }).catch((error) => {
    throw new BadRequestError(
      error,
      "Error en la búsqueda del plan.",
      "[getPlan] Bad request"
    );
  });
};

const getPlanConfigs = async (filters, orders) => {
  const where =  {};

  if (filters.idCompany) {
    where.idCompany = filters.idCompany;
  }

  if (filters.idPlan) {
    where.idPlan = filters.idPlan;
  }

  if (filters.isActive) {
    where.isActive = filters.isActive;
  }

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  if (filters.createdAt) {
    where.createdAt = new Date(filters.createdAt);
  }

  if (filters.updatedAt) {
    where.updatedAt = new Date(filters.updatedAt);
  }

  const orderBy = [];

  for (let order of orders) {
    switch (Object.keys(order)[0]) {
      case "name":
        orderBy.push(order);
        break;

      case "updatedAt":
        orderBy.push(order);
        break;

      case "updatedAt":
        orderBy.push(order);
        break;

      default:
        break;
    }
  }

  return await prisma.plan_config.findMany({
    where,
    orderBy
  })
};

const getPlanConfigByCompany = async (idCompany) => {
    const month =  new Date().getMonth() + 1;

  const startDate = new Date();
  startDate.setMonth(month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMonth(month, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return prisma.plan_config
    .findFirst({
      where: { idCompany, isActive: true },
      include: { plan_summary: {
        where: { 
          month: {
            gte: startDate,
            lte: endDate
          }
        },
      } },
      orderBy: { createdAt: "desc" },
    })
    .catch((error) => {
      throw new BadRequestError(
        error,
        "Error en la búsqueda de los planes.",
        "[getPlans] Bad request"
      );
    });
};

const createPlanConfig = async (plan, transaction) => {
  const prismaClient = transaction ? transaction : prisma;

  const planExist = await prismaClient.plan.findUnique({
    where: { id: plan.idPlan },
  });

  if (!planExist) {
    throw new NotFoundError(
      null,
      "Plan no encontrado.",
      "[createPlanConfig] Plan not found"
    );
  }

  const currentActivePlan = await prismaClient.plan_config.findFirst({
    where: { idCompany: plan.idCompany, isActive: true },
  });

  if (currentActivePlan) {
    await prismaClient.plan_config.update({
      where: { id: currentActivePlan.id },
      data: { isActive: false },
    });
  }

  const data = {
    ...plan,
    plan: { connect: { id: plan.idPlan } },
    company: { connect: { id: plan.idCompany } },
  };
  delete data.idPlan;
  delete data.idCompany;

  return prismaClient.plan_config.create({ data: data }).catch((error) => {
    if (error.code == "P2003") {
      throw new NotFoundError(
        error,
        "Error en la creación del plan.",
        "[createPlanConfig] Error with FK: " + error.meta.field_name
      );
    } else {
      throw new InternalServerError(
        error,
        "Error en la creación del plan.",
        "[createPlanConfig] Bad request"
      );
    }
  });
};

const updatePlanConfig = async (plan) => {
  return prisma.plan_config
    .update({ where: { id: plan.id }, data: plan })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(
          error,
          "Error en la actualización del plan.",
          "[updatePlanConfig] Error with FK: " + error.meta.field_name
        );
      } else if (error.code == "P2025") {
        throw new NotFoundError(
          error,
          "No se encontró el plan.",
          "[updatePlanConfig] " + error.meta.cause
        );
      } else {
        throw new InternalServerError(
          error,
          "Error en la actualización del plan.",
          "[updatePlanConfig] Bad request"
        );
      }
    });
};

const deletePlanConfig = async (id) => {
  return prisma.plan_config.delete({ where: { id: id } }).catch((error) => {
    if (error.code == "P2025") {
      throw new NotFoundError(
        error,
        "Error en la eliminación del plan.",
        "[deletePlanConfig] " + error.meta.cause
      );
    } else {
      throw new InternalServerError(
        error,
        "Error en la eliminación del plan.",
        "[deletePlanConfig] Bad request"
      );
    }
  });
};

const createPlanSummary = async (idPlanConfig, transaction) => {
  const prismaClient = transaction ? transaction : prisma;

  const planExist = await prismaClient.plan_config.findUnique({
    where: { id: idPlanConfig },
  });

  if (!planExist) {
    throw new NotFoundError(
      null,
      "Plan no encontrado.",
      "[createPlanSummary] Plan not found"
    );
  }

  const data = {
    plan_config: { connect: { id: planExist.id } },
  };

  return prismaClient.plan_summary.create({ data: data }).catch((error) => {
    if (error.code == "P2003") {
      throw new NotFoundError(
        error,
        "Error en la creación del resumen del plan.",
        "[createPlanSummary] Error with FK: " + error.meta.field_name
      );
    } else {
      throw new InternalServerError(
        error,
        "Error en la creación del resumen del plan.",
        "[createPlanSummary] Bad request"
      );
    }
  });
};

const getPlanSummary = async (idPlanConfig) => {
  return prisma.plan_summary
    .findMany({ where: { idPlanConfig: idPlanConfig } })
    .catch((error) => {
      throw new BadRequestError(
        error,
        "Error en la búsqueda del resumen del plan.",
        "[getPlanSummary] Bad request"
      );
    });
};

const updatePlanSummary = async (plan) => {
  plan.id = plan.idPlanSummary;
  delete plan.idPlanSummary;
  return prisma.plan_summary
    .update({ where: { id: plan.id }, data: plan })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(
          error,
          "Error en la actualización del resumen del plan.",
          "[updatePlanSummary] Error with FK: " + error.meta.field_name
        );
      } else if (error.code == "P2025") {
        throw new NotFoundError(
          error,
          "No se encontró el resumen del plan.",
          "[updatePlanSummary] " + error.meta.cause
        );
      } else {
        throw new InternalServerError(
          error,
          "Error en la actualización del resumen del plan.",
          "[updatePlanSummary] Bad request"
        );
      }
    });
};

const checkTotalConversation = async (idCompany) => {
  let response = {};
  const month =  new Date().getMonth() + 1;

  const startDate = new Date();
  startDate.setMonth(month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMonth(month, 0);
  endDate.setHours(23, 59, 59, 999);

  const planConfig = await prisma.plan_config.findFirst({
    where: {
      idCompany
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      plan_summary: {
        where: {
          month: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    }
  })

  if (planConfig && planConfig.plan_summary.length > 0) {

    const totalConversationSummary = planConfig.plan_summary[0].extraConversations + planConfig.nConversations;
    const checkTotalConversation = totalConversationSummary > planConfig.plan_summary[0].ticketsCount;
  
    if (!checkTotalConversation) {
      throw new BadRequestError(
        null,
        "No se puede crear el ticket porque se ha superado el límite de conversaciones.",
        "[createTicket] Bad request"
      );
    }

    response = {
      idPlanSummary: planConfig.plan_summary[0].id ,
      checkTotalConversation,
    }
  } else {
    const newPlanSummary = await createPlanSummary(planConfig.id);
    response = {
      idPlanSummary: newPlanSummary.id,
      checkTotalConversation: true,
    }
  }
  
  return response;
};

const incrementTicketsPlanSummary = async (idPlanSummary) => { 
  return prisma.plan_summary
    .update({ where: { id: idPlanSummary }, data: { ticketsCount: { increment: 1 } } })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(
          error,
          "Error en la actualización del resumen del plan.",
          "[updatePlanSummary] Error with FK: " + error.meta.field_name
        );
      } else if (error.code == "P2025") {
        throw new NotFoundError(
          error,
          "No se encontró el resumen del plan.",
          "[updatePlanSummary] " + error.meta.cause
        );
      } else {
        throw new InternalServerError(
          error,
          "Error en la actualización del resumen del plan.",
          "[updatePlanSummary] Bad request"
        );
      }
    });
};

module.exports = {
  getPlan,
  getPlans,
  createPlan,
  updatePlan,
  getPlanConfig,
  getPlanConfigByCompany,
  getPlanConfigs,
  createPlanConfig,
  updatePlanConfig,
  deletePlanConfig,
  createPlanSummary,
  getPlanSummary,
  updatePlanSummary,
  checkTotalConversation,
  incrementTicketsPlanSummary
};
