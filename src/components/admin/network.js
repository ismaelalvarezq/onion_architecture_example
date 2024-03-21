const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.post('/add-company', controller.addCompany);

module.exports = router;
