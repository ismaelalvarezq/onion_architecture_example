/*
  Warnings:

  - You are about to drop the column `idCompany` on the `client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idChannel,userIdChannel]` on the table `client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "fk_clientcompany";

-- DropIndex
DROP INDEX "client_idChannel_idCompany_userIdChannel_key";

-- DropIndex
DROP INDEX "fk_clientcompany_idx";

-- AlterTable
ALTER TABLE "client" DROP COLUMN "idCompany";

-- CreateIndex
CREATE UNIQUE INDEX "client_idChannel_userIdChannel_key" ON "client"("idChannel", "userIdChannel");
