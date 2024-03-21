const express = require("express");
const controller = require("./controller.js");
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

const router = express.Router();

router.get("/:idFeedback", roleMiddleware(constants.agents.types.ADMIN), controller.getFlowFeedback);
router.get("/", roleMiddleware(constants.agents.types.ADMIN), controller.getFlowFeedbacks);
router.get("/statistics/", roleMiddleware(constants.agents.types.ADMIN), controller.getFlowFeedbackStatistics);
router.post("/", controller.createFlowFeedback);
router.patch("/", roleMiddleware(constants.agents.types.ADMIN), controller.updateFlowFeedback);
router.delete("/:idFeedback", roleMiddleware(constants.agents.types.ADMIN), controller.deleteFlowFeedback);

module.exports = router;
