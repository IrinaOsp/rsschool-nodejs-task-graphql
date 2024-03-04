import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType, memberTypeId } from './member.js';
import { PrismaClient } from '@prisma/client';

export interface ICreateProfile {
  dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: string };
}

export interface IChangeProfile {
  id: string;
  dto: { isMale: boolean; yearOfBirth: number; memberTypeId: string };
}

export const profileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: memberType,
      resolve: async (
        { memberTypeId }: { memberTypeId: string },
        __,
        context: PrismaClient,
      ) => {
        return await context.memberType.findUnique({
          where: { id: memberTypeId },
        });
      },
    },
    memberTypeId: { type: new GraphQLNonNull(memberTypeId) },
  }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeId) },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeId) },
  }),
});
