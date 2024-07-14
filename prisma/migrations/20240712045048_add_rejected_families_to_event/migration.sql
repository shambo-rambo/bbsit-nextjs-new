-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "rejectedFamilies" TEXT[] DEFAULT ARRAY[]::TEXT[];
