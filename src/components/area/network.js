const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.post('/', controller.createArea);
router.get('/:id', controller.getArea);
router.get('/', controller.getAreas);
router.patch('/:id', controller.updateArea);
router.delete('/:id', controller.deleteArea);

module.exports = router;
