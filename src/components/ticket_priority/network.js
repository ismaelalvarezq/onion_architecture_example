const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createTicketPriority);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTicketPriority);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTicketsPriorities);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateTicketPriority);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteTicketPriority);

module.exports = router;
