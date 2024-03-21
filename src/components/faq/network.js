const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createFAQ);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getFAQ);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getFAQs);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateFAQ);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteFAQ);

module.exports = router;
