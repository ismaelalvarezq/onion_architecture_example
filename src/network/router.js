// Archivos de Rutas
const health = require('../components/health/network.js');
const auth = require('../components/auth/network');
const admin = require('../components/admin/network.js');
const agent = require('../components/agent/network.js');
const blocking_history = require('../components/blocking_history/network.js')
const area = require('../components/area/network.js');
const category = require('../components/category/network.js');
const channel = require('../components/channel/network.js');
const chat = require('../components/chat/network.js');
const client = require('../components/client/network.js');
const client_flow_step = require('../components/client_flow_step/network.js');
const list = require('../components/list/network');
const company = require('../components/company/network.js');
const env_var = require('../components/env_var/network.js');
const faq = require('../components/faq/network.js')
const flow = require('../components/flow/network.js');
const note = require('../components/note/network.js');
const outbound_campaign = require('../components/outbound_campaign/network.js');
const schedule = require('../components/scheduleDay/network.js');
const template = require('../components/template/network.js');
const ticket_status = require('../components/ticket_status/network.js')
const ticket_priority = require('../components/ticket_priority/network.js')
const ticket_category = require('../components/ticket_category/network.js')
const webchat_theme = require('../components/webchat_theme/network.js');
const dashboard_ticket = require('../components/dashboard_ticket/network.js');
const statistics = require('../components/statistics/network.js')
const be_aware_configuration = require('../components/be_aware_configuration/network.js')
const attention_feedback = require('../components/attention_feedback/network.js')
const flow_feedback = require('../components/flow_feedback/network.js')
const plan = require('../components/plan/network.js')
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const constants = require('../constants');
const whatsappProxy = require('../components/whatsapp_proxy/network.js');
const automaticResponse = require('../components/automatic_response/network.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { errorMiddleware } = require("../middlewares/errorMiddleware");
const { morganSuccessMiddleware, morganErrorMiddleware } = require("../middlewares/loggerMiddleware.js");
const cors = require('cors')
const bodyParser = require('body-parser');
const Sentry = require("@sentry/node");
const config = require('../config.js');
const express = require('express');

const router = express.Router();

// The request handler must be the first middleware on the app
Sentry.init({
  dsn: config.dsn_sentry,
  environment: config.environment,
  tracesSampleRate: 1.0,
});

router.use(Sentry.Handlers.requestHandler())

// Middleware
router.use(morganErrorMiddleware);
router.use(morganSuccessMiddleware);
router.use(cors());
router.use(bodyParser({ limit: config.limitSize }))
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/health', health);
router.use('/auth', auth);

router.use(authMiddleware);
router.use('/admin', admin);
router.use('/plan', plan);
router.use('/agent', agent);
router.use('/blocking_history', blocking_history);
router.use('/area', area);
router.use('/category', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), category);
router.use('/channel', channel);
router.use('/chat', chat);
router.use('/client', client);
router.use('/client_flow_step', roleMiddleware(constants.agents.types.SYSTEM), client_flow_step);
router.use('/list', roleMiddleware(constants.agents.types.ADMIN), list);
router.use('/company', company);
router.use('/env_var', roleMiddleware(constants.agents.types.SYSTEM), env_var);
router.use('/faq', faq)
router.use('/flow', roleMiddleware(constants.agents.types.SYSTEM), flow);
router.use('/note', note);
router.use('/outbound-campaign', outbound_campaign);
router.use('/schedule', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), schedule);
router.use('/template', template);
router.use('/ticket_status', ticket_status)
router.use('/ticket_priority', ticket_priority)
router.use('/ticket_category', ticket_category)
router.use('/webchat_theme', roleMiddleware(constants.agents.types.SYSTEM), webchat_theme);
router.use('/dashboard_ticket', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), dashboard_ticket);
router.use('/statistics', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), statistics);
router.use('/be-aware-configuration', be_aware_configuration);
router.use('/attention-feedback', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), attention_feedback)
router.use('/flow-feedback', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), flow_feedback)
router.use('/whatsapp-proxy', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), whatsappProxy);
router.use('/automatic-responses', roleMiddleware(constants.agents.types.ADMIN, constants.agents.types.AGENT), automaticResponse);

// The error handler must be before any other error middleware and after all controllers
router.use(Sentry.Handlers.errorHandler())

// Error Middleware
router.use(errorMiddleware);

module.exports = router;
