const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createTicketCategory);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTicketCategory);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTicketsCategories);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateTicketCategory);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteTicketCategory);

module.exports = router;
