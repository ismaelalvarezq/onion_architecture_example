const { PrismaClient } = require("@prisma/client");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime");
const { BadRequestError } = require("../../exceptions");
const constants = require("../../constants");
const { formatTime } = require("../../utils/timeUtils.js");
const prisma = new PrismaClient();

const getAllScheduleDaysWithRanges = async (idAgent) => {
  const scheduleDays = await prisma.schedule_day.findMany({
    where: { idAgent },
    orderBy: { weekDay: "asc" },
    select: { id: true, weekDay: true, isActive: true, scheduleRanges: {
      orderBy: { startTime: "asc" }
    } },
  });

  return {
    idAgent,
    scheduleDays: scheduleDays.map((scheduleDay) => {
      const { id, weekDay, isActive, scheduleRanges } = scheduleDay;
      return {
        id,
        weekDay,
        isActive,
        scheduleRanges: scheduleRanges.map((range) => {
          const { id, startTime, endTime } = range;
          return {
            id,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime)
          };
        }),
      };
    }),
  };
};

const deleteScheduleRanges = async (scheduleDayId) => {
  try {
    await prisma.schedule_range.deleteMany({
      where: { idScheduleDay: scheduleDayId },
    });
  } catch (error) {
    throw new Error(`Error al eliminar los rangos de horario: ${error.message}`);
  }
};

const createScheduleRanges = async (scheduleRanges, scheduleDayId) => {
  try {

    if (scheduleRanges.length > 3) {
      throw new BadRequestError(
        null,
        `No se puede crear más de 3 rangos de horarios por día.`
      );
    }

    const newScheduleRanges = await Promise.all(
      scheduleRanges.map(async (range) => {
        const startTime = new Date(`1970-01-01T${range.startTime}`);
        const endTime = new Date(`1970-01-01T${range.endTime}`);

        const newScheduleRange = await prisma.schedule_range.create({
          data: {
            startTime,
            endTime,
            scheduleDay: {
              connect: { id: scheduleDayId },
            },
          },
        });

        return {
          ...newScheduleRange,
          startTime: formatTime(newScheduleRange.startTime),
          endTime: formatTime(newScheduleRange.endTime),
        };
      })
    );

    return newScheduleRanges;
  } catch (error) {
    throw error;
  }
};

// Para crear nuevos días y rangos de horarios
const createScheduleDays = async (idAgent, scheduleDays) => {
  try {
    const scheduleDayOperations = await Promise.all(
      scheduleDays.map(async (scheduleDay) => {
        const { weekDay, isActive, scheduleRanges } = scheduleDay;

        const existingScheduleDay = await prisma.schedule_day.findUnique({
          where: {
            idAgent_weekDay: {
              idAgent,
              weekDay,
            },
          },
        });

        if (existingScheduleDay) {
          throw new BadRequestError(
            null,
            `Ya existe registro del día ${weekDay} para el agente`
          );
        }

        const newScheduleDay = await prisma.schedule_day.create({
          data: {
            idAgent,
            weekDay,
            isActive,
          },
          select: {
            id: true,
            isActive: true,
            weekDay: true,
          },
        });

        const newScheduleRanges = await createScheduleRanges(scheduleRanges, newScheduleDay.id);

        return {
          ...newScheduleDay,
          scheduleRanges: newScheduleRanges,
        };
      })
    );

    return {
      idAgent,
      scheduleDays: scheduleDayOperations,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new BadRequestError(null, "Ya existe un registro con el mismo id.");
      }
    }
    throw error;
  }
};

// Para actualizar los días y rangos de horarios existentes
const updateScheduleDays = async (idAgent, scheduleDays) => {
  try {
    const scheduleDayOperations = await Promise.all(
      scheduleDays.map(async (scheduleDay) => {
        const { id, weekDay, isActive, scheduleRanges } = scheduleDay;

        await deleteScheduleRanges(id);

        const updatedScheduleDay = await prisma.schedule_day.update({
          where: { id },
          data: {
            idAgent,
            weekDay,
            isActive,
          },
          select: {
            id: true,
            isActive: true,
            weekDay: true,
          },
        });

        const newScheduleRanges = await createScheduleRanges(scheduleRanges, updatedScheduleDay.id);

        return {
          ...updatedScheduleDay,
          scheduleRanges: newScheduleRanges,
        };
      })
    );

    return {
      idAgent,
      scheduleDays: scheduleDayOperations,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new BadRequestError(null, "Ya existe un registro con el mismo id.");
      }
    }
    throw error;
  }
};

module.exports = {
  getAllScheduleDaysWithRanges,
  createScheduleDays,
  updateScheduleDays,
};
