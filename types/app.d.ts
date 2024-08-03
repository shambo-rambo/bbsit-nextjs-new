// types/app.d.ts

import { Prisma } from '@prisma/client';

export type FamilyDashboardData = Prisma.FamilyGetPayload<{
  include: {
    members: true,
    children: true
  }
}>;

export type FamilyWithRelations = Prisma.FamilyGetPayload<{
  include: {
    members: true,
    children: true,
    groups: true,
    adminOfGroups: true,
    events: true,
  }
}> & { image: string | null };

export type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    family: true,
    creatorFamily: true,
    group: true,
  }
}>;

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

export type UserWithFamily = Prisma.UserGetPayload<{
  include: {
    family: {
      include: {
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
        adminOfGroups: true
      }
    }
  }
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