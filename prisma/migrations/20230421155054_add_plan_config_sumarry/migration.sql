-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "canUseWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "canUseFacebook" BOOLEAN NOT NULL DEFAULT false,
    "canUseWebchat" BOOLEAN NOT NULL DEFAULT false,
    "maxNConversations" INTEGER NOT NULL,
    "canRemoveBubbleLogo" BOOLEAN NOT NULL DEFAULT false,
    "canUseSchedule" BOOLEAN NOT NULL DEFAULT false,
    "canUseSurvey" BOOLEAN NOT NULL DEFAULT false,
    "canUseAutoResponse" BOOLEAN NOT NULL DEFAULT false,
    "canUseChatgpt" BOOLEAN NOT NULL DEFAULT false,
    "maxNAgents" INTEGER NOT NULL,
    "maxNAdmins" INTEGER NOT NULL,
    "canUseDashboard" BOOLEAN NOT NULL DEFAULT false,
    "canUseTemplate" BOOLEAN NOT NULL DEFAULT false,
    "canUseContactManagement" BOOLEAN NOT NULL DEFAULT false,
    "canUseChatHistory" BOOLEAN NOT NULL DEFAULT false,
    "canUseOutboundWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "canUseBeAware" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_config" (
    "id" TEXT NOT NULL,
    "idPlan" TEXT NOT NULL,
    "idCompany" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(50) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "channelWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "channelFacebook" BOOLEAN NOT NULL DEFAULT false,
    "channelWebchat" BOOLEAN NOT NULL DEFAULT false,
    "nConversations" INTEGER NOT NULL,
    "removeBubbleLogo" BOOLEAN NOT NULL,
    "attentionSchedule" BOOLEAN NOT NULL DEFAULT false,
    "satisfactionSurvey" BOOLEAN NOT NULL DEFAULT false,
    "automaticResponse" BOOLEAN NOT NULL DEFAULT false,
    "chatgpt" BOOLEAN NOT NULL DEFAULT false,
    "nAgents" INTEGER NOT NULL,
    "nAdmins" INTEGER NOT NULL,
    "isDashboard" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "isContactManagement" BOOLEAN NOT NULL DEFAULT false,
    "isChatHistory" BOOLEAN NOT NULL DEFAULT false,
    "isOutboundWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "isBeAware" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_summary" (
    "id" TEXT NOT NULL,
    "idPlanConfig" TEXT NOT NULL,
    "ticketsCount" INTEGER NOT NULL DEFAULT 0,
    "extraConversations" INTEGER NOT NULL DEFAULT 0,
    "month" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_plan_configcompany_idx" ON "plan_config"("idCompany");

-- CreateIndex
CREATE INDEX "fk_plan_configplan_idx" ON "plan_config"("idPlan");

-- CreateIndex
CREATE INDEX "fk_plan_summaryplan_config_idx" ON "plan_summary"("idPlanConfig");

-- AddForeignKey
ALTER TABLE "plan_config" ADD CONSTRAINT "plan_config_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_config" ADD CONSTRAINT "plan_config_idPlan_fkey" FOREIGN KEY ("idPlan") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan_summary" ADD CONSTRAINT "plan_summary_idPlanConfig_fkey" FOREIGN KEY ("idPlanConfig") REFERENCES "plan_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
