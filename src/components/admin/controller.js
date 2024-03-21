const response = require('../../network/response.js');
const catchAsync = require('../../utils/catchAsync.js');
const { validator } = require('../../helper/validator/index.js');
const { addCompanySchema } = require('../../helper/validator/schemas/admin.js');
const constants = require('../../constants.js');
const adminStore = require('../admin/store.js');
const crypto = require("crypto");
const { randomPassword } = require('../../utils/randomPassword.js');
const { randomAvatarColor } = require('../../utils/randomAvatarColor.js');

const avatarColors = constants.avatar.COLORS;

const addCompany = catchAsync(async (req, res, next) => {
  validator(addCompanySchema, req.body, "Post");

  const company = {
    name: req.body.companyName,
    fantasyName: req.body.fantasyName,
  };

  const bot = {
    firstName: constants.agents.types.BOT,
    type: constants.agents.types.BOT,
    status: constants.agents.status.ENABLED,
    initials: constants.agents.types.BOT.split(' ').map(word => word[0]).join('').substring(0, 2),
    email: `${crypto.randomUUID()}@${constants.agents.types.BOT}.com`,
    avatarColor: randomAvatarColor(),
    password: randomPassword(),
  };

  const admin = {
    firstName: req.body.adminFirstName,
    lastName: req.body.adminLastName,
    type: constants.agents.types.ADMIN,
    status: constants.agents.status.ENABLED,
    initials: `${req.body.adminFirstName && req.body.adminFirstName[0]}${req.body.adminLastName && req.body.adminLastName[0]}`,
    email: req.body.adminEmail,
    avatarColor: randomAvatarColor(),
    password: req.body.adminEmail.split("@")[0],
  };

  const channel = {
    name: req.body.companyName,
    type: constants.channel.type.WEBCHAT,
  };

  const { newCompany, newAdmin, newPlanConfig, newPlanSummary } = await adminStore.addCompany(company, admin, bot, channel, req.body.idPlan);

  response.success(req, res, { newCompany, newAdmin, newPlanConfig, newPlanSummary }, "response", 201);
});

module.exports = {
  addCompany,
}
