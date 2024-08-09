import axios from 'axios';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphQLContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserServices from '../../services/user';


interface GoogleTokenResult {
    iss?: string,
    nbf?: string,
    aud?: string,
    sub?: string,
    email: string,
    email_verified: string,
    azp?: string,
    name?: string,
    picture?: string,
    given_name: string,
    family_name?: string,
    iat?: string,
    exp?: string,
    jti?: string,
    alg?: string,
    kid?: string,
    typ?: string
}

interface SignInDetails {
    email: string,
    password: string
}

interface SignUpDetails {
    name: string,
    email: string,
    password: string
}

interface UserUpdate {
    name?: string,
    about?: string,
    profileImageURL: string,
    coverImageURL?: string
}

const defaultProfileImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Profile%20Image.jpg?t=2024-08-08T09%3A07%3A03.532Z";
const defaultCoverImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Cover%20Image.jfif?t=2024-08-08T09%3A06%3A47.410Z";

const queries = {

    verifyGoogleToken: async(parent: any, { token }: { token: string }) => {
        const userToken = await UserServices.verifyGoogleAuthToken(token);
        return userToken;
    },

    getCurrentUser: async(parent: any, args: any, ctx: GraphQLContext) => {
        const id = ctx.user?.id;
        if(!id){
            return null;
        }
        const userData = await UserServices.getUserById(id);
        return userData;
    },

    getUserByUsername: async(parent: any, { username }: { username: string }, ctx: GraphQLContext) =>UserServices.getUserByUsername(username)
    
};

const mutations = {

    userSignUpToken: async(parent: any, { userData }: { userData: SignUpDetails }) => {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: userData.email
            }
        });

        if(existingUser) throw new Error ('User already exists. Try logging in instead.');

        const uname = userData.name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4)
        const newUser = await prismaClient.user.create({
            data: {
                name: userData.name,
                about: "Hey there! I am using twitter clone",
                username: uname,
                email: userData.email,
                password: userData.password,
                profileImageURL: defaultProfileImage,
                coverImageURL: defaultCoverImage,
            }
        });

        if(!newUser) throw new Error('Error while signing up. Try again.');
        const userToken = JWTService.generateTokenForUser(newUser);
        return userToken;
    },
    
    userSignInToken: async(parent: any, {userData}: { userData: SignInDetails }) => {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: userData.email
            }
        });
        if(!existingUser) throw new Error ('User does not exist. Try signing up instead.');
        else if(existingUser.password!==userData.password) throw new Error ('Incorrect Password');

        const userToken = JWTService.generateTokenForUser(existingUser);
        return userToken;
    },

    updateUserData: async(parent: any, {userData}: { userData: UserUpdate }, ctx: GraphQLContext) => {
        if(!ctx.user)   throw new Error('You are not authenticated');
        const updatedUser = await prismaClient.user.update({
            where: {
                id: ctx.user.id
            }, 
            data: {
                name: (userData.name && userData.name?.length>0) ? userData.name : undefined,
                about: userData.about,
                profileImageURL: userData.profileImageURL,
                coverImageURL: userData.coverImageURL ? userData.coverImageURL : defaultCoverImage
            }
        });
        if(!updatedUser) throw new Error ('Error while updating data');
        return updatedUser;
    },

    followUser: async(parent: any, {to}: { to: string }, ctx: GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ('You are not authenticated');
        await UserServices.followUser(ctx.user.id, to);
        return true;
    },

    unfollowUser: async(parent: any, {to}: { to: string }, ctx: GraphQLContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error ('You are not authenticated');
        await UserServices.unfollowUser(ctx.user.id, to);
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
    }
};

export const resolvers = { 
    queries, 
    extraResolvers, 
    mutations
};