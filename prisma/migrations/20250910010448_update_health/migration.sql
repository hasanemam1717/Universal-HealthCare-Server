/*
  Warnings:

  - The values [SINGLE] on the enum `MaritalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaritalStatus_new" AS ENUM ('UNMARRIED', 'MARRIED', 'DIVORCED', 'WIDOWED');
ALTER TABLE "patient_health_data" ALTER COLUMN "maritalStatus" TYPE "MaritalStatus_new" USING ("maritalStatus"::text::"MaritalStatus_new");
ALTER TYPE "MaritalStatus" RENAME TO "MaritalStatus_old";
ALTER TYPE "MaritalStatus_new" RENAME TO "MaritalStatus";
DROP TYPE "MaritalStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "patient_health_data" ALTER COLUMN "hasAllergies" DROP NOT NULL,
ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "hasDiabetes" DROP NOT NULL,
ALTER COLUMN "hasDiabetes" SET DEFAULT false,
ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "mentalHealthHistory" DROP NOT NULL,
ALTER COLUMN "immunizationStatus" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" DROP NOT NULL,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" DROP NOT NULL,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "maritalStatus" SET DEFAULT 'UNMARRIED';
