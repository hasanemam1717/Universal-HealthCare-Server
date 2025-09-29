/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctor_appointmentId_key" ON "public"."doctor"("appointmentId");

-- AddForeignKey
ALTER TABLE "public"."doctor" ADD CONSTRAINT "doctor_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
