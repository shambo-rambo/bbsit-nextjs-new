// app/family/settings/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import FamilySettingsForm from '@/components/FamilySettingsForm';
import { redirect } from 'next/navigation';

export default async function FamilySettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      family: { 
        include: { 
          members: true, 
          children: true,
          adminOfGroups: true
        } 
      } 
    }
  });

  if (!user || !user.family) {
    redirect('/family/dashboard');
  }

  return (
    <div>
      <FamilySettingsForm family={user.family} currentUser={user} />
    </div>
  );
}