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
  baseURL: config.mongoDbLink,
});

const addAuthHeader = () => {
  instance.defaults.headers.common['authorization'] = getTokenService();
};

async function getCampaignStatistics(params, query) {
  const { idOutboundCampaign } = params;
  addAuthHeader();
  const response = await instance.get(`/campaign/statistics/${idOutboundCampaign}`, { params: query });
  return response?.data?.data;
}

module.exports = {
  getCampaignStatistics,
}
