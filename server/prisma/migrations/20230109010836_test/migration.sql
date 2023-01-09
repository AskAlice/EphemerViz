-- DropIndex
DROP INDEX "Ephemeris_Epoch_idx";

-- AlterTable
ALTER TABLE "Ephemeris" ALTER COLUMN "Epoch" DROP DEFAULT;
