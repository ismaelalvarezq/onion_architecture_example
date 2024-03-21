/*
  Warnings:

  - Added the required column `createdBy` to the `blocking_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blocking_history" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "blocking_history" ADD CONSTRAINT "fk_blocking_historyagent" FOREIGN KEY ("createdBy") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
