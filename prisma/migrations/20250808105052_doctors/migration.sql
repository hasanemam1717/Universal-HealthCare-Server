/*
  Warnings:

  - You are about to drop the column `avarageRating` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `averageRating` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "avarageRating",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL;
