-- CreateTable
CREATE TABLE "agent" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "idExternal" INTEGER,
    "fullname" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "password" VARCHAR(50) NOT NULL,
    "initials" VARCHAR(2) NOT NULL,
    "username" VARCHAR(50),
    "phone" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "age" INTEGER,
    "rut" VARCHAR(50),
    "gender" VARCHAR(50),
    "nickname" VARCHAR(50),
    "avatarColor" VARCHAR(10) NOT NULL,
    "avatarUrl" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocking_history" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "type" VARCHAR(250) NOT NULL,
    "reason" VARCHAR(250),
    "timeBlocked" VARCHAR(50) NOT NULL,
    "dateUnblock" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocking_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(10) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "token" VARCHAR(50) NOT NULL,
    "imageUrl" VARCHAR(250),

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "idAgent" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "idChannel" TEXT,
    "idCompany" TEXT NOT NULL,
    "userIdChannel" VARCHAR(250) NOT NULL,
    "type" VARCHAR(250) NOT NULL,
    "state" VARCHAR(250) NOT NULL,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(250) NOT NULL,
    "initials" VARCHAR(2) NOT NULL,
    "avatarColor" VARCHAR(10) NOT NULL,
    "avatarUrl" VARCHAR(250),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_flow_step" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "status" VARCHAR(50),
    "failsCount" INTEGER,
    "flow" VARCHAR(50),
    "previousFlow" VARCHAR(50),
    "answers" JSON,
    "answersApi" JSON,

    CONSTRAINT "client_flow_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "idWebChat" TEXT,
    "name" VARCHAR(250) NOT NULL,
    "fantasyName" VARCHAR(250) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "env_var" (
    "id" TEXT NOT NULL,
    "idChannel" TEXT NOT NULL,
    "token" VARCHAR(250) NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "env_var_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "body" VARCHAR(500) NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow" (
    "id" TEXT NOT NULL,
    "jsonFile" JSON NOT NULL,
    "trigger" VARCHAR(50) NOT NULL,

    CONSTRAINT "flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flows_on_channels" (
    "idChannel" TEXT NOT NULL,
    "idFlow" TEXT NOT NULL,

    CONSTRAINT "flows_on_channels_pkey" PRIMARY KEY ("idChannel","idFlow")
);

-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "idAgent" TEXT NOT NULL,
    "token" VARCHAR(50) NOT NULL,
    "checkInTime" DATE NOT NULL,
    "checkOutTime" DATE NOT NULL,
    "launchTimeStart" DATE NOT NULL,
    "launchTimeFinish" DATE NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" TEXT NOT NULL,
    "idCategory" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_category" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_priority" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "weight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_status" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webchat_theme" (
    "id" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "companyName" VARCHAR(50) NOT NULL,
    "webUrl" VARCHAR(250) NOT NULL,
    "backgroundColor" VARCHAR(50) NOT NULL,
    "textColor" VARCHAR(50) NOT NULL,
    "backgroundMessageColor" VARCHAR(50) NOT NULL,
    "textMessageColor" VARCHAR(50) NOT NULL,
    "mainButtonColor" VARCHAR(50) NOT NULL,
    "acccentButtonColor" VARCHAR(50) NOT NULL,
    "defaultOpen" BOOLEAN NOT NULL DEFAULT false,
    "viewOnMobile" BOOLEAN NOT NULL DEFAULT true,
    "viewOnDesktop" BOOLEAN NOT NULL DEFAULT true,
    "position" VARCHAR(50) NOT NULL,

    CONSTRAINT "webchat_theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_email_key" ON "agent"("email");

-- CreateIndex
CREATE INDEX "fk_usercompany_idx" ON "agent"("idCompany");

-- CreateIndex
CREATE INDEX "fk_blocking_historyclient_idx" ON "blocking_history"("idClient");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "fk_categorycompany_idx" ON "category"("idCompany");

-- CreateIndex
CREATE UNIQUE INDEX "category_idCompany_name_key" ON "category"("idCompany", "name");

-- CreateIndex
CREATE INDEX "fk_channelcompany_idx" ON "channel"("idCompany");

-- CreateIndex
CREATE UNIQUE INDEX "channel_idCompany_type_key" ON "channel"("idCompany", "type");

-- CreateIndex
CREATE INDEX "fk_chatagent_idx" ON "chat"("idAgent");

-- CreateIndex
CREATE INDEX "fk_chatclient_idx" ON "chat"("idClient");

-- CreateIndex
CREATE INDEX "fk_clientchannel_idx" ON "client"("idChannel");

-- CreateIndex
CREATE INDEX "fk_clientcompany_idx" ON "client"("idCompany");

-- CreateIndex
CREATE INDEX "fk_client_flow_stepclient_idx" ON "client_flow_step"("idClient");

-- CreateIndex
CREATE INDEX "fk_companywebchat_theme_idx" ON "company"("idWebChat");

-- CreateIndex
CREATE INDEX "fk_envchannel_idx" ON "env_var"("idChannel");

-- CreateIndex
CREATE INDEX "fk_faqcompany_idx" ON "faq"("idCompany");

-- CreateIndex
CREATE INDEX "fk_noteclient_idx" ON "note"("idClient");

-- CreateIndex
CREATE INDEX "fk_scheduleagent_idx" ON "schedule"("idAgent");

-- CreateIndex
CREATE UNIQUE INDEX "template_title_key" ON "template"("title");

-- CreateIndex
CREATE INDEX "fk_templatecategory_idx" ON "template"("idCategory");

-- CreateIndex
CREATE INDEX "fk_ticket_categorycompany_idx" ON "ticket_category"("idCompany");

-- CreateIndex
CREATE INDEX "fk_ticket_prioritycompany_idx" ON "ticket_priority"("idCompany");

-- CreateIndex
CREATE INDEX "fk_ticket_statuscompany_idx" ON "ticket_status"("idCompany");

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "fk_usercompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blocking_history" ADD CONSTRAINT "fk_blocking_historyclient" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "fk_categorycompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "fk_channelcompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "fk_chatagent" FOREIGN KEY ("idAgent") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "fk_chatclient" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "fk_clientchannel" FOREIGN KEY ("idChannel") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "fk_clientcompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client_flow_step" ADD CONSTRAINT "fk_client_flow_stepclient" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "fk_companywebchat_theme" FOREIGN KEY ("idWebChat") REFERENCES "webchat_theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "env_var" ADD CONSTRAINT "fk_envchannel" FOREIGN KEY ("idChannel") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faq" ADD CONSTRAINT "fk_faqcompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flows_on_channels" ADD CONSTRAINT "flows_on_channels_idChannel_fkey" FOREIGN KEY ("idChannel") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flows_on_channels" ADD CONSTRAINT "flows_on_channels_idFlow_fkey" FOREIGN KEY ("idFlow") REFERENCES "flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "fk_noteclient" FOREIGN KEY ("idClient") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "fk_scheduleagent" FOREIGN KEY ("idAgent") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "fk_templatecategory" FOREIGN KEY ("idCategory") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket_category" ADD CONSTRAINT "fk_ticket_categorycompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket_priority" ADD CONSTRAINT "fk_ticket_prioritycompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket_status" ADD CONSTRAINT "fk_ticket_statuscompany" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
