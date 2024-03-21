const express = require('express');
const controller = require('./controller.js');


const router = express.Router();

router.post('/', controller.createSchedule);
router.get('/:id', controller.getSchedule);
router.get('/', controller.getSchedules);
router.patch('/:id', controller.updateSchedule);
router.delete('/:id', controller.deleteSchedule);

module.exports = router;
