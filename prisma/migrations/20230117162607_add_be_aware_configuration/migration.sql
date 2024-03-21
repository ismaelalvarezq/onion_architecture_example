-- CreateTable
CREATE TABLE "be_aware_configuration" (
    "id" TEXT NOT NULL,
    "idAgent" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "clientKey" TEXT NOT NULL,

    CONSTRAINT "be_aware_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "be_aware_configuration_idAgent_key" ON "be_aware_configuration"("idAgent");

-- AddForeignKey
ALTER TABLE "be_aware_configuration" ADD CONSTRAINT "fk_be_aware_configuration_agent" FOREIGN KEY ("idAgent") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
