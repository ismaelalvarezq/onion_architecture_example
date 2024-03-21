const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.post('/', controller.createClientFlowStep);
router.get('/:id', controller.getClientFlowStep);
router.get('/', controller.getClientFlowsStep);
router.patch('/:id', controller.updateClientFlowStep);
router.delete('/:id', controller.deleteClientFlowStep);

module.exports = router;
