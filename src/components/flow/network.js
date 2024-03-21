const express = require('express');
const router = express.Router();

const controller = require('./controller.js');

router.post('/', controller.createFlow);
router.get('/:id', controller.getFlow);
router.get('/', controller.getFlows);
router.patch('/:id', controller.updateFlow);
router.delete('/:id', controller.deleteFlow);
router.get('/getConfigJson/:token', controller.getConfigJson);

module.exports = router;
