import {
  GraphQLFloat,
  GraphQLInputObjectType,
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

export interface ICreateUser {
  dto: UserInput;
}

export interface IChangeUser extends ICreateUser {
  id: string;
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

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
