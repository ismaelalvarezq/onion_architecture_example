const express = require("express");
const controller = require("./controller.js");
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

const router = express.Router();

router.post("/", roleMiddleware(constants.agents.types.ADMIN), controller.createScheduleDay);
router.get("/:idAgent", roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getAllScheduleDaysWithRange);
router.put("/:idAgent", roleMiddleware(constants.agents.types.ADMIN), controller.updatedScheduleDay);
router.get("/check/:idAgent", roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.checkAgentSchedule);

module.exports = router;
