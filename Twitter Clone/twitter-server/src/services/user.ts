import axios from "axios";
import { prismaClient } from "../client/db";
import JWTService from "./jwt";
import { redisClient } from "../client/redis";

export interface GoogleTokenResult {
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

export interface UserUpdate {
    data: {
        name?: string,
    about?: string,
    profileImageURL?: string,
    coverImageURL?: string
    }
}

const defaultProfileImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Profile%20Image.jpg?t=2024-08-08T09%3A07%3A03.532Z";
const defaultCoverImage = "https://czzkufhubdhqzbdhwljm.supabase.co/storage/v1/object/public/twitter-images/Cover%20Image.jfif?t=2024-08-08T09%3A06%3A47.410Z";

class UserServices {
    public static async verifyGoogleAuthToken(token: string){
        const googleToken = token;
        const googleOAuthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOAuthURL.searchParams.set('id_token', googleToken);
        const { data } = await axios.get<GoogleTokenResult>(
            googleOAuthURL.toString(),
            {
                responseType: 'json'
            }
        );
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
                    name: data.given_name + ' ' + data.family_name,
                    username: uname,
                    password: generatedPassword,
                    profileImageURL: defaultProfileImage,
                    coverImageURL: defaultCoverImage
                }
            });
        }
        const userInfo = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        if(!userInfo) throw new Error('User with email not found');

        const userToken = JWTService.generateTokenForUser(userInfo);
        return userToken;
    }

    public static async getUserById(id: string){
        return prismaClient.user.findUnique({
            where: { id }
        })
    }

    public static async getUserByUsername(username: string){
        const cachedUser = await redisClient.get(`USER:${username}`);
        if(cachedUser) return JSON.parse(cachedUser);

        const userData = await prismaClient.user.findUnique({
            where: { username: username }
        });

        if(!userData) throw new Error('User does not exist');

        await redisClient.set(`USER:${username}`, JSON.stringify(userData));
        return userData;
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

    public static async updateUser (id: string, userData: UserUpdate){
        console.log("User data: ", userData);
        console.log("ID: ", id);
        const updatedUser = await prismaClient.user.update({
            where: {
                id,
            }, 
            data: {
                name: userData.data.name,
                about: userData.data.about,
                profileImageURL: userData.data.profileImageURL,
                coverImageURL: userData.data.coverImageURL,
            },
        });
        if(!updatedUser) throw new Error ('Error while updating data');
        console.log(updatedUser);
        await redisClient.set(`USER:${updatedUser.username}`, JSON.stringify(updatedUser));
        return updatedUser;
    }

    public static async deleteUser(id: string){
        const deletedUser = await prismaClient.user.delete({
            where: {
                id
            },
        });
        const cachedUser = await redisClient.get(`USER:${deletedUser.username}`);
        if(!cachedUser) throw new Error('User does not exist.');
        if(!deletedUser) return false;
        await redisClient.del(`USER:${deletedUser.username}`);
        await redisClient.del('ALL_POSTS');
        return true;
    }
}

export default UserServices;