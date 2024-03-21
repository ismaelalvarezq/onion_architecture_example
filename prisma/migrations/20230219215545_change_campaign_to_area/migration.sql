/*
  Warnings:

  - You are about to drop the `campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaigns_on_agents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaign" DROP CONSTRAINT "campaign_idCompany_fkey";

-- DropForeignKey
ALTER TABLE "campaigns_on_agents" DROP CONSTRAINT "campaigns_on_agents_agentId_fkey";

-- DropForeignKey
ALTER TABLE "campaigns_on_agents" DROP CONSTRAINT "campaigns_on_agents_campaignId_fkey";

-- DropTable
DROP TABLE "campaign";

-- DropTable
DROP TABLE "campaigns_on_agents";

-- CreateTable
CREATE TABLE "area" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas_on_agents" (
    "areaId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "areas_on_agents_pkey" PRIMARY KEY ("agentId","areaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "area_idCompany_name_key" ON "area"("idCompany", "name");

-- AddForeignKey
ALTER TABLE "area" ADD CONSTRAINT "area_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_on_agents" ADD CONSTRAINT "areas_on_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_on_agents" ADD CONSTRAINT "areas_on_agents_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
