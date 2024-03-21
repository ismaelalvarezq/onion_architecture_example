const cron = require('node-cron');
const { sendWhatsAppCampaign } = require('../components/whatsapp_proxy/store');
const flowStore = require('../components/flow/store');
const { getOutboundCampaigns, getAndStoreStatistics, updateOutboundCampaign } = require('../components/outbound_campaign/store');
const clientStore = require('../components/client/store');
const logger = require('../helper/logger');
const constants = require('../constants');

class Cron {
  tasks = [
    cron.schedule('*/30 * * * *', async () => {
      logger.info('CRON: Get and store statistics from active campaigns');
      try {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        const activeCampaigns = await getOutboundCampaigns({
          dateRange: {
            startDate: new Date('1900-01-01'),
            endDate,
          },
        }, []);
        await Promise.all(activeCampaigns.map(async (campaign) => getAndStoreStatistics(campaign.id)));
        logger.info(`CRON: Found and update ${activeCampaigns.length} active campaigns`);
      } catch (error) {
        logger.error(error);
        if (error.stack) logger.error(error.stack);
      }
    }),
    cron.schedule('*/30 * * * *', async () => {
      try {
        const campaigns = await getOutboundCampaigns({
          active: true,
          status: constants.outboundCampaign.statuses.REVIEWING,
        }, []);
        if (!campaigns.length) return;
        logger.info(`CRON: Found and sending ${campaigns.length} campaigns`);
        const results = await Promise.allSettled(campaigns.map(async (campaign) => {
          try {
            const client = await clientStore.getClient({ where: { id: campaign.clients[0].idClient } });
            const configJson = await flowStore.getConfigJson({
              where: {
                channels: {
                  some: {
                    channel: {
                      id: client.idChannel,
                    },
                  },
                },
              },
            });
            const campaignNode = JSON.parse(configJson).flowNodes.find((config) => config.id === campaign.idNode);
            await sendWhatsAppCampaign(campaign.id, campaignNode.templateName, campaignNode.templateLanguage);
          } catch (error) {
            await updateOutboundCampaign(campaign.id, { status: constants.outboundCampaign.statuses.FAILED });
            throw error;
          }
        }));
        const sentResults = results.filter((res) => !res.reason);
        if (sentResults.length) {
          logger.info(`CRON: Sent ${sentResults.length} campaigns`);
        }
        const failedResults = results.filter((res) => res.reason);
        if (failedResults.length) {
          logger.info(`CRON: Couldn't send ${failedResults.length} campaigns`);
          failedResults.map((res) => {
            logger.debug(`CRON: Campaign error: ` + (res.reason.stack ? `${res.reason.stack}` : `${res.reason}`));
          });
        }
      } catch (error) {
        logger.error(error);
        if (error.stack) logger.error(error.stack);
      }
    }),
  ];

  start() {
    this.tasks.forEach((task) => {
      task.start();
    });
  }
}

module.exports = new Cron();
