const { isAxiosError } = require("axios");
const { Prisma } = require('@prisma/client');
const logger = require("../helper/logger.js");
const response = require('../network/response.js');


const errorMiddleware = (err, req, res, next) => {
  logger.error(err);
  if (err.stack) logger.error(err.stack);
  if (isAxiosError(err)) {
    const errorJson = err.toJSON().config;
    logger.info(`response data: ${JSON.stringify(err.response?.data)}`);
    logger.info(`request headers: ${JSON.stringify(errorJson?.headers)}`);
    logger.info(`request method: ${errorJson?.method}`);
    logger.info(`request url: ${errorJson?.baseURL}${errorJson?.url}`);
    if (errorJson.data) {
      logger.info(`request data: ${JSON.stringify(errorJson.data)}`);
    }
    if (errorJson.params) {
      logger.info(`request params: ${JSON.stringify(errorJson.params)}`);
    }
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        err.message = "Valor duplicado: " + err.meta.target;
        break;
      case "P2014":
        err.message = "Id inválida: " + err.meta.target;
        break;
      case "P2003":
        err.message = "Tipo de dato inválido: " + err.meta.target;
        break;
      default:
        err.message = "Error: " + err.message;
        break;
    }
  }

  response.error(req, res, err.message, err.statusCode, err.details);
}

module.exports = {
  errorMiddleware,
}
