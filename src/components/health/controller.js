const config = require("../../config");

const health = (req, res) => {
  const data = {
    service_name: config.service_name,
    version: config.version,
    enviroment: config.environment,
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }
  res.status(200).send(data);
};

module.exports = {
  health,
};
