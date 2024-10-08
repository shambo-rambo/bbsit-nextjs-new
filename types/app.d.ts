// types/app.d.ts

import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaJson {
    type PrismaClientOptions = Prisma.PrismaClientOptions;
  }
}

export type FamilyWithRelations = Prisma.FamilyGetPayload<{
  include: {
    members: true,
    children: true,
    groups: true,
    adminOfGroups: true,
    participatingEvents: true,
    createdEvents: true,
  }
}> & { image: string | null };

export interface Family extends FamilyWithRelations {}

export { PrismaEventStatus as EventStatus };

export interface EventWithRelations extends Prisma.EventGetPayload<{
  include: {
    family: true,
    creatorFamily: true,
    group: true,
  }
}> {
  status: EventStatus;
  acceptedByName?: string | null;
}

export type GroupBasic = Pick<Prisma.GroupGetPayload<{}>, 'id' | 'name' | 'adminId' | 'inviteCode'>;

export type GroupWithRelations = Prisma.GroupGetPayload<{
  include: {
    admin: true,
    members: true,
    events: {
      include: {
        family: true,
        creatorFamily: true,
        group: true,
      }
    },
    familyPoints: true,
  }
}> & GroupBasic;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { family: true }
}>;

export type UserWithFamilyForDashboard = Prisma.UserGetPayload<{
  include: {
    family: {
      include: {
        groups: {
          select: {
            id: true,
            name: true,
          }
        },
        adminOfGroups: {
          select: {
            id: true,
          }
        }
      }
    }
  }
}>;

export type UserWithFamily = Prisma.UserGetPayload<{
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
}>;

export interface SimpleFamilyInfo {
  id: string;
  name: string;
  homeAddress: string;
  image: string | null;
  children: Array<{ id: string; name: string }>;
  members: Array<{ id: string; name: string | null; email: string }>;
  groups: Array<{ id: string; name: string }>;
}

export interface SimpleUser {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
}

export type DashboardFamily = Pick<Family, 'id' | 'name' | 'homeAddress' | 'image' | 'children'> & {
  members: Array<Pick<Family['members'][number], 'id' | 'name' | 'email'>>;
  groups: Array<Pick<Family['groups'][number], 'id' | 'name'>>;
};

export interface DashboardSummary {
  user: SimpleUser;
  family: DashboardFamily | null;
  pendingInvitationsCount: number;
  upcomingEvents: Array<{
    id: string;
    name: string;
    startTime: Date;
    groupName: string;
  }>;
}

export type FamilyDashboardData = Prisma.FamilyGetPayload<{
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
}> & { image: string | null };

export type InvitationWithRelations = Prisma.InvitationGetPayload<{
  include: { inviterFamily: true, group: true }
}>;

export type ChildWithRelations = Prisma.ChildGetPayload<{
  include: { family: true }
}>;

export type FamilyGroupPointsWithRelations = Prisma.FamilyGroupPointsGetPayload<{
  include: { family: true, group: true }
}>;

export interface Family extends FamilyWithRelations {}
export interface Event extends EventWithRelations {}
export interface Group extends GroupWithRelations {}
export interface User extends UserWithRelations {}
export interface Child extends ChildWithRelations {}
export interface FamilyGroupPoints extends FamilyGroupPointsWithRelations {}

export interface EventListProps {
  groupId: string;
  familyId: string;
  events: EventWithRelations[];
  isAdmin: boolean;
}

export { Family, Event, Group, User, Child, FamilyGroupPoints };

export interface EventInclude {
  family?: boolean;
  creatorFamily?: boolean;
  group?: boolean;
}

export interface EventSelect {
  id?: boolean;
  name?: boolean;
  description?: boolean;
  startTime?: boolean;
  endTime?: boolean;
  points?: boolean;
  status?: boolean;
  creatorFamilyId?: boolean;
  familyId?: boolean;
  groupId?: boolean;
}

export interface EventWhereUniqueInput {
  id: string;
}


export type FamilyWithFullDetails = Prisma.FamilyGetPayload<{
  include: {
    members: true,
    children: true,
    groups: {
      include: {
        admin: true,
        events: true,
      }
    },
    adminOfGroups: true,
    participatingEvents: {
      include: {
        group: true,
        creatorFamily: true,
      }
    },
    createdEvents: {
      include: {
        group: true,
        family: true,
      }
    },
    invitations: true,
    groupPoints: true,
  }
}> & { image: string | null };

export type FamilyMember = FamilyWithFullDetails['members'][number];

