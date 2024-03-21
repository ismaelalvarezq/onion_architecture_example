const store = require('./store.js');
const beAwareResolver = require('../be_aware/resolver.js')
const response = require('../../network/response.js');
const catchAsync = require('../../utils/catchAsync.js');
const { beAwareConfigurationSchema } = require('../../helper/validator/schemas/beAwareConfiguration.js');
const { validator } = require('../../helper/validator/index.js');
const { ForbiddenError, NotFoundError, UnauthorizedError } = require('../../exceptions.js');
const { getAgent } = require('../agent/store.js');
const constants = require('../../constants.js');
const config = require('../../config.js');
const { encrypt } = require('../../helper/cryptoService.js');
const { isAxiosError } = require('axios');
const { StatusCodes } = require('http-status-codes');


const createBeAwareConfiguration = catchAsync(async (req, res, next) => {
    const beAwareConfiguration = req.body;
    validator(beAwareConfigurationSchema, beAwareConfiguration, "Post");

    if (constants.agents.types.AGENT === req.ctx.user.type && beAwareConfiguration.idAgent !== req.ctx.user.id) {
        throw new ForbiddenError(null, "No puedes configurar la integración de otros agentes.", "[createBeAwareConfiguration] forbidden error.");
    }

    if (constants.agents.types.ADMIN === req.ctx.user.type) {
        const agent = await getAgent(beAwareConfiguration.idAgent);
        if (agent.idCompany !== req.ctx.user.idCompany) {
            throw new ForbiddenError(null, "No puedes configurar la integración de agentes de otras compañías.", "[createBeAwareConfiguration] forbidden error.");
        }
    }

    const newBeAwareConfiguration = await store.createOrUpdateBeAwareConfiguration(beAwareConfiguration);
    delete newBeAwareConfiguration.password;
    delete newBeAwareConfiguration.secretKey;
    delete newBeAwareConfiguration.clientKey;

    response.success(req, res, newBeAwareConfiguration, "response", 201);
});

const getBeAwareToken = catchAsync(async (req, res, next) => {
    const beAwareConfiguration = await store.getBeAwareConfiguration(req.ctx.user.id);
    if (!beAwareConfiguration) {
        throw new NotFoundError(null, "El agente no tiene configuración de integración Be Aware.");
    }

    try {
        const token = await beAwareResolver.getBeAwareToken(
            beAwareConfiguration.user,
            beAwareConfiguration.password,
            beAwareConfiguration.company,
            beAwareConfiguration.secretKey,
            beAwareConfiguration.clientKey,
        );
        response.success(req, res, { token }, "response", 200);
    } catch (error) {
        if (isAxiosError(error) && error.response.status === StatusCodes.UNAUTHORIZED) {
            throw new UnauthorizedError(error, "Ocurrio un error al iniciar sesión en Be Aware.")
        }
        throw error;
    }
  
});

module.exports = {
    createBeAwareConfiguration,
    getBeAwareToken,
}
