const { ValidationError } = require('../../exceptions.js');


function validator(schema, params, requestType) {
  let validationResult = schema.tailor(requestType).validate(params, { "abortEarly": false, "allowUnknown": false });

  if (validationResult.error) {
    let arrayErrors = [];
    for (const err of validationResult.error.details) {
      arrayErrors.push({ "message": err.message, "key": err.context.key });
    }

    throw new ValidationError(null, JSON.stringify(arrayErrors), "[" + requestType + "] Data types don't match");
  }
};

module.exports = { validator }
