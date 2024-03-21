/*
  Warnings:

  - A unique constraint covering the columns `[idChannel,idCompany,userIdChannel]` on the table `client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "client_idChannel_idCompany_userIdChannel_key" ON "client"("idChannel", "idCompany", "userIdChannel");
