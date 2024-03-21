const store = require('./store.js');
const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError, ValidationError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const {schemaFlowFeedback} = require('../../helper/validator/schemas/flowFeedback.js');

const getFlowFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.idFeedback) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getFlowFeedback] Missing params");
  }

  const flowFeedback = await store.getFlowFeedback(req.params.idFeedback);
  response.success(req, res, flowFeedback, "response", 200);
});

const getFlowFeedbacks = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const orderBy = [];
  const query = {where:{}};

  if(filters?.type){
    query.where["type"] = filters.type;
  }

  if(filters?.value){
    query.where["value"] = parseInt(filters.value);
  }

  if(filters?.idClient){
    query.where["idClient"] = filters.idUser;
  }

  if(filters?.idFlow){
    query.where["idFlow"] = filters.idFlow;
  }

  if (filters.orderBy) {
    let item = filters.orderBy.split(" ");
    orderBy.push({ [`${item[0]}`] : item[1] }); 
    query["orderBy"] = orderBy;
  }

  if (filters.skip) {
    query["skip"] = parseInt(filters.skip);
  }

  if (filters.take) {
    query["take"] = parseInt(filters.take);
  }

  const flowFeedbacks = await store.getFlowFeedbacks(query);
  response.success(req, res, flowFeedbacks, "response", 200);
});

const getFlowFeedbackStatistics = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const query = {where:{}};

  

  const flowFeedbackStatistics = await store.getFlowFeedbackStatistics(query);
  response.success(req, res, flowFeedbackStatistics, "response", 200);
});

const createFlowFeedback = catchAsync(async (req, res, next) => {
  let feedback = req.body;
  validator(schemaFlowFeedback, feedback, "Post");

  const flowFeedback = await store.createFlowFeedback(feedback);
  response.success(req, res, flowFeedback, "response", 201);
});

const updateFlowFeedback = catchAsync(async (req, res, next) => {
  let feedback = req.body;
  validator(schemaFlowFeedback, feedback, "Patch");
  feedback.id = req.params.id;

  const updatedFlowFeedback = await store.updateFlowFeedback(feedback);
  response.success(req, res, updatedFlowFeedback, "response", 200);
});

const deleteFlowFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.idFeedback) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteFlowFeedback] Missing params");
  }

  const deletedFlowFeedback = await store.deleteFlowFeedback(req.params.idFeedback);
  response.success(req, res, deletedFlowFeedback, "response", 200);
});

module.exports = {
  getFlowFeedback,
  getFlowFeedbacks,
  createFlowFeedback,
  updateFlowFeedback,
  deleteFlowFeedback,
  getFlowFeedbackStatistics
};