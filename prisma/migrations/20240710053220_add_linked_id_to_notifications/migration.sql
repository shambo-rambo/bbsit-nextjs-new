-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_familyId_fkey";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "groupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "linkedId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "familyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "FamilyGroupPoints" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyGroupPoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyGroupPoints_familyId_groupId_key" ON "FamilyGroupPoints"("familyId", "groupId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyGroupPoints" ADD CONSTRAINT "FamilyGroupPoints_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyGroupPoints" ADD CONSTRAINT "FamilyGroupPoints_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
