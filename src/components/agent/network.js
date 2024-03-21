const express = require('express');
const multer  = require('multer')

const controller = require('./controller.js');
const { roleMiddleware } = require('../../middlewares/roleMiddleware');
const controllerAuth = require('../auth/controller');
const constants = require('../../constants');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', roleMiddleware(constants.agents.types.ADMIN), controller.createAgent);
router.get("/roles", controller.getRoles);
router.get("/all-agents", controller.getAllAgents);
router.get('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getAgent);
router.get('/', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getAgents);
router.get('/availableAgents/:idCompany', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.getAvailableAgents);
router.patch('/:id', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), controller.updateAgent);
router.put("/changeAvailability/:id", controller.changeAgentAvailability);
router.put("/updateAvatarAgent/:id", upload.single('file'), controller.updateAvatarAgent);
router.put("/enableDisableUser", controllerAuth.enableDisableUserAtenea);
router.put("/changePassword", controllerAuth.changePassword);

module.exports = router;
