const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const { validator } = require("../../helper/validator/index.js");
const { getAgent } = require("../agent/store.js");
const { scheduleDayAndRangeSchema } = require("../../helper/validator/schemas/scheduleDayAndRange.js");
const {BadRequestError, NotFoundError, ForbiddenError } = require("../../exceptions.js");
const constants = require("../../constants.js");
const dayjs = require('dayjs')
const { updateScheduleDays, getAllScheduleDaysWithRanges,createScheduleDays } = require("../scheduleDay/store.js");

const getAllScheduleDaysWithRange = catchAsync(async (req, res, next) => {
  const { idAgent } = req.params;
  if (
    constants.agents.types.AGENT === req.ctx.user.type &&
    idAgent !== req.ctx.user.id
  ) {
    throw new ForbiddenError(null, "No puedes ver los días de la semana de otro agente.");
  }

  const scheduleDays = await getAllScheduleDaysWithRanges(idAgent);
  response.success(req, res, scheduleDays, "response", 200);
});

const createScheduleDay = catchAsync(async (req, res, next) => {
  const { idAgent, scheduleDays } = req.body;

  validator(scheduleDayAndRangeSchema, { idAgent, scheduleDays }, "Post");

  const agent = await getAgent(idAgent);

  if (!agent) throw new NotFoundError(null, "No se encontro el agente.");

  if (
    constants.agents.types.ADMIN === req.ctx.user.type &&
    agent.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(null, "No puedes crear el día de la semana de un agente de otra compañía.");
  }

  const createdScheduleDay = await createScheduleDays(idAgent, scheduleDays);

  response.success(req, res, createdScheduleDay, "response", 200);
});

const updatedScheduleDay = catchAsync(async (req, res, next) => {
  const { scheduleDays } = req.body;
  const idAgent = req.params.idAgent;

  validator(scheduleDayAndRangeSchema, { idAgent, scheduleDays }, "Put");

  const agent = await getAgent(idAgent);

  if (!agent) throw new NotFoundError(null, "No se encontro el agente.");

  if (
    constants.agents.types.ADMIN === req.ctx.user.type &&
    agent.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(null, "No puedes modificar el día de la semana de un agente de otra compañía.");
  }

  console.log("scheduleDays", scheduleDays);

  const updatedScheduleDay = await updateScheduleDays(idAgent, scheduleDays);

  response.success(req, res, updatedScheduleDay, "response", 200);
});

const checkAgentSchedule = catchAsync(async (req, res, next) => {  

  if(!req.params.idAgent){
    throw new BadRequestError(null, "El id del agente es requerido.");
  }

  let isOnSchedule = await validateSchedule(req.params.idAgent);

  response.success(req, res, {isOnSchedule}, "response", 200);

});

const validateSchedule = async (idAgent) => {
  let isOnSchedule = false;

  const schedule = (await getAllScheduleDaysWithRanges(idAgent)).scheduleDays || [];
  if (!Array.isArray(schedule) && array.length == 0) {
    return true;
  }
  const today = dayjs().day();
  const now = new Date().toLocaleString("es-CL", { timeZone: constants.timeZone.chile })
  const unformatHour = now.split(" ")[1].split(":");
  const hour = unformatHour[0] + unformatHour[1];

  const todaySchedule = schedule.find((day) => day.weekDay === today)?.scheduleRanges || [];

  for await( const range of todaySchedule){
    let startTime = range.startTime.replace(":","");
    let endTime = range.endTime.replace(":","");

    if(hour >= startTime && hour <= endTime){
      isOnSchedule = true;
      break;
    }
  };
  return isOnSchedule;
}; 

module.exports = {
  getAllScheduleDaysWithRange,
  createScheduleDay,
  updatedScheduleDay,
  checkAgentSchedule,
  validateSchedule
};
