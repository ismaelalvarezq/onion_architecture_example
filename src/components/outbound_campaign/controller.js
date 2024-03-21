const response = require("../../network/response.js");
const catchAsync = require("../../utils/catchAsync.js");
const { validator } = require("../../helper/validator/index.js");
const outboundCampaignStore = require("./store.js");
const {
  outboundCampaignSchema,
  outboundCampaignClientsSchema,
} = require("../../helper/validator/schemas/outboundCampaign.js");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../../exceptions.js");
const constants = require("../../constants.js");
const { formatRequest } = require("../../utils/formatRequest.js");
const { getClient } = require("../client/store.js");
const XLSX = require("xlsx");
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { getChannel } = require("../channel/store.js");
const fsPromises = fs.promises;

const createOutboundCampaign = catchAsync(async (req, res, next) => {
  const { file } = req;
  let { clients, ...outboundCampaign } = req.body;
  validator(outboundCampaignSchema, outboundCampaign, "Post");
  if (file) {
    const workbook = XLSX.readFile(file.path, { codepage: 65001 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    const [header] = XLSX.utils.sheet_to_json(sheet, { range: "A1:A1", header: 1 });
    const requiredColumns = [
      "phone",
    ];
    if (!requiredColumns.every((col) => header.includes(col)) || header.length !== requiredColumns.length) {
      throw new BadRequestError(null, `Las columnas que se aceptan son: ${requiredColumns.join(", ")}`);
    }
    clients = data.map((row) => {
      const { phone, ...customVariables } = row;
      return { phone, customVariables };
    });
    for (const client of clients) {
      const foundClient = await getClient({
        where: {
          idChannel_userIdChannel: {
            userIdChannel: String(client.phone),
            idChannel: outboundCampaign.templateIdChannel,
          },
        }
      });
      if (!foundClient) throw new BadRequestError(null, `El cliente con el teléfono ${client.phone} no existe.`);
      client.id = foundClient.id;
      delete client.phone;
    }
  } else {
    const newClients = [];
    for (let client of clients) {
      const foundClient = await getClient({
        where: {
          id: client,
        }
      });
      if (!foundClient) throw new BadRequestError(null, `El cliente con el teléfono ${client} no existe.`);
      if (foundClient.idChannel !== outboundCampaign.templateIdChannel) throw new BadRequestError(null, `El cliente con id ${client} no pertenece al canal seleccionado.`);
      newClients.push({ id: foundClient.id, customVariables: {} });
    }
    clients = newClients;
  }
  delete outboundCampaign.templateIdChannel;
  validator(outboundCampaignClientsSchema, clients, "Post");
  const idCompanies = new Set();
  const idChannels = new Set();
  for (let clientObject of clients) {
    const client = await getClient({
      where: {
        id: clientObject.id,
      }
    });
    if (
      [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
        req.ctx.user.type
      ) &&
      client.idCompany !== req.ctx.user.idCompany
    )
      throw new ForbiddenError(
        null,
        "No puedes crear campañas con clientes de otras compañias."
      );
    idCompanies.add(client.idCompany);
    idChannels.add(client.idChannel);
  }
  if (idCompanies.size > 1)
    throw new BadRequestError(
      null,
      "Existen clientes de diferentes compañías."
    );
  if (idChannels.size > 1)
    throw new BadRequestError(
      null,
      "Existen clientes de diferentes canales."
    );
  const channel = await getChannel(idChannels.values().next().value);
  if (!channel) throw new BadRequestError(null, "El canal no existe.");
  if (channel.type !== constants.channel.type.WHATSAPP) throw new BadRequestError(null, "El canal debe ser de tipo WhatsApp.");
  const newOutboundCampaign =
    await outboundCampaignStore.createOutboundCampaign(
      outboundCampaign,
      clients,
    );
  response.success(req, res, newOutboundCampaign, "response", 201);
});

const getOutboundCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError(null, "No se envio el id de la campaña.");
  const outboundCampaign = await outboundCampaignStore.getOutboundCampaign(id);
  if (!outboundCampaign)
    throw new NotFoundError(null, "No se encontro la campaña.");
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    ) &&
    outboundCampaign.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se puede obtener una campaña de otra compañía."
    );
  }
  response.success(req, res, outboundCampaign, "response", 200);
});

