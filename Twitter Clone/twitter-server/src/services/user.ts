import axios from "axios";
import { prismaClient } from "../client/db";
import JWTService from "./jwt";

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

interface UserUpdate {
    name?: string,
    about?: string,
    profileImageURL: string,
    coverImageURL?: string
}

const defaultProfileImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Profile%20Image.jpg?t=2024-08-08T09%3A07%3A03.532Z";
const defaultCoverImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Cover%20Image.jfif?t=2024-08-08T09%3A06%3A47.410Z";

class UserServices {
    public static async verifyGoogleAuthToken(token: string){
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
                    name: data.given_name+ " " + data.family_name,
                    about: "Hey there! I am using twitter clone",
                    password: generatedPassword,
                    profileImageURL: data.picture || defaultProfileImage,
                    coverImageURL: defaultCoverImage,
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
    }

    public static async getUserById(id: string){
        return prismaClient.user.findUnique({
            where: { id }
        })
    }

    public static async getUserByUsername(username: string){
        return prismaClient.user.findUnique({
            where: { username: username }
        })
    }

    public static followUser (from: string, to: string){
        return prismaClient.follows.create({
            data: {
                follower: { connect: { id: from } },
                following: { connect: { id: to } }
            }
        })
    }

    public static unfollowUser (from: string, to: string){
        return prismaClient.follows.delete({
            where: {
                followerId_followingId: {followerId: from, followingId: to}
            }
        })
    }

    public static updateUser (id: string, userData: UserUpdate){
        return prismaClient.user.update({
            where: {
                id
            }, 
            data: {
                name: userData.name,
                about: userData.about,
                profileImageURL: userData.profileImageURL,
                coverImageURL: userData.coverImageURL
            }
        });
    }
}

export default UserServices;