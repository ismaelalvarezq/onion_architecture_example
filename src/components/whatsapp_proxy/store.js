const axios = require('axios').default;
const FormData = require('form-data');
const config = require('../../config');
const crypto = require("crypto");
const mongoResolver = require("../mongo_ticket/resolver.js");
const ticketCategoryStore = require("../ticket_category/store.js");
const ticketPriorityStore = require("../ticket_priority/store.js");
const ticketStatusStore = require("../ticket_status/store.js");
const chatStore = require("../chat/store.js");
const outboundCampaignStore = require("../outbound_campaign/store.js");
const clientFlowStepStore = require("../client_flow_step/store.js");
const flowStore = require("../flow/store.js");
const agentStore = require("../agent/store.js");
const {
  BadRequestError,
} = require("../../exceptions.js");
const logger = require("../../helper/logger.js");
const channelStore = require("../channel/store.js");
const envVarStore = require("../env_var/store.js");
const constants = require("../../constants.js");

async function sendWhatsAppCampaign(idCampaign) {
  if (!idCampaign) {
    throw new BadRequestError(null, "Falta el id de la campaña.");
  }

  const outboundCampaign = await outboundCampaignStore.getOutboundCampaign(idCampaign);
  if (!outboundCampaign) throw new BadRequestError(null, "No existe la campaña outbound.");

  const now = new Date();
  if (!(now >= new Date(outboundCampaign.startDate) && now <= new Date(outboundCampaign.endDate))) {
    throw new BadRequestError(null, "Fuera del rango de fecha válido de la 'Campaña Outbound'");
  }

  const clients = await outboundCampaignStore.getClientsOfCampaign(idCampaign);
  if (clients.length === 0) throw new BadRequestError(null, "No hay clientes asociados a la campaña.");
  const channel = await channelStore.getChannel(clients[0].idChannel);

  const envVars = await envVarStore.getEnvVars({ where: { idChannel: clients[0].idChannel } });
  const version = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_VERSION)).value;
  const businessAccountId = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_PHONE_NUMBER_ID)).value;
  const accessToken = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_ACCESS_TOKEN)).value;

  for (const client of clients) {
    let clientFlow = await clientFlowStepStore.getClientFlowsStep({ where: { idClient: client.id } });
    if (clientFlow.length > 1 || clientFlow.lenght === 0) {
      logger.debug(`El cliente ${client.id} no tiene un flujo activo.`);
      continue;
    }
    clientFlow = clientFlow[0];
    const configJson = await flowStore.getConfigJson({
      where: {
        channels: {
          some: {
            channel: {
              id: client.idChannel,
            },
          },
        },
      },
    });
    const currentNode = JSON.parse(configJson).flowNodes.find((config) => config.id === clientFlow.flow);

    if (currentNode && !(currentNode?.isFinishNode && !currentNode?.chatToAdmin)) {
      logger.debug(`El cliente ${client.id} no se encuentra en el nodo final del flujo.`);
      continue;
    }

    const campaignNode = JSON.parse(configJson).flowNodes.find((config) => config.id === outboundCampaign.idNode);
    await clientFlowStepStore.updateClientFlowStep({
      id: clientFlow.id,
      flow: campaignNode.id,
      previousFlow: campaignNode.id,
    });

    function getDataComponents(params, client) {
      if (!params) return [];

      const values = [];
      for (const param of params) {
        let auxClient = client;
        const keys = param.split(".");

        keys.shift();
        keys.forEach(key => { auxClient = auxClient[key] });

        values.push(auxClient);
      }

      if (values.length === 0) return [];

      const dataComponents = [];
      for (const value of values) {
        dataComponents.push({
          "type": "body",
          parameters: [{
            "type": "text",
            "text": value
          }]
        });
      }

      return dataComponents;
    }

    const dataComponents = getDataComponents(
      campaignNode.params,
      Object.assign(client, client.outboundCampaigns[0].customVariables)
    );

    const messageData = await sendWhatsAppMessageTemplate({
      version,
      businessAccountId,
      accessToken,
      userIdChannel: client.userIdChannel,
      templateName: campaignNode.templateName,
      templateLanguage: campaignNode.templateLanguage,
      dataComponents
    });

    function replaceClientVariable(string, client) {
      const regex = /{{2}([^}]+)}{2}/g;
      const found = [];
      const foundRaw = [];
      const value = [];
      let curMatch;

      while (curMatch = regex.exec(string)) {
        found.push(curMatch[1]);
        foundRaw.push(curMatch[0]);
      }

      found.forEach(variable => {
        const keys = variable.split(".");
        let auxClient = client;

        keys.shift();
        keys.forEach((key) => { auxClient = auxClient[key] });
        value.push(auxClient);
      });

      let newString = string;
      value.forEach((value, index) => {
        if (Array.isArray(value)) {
          newString = "\n" + newString.replace(foundRaw[index], value.join("\n"));
        }
        newString = newString.replace(foundRaw[index], value);
      });

      return newString;
    }

    function getMessageToStore(flowNode, client) {
      let message = "";

      message += replaceClientVariable(flowNode.buttonsHeader, client) + "\n";
      message += replaceClientVariable(flowNode.buttonsFooter, client);
      for (const index in flowNode.buttonsItems) {
        message += "\n" + replaceClientVariable(flowNode.buttonsItems[index].buttonText, client);
      }

      return message;
    }

    const messageString = getMessageToStore(
      campaignNode,
      Object.assign(client, client.outboundCampaigns[0].customVariables)
    );

    const bot = await agentStore.getBot(channel.idCompany);
    const chat = await chatStore.getChats({
      where: {
        idClient: client.id,
      },
    }).then((chats) => chats[0]);
    const idCategory = await ticketCategoryStore.getTicketsCategories({
      where: {
        idCompany: channel.idCompany,
        name: constants.ticketCategory.name.GENERAL_QUERY,
      },
    }).then((categories) => categories[0].id);
    const idPriority = await ticketPriorityStore.getTicketsPriorities({
      where: {
        idCompany: channel.idCompany,
        name: constants.ticketPriority.name.NO_PRIORITY,
      },
    }).then((priorities) => priorities[0].id);
    const idStatus = await ticketStatusStore.getTicketStatuses({
      where: {
        idCompany: channel.idCompany,
        name: constants.ticketStatus.name.OPEN,
      },
    }).then((statuses) => statuses[0].id);
    const currentDate = new Date();
    await mongoResolver.createTicket({
      idChat: chat.id,
      idAgent: bot.id,
      idCategory: idCategory,
      idPriority: idPriority,
      idStatus: idStatus,
      idOutboundCampaign: idCampaign,
      messages: [{
        _id: crypto.randomUUID(),
        userId: bot.id,
        idWhatsApp: messageData.messages[0].id,
        message: messageString,
        type: campaignNode.flowNodeType,
        isSeen: false,
        currentStatus: constants.message.statuses.SENT,
        statuses: [{
          name: constants.message.statuses.SENT,
          createdAt: currentDate
        }],
      }]
    });
  }
  await outboundCampaignStore.updateOutboundCampaign(outboundCampaign.id, { status: constants.outboundCampaign.statuses.SENT });
  return `Se ha enviado la campaña ${outboundCampaign.name} (${outboundCampaign.id}) a los clientes correspondientes.`;
}

