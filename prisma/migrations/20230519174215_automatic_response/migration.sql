-- CreateTable
CREATE TABLE "automatic_response_type" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,

    CONSTRAINT "automatic_response_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automatic_response" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "idAutomaticResponseType" TEXT NOT NULL,
    "message" VARCHAR(1024) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "automatic_response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "automatic_response" ADD CONSTRAINT "automatic_response_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatic_response" ADD CONSTRAINT "automatic_response_idAutomaticResponseType_fkey" FOREIGN KEY ("idAutomaticResponseType") REFERENCES "automatic_response_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
