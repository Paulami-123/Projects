import axios from 'axios';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphQLContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserServices, { SignInDetails, SignUpDetails, UserUpdate } from '../../services/user';
import { redisClient } from '../../client/redis';

const queries = {

    verifyGoogleToken : async(parent: any, {token}: {token: string}) => {
        const userToken = await UserServices.verifyGoogleAuthToken(token);
        return userToken;
    },

    getCurrentUser: async(parent: any, args: any, ctx: GraphQLContext) => {
        if(!ctx.user?.id){
            return null;
        }
        const userData = await UserServices.getUserById(ctx.user.id);
        return userData;
    },

    getUserByUsername: async(parent: any, { username }: { username: string }, ctx: GraphQLContext) =>{
        const response = await UserServices.getUserByUsername(username);
        return response;
    },

    deleteUserAccount: async(parent: any, args: any, ctx: GraphQLContext,) => {
        // if(!ctx.user) throw new Error('You are not authenticated');
        if(!ctx.user){
            return {success: false, error: 'You are not authenticated'};
        }
        const response = await UserServices.deleteUser(ctx.user.id);
        return response;
    }
    
};

const mutations = {

    userSignUpToken: async(parent: any, { userData }: { userData: SignUpDetails }) => UserServices.createUserAccount(userData),
    
    userSignInToken: async(parent: any, {userData}: { userData: SignInDetails }) => UserServices.findUserAccount(userData),

    updateUserData: async(parent: any, {userData}: { userData: UserUpdate }, ctx: GraphQLContext) => {
        // if(!ctx.user || !ctx.user.id)   throw new Error('You are not authenticated');
        if(!ctx.user || !ctx.user.id){
            return {data: null, error: 'You are not authenticated'};
        }
        const updatedUser = await UserServices.updateUser(ctx.user.id, userData);
        return updatedUser;
    },

    followUser: async(parent: any, {to}: { to: string }, ctx: GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ('You are not authenticated');
        await UserServices.followUser(ctx.user.id, to);
        await redisClient.del(`RECOMMENDED_USER:${ctx.user?.id}`);
        return true;
    },

    unfollowUser: async(parent: any, {to}: { to: string }, ctx: GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ('You are not authenticated');
        await UserServices.unfollowUser(ctx.user.id, to);
        await redisClient.del(`RECOMMENDED_USER:${ctx.user?.id}`);
        return true;
    },
    
};

const extraResolvers = {
    User: {
        posts: (parent: User) => prismaClient.post.findMany({where: {author: {id: parent.id}}}),
        followers: async(parent: User) => {
            const result = await prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {follower: true}
            });

            return result.map((el) => el.follower)
        },
        following: async(parent: User) => {
            const result = await prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {following: true}
            });

            return result.map((el) => el.following)
        }, 
        recommendedUsers: async(parent: User, _: any, ctx: GraphQLContext) => {
            if(!ctx) return [];
            const cachedValue = await redisClient.get(`RECOMMENDED_USER:${ctx.user?.id}`);

            if(cachedValue) return JSON.parse(cachedValue);

            const myFollowings = await prismaClient.follows.findMany({
                where: {
                    follower: {id: ctx.user?.id}
                },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true
                                }
                            }
                        }
                    }
                }
            });

            const users: User[] = [];

            for (const followings of myFollowings){
                for(const followingByFollowedUser of followings.following.followers){
                    if(followingByFollowedUser.following.id!==ctx.user?.id 
                        && 
                    myFollowings.findIndex((e) => e.followingId===followingByFollowedUser.following.id)<0){
                        users.push(followingByFollowedUser.following);
                    }
                }
            }

            await redisClient.set(`RECOMMENDED_USER:${ctx.user?.id}`, JSON.stringify(users)); 

            return users;
        }
    }
};

export const resolvers = { 
    queries, 
    extraResolvers, 
    mutations
};