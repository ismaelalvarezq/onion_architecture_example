const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/index.js');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');


function getCategory(id) {
  return prisma.category.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de la categoría.", "[getCategory] Bad request");
    });
}

function getCategories(query) {
  return prisma.category.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las categorías.", "[getCategories] Bad request");
    });
}

async function createCategory(category) {
  try {
    return await prisma.category.create({ "data": category });
  } catch (error) {
    if ((error instanceof PrismaClientKnownRequestError)) {
      if (error.code == "P2002" && error.meta?.target?.includes('name')) {
        throw new BadRequestError(error, "El nombre de la categoría de plantilla ya está en uso.");
      }
    }
    throw new InternalServerError(error, "Ha ocurrido un error al crear la categoría de plantilla.");
  }
}

const createManyTemplateCategories = async (templateCategories, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  const createdCategories = await prismaClient.category.createMany({
    data: templateCategories,
  });
  return createdCategories;
};

async function updateCategory(category) {
  try {
    return await prisma.category.update({ "where": { "id": category.id }, "data": category });
  } catch (error) {
    if ((error instanceof PrismaClientKnownRequestError)) {
      if (error.code == "P2002" && error.meta?.target?.includes('name')) {
        throw new BadRequestError(error, "El nombre de la categoría de plantilla ya está en uso.");
      }
    }
    throw new InternalServerError(error, "Ha ocurrido un error al editar la categoría de plantilla.");
  }
}

function deleteCategory(id) {
  return prisma.category.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la categoría.", "[deleteCategory] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la categoría.", "[deleteCategory] Bad request");
      }
    });
}


async function checkDependencies(id) {
  try {
    const dependencies = await prisma.category.findUnique({ where: { id: id } });
    if (dependencies != null) {
      const countDependenciesCategory = await prisma.template.groupBy({
        by: 'idCategory',
        where: { idCategory: id },
        _count: { idCategory: true },
      });
      if (countDependenciesCategory.length == 0) {
        return { countCategory: 0, category: dependencies };
      }
      return {countCategory: countDependenciesCategory[0]._count.idCategory, category: dependencies};
    }
    return { count: { idCategory: 0 }, idCategory: null };
  } catch (error) {
    return { "catchError": true, ...error };
  }
}


module.exports = {
  getCategory,
  getCategories,
  createCategory,
  createManyTemplateCategories,
  updateCategory,
  deleteCategory,
  checkDependencies,
}
