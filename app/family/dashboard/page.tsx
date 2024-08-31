// app/family/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import FamilyDashboardClient from '@/components/FamilyDashboardClient';

export const metadata: Metadata = {
  title: 'Family Dashboard',
  description: 'Manage your family and invitations',
}

type DashboardSummary = {
  user: {
    id: string;
    name: string | null;
    email: string;
    isAdmin: boolean;
  };
  family: {
    id: string;
    name: string;
    image: string | null;
    homeAddress: string;
  } | null;
  members: Array<{
    id: string;
    name: string | null;
  }>;
  groups: Array<{
    id: string;
    name: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    name: string;
    startTime: Date;
    groupName: string;
  }>;
  pendingInvitationsCount: number;
};

async function getDashboardSummary(email: string): Promise<DashboardSummary | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      family: {
        select: {
          id: true,
          name: true,
          image: true,
          homeAddress: true,
          children: {
            select: {
              id: true,
              name: true,
            }
          },
          members: {
            select: {
              id: true,
              name: true,
            }
          },
          groups: {
            select: {
              id: true,
              name: true,
            }
          },
          participatingEvents: {
            where: {
              startTime: {
                gte: new Date(),
              }
            },
            orderBy: {
              startTime: 'asc',
            },
            take: 5,
            select: {
              id: true,
              name: true,
              startTime: true,
              group: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  const pendingInvitationsCount = await prisma.invitation.count({
    where: { inviteeEmail: email, status: 'pending' }
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    family: user.family ? {
      id: user.family.id,
      name: user.family.name,
      image: user.family.image,
      homeAddress: user.family.homeAddress,
      children: user.family.children,
    } : null,
    members: user.family?.members ?? [],
    groups: user.family?.groups ?? [],
    upcomingEvents: user.family?.participatingEvents.map(event => ({
      id: event.id,
      name: event.name,
      startTime: event.startTime,
      groupName: event.group.name,
    })) ?? [],
    pendingInvitationsCount,
  };
}

export default async function FamilyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return <div>Not authenticated. Please sign in to view your family dashboard.</div>;
  }

  const dashboardSummary = await getDashboardSummary(session.user.email);
  if (!dashboardSummary) {
    return <div>User not found. There might be an issue with your account.</div>;
  }

  return <FamilyDashboardClient dashboardSummary={dashboardSummary} />;
}