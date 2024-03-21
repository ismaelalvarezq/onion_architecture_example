const morgan = require("morgan");
const config = require("../config");
const logger = require("../helper/logger");

let morganFormat = '';
if (config.environment !== 'local') morganFormat += ':remote-addr - ';
morganFormat += ':method :url :status - :response-time ms';
const morganSuccessMiddleware = morgan(morganFormat, {
  skip: (req, res) => {
    return (res.statusCode >= 400) || (req.url === "/health")
  },
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

const morganErrorMiddleware = morgan(morganFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => logger.error(message.trim()),
  },
});

module.exports = {
  morganSuccessMiddleware,
  morganErrorMiddleware,
}
