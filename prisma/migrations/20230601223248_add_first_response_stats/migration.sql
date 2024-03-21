-- AlterTable
ALTER TABLE "outbound_campaign" ADD COLUMN     "firstResponseDate" TIMESTAMP(3),
ADD COLUMN     "firstResponseSeconds" INTEGER;
