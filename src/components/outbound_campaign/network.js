const express = require('express');
const controller = require('./controller.js');
const multer = require('multer');
const upload = multer({ dest: 'client-import-files/' });

const router = express.Router();

router.post('/', upload.single('file'), controller.createOutboundCampaign);
router.get('/format', controller.downloadOutboundCampaignFormat);
router.get('/statistics-report', controller.getOutboundCampaignStatisticsReport);
router.get('/statistics', controller.getOutboundCampaignStatistics);
router.get('/:idCampaign/clients', controller.getClientsOfCampaign);
router.get('/:id', controller.getOutboundCampaign);
router.patch('/:id/cancel', controller.cancelOutboundCampaign);
router.get('/', controller.getOutboundCampaigns);
router.patch('/:id', controller.updateOutboundCampaign);
router.delete('/:id', controller.deleteOutboundCampaign);


module.exports = router;
