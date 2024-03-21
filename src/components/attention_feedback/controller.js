const store = require('./store.js');
const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError, ValidationError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const {schemaAttentionFeedback} = require('../../helper/validator/schemas/attentionFeedback.js');

const getAttentionFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.idFeedback) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getAttentionFeedback] Missing params");
  }

  const attentionFeedback = await store.getAttentionFeedback(req.params.idFeedback);
  response.success(req, res, attentionFeedback, "response", 200);
});

const getAttentionFeedbacks = catchAsync(async (req, res, next) => {
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

  if(filters?.idAgent){
    query.where["idAgent"] = filters.idAgent;
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

  const attentionFeedbacks = await store.getAttentionFeedbacks(query);
  response.success(req, res, attentionFeedbacks, "response", 200);
});

const getAttentionFeedbackStatistics = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const query = {where:{}};

  const attentionFeedbackStatistics = await store.getAttentionFeedbackStatistics(query);
  response.success(req, res, attentionFeedbackStatistics, "response", 200);
});

const createAttentionFeedback = catchAsync(async (req, res, next) => {
  let feedback = req.body;
  validator(schemaAttentionFeedback, feedback, "Post");

  const attentionFeedback = await store.createAttentionFeedback(feedback);
  response.success(req, res, attentionFeedback, "response", 201);
});

const updateAttentionFeedback = catchAsync(async (req, res, next) => {
  let feedback = req.body;
  validator(schemaAttentionFeedback, feedback, "Patch");
  feedback.id = req.params.id;

  const updatedAttentionFeedback = await store.updateAttentionFeedback(feedback);
  response.success(req, res, updatedAttentionFeedback, "response", 200);
});

const deleteAttentionFeedback = catchAsync(async (req, res, next) => {
  if (!req.params.idFeedback) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteAttentionFeedback] Missing params");
  }

  const deletedAttentionFeedback = await store.deleteAttentionFeedback(req.params.idFeedback);
  response.success(req, res, deletedAttentionFeedback, "response", 200);
});

module.exports = {
  getAttentionFeedback,
  getAttentionFeedbacks,
  createAttentionFeedback,
  updateAttentionFeedback,
  deleteAttentionFeedback,
  getAttentionFeedbackStatistics
};