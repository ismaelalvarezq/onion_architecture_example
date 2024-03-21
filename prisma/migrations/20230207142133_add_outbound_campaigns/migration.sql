-- CreateEnum
CREATE TYPE "message_type" AS ENUM ('TEXT', 'AUDIO', 'VIDEO', 'IMAGE', 'FILE');

-- CreateTable
CREATE TABLE "outbound_campaign" (
    "id" TEXT NOT NULL,
    "idNode" VARCHAR(36) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "outbound_campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbound_campaigns_on_clients" (
    "idOutboundCampaign" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,

    CONSTRAINT "outbound_campaigns_on_clients_pkey" PRIMARY KEY ("idOutboundCampaign","idClient")
);

-- CreateTable
CREATE TABLE "outbound_message" (
    "id" TEXT NOT NULL,
    "type" "message_type" NOT NULL,
    "body" VARCHAR(1024) NOT NULL,
    "idOutboundCampaign" TEXT NOT NULL,

    CONSTRAINT "outbound_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outbound_campaigns_on_clients" ADD CONSTRAINT "outbound_campaigns_on_clients_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_campaigns_on_clients" ADD CONSTRAINT "outbound_campaigns_on_clients_idOutboundCampaign_fkey" FOREIGN KEY ("idOutboundCampaign") REFERENCES "outbound_campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_message" ADD CONSTRAINT "outbound_message_idOutboundCampaign_fkey" FOREIGN KEY ("idOutboundCampaign") REFERENCES "outbound_campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
