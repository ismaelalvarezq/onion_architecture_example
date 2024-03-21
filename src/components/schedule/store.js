const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getSchedule(id) {
  return prisma.schedule.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del horario.", "[getSchedule] Bad request");
    });
}

async function getSchedules(query) {
  return prisma.schedule.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los horarios.", "[getSchedules] Bad request");
    });
}

async function createSchedule(schedule) {
  return prisma.schedule.create({ "data": schedule })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación del horario.", "[createSchedule] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación del horario.", "[createSchedule] Bad request");
      }
    });
}

async function updateSchedule(schedule) {
  return prisma.schedule.update({ "where": { "id": schedule.id }, "data": schedule })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del horario.", "[updateSchedule] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del horario.", "[updateSchedule] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del horario.", "[updateSchedule] Bad request");
      }
    });
}

async function deleteSchedule(id) {
  return prisma.schedule.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del horario.", "[deleteSchedule] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del horario.", "[deleteSchedule] Bad request");
      }
    });
}


module.exports = {
  getSchedule,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
}
