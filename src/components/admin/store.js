const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createCompany } = require('../company/store.js');
const { createAgent } = require("../agent/store.js");
const constants = require('../../constants.js');
const { createManyTicketCategories } = require('../ticket_category/store.js');
const { createManyTicketPriorities } = require('../ticket_priority/store.js');
const { createManyTicketStatuses } = require('../ticket_status/store.js');
const { createManyTemplateCategories } = require('../category/store.js');
const { createManyAutomaticResponses } = require('../automatic_response/store.js');
const { createChannel } = require('../channel/store.js');
const { createArea } = require('../area/store.js');
const { createPlanConfig, getPlan, createPlanSummary } = require('../plan/store.js');
const { NotFoundError } = require('../../exceptions.js');


const addCompany = async (company, admin, bot, channel, idPlan) => {
  return await prisma.$transaction(async (transaction) => {
    // Company
    const newCompany = await createCompany(company, transaction);

    // Ticket Categories
    const ticketCategories = Object.values(constants.ticketCategory.name).map((ticketCategory) => {
      return { name: ticketCategory, idCompany: newCompany.id };
    });
    await createManyTicketCategories(ticketCategories, transaction);

    // Ticket Priorities
    const ticketPriorities = Object.values(constants.ticketPriority.name).map((ticketPriority, index) => {
      return { name: ticketPriority, weight: index, idCompany: newCompany.id };
    });
    await createManyTicketPriorities(ticketPriorities, transaction);

    // Ticket Statuses
    const ticketStatuses = Object.values(constants.ticketStatus.name).map((ticketStatus) => {
      return { name: ticketStatus, idCompany: newCompany.id };
    });
    await createManyTicketStatuses(ticketStatuses, transaction);

    // Template Categories
    const templateCategories = Object.values(constants.templateCategories.name).map((templateCategory) => {
      return { name: templateCategory, idCompany: newCompany.id, color: "#FF7875" };
    });
    await createManyTemplateCategories(templateCategories, transaction);

    // Channel
    channel.idCompany = newCompany.id;
    const newChannel = await createChannel(channel, transaction);
    await transaction.env_var.create({
      data: {
        idChannel: newChannel.id,
        value: newChannel.id,
        type: constants.envVar.type.WEBCHAT_ACCESS_TOKEN,
      },
    });

    // Area
    const area = {
      idCompany: newCompany.id,
      name: constants.areas.name.NO_AREA,
    };
    const newArea = await createArea(area, transaction);

    // Plan Config
    const planExist = await getPlan(idPlan, transaction);
    if (!planExist) {
      throw new NotFoundError(null, "Plan no encontrado.", "[addCompany] Plan not found");
    };

    const dataPlan = {
      idPlan,
      idCompany: newCompany.id,
      isActive: true,
      name: planExist.name,
      price: planExist.price,
      channelWhatsApp: planExist.canUseWhatsApp,
      channelFacebook: planExist.canUseFacebook,
      channelWebchat: planExist.canUseWebchat,
      nConversations: planExist.maxNConversations,
      removeBubbleLogo: planExist.canRemoveBubbleLogo,
      attentionSchedule: planExist.canUseSchedule,
      satisfactionSurvey: planExist.canUseSurvey,
      automaticResponse: planExist.canUseAutoResponse,
      chatgpt: planExist.canUseChatgpt,
      nAgents: planExist.maxNAgents,
      nAdmins: planExist.maxNAdmins,
      isDashboard: planExist.canUseDashboard,
      isTemplate: planExist.canUseTemplate,
      isContactManagement: planExist.canUseContactManagement,
      isChatHistory: planExist.canUseChatHistory,
      isOutboundWhatsApp: planExist.canUseOutboundWhatsApp,
      isBeAware: planExist.canUseBeAware,
    }

    const newPlanConfig = await createPlanConfig(dataPlan, transaction);

    // Plan Summary
    const newPlanSummary = await createPlanSummary(newPlanConfig.id, transaction);

    // Bot
    await transaction.agent.create({
      data: {
        ...bot,
        areas: {
          create: [{ area: { connect: { id: newArea.id } } }],
        },
      }
    });

    // Agent
    admin.idCompany = newCompany.id;
    const newAdmin = await createAgent(admin, transaction);

    // Automatic Responses
    const automaticResponses = [
      {
        idCompany: newCompany.id,
        idAutomaticResponseType: "7c4d4dbb-9838-4d61-a3a0-99e7791904e9",
        message: "Hola, gracias por escribirnos. En este momento no contamos con agentes disponibles para atender tu solicitud. Te responderemos a la brevedad.",
        isActive: true,
      },
      {
        idCompany: newCompany.id,
        idAutomaticResponseType: "cfe052a6-d756-4fa5-befa-549ce8c4f18c",
        message: "Hola, la conversación ha caducado. Favor vuelva a escribirnos.",
        isActive: true,
      },
    ];
    await createManyAutomaticResponses(automaticResponses, transaction);

    return { newCompany, newAdmin, newChannel, newPlanConfig, newPlanSummary };
  });
};

module.exports = {
  addCompany,
}
