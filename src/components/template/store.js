const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/index.js');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


function getTemplate(query) {
  return prisma.template.findUnique(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del template.", "[getTemplate] Bad request");
    });
}

async function getTemplates(query) {
  const templates = await prisma.template.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de los templates.", "[getTemplates] Bad request");
    });

  delete query["skip"]; delete query["take"]; delete query["include"];
  query["_count"] = { "id": true };
  const totalTemplates = (await prisma.template.aggregate(query))._count.id;

  return { items: templates, total_items: totalTemplates };
}

async function createTemplate(template) {
  try {
    return await prisma.template.create({ "data": template });
  } catch (error) {
    if ((error instanceof PrismaClientKnownRequestError)) {
      if (error.code == "P2002" && error.meta?.target?.includes('title')) {
        throw new BadRequestError(error, "El nombre de la plantilla ya está en uso.");
      }
    }
    throw new InternalServerError(error, "Ha ocurrido un error al crear la plantilla.");
  }
}

async function updateTemplate(template) {
  try {
    return await prisma.template.update({ "where": { "id": template.id }, "data": template });
  } catch (error) {
    if ((error instanceof PrismaClientKnownRequestError)) {
      if (error.code == "P2002" && error.meta?.target?.includes('title')) {
        throw new BadRequestError(error, "El nombre de la plantilla ya está en uso.");
      }
    }
    throw new InternalServerError(error, "Ha ocurrido un error al editar la plantilla.");
  }
}

function deleteTemplate(id) {
  return prisma.template.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del template.", "[deleteTemplate] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del template.", "[deleteTemplate] Bad request");
      }
    });
}


module.exports = {
  getTemplate,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
}
