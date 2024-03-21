/*
  Warnings:

  - You are about to drop the column `nickname` on the `agent` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "agent" DROP COLUMN "nickname",
DROP COLUMN "username";
