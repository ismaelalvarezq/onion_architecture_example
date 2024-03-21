const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getChannel(id) {
  return prisma.channel.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del canal.", "[getChannel] Bad request");
    });
}

async function getChannels(query) {
  return prisma.channel.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los canales.", "[getChannels] Bad request");
    });
}

const createChannel = async (channel, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.channel.create({ data: channel });
};

async function updateChannel(channel) {
  return prisma.channel.update({ "where": { "id": channel.id }, "data": channel })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del canal.", "[updateChannel] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del canal.", "[updateChannel] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del canal.", "[updateChannel] Bad request");
      }
    });
}

async function deleteChannel(id) {
  return prisma.channel.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del canal.", "[deleteChannel] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del canal.", "[deleteChannel] Bad request");
      }
    });
}

module.exports = {
  getChannel,
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
}
