const store = require("./store.js");
const response = require("../../network/response.js");
const {
  BadRequestError,
  NotFoundError,
} = require("../../exceptions.js");

const catchAsync = require("../../utils/catchAsync.js");
const { validator } = require("../../helper/validator/index.js");
const {
  getPlanSchema,
  getPlanConfigSummarySchema,
  createUpdatePlanSchema,
  createUpdatePlanConfigSchema,
  createUpdatePlanSummarySchema,
  checkTotalSchema,
  incrementTicketSchema
} = require("../../helper/validator/schemas/plan");
const { formatRequest } = require("../../utils/formatRequest.js");
const constants = require("../../constants.js");

const getPlan = catchAsync(async (req, res, next) => {
  validator(getPlanSchema, req.query);
  const plan = await store.getPlan(req.query.idPlan);

  if (!plan) {
    throw new NotFoundError(
      null,
      "No se encontró el plan.",
      "[getPlan] Not found"
    );
  }

  response.success(req, res, plan, "response");
});

const getPlans = catchAsync(async (req, res, next) => {
  const plans = await store.getPlans();

  response.success(req, res, plans, "response", 200);
});

const createPlan = catchAsync(async (req, res, next) => {
  let plan = req.body;

  validator(createUpdatePlanSchema, plan, "Post");

  const createdPlan = await store.createPlan(plan);

  response.success(req, res, createdPlan, "response", 201);
});

const updatePlan = catchAsync(async (req, res, next) => {
  let plan = req.body;
  plan.id = req.query.idPlan;

  validator(createUpdatePlanSchema, plan, "Patch");

  const updatedPlan = await store.updatePlan(plan);

  response.success(req, res, updatedPlan, "response", 200);
});

const getPlanConfig = catchAsync(async (req, res, next) => {
  validator(getPlanConfigSummarySchema, req.query);
  const plan = await store.getPlanConfig(req.query.idPlanConfig);

  if (!plan) {
    throw new NotFoundError(
      null,
      "No se encontró el plan.",
      "[getPlan] Not found"
    );
  }

  response.success(req, res, plan, "response");
});


const getPlanConfigs = catchAsync(async (req, res, next) => {
  const { filters, orders } = formatRequest(req);

  if (constants.agents.types.ADMIN === req.ctx.user.type || constants.agents.types.AGENT === req.ctx.user.type) {
    filters.idCompany = req.ctx.user.idCompany;
  }

  const plans = await store.getPlanConfigs(filters, orders);
  response.success(req, res, plans, "response", 200);
});

//TODO: Endpoint de uso interno
const createPlanConfig = catchAsync(async (req, res, next) => {
  let plan = req.body;

  validator(createUpdatePlanConfigSchema, plan, "Post");

  const newPlan = await store.createPlanConfig(plan);
  const newPlanSummary = await store.createPlanSummary(newPlan.id);

  response.success(req, res, { newPlan, newPlanSummary }, "response", 201);
});

const updatePlanConfig = catchAsync(async (req, res, next) => {
  let plan = req.body;
  plan.id = req.query.idPlanConfig;

  validator(createUpdatePlanConfigSchema, plan, "Patch");

  const updatedPlan = await store.updatePlanConfig(plan);

  response.success(req, res, updatedPlan, "response", 200);
});

const deletePlanConfig = catchAsync(async (req, res, next) => {
  if (!req.params.idPlanConfig)
    throw new BadRequestError(
      null,
      "Faltan parámetros requeridos.",
      "[deleteSchedule] Missing 'Id'"
    );
  const deletedPlan = await store.deletePlanConfig(req.params.idPlanConfig);

  response.success(req, res, deletedPlan, "response", 200);
});

const getPlanSummaries = catchAsync(async (req, res, next) => {
  validator(getPlanConfigSummarySchema, req.query);

  const plan = await store.getPlanSummary(req.query.idPlanConfig);

  if (!plan || plan.length === 0) {
    throw new NotFoundError(
      null,
      "No hay resumen para el plan.",
      "[getPlanSummaries] Not found"
    );
  }

  response.success(req, res, plan, "response");
});

const updatePlanSummary = catchAsync(async (req, res, next) => {
  let planSummary = req.body;
  planSummary.idPlanSummary = req.query.idPlanSummary;

  validator(createUpdatePlanSummarySchema, planSummary, "Patch");

  const updatedPlan = await store.updatePlanSummary(planSummary);

  response.success(req, res, updatedPlan, "response", 200);
});

const checkTotalConversation = catchAsync(async (req, res, next) => {
  validator(checkTotalSchema, req.query);
  const plan = await store.checkTotalConversation(req.query.idCompany);

  response.success(req, res, plan, "response");
});

const incrementTicketsPlanSummary = catchAsync(async (req, res, next) => {
  validator(incrementTicketSchema, req.body, "Patch");

  const updatedPlan = await store.incrementTicketsPlanSummary(req.body?.idPlanSummary);

  response.success(req, res, updatedPlan, "response", 200);
});

const getPlanByCompany = catchAsync(async (req, res, next) => {
  if(!req.params.idCompany) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getPlanByCompany] Missing 'idCompany'");
  }

  const plan = await store.getPlanConfigByCompany(req.params.idCompany);

  response.success(req, res, plan, "response");
});


module.exports = {
  getPlan,
  getPlans,
  createPlan,
  updatePlan,
  getPlanConfig,
  getPlanConfigs,
  createPlanConfig,
  updatePlanConfig,
  deletePlanConfig,
  getPlanSummaries,
  updatePlanSummary,
  getPlanByCompany,
  checkTotalConversation,
  incrementTicketsPlanSummary
};
