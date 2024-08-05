import axios from 'axios';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphQLContext } from '../../interfaces';
import { User } from '@prisma/client';


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
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}

const queries = {

    verifyGoogleToken: async(parent: any, { token }: { token: string }) => {
        const googleToken = token;
        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOAuthURL.searchParams.set('id_token', googleToken);

        const { data } = await axios.get<GoogleTokenResult>(
            googleOAuthURL.toString(), {
                responseType: 'json'
            }
        )

        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if(!existingUser){
            const uname = data.given_name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    about: "Hey there! I am using twitter clone",
                    password: generatedPassword,
                    profileImageURL: data.picture,
                    username: uname
                },
            });
        }

        const userInfo = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if(!userInfo) throw new Error('User not found');
        const userToken = JWTService.generateTokenForUser(userInfo);
        console.log(userToken)

        return userToken;
    },

    getCurrentUser: async(parent: any, args: any, ctx: GraphQLContext) => {
        console.log(ctx);
        const id = ctx.user?.id;
        if(!id){
            return null;
        }
        const userData = await prismaClient.user.findUnique({
            where: {id}
        });

        return userData;
    },

    getUserByUsername: async(parent: any, { username }: { username: string }, ctx: GraphQLContext) =>{
        const user = prismaClient.user.findUnique({ 
            where: { 
                username: username 
            } 
        });
        return user;
    }
    
};

const extraResolvers = {
    User: {
        posts: (parent: User) => prismaClient.post.findMany({where: {author: {id: parent.id}}})
    }
};

const mutations = {

    userSignUpToken: async(parent: any, { userData }: { userData: SignUpDetails }) => {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: userData.email
            }
        });

        if(existingUser) throw new Error ('User already exists. Try logging in instead.');

        const uname = userData.firstName.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4)
        const newUser = await prismaClient.user.create({
            data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                about: "Hey there! I am using twitter clone",
                username: uname,
                email: userData.email,
                password: userData.password,
                profileImageURL: "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
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
    
};

export const resolvers = { 
    queries, 
    extraResolvers, 
    mutations
};