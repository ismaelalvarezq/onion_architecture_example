/*
  Warnings:

  - You are about to drop the column `token` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `env_var` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idChannel,type]` on the table `env_var` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `env_var` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `env_var` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "env_var_type" AS ENUM ('FACEBOOK_PAGE_ACCESS_TOKEN', 'FACEBOOK_PAGE_ID', 'FACEBOOK_VERIFY_TOKEN', 'FACEBOOK_VERSION', 'INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_PAGE_ID', 'INSTAGRAM_VERIFY_TOKEN', 'INSTAGRAM_VERSION', 'INSTAGRAM_FACEBOOK_PAGE_ID', 'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_BUSINESS_ACCOUNT_ID', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN', 'WHATSAPP_VERSION', 'WEBCHAT_ACCESS_TOKEN');

-- AlterTable
ALTER TABLE "channel" DROP COLUMN "token";

-- AlterTable
ALTER TABLE "env_var" RENAME COLUMN "token" TO "value";
ALTER TABLE "env_var" ALTER COLUMN "type" TYPE "env_var_type" USING type::env_var_type;

-- CreateIndex
CREATE UNIQUE INDEX "env_var_idChannel_type_key" ON "env_var"("idChannel", "type");
