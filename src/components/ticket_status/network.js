const express = require('express');
const constants = require('../../constants');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const router = express.Router();


const controller = require('./controller.js');

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createTicketStatus);
router.get('/:id', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getTicketStatus);
router.get('/', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getTicketsStatuses);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateTicketStatus);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteTicketStatus);

module.exports = router;
