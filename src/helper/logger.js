const winston = require('winston');
const config = require('../config');

const logger = winston.createLogger({
  level: ['qa', 'production'].includes(config.environment) ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.errors({ stack: ['qa', 'production'].includes(config.environment) ? true : false }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    ['qa', 'production'].includes(config.environment) ? winston.format.uncolorize() : winston.format.colorize(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}` + (info.stack ? `\n${info.timestamp} ${info.level}: ${info.stack}` : '')),
  ),
  transports: [
    new winston.transports.Console(),
  ]
});

if (['qa', 'production'].includes(config.environment)) {
  logger.add(new winston.transports.File({ filename: `logs/${new Date().valueOf()}.log` }))
}

module.exports = logger;
