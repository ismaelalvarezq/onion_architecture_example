const express = require('express');
const controller = require('./controller.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

router.post('/send-message-template', controller.sendWhatsAppMessageTemplate);
router.post('/message-templates', controller.createWhatsAppMessageTemplate);
router.get('/message-templates', controller.getWhatsAppMessageTemplates)
router.post('/uploads', upload.single('file'), controller.uploadFile);

module.exports = router;
