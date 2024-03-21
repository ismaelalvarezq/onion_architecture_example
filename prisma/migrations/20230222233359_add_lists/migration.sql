-- CreateTable
CREATE TABLE "list" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists_on_clients" (
    "idList" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,

    CONSTRAINT "lists_on_clients_pkey" PRIMARY KEY ("idList","idClient")
);

-- CreateIndex
CREATE INDEX "fk_listcompany_idx" ON "list"("idCompany");

-- AddForeignKey
ALTER TABLE "list" ADD CONSTRAINT "fk_listcompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lists_on_clients" ADD CONSTRAINT "lists_on_clients_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists_on_clients" ADD CONSTRAINT "lists_on_clients_idList_fkey" FOREIGN KEY ("idList") REFERENCES "list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