const getOutboundCampaigns = catchAsync(async (req, res, next) => {
  const { filters, orders, pagination } = formatRequest(req);

  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    )
  ) {
    filters.idCompany = req.ctx.user.idCompany;
  }

  const outboundCampaigns = await outboundCampaignStore.getOutboundCampaigns(
    filters,
    orders,
    pagination,
  );
  response.success(req, res, outboundCampaigns, "response", 200);
});

const updateOutboundCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const outboundCampaignData = req.body;
  outboundCampaignData.id = id;

  validator(outboundCampaignSchema, outboundCampaignData, "Patch");

  const outboundCampaign = await outboundCampaignStore.getOutboundCampaign(id);
  if (!outboundCampaign)
    throw new NotFoundError(null, "No se encontro la campaña.");
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    ) &&
    outboundCampaign.idCompany !== req.ctx.user.idCompany &&
    outboundCampaignData.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden editar campañas de otra compañía."
    );
  }

  delete outboundCampaignData.id;
  const updatedOutboundCampaign = await outboundCampaignStore.updateOutboundCampaign(
    id,
    outboundCampaignData
  );

  response.success(req, res, updatedOutboundCampaign, "response", 200);
});

const deleteOutboundCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError(null, "No se envio el id de la campaña.");

  const outboundCampaign = await outboundCampaignStore.getOutboundCampaign(id);
  if (!outboundCampaign)
    throw new NotFoundError(null, "No se encontro la campaña.");
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    ) &&
    outboundCampaign.idCompany !== req.ctx.user.idCompany
  ) {
    throw new ForbiddenError(
      null,
      "No se pueden eliminar campañas de otra compañía."
    );
  }

  const deletedOutboundCampaign =
    await outboundCampaignStore.deleteOutboundCampaign(id);

  response.success(req, res, deletedOutboundCampaign, "response", 200);
});

const getClientsOfCampaign = catchAsync(async (req, res, next) => {
  if (!req.params.idCampaign) {
    throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getClientsOfCampaign] Missing 'idCampaign'");
  }

  const clients = await outboundCampaignStore.getClientsOfCampaign(req.params.idCampaign);

  response.success(req, res, clients, "response", 200);
});

const getOutboundCampaignStatistics = catchAsync(async (req, res, next) => {
  const { filters } = formatRequest(req);
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    )
  ) {
    filters.idCompany = req.ctx.user.idCompany;
  }
  const statistics = await outboundCampaignStore.getOutboundCampaignStatistics(filters);
  response.success(req, res, statistics, "response", 200);
});

