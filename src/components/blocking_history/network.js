const express = require('express');
const router = express.Router();

const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

router.post('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.createBlock);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getBlock);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getBlocks);
router.patch('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.updateBlock);
router.delete('/:id', roleMiddleware(constants.agents.types.ADMIN), controller.deleteBlock);

module.exports = router;
