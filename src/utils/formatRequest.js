const constants = require("../constants");
const { BadRequestError } = require("../exceptions");

const formatRequest = (req) => {
  const NOT_FILTERS = ["offset", "limit", "orderBy"];
  const filters = {};
  for (let [key, value] of Object.entries(req.query)) {
    if (!NOT_FILTERS.includes(key)) {
      filters[key] = value;
    }
  }
  for (let [key, value] of Object.entries(req.params)) {
    if (!NOT_FILTERS.includes(key)) {
      filters[key] = value;
    }
  }

  const orders = [];
  if (Array.isArray(req.query.orderBy)) {
    for (let item of req.query.orderBy) {
      [key, value] = item.split(" ");
      if (!["asc", "desc"].includes(value)) {
        throw new BadRequestError(null, "Solo se aceptan 'asc', 'desc' en el orden.")
      }
      orders.push({ [key]: value });
    }
  } else if (req.query.orderBy) {
    [key, value] = req.query.orderBy.split(" ");
    if (!["asc", "desc"].includes(value)) {
      throw new BadRequestError(null, "Solo se aceptan 'asc', 'desc' en el orden.")
    }
    orders.push({ [key]: value });
  }

  let pagination;
  if (req.query.offset || req.query.limit) {
    pagination = {};
    pagination.take = req.query.limit ? parseInt(req.query.limit) : constants.pagination.DEFAULT_LIMIT;
    pagination.skip = req.query.offset ? parseInt(req.query.offset) : ((constants.pagination.DEFAULT_PAGE - 1) * pagination.take);
  }

  return { filters, orders, pagination };
};

module.exports = {
  formatRequest,
}
