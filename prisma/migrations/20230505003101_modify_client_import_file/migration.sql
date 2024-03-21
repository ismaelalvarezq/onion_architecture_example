/*
  Warnings:

  - The values [ACTIVE] on the enum `job_state` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `idChannel` to the `client_import_file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idClientImportFile` to the `client_import_state` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "job_state_new" AS ENUM ('CREATED', 'COMPLETED', 'FAILED');
ALTER TABLE "client_import_state" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "client_import_state" ALTER COLUMN "name" TYPE "job_state_new" USING ("name"::text::"job_state_new");
ALTER TYPE "job_state" RENAME TO "job_state_old";
ALTER TYPE "job_state_new" RENAME TO "job_state";
DROP TYPE "job_state_old";
ALTER TABLE "client_import_state" ALTER COLUMN "name" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "client_import_file" ADD COLUMN     "idChannel" TEXT NOT NULL,
ADD COLUMN     "numberDuplicatedContacts" INTEGER,
ADD COLUMN     "numberExistingContacts" INTEGER,
ADD COLUMN     "numberInvalidContacts" INTEGER,
ADD COLUMN     "numberValidContacts" INTEGER;

-- AlterTable
ALTER TABLE "client_import_state" ADD COLUMN     "idClientImportFile" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "client_import_file" ADD CONSTRAINT "fk_client_import_filechannel" FOREIGN KEY ("idChannel") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_import_state" ADD CONSTRAINT "fk_client_import_stateclient_import_file" FOREIGN KEY ("idClientImportFile") REFERENCES "client_import_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
