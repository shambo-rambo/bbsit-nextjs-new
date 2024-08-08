// bbsit-deploy/app/family/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import FamilyDashboardClient from '@/components/FamilyDashboardClient';
import { UserWithFamily, Family } from '@/types/app';

export const metadata: Metadata = {
  title: 'Family Dashboard',
  description: 'Manage your family and invitations',
}

async function getUser(email: string): Promise<UserWithFamily | null> {
  return prisma.user.findUnique({
    where: { email },
    include: {
      family: {
        include: {
          members: true,
          children: true,
          groups: {
            include: {
              events: {
                include: {
                  family: true,
                  group: true,
                  creatorFamily: true
                }
              }
            }
          },
          adminOfGroups: true,
          participatingEvents: true,
          createdEvents: true,
        }
      }
    }
  });
}

async function getPendingInvitations(email: string) {
  return prisma.invitation.findMany({
    where: { inviteeEmail: email, status: 'pending' },
    include: { inviterFamily: true, group: true }
  });
}

export default async function FamilyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return <div>Not authenticated. Please sign in to view your family dashboard.</div>;
  }

  const user = await getUser(session.user.email);
  if (!user) {
    return <div>User not found. There might be an issue with your account.</div>;
  }

  const pendingInvitations = await getPendingInvitations(user.email);

  return <FamilyDashboardClient user={user} pendingInvitations={pendingInvitations} />;
}