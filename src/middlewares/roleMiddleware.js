const constants = require("../constants");
const { ForbiddenError } = require("../exceptions");

const catchAsync = require("../utils/catchAsync");

const roleMiddleware = (...roles) => catchAsync(async (req, res, next) => {
  const hasRole = roles.includes(req.ctx.user.type) || req.ctx.user.type === constants.agents.types.SYSTEM;
  if (!hasRole) {
    throw new ForbiddenError(
      null,
      "El usuario no tiene los permisos necesarios",
      "Error roleMiddleware"
    );
  }
  next();
});

module.exports = {
  roleMiddleware,
};
