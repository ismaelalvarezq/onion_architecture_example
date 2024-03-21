const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getList = async (id) => {
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      clients: {
        include: {
          client: {
            include: {
              channel: true,
            },
          },
        },
      },
    },
  });
  list.channel = list.clients[0].client.channel;
  return list;
};

const getLists = async (filters, orders) => {
  const where = {};

  if (filters.idCompany && filters.idClient && filters.idChannel) {
    where.clients = {
      some: {
        AND: {
          client: {
            id: filters.idClient,
            channel: {
              id: filters.idChannel,
              idCompany: filters.idCompany,
            }
          },
        },
      },
    };
  } else if (filters.idCompany && filters.idClient) {
    where.clients = {
      some: {
        AND: {
          client: {
            id: filters.idClient,
            channel: {
              idCompany: filters.idCompany,
            }
          },
        },
      },
    };
  } else if (filters.idCompany && filters.idChannel) {
    where.clients = {
      some: {
        AND: {
          client: {
            channel: {
              id: filters.idChannel,
              idCompany: filters.idCompany,
            }
          },
        },
      },
    };
  } else if (filters.idClient && filters.idChannel) {
    where.clients = {
      some: {
        AND: {
          client: {
            id: filters.idClient,
            channel: {
              id: filters.idChannel,
            }
          },
        },
      },
    };
  } else if (filters.idCompany) {
    where.clients = {
      some: {
        client: {
          channel: {
            idCompany: filters.idCompany,
          }
        },
      },
    };
  } else if (filters.idChannel) {
    where.clients = {
      some: {
        client: {
          channel: {
            id: filters.idChannel,
          }
        },
      },
    };
  } else if (filters.idClient) {
    where.clients = {
      some: {
        client: {
          id: filters.idClient,
        },
      },
    };
  }

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  if (filters.createdAt) {
    where.createdAt = new Date(filters.createdAt);
  }

  if (filters.updatedAt) {
    where.updatedAt = new Date(filters.updatedAt);
  }

  const orderBy = [];

  for (let order of orders) {
    switch (Object.keys(order)[0]) {
      case "name":
        orderBy.push(order);
        break;

      case "updatedAt":
        orderBy.push(order);
        break;

      case "updatedAt":
        orderBy.push(order);
        break;

      default:
        break;
    }
  }

  const lists = await prisma.list.findMany({
    where,
    orderBy,
    include: {
      clients: {
        include: {
          client: {
            include: {
              channel: true,
            },
          },
        },
      },
    },
  });
  return lists.map((list) => ({
    ...list,
    channel: list.clients[0].client.channel,
  }));
};

const createList = async (listData, transaction) => {
  listData.clients = {
    create: listData.clients.map((idClient) => ({
      client: { connect: { id: idClient } },
    })),
  };

  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.list.create({
    data: listData,
    include: {
      clients: {
        include: { client: true },
      },
    },
  });
};

const updateList = async (listData) => {
  listData.clients = {
    deleteMany: { idList: listData.id },
    create: listData.clients.map((idClient) => ({
      client: { connect: { id: idClient } },
    })),
  };

  return await prisma.list.update({
    where: { id: listData.id },
    data: listData,
    include: {
      clients: {
        include: { client: true },
      },
    },
  });
};

const deleteList = async (id) => {
  try {
    return await prisma.list.delete({ where: { id } });
  } catch (error) {
    throw error;
  }
};

const getClientsOnList = async (idList) => {
  return await prisma.client.findMany({
    where: {
      lists: {
        some: {
          list: {
            id: idList,
          },
        },
      },
    },
  });
};

module.exports = {
  createList,
  getList,
  getLists,
  updateList,
  deleteList,
  getClientsOnList,
};
