/*
  Warnings:

  - You are about to drop the `outbound_message` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "outbound_campaign_status" AS ENUM ('REVIEWING', 'APPROVED', 'SENDING', 'SENT');

-- DropForeignKey
ALTER TABLE "outbound_message" DROP CONSTRAINT "outbound_message_idOutboundCampaign_fkey";

-- AlterTable
ALTER TABLE "outbound_campaign" ADD COLUMN     "answered" INTEGER DEFAULT 0,
ADD COLUMN     "delivered" INTEGER DEFAULT 0,
ADD COLUMN     "read" INTEGER DEFAULT 0,
ADD COLUMN     "sent" INTEGER DEFAULT 0,
ADD COLUMN     "status" "outbound_campaign_status" NOT NULL DEFAULT E'REVIEWING';

-- DropTable
DROP TABLE "outbound_message";

-- DropEnum
DROP TYPE "message_type";
