const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.post('/', controller.createEnvVar);
router.get('/:id', controller.getEnvVar);
router.get('/', controller.getEnvVars);
router.patch('/:id', controller.updateEnvVar);
router.delete('/:id', controller.deleteEnvVar);
router.get('/getEnvVarByToken/:token', controller.getEnvVarByToken);

module.exports = router;
