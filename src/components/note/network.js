const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.createNote);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getNote);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getNotes);
router.patch('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.updateNote);
router.delete('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.deleteNote);

module.exports = router;
