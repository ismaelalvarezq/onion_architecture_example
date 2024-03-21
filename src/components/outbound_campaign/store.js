const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const { BadRequestError, NotFoundError } = require('../../exceptions');
const { getCampaignStatistics } = require('../history_campaign/resolver');
const constants = require('../../constants');
const prisma = new PrismaClient();


const createOutboundCampaign = async (outboundCampaign, clients) => {
  return await prisma.outbound_campaign.create({
    data: {
      ...outboundCampaign,
      startDate: outboundCampaign.startDate ? new Date(outboundCampaign.startDate) : null,
      endDate: outboundCampaign.endDate ? new Date(outboundCampaign.endDate) : null,
      clients: {
        create: clients.map((client) => ({
          customVariables: client.customVariables,
          client: {
            connect: {
              id: client.id,
            },
          },
        })),
      },
    },
    include: {
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
};

const getOutboundCampaign = async (id) => {
  const outboundCampaign = await prisma.outbound_campaign.findUnique({
    where: { id },
    include: {
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  if (outboundCampaign?.clients) {
    outboundCampaign.idCompany = outboundCampaign.clients[0]?.client.idCompany;
  }
  return outboundCampaign;
};

const getOutboundCampaigns = async (filters, orders, pagination) => {
  const where = {};

  if (filters.idCampaign) {
    where.id = filters.idCampaign;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.idCompany && filters.idClient) {
    where.clients = {
      some: {
        AND: {
          client: {
            id: filters.idClient,
            channel: {
              idCompany: filters.idCompany,
            },
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
          },
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
    where.name = { contains: filters.name, mode: 'insensitive' };
  }

  if (filters.idNode) {
    where.idNode = filters.idNode;
  }

  if (filters.startDate) {
    where.startDate = new Date(filters.startDate);
  }

  if (filters.endDate) {
    where.endDate = new Date(filters.endDate);
  }

  if (filters.active == 'true') {
    where.startDate = { lte: new Date() };
    where.endDate = { gte: new Date() };
    where.status = {
      in: [
        constants.outboundCampaign.statuses.SENT,
        constants.outboundCampaign.statuses.REVIEWING,
      ],
    };
  } else if (filters.active == 'false') {
    if (where.status) {
      delete where.status;
    }
    where.OR = [
      {
        OR: [
          { startDate: { gt: new Date() } },
          { endDate: { lt: new Date() } },
        ]
      },
      {
        status: {
          notIn: [
            constants.outboundCampaign.statuses.SENT,
            constants.outboundCampaign.statuses.REVIEWING,
          ],
        },
      }
    ];
  }

  if (filters.dateRangeStart && filters.dateRangeEnd) {
    where.AND = [
      { startDate: { gte: new Date(filters.dateRangeStart) } },
      { startDate: { lte: new Date(filters.dateRangeEnd) } },
    ];
  }

  const orderBy = [];

  for (let order of orders) {
    switch (Object.keys(order)[0]) {
      case 'idNode':
        orderBy.push(order)
        break;

      case 'name':
        orderBy.push(order)
        break;

      case 'startDate':
        orderBy.push(order)
        break;

      case 'endDate':
        orderBy.push(order)
        break;

      default:
        break;
    }
  }

  const outboundCampaigns = await prisma.outbound_campaign.findMany({
    where,
    ...pagination,
    orderBy,
    include: { clients: true },
  });

  if (!pagination) return outboundCampaigns;
  const total = await prisma.outbound_campaign.findMany({
    where,
    orderBy,
    include: { clients: true },
  });

  return {
    items: outboundCampaigns,
    total_items: total.length,
  };
};

const updateOutboundCampaign = async (id, data) => {
  return await prisma.outbound_campaign.update({ where: { id }, data });
};

async function getClientsOfCampaign(idCampaign) {
  const query = {
    where: {
      outboundCampaigns: {
        some: { outboundCampaign: { id: idCampaign } },
      },
    },
    include: {
      outboundCampaigns: {
        select: {
          customVariables: true,
        },
        where: {
          outboundCampaign: { id: idCampaign },
        },
      },
    },
  };

  return await prisma.client.findMany(query);
}

async function getAndStoreStatistics(idCampaign) {
  const campaign = await prisma.outbound_campaign.findUnique({
    where: { id: idCampaign },
  });
  if (!campaign) throw new NotFoundError(null, "No se encontró la campaña.");
  const statistics = await getCampaignStatistics({ idOutboundCampaign: idCampaign }, { statsType: 'resumed' });
  const { sent, delivered, read, answered, firstResponse } = statistics;
  const { date, averageSeconds } = firstResponse;
  await prisma.outbound_campaign.update({
    where: { id: idCampaign },
    data: { sent, delivered, read, answered, firstResponseDate: date, firstResponseSeconds: Math.floor(averageSeconds) },
  });
}

async function getOutboundCampaignStatistics(filters) {
  const { idCampaign, idCompany, dateRangeStart, dateRangeEnd } = filters;
  const where = {};
  if (idCampaign) {
    where.id = idCampaign;
  }
  if (idCompany) {
    where.clients = {
      some: {
        client: {
          channel: {
            idCompany: filters.idCompany,
          },
        },
      },
    };
  }
  if (dateRangeStart && dateRangeEnd) {
    where.AND = [
      { startDate: { gte: new Date(dateRangeStart) } },
      { startDate: { lte: new Date(dateRangeEnd) } },
    ];
  }
  let campaigns = await prisma.outbound_campaign.findMany({
    where,
    include: { clients: true },
  });
  campaigns = await Promise.all(campaigns.map(async (c) => {
    let details = [];
    if (c.firstResponseDate) {
      // TODO: store statistics on cron
      details = await getCampaignStatistics({ idOutboundCampaign: c.id }, { statsType: 'client' });
    }
    return { ...c, clients: c.clients.length, details };
  }));
  const campaignsResponded = campaigns.filter((c) => c.firstResponseSeconds);
  let averageFirstResponseSeconds = 0;
  let responsesByDate = [];
  if (campaignsResponded.length > 0) {
    averageFirstResponseSeconds = (campaignsResponded.map((c) => c.firstResponseSeconds)).reduce((a, b) => a + b, 0) / campaignsResponded.length;
    averageFirstResponseSeconds = Math.round(averageFirstResponseSeconds);
    campaignsResponded.forEach((c) => {
      c.details?.forEach((d) => {
        const key = d.statistics?.firstResponse?.date?.split('T')[0];
        if (key) {
          if (responsesByDate[key]) {
            responsesByDate[key] += 1;
          } else {
            responsesByDate[key] = 1;
          }
        }
      });
    });
    responsesByDate = Object.entries(responsesByDate).map(([date, responses]) => ({ date, responses }));
    responsesByDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return {
    total: campaigns.map((c) => c.clients || 0).reduce((a, b) => a + b, 0),
    sent: campaigns.map((c) => c.sent || 0).reduce((a, b) => a + b, 0),
    delivered: campaigns.map((c) => c.delivered || 0).reduce((a, b) => a + b, 0),
    read: campaigns.map((c) => c.read || 0).reduce((a, b) => a + b, 0),
    answered: campaigns.map((c) => c.answered || 0).reduce((a, b) => a + b, 0),
    averageFirstResponseSeconds,
    responsesByDate,
  };
}

module.exports = {
  createOutboundCampaign,
  getOutboundCampaign,
  getOutboundCampaigns,
  updateOutboundCampaign,
  getClientsOfCampaign,
  getAndStoreStatistics,
  getOutboundCampaignStatistics,
}
