const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getTheme(id) {
  return prisma.webchat_theme.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del tema.", "[getTheme] Bad request");
    });
}

async function getThemes(query) {
  return prisma.webchat_theme.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los temas.", "[getThemes] Bad request");
    });
}

async function createTheme(theme) {
  return prisma.webchat_theme.create({ "data": theme })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación del tema.", "[createTheme] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación del tema.", "[createTheme] Bad request");
      }
    });
}

async function updateTheme(theme) {
  return prisma.webchat_theme.update({ "where": { "id": theme.id }, "data": theme })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del tema.", "[updateTheme] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del tema.", "[updateTheme] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del tema.", "[updateTheme] Bad request");
      }
    });
}

async function deleteTheme(id) {
  return prisma.webchat_theme.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del tema.", "[deleteTheme] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del tema.", "[deleteTheme] Bad request");
      }
    });
}


module.exports = {
  getTheme,
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme
}
