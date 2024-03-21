const axios = require('axios').default;

const { InternalServerError } = require('../../exceptions.js');
const { getTokenService } = require('../../helper/tokenServices');
const config = require('../../config');

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    "access-control-allow-origin": "*",
  },
  timeout: 10000,
  baseURL: config.websocketUrl,
});

const addAuthHeader = () => {
  instance.defaults.headers.common['authorization'] = getTokenService();
};

async function sendSystemMessage(msgBody) {
  addAuthHeader();
  try {
    const response = await instance.post("/remote_message/from-system", msgBody);
    return response.data;
  } catch (error) {
    throw new InternalServerError(error, "Error al mandar el mensaje.", "[sendSystemMessage] Bad request");
  }
}

const disconnectAgent = async (idAgent) => {
  addAuthHeader();
  try {
    const response = await instance.post(`/remote_message/disconnect-agent/${idAgent}`);
    return response.data;
  } catch (error) {
    throw new InternalServerError(error, "Error al desconectar el agente.", "[disconnectAgent] Bad request");
  }
}

module.exports = {
  sendSystemMessage,
  disconnectAgent
}
