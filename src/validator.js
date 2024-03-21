const { Prisma } = require('@prisma/client');


function validateTypeVariablesModel(modelName, object) {
  let isValid = true;
  const dataModel = getDataModel(modelName);

  Object.keys(object).forEach((key) => {
    if (Number.isNaN(object[key])) {
      isValid = false;
    }

    if (object[key]) {
      let typeVariable = dataModel.find((field) => field.name === key)?.type;

      if (typeVariable == "Int") {
        if (!Number.isInteger(object[key])) {
          // throw new BadRequestError(null, "Faltan parámetros requeridos.", "[createAgent] Missing params");
          isValid = false; // ! Lanzar error desde acá
        }

      } else if (typeVariable == "String") {
        if (typeof(object[key]) != "string") {
          isValid = false;
        }

      } else if (typeVariable == "DateTime") {
        if (typeof(object[key]) !== "object") {
          isValid = false;
        }

      } else if (typeVariable == "Boolean") {
        if (typeof(object[key]) !== "boolean") {
          isValid = false;
        }
      }
    }
  });

  return isValid;
}

function getFieldType(modelName, variableName) {
  try {
    var dataModel = getDataModel(modelName);
    return dataModel.find(variable => variable.name === variableName).type;

  } catch (error) {
    return false
  }
}

function getDataModel(modelName) {
  return Prisma.dmmf.datamodel.models.find(model => model.name === modelName).fields;
}


module.exports = {
  validateTypeVariablesModel,
  getFieldType,
  getDataModel
}