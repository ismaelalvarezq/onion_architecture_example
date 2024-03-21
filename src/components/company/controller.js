const store = require('./store.js');
const validatorSchema = require('../../validator.js');

const response = require('../../network/response.js');
const { BadRequestError, ForbiddenError, ValidationError } = require('../../exceptions.js');
const catchAsync = require('../../utils/catchAsync.js');
const constants = require('../../constants.js');
const XLSX = require("xlsx");
const fs = require('fs');
const { storeFileS3, generateSignedUrl } = require('../../helper/filesS3');
const fsPromises = fs.promises;
const { validator } = require('../../helper/validator/index.js');
const { schemaCompany } = require('../../helper/validator/schemas/company.js');
const { schemaClient } = require('../../helper/validator/schemas/clientImportFile.js');
const { getClients, createManyClientsAssignedToBot } = require('../client/store.js');
const { randomAvatarColor } = require('../../utils/randomAvatarColor.js');
const { getChannel } = require('../channel/store.js');
const { capitalize } = require('../../utils/capitalize.js');
const path = require('path');
const crypto = require('crypto');
const { formatRequest } = require('../../utils/formatRequest.js');

const currentComponent = "company";

const getCompany = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[getCompany] Missing params");

  const company = await store.getCompany(req.params.id);
  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type) && company.id !== req.ctx.user.idCompany) {
    throw new ForbiddenError(null, "No se pueden obtener otras compañías.", "[getCompany] forbidden error");
  }
  response.success(req, res, company, "response", 200);
});

const getCompanies = catchAsync(async (req, res, next) => {
  var filterItems = {};
  var orderBy = [];
  var query = {};

  if (Object.keys(req.query).length !== 0) {
    Object.keys(req.query).map((key) => {
      if (key != "offset" && key != "limit" && key != "orderBy") {
        filterItems[key] = req.query[key];
      } else if (key == "orderBy") {
        orderItems = req.query[key].split(",");
        orderItems.map((orderItem) => {
          var item = orderItem.split(" ");
          orderBy.push({ "attribute": item[0], "type": item[1] });
        });
      }
    });
  }

  if (Object.keys(filterItems).length > 0) {
    query["where"] = {};
    Object.keys(filterItems).map((key) => {
      var variableType = validatorSchema.getFieldType(currentComponent, key);

      if (variableType == "String" && !key.startsWith("id")) {
        query["where"][key] = { "contains": filterItems[key], mode: "insensitive" };
      } else if (variableType == "Int") {
        query["where"][key] = parseInt(filterItems[key]);
      } else {
        query["where"][key] = filterItems[key];
      }
    });
  }

  query["orderBy"] = []
  if (orderBy.length > 0) {
    orderBy.map((orderItem) => {
      query["orderBy"].push({ [orderItem.attribute]: orderItem.type })
    });
  } else {
    query["orderBy"] = { "id": "asc" };
  }

  if ([constants.agents.types.AGENT, constants.agents.types.ADMIN].includes(req.ctx.user.type)) {
    query.where = {
      ...query.where,
      id: req.ctx.user.idCompany,
    };
  }

  const companies = await store.getCompanies(query);
  response.success(req, res, companies, "response", 200);
});

const createCompany = catchAsync(async (req, res, next) => {
  let company = req.body;

  validator(schemaCompany, company, "Post");

  const newCompany = await store.createCompany(company);
  response.success(req, res, newCompany, "response", 201);
});

const updateCompany = catchAsync(async (req, res, next) => {
  let company = req.body;
  company.id = req.params.id;

  validator(schemaCompany, company, "Patch");

  const updatedCompany = await store.updateCompany(company);
  response.success(req, res, updatedCompany, "response", 200);
});

const deleteCompany = catchAsync(async (req, res, next) => {
  if (!req.params.id) throw new BadRequestError(null, "Faltan parámetros requeridos.", "[deleteAgent] Missing 'Id'");

  const deletedCompany = await store.deleteCompany(req.params.id);
  response.success(req, res, deletedCompany, "response", 200);
});

