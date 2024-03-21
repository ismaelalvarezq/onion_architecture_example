/*
  Warnings:

  - The values [APPROVED,SENDING] on the enum `outbound_campaign_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "outbound_campaign_status_new" AS ENUM ('REVIEWING', 'SENT', 'FAILED', 'CANCELLED');
ALTER TABLE "outbound_campaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "outbound_campaign" ALTER COLUMN "status" TYPE "outbound_campaign_status_new" USING ("status"::text::"outbound_campaign_status_new");
ALTER TYPE "outbound_campaign_status" RENAME TO "outbound_campaign_status_old";
ALTER TYPE "outbound_campaign_status_new" RENAME TO "outbound_campaign_status";
DROP TYPE "outbound_campaign_status_old";
ALTER TABLE "outbound_campaign" ALTER COLUMN "status" SET DEFAULT 'REVIEWING';
COMMIT;
