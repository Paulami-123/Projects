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

const queries = {
    verifyGoogleToken: async(parent: any, {token}: {token: string}) => {
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
            const uname = data.given_name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4)
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
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
    }
};

const extraResolvers = {
    User: {
        posts: (parent: User) => prismaClient.post.findMany({where: {author: {id: parent.id}}})
    }
}

export const resolvers = { queries, extraResolvers };