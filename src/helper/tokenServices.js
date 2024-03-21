const jwt = require("jsonwebtoken");
const config = require("../config");

const getTokenService = () => {
  const token = jwt.sign({}, config.secretKeyTokenService, {
    expiresIn: "15s",
  });
  return token;
};

const verifyTokenService = async (token) => {
  const isVerified = await jwt.verify(token, config.secretKeyTokenService, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
  return isVerified;
};

module.exports = {
  getTokenService,
  verifyTokenService,
};
