const express = require('express');
const router = express.Router();

const controller = require('./controller.js');


router.post('/', controller.createTheme);
router.get('/:id', controller.getTheme);
router.get('/', controller.getThemes);
router.patch('/:id', controller.updateTheme);
router.delete('/:id', controller.deleteTheme);

module.exports = router;
