/*
  Warnings:

  - Added the required column `idAuthor` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note" ADD COLUMN     "idAuthor" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "fk_noteagent" FOREIGN KEY ("idAuthor") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
