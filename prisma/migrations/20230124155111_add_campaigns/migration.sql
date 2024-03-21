/*
  Warnings:

  - You are about to drop the column `idCompany` on the `agent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "agent" DROP CONSTRAINT "fk_usercompany";

-- DropIndex
DROP INDEX "fk_usercompany_idx";

-- AlterTable
ALTER TABLE "agent" DROP COLUMN "idCompany";

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns_on_agents" (
    "campaignId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "campaigns_on_agents_pkey" PRIMARY KEY ("agentId","campaignId")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_idCompany_name_key" ON "campaign"("idCompany", "name");

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_on_agents" ADD CONSTRAINT "campaigns_on_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns_on_agents" ADD CONSTRAINT "campaigns_on_agents_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
