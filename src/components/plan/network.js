const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/', controller.getPlans);
router.get('/getPlan', controller.getPlan);
router.post('/createPlan', controller.createPlan);
router.patch('/updatePlan', controller.updatePlan);

router.post('/', controller.createPlanConfig);
router.get('/planConfig/', controller.getPlanConfigs);
router.get('/getPlanConfig', controller.getPlanConfig);
router.get('/checkTotalConversation', controller.checkTotalConversation);
router.patch('/udpatePlanConfig', controller.updatePlanConfig);
router.delete('/:idPlanConfig', controller.deletePlanConfig);

router.get('/getPlanSummaries', controller.getPlanSummaries);
router.patch('/updatePlanSummary', controller.updatePlanSummary);
router.patch('/incrementTicketsPlanSummary', controller.incrementTicketsPlanSummary);

router.get('/planByCompany/:idCompany', controller.getPlanByCompany);

module.exports = router;
