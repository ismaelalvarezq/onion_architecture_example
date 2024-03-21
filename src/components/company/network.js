const express = require('express');
const controller = require('./controller.js');
const constants = require('../../constants');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const multer  = require('multer')
const upload = multer({ dest: 'client-import-files/' });

const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.SYSTEM), controller.createCompany);
router.get('/client-import-file', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.downloadFormat);
router.get('/:id', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getCompany);
router.get('/:idCompany/client-import-files', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getClientImportFiles);
router.post('/:id/client-import-files', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), upload.single('file'), controller.importFile);
router.get('/:id/client-import-files/format', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.downloadFormat);
router.get('/', roleMiddleware(constants.agents.types.AGENT, constants.agents.types.ADMIN), controller.getCompanies);
router.patch('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.updateCompany);
router.delete('/:id', roleMiddleware(constants.agents.types.SYSTEM), controller.deleteCompany);

module.exports = router;
