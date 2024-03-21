const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.get('/validate-chat/', roleMiddleware(constants.agents.types.SYSTEM), controller.validateChat);
router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createChat);
// ! remove agent and system permission after solving websocket issue
router.get('/:id', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getChat);
router.get('/', roleMiddleware(constants.agents.types.SYSTEM), controller.getChats);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateChat);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteChat);
router.get('/get_previews/:idAgent', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getPreviews);

module.exports = router;
