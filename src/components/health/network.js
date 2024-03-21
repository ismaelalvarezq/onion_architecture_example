const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.get('/', controller.health);

module.exports = router;
