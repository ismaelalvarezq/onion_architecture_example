const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.get('/', controller.getTicketsDashboard);

module.exports = router;
