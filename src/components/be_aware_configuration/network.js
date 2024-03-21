const express = require('express');
const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');


const router = express.Router();

router.post("/", roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.createBeAwareConfiguration);
router.get("/get-be-aware-token", roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getBeAwareToken);

module.exports = router;
