-- CreateEnum
CREATE TYPE "job_state" AS ENUM ('CREATED', 'ACTIVE', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "client_import_file" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_import_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_import_state" (
    "id" TEXT NOT NULL,
    "name" "job_state" NOT NULL DEFAULT E'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_import_state_pkey" PRIMARY KEY ("id")
);
