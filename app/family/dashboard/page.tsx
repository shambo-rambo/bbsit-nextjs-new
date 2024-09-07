// app/family/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import FamilyDashboardClient from '@/components/FamilyDashboardClient';
import { DashboardSummary, SimpleUser, DashboardFamily } from '@/types/app';
import FriendlyError from '@/components/FriendlyError';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Family Dashboard',
  description: 'Manage your family and invitations',
}

async function getDashboardSummary(email: string): Promise<DashboardSummary | null> {
  try {
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
                email: true,
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

    console.log('User found:', JSON.stringify(user, null, 2));

    if (!user) return null;

    const pendingInvitationsCount = await prisma.invitation.count({
      where: { inviteeEmail: email, status: 'pending' }
    });

    const dashboardSummary: DashboardSummary = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      } as SimpleUser,
      family: user.family ? {
        id: user.family.id,
        name: user.family.name,
        image: user.family.image,
        homeAddress: user.family.homeAddress,
        children: user.family.children,
        members: user.family.members,
        groups: user.family.groups,
      } as DashboardFamily : null,
      upcomingEvents: user.family?.participatingEvents.map(event => ({
        id: event.id,
        name: event.name,
        startTime: event.startTime,
        groupName: event.group.name,
      })) ?? [],
      pendingInvitationsCount,
    };

    return dashboardSummary;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return null;
  }
}

export default async function FamilyDashboard() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in FamilyDashboard:', session);

    if (!session || !session.user?.email) {
      console.log('No session or user email');
      return <div>Not authenticated. Please sign in to view your family dashboard.</div>;
    }

    const dashboardSummary = await getDashboardSummary(session.user.email);
    console.log('Dashboard Summary in FamilyDashboard:', JSON.stringify(dashboardSummary, null, 2));

    if (!dashboardSummary) {
      console.log('No dashboard summary');
      return <div>User not found. There might be an issue with your account.</div>;
    }

    if (!dashboardSummary.family) {
      console.log('No family in dashboard summary');
      return (
        <div className="container mx-auto px-4 py-8">
          <FriendlyError 
            message="It looks like you haven't set up your family yet." 
            suggestion="Create your family profile to start managing events."
          />
          <Link href="/family/create" className="mt-4 inline-block px-6 py-2 bg-accent text-black rounded-full hover:bg-opacity-90 transition-colors">
            Create Family Profile
          </Link>
        </div>
      );
    }

    console.log('Rendering FamilyDashboardClient with:', JSON.stringify(dashboardSummary, null, 2));
    return <FamilyDashboardClient dashboardSummary={dashboardSummary} />;
  } catch (error) {
    console.error('Error in FamilyDashboard:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}