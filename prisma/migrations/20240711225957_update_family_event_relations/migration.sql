-- Step 1: Add the column as nullable
ALTER TABLE "Event" ADD COLUMN "creatorFamilyId" TEXT;

-- Step 2: Update existing rows
UPDATE "Event" SET "creatorFamilyId" = "familyId" WHERE "creatorFamilyId" IS NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE "Event" ALTER COLUMN "creatorFamilyId" SET NOT NULL;

-- Step 4: Add the foreign key constraint
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorFamilyId_fkey" FOREIGN KEY ("creatorFamilyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;