const crypto = require('crypto');

const randomPassword = () => {
  const newArray = new BigUint64Array(1);
  const password = crypto.webcrypto.getRandomValues(newArray).toString(36);
  return password;
};

module.exports = {
    randomPassword,
}
