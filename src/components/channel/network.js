const express = require('express');
const router = express.Router();

const controller = require('./controller.js');
const response = require('../../network/response.js');

const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createChannel);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getChannel);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getChannels);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateChannel);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteChannel);

module.exports = router;
