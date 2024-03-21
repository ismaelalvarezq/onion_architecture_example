/*
  Warnings:

  - Added the required column `updatedAt` to the `list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lists_on_clients" DROP CONSTRAINT "lists_on_clients_idList_fkey";

-- AlterTable
ALTER TABLE "list" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "lists_on_clients" ADD CONSTRAINT "lists_on_clients_idList_fkey" FOREIGN KEY ("idList") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
