// app/events/[eventId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { EventWithRelations, FamilyWithFullDetails } from '@/types/app';
import dynamic from 'next/dynamic';

const EventItemWrapper = dynamic(() => import('@/components/EventItemWrapper'), { ssr: false });

async function getEvent(eventId: string): Promise<EventWithRelations | null> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      creatorFamily: true,
      family: true,
      group: true,
    },
  });

  return event as EventWithRelations | null;
}

async function getFamilyData(familyId: string): Promise<FamilyWithFullDetails | null> {
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      members: true,
    },
  });

  return family as FamilyWithFullDetails | null;
}

export default async function EventPage({ params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  const event = await getEvent(params.eventId);

  if (!session) {
    return <div>Please log in to view this event.</div>;
  }

  if (!event) {
    notFound();
  }

  const currentFamilyId = session.user?.familyId || '';
  const isAdmin = session.user?.isAdmin || false;
  const familyData = await getFamilyData(currentFamilyId);

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <EventItemWrapper 
        event={event}
        currentFamilyId={currentFamilyId}
        familyData={familyData}
        isAdmin={isAdmin}
      />
    </div>
  );
}