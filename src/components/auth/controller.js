const store = require("./store.js");
const storeAgent = require("../agent/store");
const axios = require("axios");
const config = require("../../config");
const { schemaNewPassword } = require('../../helper/validator/schemas/newPassword');
const { schemaEnableDisableAgent } = require('../../helper/validator/schemas/enableDisableAgent');
const { disconnectAgent } = require('../websocket_handler/resolver');
const { validator } = require('../../helper/validator/index');
const constants = require('../../constants');
const mongoTicket = require('../mongo_ticket/resolver')
const catchAsync = require('../../utils/catchAsync.js');
const sendResponse = require("../../network/response.js");

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    "access-control-allow-origin": "*",
  },
  timeout: 10000,
  baseURL: config.base_url_atenea,
});

const {
  BadRequestError,
  UnauthorizedError,
} = require("../../exceptions");
const logger = require("../../helper/logger.js");

const getTokenAtenea = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      throw new BadRequestError(null, "No se envió el código de autorización");
    }
    const token = await store.getTokenAtenea(code, instance, next);
    instance.defaults.headers.common["Authorization"] = `Bearer ${token.access_token}`;
    const response = await instance.get("/oauth/token/info");
    logger.debug(`response verifyToken en getTokenAtenea: ${JSON.stringify(response.data)}`);
    const agent = await storeAgent.getAgentByIdExternal(response.data.resource_owner_id);
    if (!agent) {
      throw new BadRequestError(null, "No se encontró el agente");
    }
    if (agent.status === constants.agents.status.DISABLED) {
      throw new UnauthorizedError(null, "El agente está deshabilitado");
    }
    logger.debug(`token mas user: ${JSON.stringify({ ...token, user: agent })}`);
    delete agent.password;
    return res.status(200).send({ ...token, user: agent });
  } catch (error) {
    next(error);
  }
};

const getRefreshTokenAtenea = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError(null, "No se envió refreshToken");
    }
    const token = await store.getRefreshTokenAtenea(refreshToken);
    instance.defaults.headers.common["Authorization"] = `Bearer ${token.access_token}`;
    const response = await instance.get("/oauth/token/info");
    logger.debug(`response verifyToken en getRefreshTokenAtenea: ${JSON.stringify(response.data)}`);
    const agent = await storeAgent.getAgentByIdExternal(response.data.resource_owner_id);
    if (!agent) {
      throw new BadRequestError(null, "No se encontró el agente");
    }
    if (agent.status === constants.agents.status.DISABLED) {
      throw new UnauthorizedError(null, "El agente está deshabilitado");
    }
    logger.debug(`refresh token mas user: ${JSON.stringify({ ...token, user: agent })}`);
    delete agent.password;
    return res.status(200).send({ ...token, user: agent });
  } catch (error) {
    next(error);
  }
};

const enableDisableUserAtenea = async (req, res, next) => {
  try {
    const data = req.body;
    const { idExternal, action } = req.body;
    validator(schemaEnableDisableAgent, data, "Put");
    const token = await store.getTokenCreateUser();
    const response = await store.enableDisableUserAtenea(action, idExternal, token.access_token);

    if(action === constants.agents.action.DISABLE){
      const agent = await storeAgent.getAgentByIdExternal(idExternal);
      disconnectAgent(agent?.id);
      mongoTicket.expireAgentTickets(agent?.id);
    }
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const changePassword = catchAsync(async (req, res, next) => {
  const { email, old_password, new_password } = req.body;
  const data = { email, old_password, new_password };
  validator(schemaNewPassword, data, "Put");
  const token = req.headers.authorization;
  const response = await store.changePassword(data, token);
  sendResponse.success(req, res, response, "response", 200);
});

module.exports = {
  getTokenAtenea,
  enableDisableUserAtenea,
  getRefreshTokenAtenea,
  changePassword,
};
