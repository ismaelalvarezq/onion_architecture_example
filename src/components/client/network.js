const express = require('express');
const router = express.Router();

const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createClient);
router.get('/has-active-ticket/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.hasActiveTicket);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getClient);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getClients);
router.patch('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.updateClient);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteClient);


module.exports = router;
