-- CreateTable
CREATE TABLE "attention_feedback" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "idAgent" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "value" INTEGER NOT NULL,
    "message" VARCHAR(250) DEFAULT '',

    CONSTRAINT "attention_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_feedback" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "idFlow" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "value" INTEGER NOT NULL,
    "message" VARCHAR(250) DEFAULT '',

    CONSTRAINT "flow_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_attention_feedbackagent_idx" ON "attention_feedback"("idAgent");

-- CreateIndex
CREATE INDEX "fk_flow_feedbackflow_idx" ON "flow_feedback"("idFlow");

-- AddForeignKey
ALTER TABLE "attention_feedback" ADD CONSTRAINT "fk_attention_feedbackagent" FOREIGN KEY ("idAgent") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "flow_feedback" ADD CONSTRAINT "fk_flow_feedbackflow" FOREIGN KEY ("idFlow") REFERENCES "flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
