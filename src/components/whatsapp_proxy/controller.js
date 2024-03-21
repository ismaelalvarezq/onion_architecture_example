const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const channelStore = require("../channel/store.js");
const envVarStore = require("../env_var/store.js");
const store = require('./store.js');
const {
  UnauthorizedError,
} = require("../../exceptions.js");
const constants = require("../../constants.js");
const { formatRequest } = require("../../utils/formatRequest.js");

const sendWhatsAppMessageTemplate = catchAsync(async (req, res) => {
  const idCampaign = req.body?.idCampaign;
  const message = await store.sendWhatsAppCampaign(idCampaign);
  response.success(req, res, message, "response", 200);
});

const getWhatsAppMessageTemplates = catchAsync(async (req, res) => {
  const { filters } = formatRequest(req);

  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && filters.idCompany && filters.idCompany !== req.ctx.user.idCompany) {
    throw new UnauthorizedError(null, "No tiene permisos para acceder a esta información");
  }

  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && !filters.idCompany) {
    filters.idCompany = req.ctx.user.idCompany;
  }

  const where = {};
  if (filters.idChannel) {
    where.idChannel = filters.idChannel;
  }
  if (filters.idCompany) {
    where.channel = {
      idCompany: filters.idCompany,
    };
  }
  const envVars = await envVarStore.getEnvVars({ where });
  const uniqueChannels = [];
  envVars.forEach((envVar) => {
    if (!uniqueChannels.find((idChannel) => envVar.idChannel == idChannel)) {
      uniqueChannels.push(envVar.idChannel);
    }
  });
  const allTemplates = [];
  for (let currentIdChannel of uniqueChannels) {
    const check = (envVars.find(({ type, idChannel }) => type === constants.envVar.type.WHATSAPP_VERSION && idChannel === currentIdChannel));
    if (!check) continue;
    const channel = await channelStore.getChannel(currentIdChannel);
    const version = (envVars.find(({ type, idChannel }) => type === constants.envVar.type.WHATSAPP_VERSION && idChannel === currentIdChannel)).value;
    const businessAccountId = (envVars.find(({ type, idChannel }) => type === constants.envVar.type.WHATSAPP_BUSINESS_ACCOUNT_ID && idChannel === currentIdChannel)).value;
    const accessToken = (envVars.find(({ type, idChannel }) => type === constants.envVar.type.WHATSAPP_ACCESS_TOKEN && idChannel === currentIdChannel)).value;
    const templates = await store.getWhatsAppMessageTemplates({
      version,
      businessAccountId,
      accessToken,
      templateName: filters.templateName,
    });
    allTemplates.push(...templates.map((template) => ({ ...template, idChannel: currentIdChannel, channel })));
  }
  response.success(req, res, allTemplates, "response", 200);
});

const createWhatsAppMessageTemplate = catchAsync(async (req, res) => {
  const { template, idChannel } = req.body;

  const channel = await channelStore.getChannel(idChannel);
  if (!channel) throw new Error("Channel not found");
  const idCompany = channel.idCompany;
  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && idCompany && idCompany !== req.ctx.user.idCompany) {
    throw new UnauthorizedError(null, "No tiene permisos para crear un template");
  }

  const envVars = await envVarStore.getEnvVars({ where: { idChannel } });
  const version = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_VERSION)).value;
  const businessAccountId = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_BUSINESS_ACCOUNT_ID)).value;
  const accessToken = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_ACCESS_TOKEN)).value;

  const templateResponse = await store.createWhatsAppMessageTemplate({
    version,
    businessAccountId,
    accessToken,
    template,
  });
  response.success(req, res, templateResponse, "response", 201);
});

const uploadFile = catchAsync(async (req, res) => {
  const { idChannel } = req.body;
  const { file } = req;

  const channel = await channelStore.getChannel(idChannel);
  if (!channel) throw new Error("Channel not found");

  const idCompany = channel.idCompany;
  if ([constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(req.ctx.user.type) && idCompany && idCompany !== req.ctx.user.idCompany) {
    throw new UnauthorizedError(null, "No tiene permisos para crear un template");
  }

  const envVars = await envVarStore.getEnvVars({ where: { idChannel } });
  const version = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_VERSION)).value;
  const appId = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_APP_ID)).value;
  const accessToken = (envVars.find(({ type }) => type === constants.envVar.type.WHATSAPP_ACCESS_TOKEN)).value;

  const fileResponse = await store.uploadFile({
    version,
    appId,
    accessToken,
    file: file.buffer,
    fileName: file.originalname,
    fileLength: file.size,
    fileType: file.mimetype,
  });
  response.success(req, res, fileResponse, "response", 201);
});

module.exports = {
  getWhatsAppMessageTemplates,
  sendWhatsAppMessageTemplate,
  createWhatsAppMessageTemplate,
  uploadFile,
};
