const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.createTemplate);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTemplate);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getTemplates);
router.patch('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.updateTemplate);
router.delete('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.deleteTemplate);

module.exports = router;
