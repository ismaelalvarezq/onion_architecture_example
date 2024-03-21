const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getEnvVar(id) {
  return prisma.env_var.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de la variable de entorno.", "[getEnvVar] Bad request");
    });
}

async function getEnvVars(query) {
  return prisma.env_var.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las variables de entorno.", "[getEnvVars] Bad request");
    });
}

async function createEnvVar(envVar) {
  return prisma.env_var.create({ "data": envVar })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación de la variable de entorno.", "[createEnvVar] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación de la variable de entorno.", "[createEnvVar] Bad request");
      }
    });
}

async function updateEnvVar(envVar) {
  return prisma.env_var.update({ "where": { "id": envVar.id }, "data": envVar })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización de la variable de entorno.", "[updateEnvVar] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización de la variable de entorno.", "[updateEnvVar] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización de la variable de entorno.", "[updateEnvVar] Bad request");
      }
    });
}

async function deleteEnvVar(id) {
  return prisma.env_var.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la variable de entorno.", "[deleteEnvVar] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la variable de entorno.", "[deleteEnvVar] Bad request");
      }
    });
}

async function getEnvVarByToken(query) {
  return prisma.env_var.findFirst(query);
}


module.exports = {
  getEnvVar,
  getEnvVars,
  createEnvVar,
  updateEnvVar,
  deleteEnvVar,

  getEnvVarByToken
}
