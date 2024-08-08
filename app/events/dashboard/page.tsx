import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import EventList from '@/components/EventList';
import FriendlyError from '@/components/FriendlyError';
import Link from 'next/link';
import { UserWithFamily, EventWithRelations, Group } from '@/types/app';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Define a more specific type for the groups we're working with
type GroupWithEvents = Group & {
  events: EventWithRelations[];
};

export default async function EventsDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return (
      <FriendlyError 
        message="Oops! It looks like you're not signed in." 
        suggestion="Please sign in to view the Events Dashboard."
      />
    );
  }

  let user: UserWithFamily | null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
            createdEvents: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <FriendlyError 
        message="We couldn't find your user profile." 
        suggestion="There might be an issue with your account. Please try signing out and in again."
      />
    );
  }

  if (!user || !user.family) {
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

  const { family } = user;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-accent">Events</h1>
        {(family.groups as GroupWithEvents[]).map((group) => {
          const isAdmin = family.adminOfGroups.some(adminGroup => adminGroup.id === group.id);
          return (
            <div key={group.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Group: {group.name}</h2>
              <EventList 
                groupId={group.id} 
                familyId={family.id}
                events={group.events}
                isAdmin={isAdmin}
              />
            </div>
          );
        })}
        {family.groups.length === 0 && (
          <div className="text-center">
            <p className="text-lg mb-4">You&apos;re not part of any groups yet.</p>
            <Link href="/groups/join" className="px-6 py-2 bg-accent text-black rounded-full hover:bg-opacity-90 transition-colors">
              Join a Group
            </Link>
          </div>
        )}
      </div>
    </Suspense>
  );
}