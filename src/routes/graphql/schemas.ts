import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {
  ChangeUserInputType,
  CreateUserInputType,
  IChangeUser,
  ICreateUser,
  userType,
} from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { memberType, memberTypeId } from './types/member.js';
import {
  ChangePostInputType,
  CreatePostInputType,
  IChangePost,
  ICreatePost,
  postType,
} from './types/post.js';
import {
  ChangeProfileInputType,
  CreateProfileInputType,
  IChangeProfile,
  ICreateProfile,
  profileType,
} from './types/profile.js';
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
      args: {
        dto: { type: CreatePostInputType },
      },
      resolve: async (_, { dto }: ICreatePost, context: PrismaClient) => {
        return await context.post.create({
          data: dto,
        });
      },
    },

    changePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInputType },
      },
      resolve: async (_, { id, dto }: IChangePost, context: PrismaClient) => {
        return await context.post.update({
          where: { id },
          data: dto,
        });
      },
    },

    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.post
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false);
      },
    },

    createProfile: {
      type: profileType,
      args: {
        dto: { type: CreateProfileInputType },
      },
      resolve: async (_, { dto }: ICreateProfile, context: PrismaClient) => {
        return await context.profile.create({
          data: dto,
        });
      },
    },

    changeProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInputType },
      },
      resolve: async (_, { id, dto }: IChangeProfile, context: PrismaClient) => {
        return await context.profile.update({
          where: { id },
          data: dto,
        });
      },
    },

    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.profile
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false);
      },
    },

    createUser: {
      type: userType,
      args: {
        dto: { type: CreateUserInputType },
      },
      resolve: async (_, { dto }: ICreateUser, context: PrismaClient) => {
        return await context.user.create({
          data: dto,
        });
      },
    },

    changeUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInputType },
      },
      resolve: async (_, { id, dto }: IChangeUser, context: PrismaClient) => {
        return await context.user.update({
          where: { id },
          data: dto,
        });
      },
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
        return await context.user
          .delete({ where: { id } })
          .then(() => true)
          .catch(() => false);
      },
    },

    subscribeTo: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: PrismaClient,
      ) => {
        await context.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });

        return await context.user.findUnique({
          where: { id: userId },
        });
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: PrismaClient,
      ) => {
        await context.subscribersOnAuthors.deleteMany({
          where: { subscriberId: userId, authorId },
        });
      },
    },
  },
});

export const schema = new GraphQLSchema({ query, mutation });
