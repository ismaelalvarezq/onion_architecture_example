const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


async function getNote(id) {
  return prisma.note.findUnique({
    where: { id },
    include: {
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          type: true,
        },
      },
    },
  })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de la nota.", "[getNote] Bad request");
    });
}

async function getNotes(query) {
  return prisma.note.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las notas.", "[getNotes] Bad request");
    });
}

async function createNote(note) {
  return prisma.note.create({
    data: note,
    include: {
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          type: true,
        },
      },
    },
  })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la creación de la nota.", "[createNote] Error with FK: " + error.meta.field_name);

      } else {
        throw new InternalServerError(error, "Error en la creación de la nota.", "[createNote] Bad request");
      }
    });
}

async function updateNote(note) {
  return prisma.note.update({
    where: { id: note.id },
    data: note,
    include: {
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          type: true,
        },
      },
    },
  })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización de la nota.", "[updateNote] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización de la nota.", "[updateNote] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización de la nota.", "[updateNote] Bad request");
      }
    });
}

async function deleteNote(id) {
  return prisma.note.delete({
    where: { id: id },
    include: {
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          type: true,
        },
      },
    },
  })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la nota.", "[deleteNote] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la nota.", "[deleteNote] Bad request");
      }
    });
}


module.exports = {
  getNote,
  getNotes,
  createNote,
  updateNote,
  deleteNote
}
