const AWS = require("aws-sdk");

const config = require("../config");
const logger = require("./logger");
const { InternalServerError } = require("../exceptions");

AWS.config.update({
  accessKeyId: config.awsAccessKeyIdS3,
  secretAccessKey: config.awsSecretAccessKeyS3,
});

const storeFileS3 = async (file, type, key) => {
  const s3 = new AWS.S3();

  let params = {
    ContentEncoding: "base64",
  };

  params = {
    ...params,
    Bucket: config.awsBucketNameS3,
    Key: key, //`${channelType}/${ticketId}/${fileName}`
    Body: file,
    ContentType: type, // Si es un pdf el content type debe ser application/pdf o alguno de los otros tipos de archivos que soporte S3 (ver documentación)
  };

  return s3
    .upload(params)
    .promise()
    .then((data) => {
      logger.info("File uploaded successfully. " + data.Location);
      return data.Location;
    })
    .catch((error) => {
      throw new InternalServerError(
        error,
        "Error al subir el archivo.",
        "[storeFileS3] Error uploading file"
      );
    });
};

const deleteFileS3 = async (key) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: config.awsBucketNameS3,
    Key: key,
  };

  return s3
    .deleteObject(params)
    .promise()
    .then((data) => {
      logger.info("File deleted successfully. " + data);
      return data;
    })
    .catch((error) => {
      throw new InternalServerError(
        error,
        "Error al eliminar el archivo.",
        "[deleteFileS3] Error deleting file"
      );
    });
};

const generateSignedUrl = async (key, expires = 3600) => {
  const s3 = new AWS.S3();
  const params = { Bucket: config.awsBucketNameS3, Key: key, Expires: expires };
  const url = s3.getSignedUrlPromise("getObject", params);
  return url
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new InternalServerError(
        error,
        "Error al generar la url firmada.",
        "[generateSignedUrl] Error generating signed url"
      );
    });
};

module.exports = {
  storeFileS3,
  generateSignedUrl,
  deleteFileS3,
};
