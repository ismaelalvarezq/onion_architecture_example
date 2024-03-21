const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.get('/agent/ticket_general_status/:idAgent', controller.getDashboardTicketStatus);
router.get('/agent/ticket_status_traffic/:idAgent', controller.getTicketStatusTraffic);
router.get('/agent/ticket_category_traffic/:idAgent', controller.getTicketCategoryTraffic);
router.get('/agent/ticket_channel_traffic/:idAgent', controller.getTicketChannelTraffic);

module.exports = router;
