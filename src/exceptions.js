const { isAxiosError } = require("axios");
const logger = require("./helper/logger");

// Base Error
class BaseError extends Error {
  constructor(error, message, details, statusCode) {
    if (error) {
      logger.error(error);
      if (isAxiosError(error)) {
        const errorJson = error.toJSON().config;
        logger.info(`response data: ${JSON.stringify(error.response?.data)}`);
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
    }

    super(message);
    this.details = details;
    this.statusCode = statusCode;
  }
}

// 4XX Errors
class BadRequestError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 400);
  }
}

class ValidationError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 400);
  }
}

class UnauthorizedError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 401);
  }
}

class ForbiddenError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 403);
  }
}

class NotFoundError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 404);
  }
}

// 5XX Errors
class InternalServerError extends BaseError {
  constructor(error, message, details) {
    super(error, message, details, 500);
  }
}

module.exports = {
  BaseError,
  UnauthorizedError,
  BadRequestError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
