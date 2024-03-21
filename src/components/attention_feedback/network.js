const express = require("express");
const controller = require("./controller.js");
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const constants = require('../../constants');

const router = express.Router();

router.get("/:idFeedback", roleMiddleware(constants.agents.types.ADMIN), controller.getAttentionFeedback);
router.get("/", roleMiddleware(constants.agents.types.ADMIN), controller.getAttentionFeedbacks);
router.get("/statistics/", roleMiddleware(constants.agents.types.ADMIN), controller.getAttentionFeedbackStatistics);
router.post("/", controller.createAttentionFeedback);
router.patch("/", roleMiddleware(constants.agents.types.ADMIN), controller.updateAttentionFeedback);
router.delete("/:idFeedback", roleMiddleware(constants.agents.types.ADMIN), controller.deleteAttentionFeedback);

module.exports = router;
