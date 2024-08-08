import { Post } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphQLContext } from "../../interfaces";

interface CreatePostPayload{
    content: string
    postImages?: string[]
}


const queries = {
    getAllPosts: () => prismaClient.post.findMany({orderBy: {createdAt: 'desc'}})
};

const mutations = {
    createPost: async(parent: any, { payload }: { payload: CreatePostPayload }, ctx: GraphQLContext) => {
        if(!ctx.user) throw new Error("You are not authenticated");
        const post = await prismaClient.post.create({
            data: {
                content: payload.content,
                images: payload.postImages,
                author: {connect: {id: ctx.user.id}},
            }
        });

        if(!post) throw new Error ('Error while creating post.')

        return post;
    }
};

const extraResolvers = {
    Post: {
        author: (parent: Post) => prismaClient.user.findUnique({where: {id: parent.authorId}})
    },
};

export const resolvers = { 
    mutations, 
    extraResolvers, 
    queries 
}