const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');
const constants = require('../../constants.js');

async function getCompany(id) {
  return prisma.company.findUnique({ "where": { "id": id } })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de la empresa.", "[getCompany] Bad request");
    });
}

async function getCompanies(query) {
  return prisma.company.findMany(query)
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda de las empresas.", "[getCompanies] Bad request");
    });
}

const createCompany = async (company, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.company.create({ data: company });
};

async function updateCompany(company) {
  return prisma.company.update({ "where": { "id": company.id }, "data": company })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización de la empresa.", "[updateCompany] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización de la empresa.", "[updateCompany] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización de la empresa.", "[updateCompany] Bad request");
      }
    });
}

async function deleteCompany(id) {
  return prisma.company.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación de la empresa.", "[deleteCompany] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación de la empresa.", "[deleteCompany] Bad request");
      }
    });
}

async function createClientImportFile(idChannel, name, key) {
  const clientImportFile = await prisma.client_import_file.create({
    data: {
      name,
      key,
      channel: {
        connect: { id: idChannel },
      },
      clientImportFileStates: {
        create: {
          name: constants.clientImportFile.state.CREATED,
        },
      },
    }
  });
  return clientImportFile;
}

async function clientImportFileUpdateState(clientImportFileId, state) {
  const clientImportFile = await prisma.client_import_file.update({
    where: { id: clientImportFileId },
    data: {
      clientImportFileStates: {
        create: {
          name: state,
        },
      },
    },
  });
  return clientImportFile;
}

async function updateClientImportFile(clientImportFileId, numberValidContacts, numberExistingContacts, numberInvalidContacts, numberDuplicatedContacts) {
  const clientImportFile = await prisma.client_import_file.update({
    where: { id: clientImportFileId },
    data: {
      numberValidContacts,
      numberExistingContacts,
      numberInvalidContacts,
      numberDuplicatedContacts,
    },
  });
  return clientImportFile;
}

async function updateClientImportFileResKey(clientImportFileId, resKey) {
  const clientImportFile = await prisma.client_import_file.update({
    where: { id: clientImportFileId },
    data: {
      resultKey: resKey,
    },
  });
  return clientImportFile;
}

async function getClientImportFiles(filters, orders, pagination) {
  const where = {};
  if (filters.idCompany) {
    where.channel = {
      idCompany: filters.idCompany,
    };
  }
  if (filters.name) {
    where.name = {
      contains: filters.name,
      mode: 'insensitive',
    };
  }
  const orderBy = [];
  for (let order of orders) {
    switch (Object.keys(order)[0]) {
      case 'name':
        orderBy.push(order)
        break;

      case 'createdAt':
        orderBy.push(order)
        break;

      default:
        break;
    }
  }
  const query = {
    orderBy,
    where,
    include: {
      channel: {
        select: {
          name: true,
          type: true,
        },
      },
      clientImportFileStates: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          name: true,
        },
      },
    },
  };
  const files = await prisma.client_import_file.findMany({
    ...pagination,
    ...query,
  });
  const total = await prisma.client_import_file.findMany(query);
  return {
    items: files,
    total_items: total.length,
  };
}

module.exports = {
  getCompany,
  getCompanies,
  createCompany,
  updateCompany,
  createClientImportFile,
  deleteCompany,
  clientImportFileUpdateState,
  getClientImportFiles,
  updateClientImportFile,
  updateClientImportFileResKey,
}
