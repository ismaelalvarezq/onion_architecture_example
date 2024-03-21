const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const { BadRequestError } = require('../../exceptions');
const prisma = new PrismaClient();


const createArea = async (area, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.area.create({ data: area });
};

const getArea = async (id) => {
  return await prisma.area.findUnique({ where: { id } });
};

const getAreas = async (filters, orders) => {
  const where = {};
  
  if (filters.idCompany) {
    where.idCompany = filters.idCompany;
  }

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }

  const orderBy = [];

  for (let order of orders) {
    switch (Object.keys(order)[0]) {
      case 'name':
        orderBy.push(order)
        break;
      
      case 'id':
        orderBy.push(order)
        break;

      case 'idCompany':
        orderBy.push(order)
        break;
    
      default:
        break;
    }
  }

  return await prisma.area.findMany({ where, orderBy });
};

const updateArea = async (id, data) => {
  return await prisma.area.update({ where: { id }, data });
};

const deleteArea = async (id) => {
  try {
    return await prisma.area.delete({ where: { id } });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2003' && error.meta.field_name === 'areas_on_agents_areaId_fkey (index)') {
        throw new BadRequestError(null, "No se pueden eliminar areas asociadas a un agente.");
      }
    }
    throw error;
  }
};

module.exports = {
  createArea,
  getArea,
  getAreas,
  updateArea,
  deleteArea,
}
