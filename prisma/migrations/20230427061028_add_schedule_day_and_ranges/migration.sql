-- CreateTable
CREATE TABLE "schedule_day" (
    "id" TEXT NOT NULL,
    "idAgent" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "schedule_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_range" (
    "id" TEXT NOT NULL,
    "idScheduleDay" TEXT NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "schedule_range_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_scheduledayagent_idx" ON "schedule_day"("idAgent");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_day_idAgent_weekDay_key" ON "schedule_day"("idAgent", "weekDay");

-- CreateIndex
CREATE INDEX "fk_schedulerange_scheduleday_idx" ON "schedule_range"("idScheduleDay");

-- AddForeignKey
ALTER TABLE "schedule_day" ADD CONSTRAINT "fk_scheduledayagent" FOREIGN KEY ("idAgent") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_range" ADD CONSTRAINT "fk_schedulerange_scheduleday" FOREIGN KEY ("idScheduleDay") REFERENCES "schedule_day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
