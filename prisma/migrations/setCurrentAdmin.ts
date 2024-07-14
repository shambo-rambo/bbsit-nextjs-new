import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const families = await prisma.family.findMany({
    where: {
      currentAdminId: null
    }
  });

  for (const family of families) {
    await prisma.family.update({
      where: { id: family.id },
      data: { currentAdminId: family.adminId }
    });
  }

  console.log(`Updated ${families.length} families`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
