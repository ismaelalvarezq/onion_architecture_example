const express = require('express');
const controller = require('./controller.js');
const response = require('../../network/response.js');


const router = express.Router();

router.post('/', controller.createCategory);
router.get('/:id', controller.getCategory);
router.get('/checkCategory/:id/', controller.checkCategory);
router.get('/', controller.getCategories);
router.patch('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
