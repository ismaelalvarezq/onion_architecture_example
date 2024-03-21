const linksPagination = require("../linksPagination.js");

const statusMessage = {
  "200": "Success",
  "201": "Created",

  "400": "Bad Request",
  "401": "Unauthorized",
  "404": "Not Found",

  "500": "Internal Server Error"
}

const success = async function(req, res, data, typeResponse, status){
  let response = {};

  if (!status) status = 200;
  if (!data) data = [];

  if (typeResponse == "paginatedResponse") {
    response = {
      "status": statusMessage[status],
      "errors": [],
      "links": await linksPagination.getLinks(data.url, data.results.total_items),
      "data": data.results.items
    }

  } else {
    response = {
      "status": statusMessage[status],
      "errors": [],
      "data": data
    }
  }

  res.status(status).send(response);
}

const error = function(req, res, message, status, details) {
  if (!status) status = 500;
  if (!message) message = statusMessage[status];

  try {
    message = JSON.parse(message);
  } catch {
    message = [{ "message": message }];
  }

  let response = {
    "status": statusMessage[status],
    "errors": message,
    "data": []
  }

  res.status(status).send(response);
}


module.exports = {
  success,
  error
}