const getOutboundCampaignStatisticsReport = catchAsync(async (req, res, next) => {
  const { filters, orders } = formatRequest(req);
  if (
    [constants.agents.types.ADMIN, constants.agents.types.AGENT].includes(
      req.ctx.user.type
    )
  ) {
    filters.idCompany = req.ctx.user.idCompany;
  }
  const statistics = await outboundCampaignStore.getOutboundCampaignStatistics(filters);
  const { responsesByDate, ...otherStatistics } = statistics;
  const campaigns = await outboundCampaignStore.getOutboundCampaigns(filters, orders);

  const workbook = XLSX.utils.book_new();

  const otherStatisticsMap = {
    total: "Total de clientes",
    sent: "Total de mensajes enviados",
    delivered: "Total de mensajes recibidos",
    read: "Total de mensajes leídos",
    answered: "Total de mensajes contestados",
    averageFirstResponseSeconds: "Promedio de tiempo de primera respuesta (segundos)",
  };
  const statisticsSheet = XLSX.utils.aoa_to_sheet(Object.entries(otherStatistics).map(([key, value]) => ([otherStatisticsMap[key], value])));
  statisticsSheet["!cols"] = [{ width: 50 }, { width: 15 }];
  XLSX.utils.book_append_sheet(workbook, statisticsSheet, "Estadísticas");

  const responsesByDateMap = {
    date: "Fecha",
    responses: "Respuestas",
  };
  const responsesSheet = XLSX.utils.json_to_sheet(responsesByDate.map((row) => ({ [responsesByDateMap.date]: row.date, [responsesByDateMap.responses]: row.responses })));
  responsesSheet["!cols"] = [{ width: 15 }, { width: 15 }];
  XLSX.utils.book_append_sheet(workbook, responsesSheet, "Respuestas por día");

  const campaignsSheet = XLSX.utils.json_to_sheet(campaigns.map((c) => ({
    id: c.id,
    ["Nombre"]: c.name,
    ["Fecha de inicio"]: c.startDate,
    ["Fecha de fin"]: c.endDate,
    ["Total de clientes"]: c.clients.length,
    ["Enviados"]: c.sent,
    ["Recibidos"]: c.delivered,
    ["Leídos"]: c.read,
    ["Contestados"]: c.answered,
    ["Fecha de primera respuesta"]: c.firstResponseDate,
    ["Tiempo de primera respuesta (segundos)"]: c.firstResponseSeconds,
    ["Estado"]: c.status,
  })));
  campaignsSheet["!cols"] = [
    { width: 30 },
    { width: 15 },
    { width: 10 },
    { width: 10 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];
  XLSX.utils.book_append_sheet(workbook, campaignsSheet, "Campañas");

  const pathtemp = path.resolve('temp', `${crypto.randomUUID()}`);
  const dirtemp = path.resolve('temp');
  await fsPromises.mkdir(dirtemp, { recursive: true });
  await fsPromises.writeFile(pathtemp, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  res.download(pathtemp, 'StatisticsReport.xlsx', async (err) => {
    await fsPromises.unlink(pathtemp);
  });
});

const cancelOutboundCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const outboundCampaign = await outboundCampaignStore.getOutboundCampaign(id);
  if (!outboundCampaign) throw new NotFoundError(null, "No se encontro la campaña.");
  if (outboundCampaign.status !== constants.outboundCampaign.statuses.REVIEWING) {
    throw new BadRequestError(null, "La campaña no se puede cancelar en el estado actual")
  }
  // compare if startDate is less than now plus 5 minutes
  const startDate = new Date(outboundCampaign.startDate);
  if (startDate < new Date(Date.now() + 5 * 60 * 1000)) {
    throw new BadRequestError(null, "La campaña no se puede cancelar si ya comenzó o faltan menos de 5 minutos para su inicio");
  }
  await outboundCampaignStore.updateOutboundCampaign(id, {
    status: constants.outboundCampaign.statuses.CANCELLED,
  });
  response.success(req, res, null, "response", 204);
});

const downloadOutboundCampaignFormat = catchAsync(async (req, res, next) => {
  const wb = XLSX.utils.book_new();
  const requiredColumns = [
    "phone",
  ];
  const ws = XLSX.utils.aoa_to_sheet([requiredColumns]);
  XLSX.utils.book_append_sheet(wb, ws, "Formato");
  const pathtemp = path.resolve('temp', `${crypto.randomUUID()}`);
  const dirtemp = path.resolve('temp');
  await fsPromises.mkdir(dirtemp, { recursive: true });
  await fsPromises.writeFile(pathtemp, XLSX.write(wb, { type: 'buffer', bookType: 'csv' }));
  res.download(pathtemp, 'formato-carga-campañas.csv', async (err) => {
    await fsPromises.unlink(pathtemp);
  });
});

module.exports = {
  createOutboundCampaign,
  getOutboundCampaign,
  getOutboundCampaigns,
  updateOutboundCampaign,
  deleteOutboundCampaign,
  getClientsOfCampaign,
  getOutboundCampaignStatistics,
  getOutboundCampaignStatisticsReport,
  cancelOutboundCampaign,
  downloadOutboundCampaignFormat,
};
