const express = require('express');
const config = require('./config.js');
const router = require('./network/router.js');
const Cron = require('./crons/index.js');
const logger = require("./helper/logger.js");

Cron.start();

const app = express();

// Settings
app.set('port', config.port);
app.set('json spaces', 2);

// Rutes
app.use('/api/config', router);

// Starting the Server
app.listen(config.port, () => {
  logger.info('Server on Port: ' + config.port);
});
