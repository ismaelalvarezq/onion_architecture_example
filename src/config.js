require('dotenv').config()

const config = {
  service_name: 'API Configuration',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'local',
  port: process.env.PORT_APP || 8080,
  host: process.env.HOST || 'http://localhost',
  appRoute: process.env.APP_ROUTE || '/app',
  publicRoute: process.env.PUBLIC_ROUTE || '/public',
  filesRoute: process.env.FILES_ROUTE || '/files',
  dsn_sentry: process.env.DSN_SENTRY || '',
  mongoDbLink: process.env.MONGODB_LINK || 'http://omnicanal-history:8500',
  client_id_atenea: process.env.CLIENT_ID_ATENEA || '',
  client_secret_atenea: process.env.CLIENT_SECRET_ATENEA || '',
  grantTypeTokenAtenea: process.env.GRANT_TYPE_TOKEN_ATENEA || '',
  redirect_uri_atenea: process.env.REDIRECT_URI_ATENEA || '',
  base_url_atenea: process.env.BASE_URL_ATENEA || '',
  clientIdCreateUserAtenea: process.env.CLIENT_ID_CREATE_USER_ATENEA || '',
  clientSecretCreateUserAtenea: process.env.CLIENT_SECRET_CREATE_USER_ATENEA || '',
  grantTypeCreateUserAtenea: process.env.GRANT_TYPE_CREATE_USER_ATENEA || '',
  secretKeyTokenService: process.env.SECRET_KEY_TOKEN_SERVICE,
  websocketUrl: process.env.WEBSOCKET_URL || 'http://omnicanal-websocket-server:8510',
  baseUrlBeAware: process.env.BASE_URL_BE_AWARE,
  cryptoKey: process.env.CRYPTO_KEY,
  awsAccessKeyIdS3: process.env.AWS_ACCESS_KEY_ID_S3,
  awsSecretAccessKeyS3: process.env.AWS_SECRET_ACCESS_KEY_S3,
  awsBucketNameS3: process.env.AWS_BUCKET_NAME_S3,
  metaLink: process.env.META_LINK || 'https://graph.facebook.com/',
  limitSize: process.env.LIMIT_SIZE || '50mb',
};

module.exports = config;