async function sendWhatsAppMessageTemplate({ version, businessAccountId, accessToken, userIdChannel, templateName, templateLanguage, dataComponents }) {
  const query = `${config.metaLink}${version}/${businessAccountId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: userIdChannel,
    type: "template",
    template: {
      name: templateName,
      language: { code: templateLanguage },
      components: dataComponents
    },
  };

  const params = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }

  const response = await axios.post(query, body, params);
  return response.data;
}

async function getWhatsAppMessageTemplates({ version, businessAccountId, accessToken, templateName }) {
  const url = `${config.metaLink}${version}/${businessAccountId}/message_templates`;
  const requestConfig = {
    params: {
      access_token: accessToken,
    },
  };

  if (templateName) {
    requestConfig.params.name = templateName;
  }

  const response = await axios.get(url, requestConfig);

  return response.data.data;
}

async function createWhatsAppMessageTemplate({ version, businessAccountId, accessToken, template }) {
  const url = `${config.metaLink}${version}/${businessAccountId}/message_templates`;
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }
  const response = await axios.post(url, template, requestConfig);
  return response.data;
}

async function uploadFile({ version, appId, accessToken, file, fileName, fileLength, fileType }) {
  const urlStart = `${config.metaLink}${version}/${appId}/uploads`;
  const requestStartConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: '*/*',
    },
  };
  const responseStart = await axios.post(urlStart, {
    'file_length': fileLength,
    'file_type': fileType,
    'file_name': fileName,
  }, requestStartConfig);
  const { id } = responseStart.data;
  const urlUpload = `${config.metaLink}${version}/${id}`;
  const requestUploadConfig = {
    headers: {
      Authorization: `OAuth ${accessToken}`,
      Accept: '*/*',
      'file_offset': 0,
    },
  };
  const responseUpload = await axios.post(urlUpload, file, requestUploadConfig);
  const { h } = responseUpload.data;
  return h;
}

module.exports = {
  sendWhatsAppMessageTemplate,
  getWhatsAppMessageTemplates,
  createWhatsAppMessageTemplate,
  sendWhatsAppCampaign,
  uploadFile,
}
