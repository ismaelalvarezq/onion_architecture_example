/*
  Warnings:

  - You are about to drop the column `fullname` on the `agent` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agent" RENAME COLUMN "fullname" TO "firstName";
ALTER TABLE "agent" ADD COLUMN "lastName" VARCHAR(50);
