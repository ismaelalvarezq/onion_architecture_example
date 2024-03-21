-- DropForeignKey
ALTER TABLE "flows_on_channels" DROP CONSTRAINT "flows_on_channels_idFlow_fkey";

-- AddForeignKey
ALTER TABLE "flows_on_channels" ADD CONSTRAINT "flows_on_channels_idFlow_fkey" FOREIGN KEY ("idFlow") REFERENCES "flow"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
