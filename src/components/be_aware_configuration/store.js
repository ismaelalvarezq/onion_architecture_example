const { PrismaClient } = require('@prisma/client');
const { encrypt, decrypt } = require('../../helper/cryptoService');
const prisma = new PrismaClient();

const createOrUpdateBeAwareConfiguration = async (beAwareConfiguration) => {
  beAwareConfiguration.password = encrypt(beAwareConfiguration.password);
  beAwareConfiguration.clientKey = encrypt(beAwareConfiguration.clientKey);
  beAwareConfiguration.secretKey = encrypt(beAwareConfiguration.secretKey);

  return await prisma.be_aware_configuration.upsert({
    create: beAwareConfiguration,
    update: beAwareConfiguration,
    where: { idAgent: beAwareConfiguration.idAgent }
  });
};

const getBeAwareConfiguration = async (idAgent) => {
  const beAwareConfiguration = await prisma.be_aware_configuration.findUnique({ where: { idAgent }});
  if (beAwareConfiguration) {
    beAwareConfiguration.password = decrypt(beAwareConfiguration.password);
    beAwareConfiguration.clientKey = decrypt(beAwareConfiguration.clientKey);
    beAwareConfiguration.secretKey = decrypt(beAwareConfiguration.secretKey);
  }
  return beAwareConfiguration;
};

module.exports = {
  createOrUpdateBeAwareConfiguration,
  getBeAwareConfiguration,
}
