const config = require('../../config');
const axios = require("axios");


const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "application/json",
      "access-control-allow-origin": "*",
    },
    timeout: 10000,
    baseURL: config.baseUrlBeAware,
});

const getBeAwareToken = async (user, password, company, secretKey, clientKey) => {
    const response = await instance.post("/ba360/apir/v10/login/authexternalsystem", {
        user: user,
        pass: password,
        company: company,
        secretkey: secretKey,
        clientkey: clientKey
    });
    return response.data.token;
}

module.exports = {
    getBeAwareToken,
};