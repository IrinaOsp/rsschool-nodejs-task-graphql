import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { userType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { memberType, memberTypeId } from './types/member.js';
import { postType } from './types/post.js';
import { profileType } from './types/profile.js';
import { PrismaClient } from '@prisma/client';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.user.findFirst({
          where: { id },
        });
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (_, __, context: PrismaClient) => {
        return await context.user.findMany();
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.post.findUnique({
          where: {
            id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (_, __, context: PrismaClient) => {
        return await context.post.findMany();
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.profile.findUnique({
          where: {
            id,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (_, __, context: PrismaClient) => {
        return await context.profile.findMany();
      },
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeId) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.memberType.findUnique({
          where: {
            id,
          },
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: async (_, __, context: PrismaClient) => {
        return context.memberType.findMany();
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: postType,
    },
  },
});

export const schema = new GraphQLSchema({ query, mutation });
