import { Post } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphQLContext } from "../../interfaces";
import PostServices, { CreatePostPayload } from "../../services/post";

const queries = {
    getAllPosts: async() => PostServices.getAllPosts(),
};

const mutations = {
    createPost: async(parent: any, { payload }: { payload: CreatePostPayload }, ctx: GraphQLContext) => {
        // if(!ctx.user) throw new Error("You are not authenticated");
        if(!ctx.user){
            return {success: false, error: "You are not authenticated"};
        }
        const post = await PostServices.createPost({
            ...payload,
            userId: ctx.user.id
        });
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