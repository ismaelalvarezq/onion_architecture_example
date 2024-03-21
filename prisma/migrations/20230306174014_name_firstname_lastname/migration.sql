/*
  Warnings:

  - You are about to drop the column `name` on the `client` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client" RENAME COLUMN "name" TO "firstName";
ALTER TABLE "client" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(125);
ALTER TABLE "client" ADD COLUMN "lastName" VARCHAR(125);