const importFile = catchAsync(async (req, res, next) => {
  const { file } = req;
  let clientImportFile;
  try {
    // Params
    if (!file) throw new BadRequestError(null, "No se subió un archivo.", "[importFile] required file.");
    const { id: idCompany } = req.params;
    if (!idCompany) throw new BadRequestError(null, "No se envió el id de la compañía.");
    const company = await store.getCompany(idCompany);
    if (!company) throw new BadRequestError(null, "No se encontró la compañía.");
    const { idChannel } = req.body;
    if (!idChannel) throw new BadRequestError(null, "No se envió el id del canal.");
    const channel = await getChannel(idChannel);
    if (!channel) throw new BadRequestError(null, "No se encontró el canal.");

    // Read file
    const workbook = XLSX.readFile(file.path, { codepage: 65001 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    const [header] = XLSX.utils.sheet_to_json(sheet, { range: "A1:E1", header: 1 });
    const requiredColumns = [
      "firstName",
      "lastName",
      "phone",
      "email",
    ];
    if (!requiredColumns.every((col) => header.includes(col)) || header.length !== requiredColumns.length) {
      throw new BadRequestError(null, `Las columnas que se aceptan son: ${requiredColumns.join(", ")}`);
    }

    // Upload file to s3
    const key = `import-files/${crypto.randomUUID()}`;
    const buffer = await fsPromises.readFile(file.path);
    await storeFileS3(buffer, file.mimetype, key);

    // Store reference
    clientImportFile = await store.createClientImportFile(idChannel, file.originalname, key);

    // Iterate file
    const validClients = [];
    const existingClients = [];
    const invalidClients = [];
    const duplicatedClients = [];
    const clientsCount = {};
    for (let rowNumber = 0; rowNumber < data.length; rowNumber++) {
      const client = data[rowNumber];

      // Format input data
      let formattedClient = {
        firstName: capitalize(`${client.firstName.trim()}`),
        lastName: capitalize(`${client.lastName.trim()}`),
        phone: `${client.phone}`.replace(/[^\d]/gi, ""),
        email: client.email.toLowerCase(),
      };
      if (formattedClient.phone.length === 9) {
        formattedClient.phone = '+56' + formattedClient.phone;
      } else {
        formattedClient.phone = '+' + formattedClient.phone;
      }

      // Validate input data
      try {
        validator(schemaClient, formattedClient);
      } catch (error) {
        if (error instanceof ValidationError) {
          invalidClients.push({
            rowNumber,
            originalData: client,
            formattedData: formattedClient,
            errors: JSON.parse(error.message),
          });
        } else {
          throw error;
        }
        continue;
      }

      // Add required data
      let initials = [];
      if (formattedClient.firstName) {
        initials.push(formattedClient.firstName);
      }
      if (formattedClient.lastName) {
        initials.push(formattedClient.lastName);
      }
      if (initials.length >= 2) {
        initials = initials[0][0] + initials[1][0];
      } else {
        initials = initials[0];
      }
      initials = initials.toUpperCase();
      formattedClient = {
        ...formattedClient,
        idChannel,
        type: constants.client.type.LOGGED,
        state: constants.client.state.AVAILABLE,
        initials,
        avatarColor: randomAvatarColor(),
      };
      if (channel.type === constants.channel.type.WHATSAPP) {
        formattedClient.userIdChannel = formattedClient.phone.replace('+', '');
      }

      // Handle existing clients
      const clients = await getClients({
        where: {
          channel: { id: formattedClient.idChannel },
          idChannel: formattedClient.idChannel,
          userIdChannel: formattedClient.userIdChannel,
        },
      });
      if (clients.total_items > 0) {
        existingClients.push({
          rowNumber,
          originalData: client,
        });
        continue;
      }

      // Handle duplicated
      if (formattedClient.userIdChannel in clientsCount) {
        duplicatedClients.push({
          rowNumber,
          originalData: client,
        });
        continue;
      }

      // Add valid clients
      clientsCount[formattedClient.userIdChannel] = 1
      validClients.push({
        rowNumber,
        originalData: client,
        formattedData: formattedClient,
      });
    }

    const numValid = validClients.length;
    const numExisting = existingClients.length;
    const numInvalid = invalidClients.length;
    const numDuplicated = duplicatedClients.length;
    await createManyClientsAssignedToBot(validClients.map((client) => client.formattedData));
    await store.updateClientImportFile(clientImportFile.id,
      numValid,
      numExisting,
      numInvalid,
      numDuplicated,
    );

    // Results file
    const resWB = XLSX.utils.book_new();
    const resData = [
      ...existingClients.map((client) => ({ rowNumber: client.rowNumber, ...client.originalData, errors: 'El contacto ya existe en la plataforma.' })),
      ...invalidClients.map((client) => ({ rowNumber: client.rowNumber, ...client.originalData, errors: client.errors.map((error) => `${error.key}: ${error.message}`).join(' / ') })),
      ...duplicatedClients.map((client) => ({ rowNumber: client.rowNumber, ...client.originalData, errors: 'El contacto está duplicado en el archivo.' })),
      ...validClients.map((client) => ({ rowNumber: client.rowNumber, ...client.originalData, errors: '' })),
    ];
    resData.sort((a, b) => a.rowNumber - b.rowNumber);
    const resSheet = XLSX.utils.json_to_sheet(resData);
    XLSX.utils.book_append_sheet(resWB, resSheet, "validClients");

    // Upload results file to s3
    const resKey = `import-result-files/${crypto.randomUUID()}`;
    const resBuffer = XLSX.write(resWB, { type: "buffer", bookType: "csv" });
    await storeFileS3(resBuffer, 'text/csv', resKey);
    const resUrl = await generateSignedUrl(resKey);
    await store.updateClientImportFileResKey(clientImportFile.id, resKey);

    // Update state
    await store.clientImportFileUpdateState(clientImportFile.id, constants.clientImportFile.state.COMPLETED);
    response.success(req, res, {
      numValid,
      numExisting,
      numInvalid,
      numDuplicated,
      resUrl,
    }, "response", 201);
  } catch (error) {
    if (clientImportFile) {
      await store.clientImportFileUpdateState(clientImportFile.id, constants.clientImportFile.state.FAILED);
    }
    throw error;
  } finally {
    await fsPromises.unlink(file.path);
  }
});

const downloadFormat = catchAsync(async (req, res, next) => {
  const wb = XLSX.utils.book_new();
  const requiredColumns = [
    "firstName",
    "lastName",
    "phone",
    "email",
  ];
  const ws = XLSX.utils.aoa_to_sheet([requiredColumns]);
  XLSX.utils.book_append_sheet(wb, ws, "Formato");
  const pathtemp = path.resolve('temp', `${crypto.randomUUID()}`);
  const dirtemp = path.resolve('temp');
  await fsPromises.mkdir(dirtemp, { recursive: true });
  await fsPromises.writeFile(pathtemp, XLSX.write(wb, { type: 'buffer', bookType: 'csv' }));
  res.download(pathtemp, 'formato.csv', async (err) => {
    await fsPromises.unlink(pathtemp);
  });
});

const getClientImportFiles = catchAsync(async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { filters, orders, pagination } = formatRequest(req);
  const results = await store.getClientImportFiles(filters, orders, pagination);
  await Promise.all(results.items.map(async (item) => {
    if (!item.resultKey) {
      item.resUrl = null;
    } else {
      const resUrl = await generateSignedUrl(item.resultKey);
      item.resUrl = resUrl;
    };
  }))
  response.success(req, res, { url, results }, 'paginatedResponse', 200);
});

module.exports = {
  getCompany,
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  importFile,
  downloadFormat,
  getClientImportFiles,
}
