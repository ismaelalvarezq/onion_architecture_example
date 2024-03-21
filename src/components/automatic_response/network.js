const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/', controller.getAutomaticResponses);
router.get('/:id', controller.getAutomaticResponse);
router.patch('/:id', controller.updateAutomaticResponse);

module.exports = router;
