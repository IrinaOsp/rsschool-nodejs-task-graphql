import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { postType } from './post.js';
import { PrismaClient } from '@prisma/client';

export interface UserInput {
  name: string;
  balance: number;
}

export const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType,
      resolve: async ({ id }: { id: string }, __, context: PrismaClient) => {
        return await context.profile.findUnique({
          where: { userId: id },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async ({ id }: { id: string }, __, context: PrismaClient) => {
        return await context.post.findMany({
          where: { authorId: id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async ({ id }: { id: string }, __, context: PrismaClient) => {
        return await context.user.findMany({
          where: {
            subscribedToUser: {
              some: { subscriberId: id },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async ({ id }: { id: string }, __, context: PrismaClient) => {
        return await context.user.findMany({
          where: {
            userSubscribedTo: {
              some: { authorId: id },
            },
          },
        });
      },
    },
  }),
});
