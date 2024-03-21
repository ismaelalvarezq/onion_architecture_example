const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


function getBlock(id) {
  return prisma.blocking_history.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del historial de bloqueo.", "[getBlock] Bad request");
    });
}

function getBlocks(query) {
  return prisma.blocking_history.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los historiales de bloqueo.", "[getBlocks] Bad request");
    });
}

function createBlock(block) {
  return prisma.blocking_history.create({ "data": block })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación del bloqueo.", "[createBlock] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación del bloqueo.", "[createBlock] Bad request");
      }
    });
}

function updateBlock(block) {
  return prisma.blocking_history.update({ "where": { "id": block.id }, "data": block })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del bloqueo.", "[updateBlock] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del bloqueo.", "[updateBlock] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del bloqueo.", "[updateBlock] Bad request");
      }
    });
}

function deleteBlock(id) {
  return prisma.blocking_history.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del bloqueo.", "[deleteBlock] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del bloqueo.", "[deleteBlock] Bad request");
      }
    });
}


module.exports = {
  getBlock,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock
}
