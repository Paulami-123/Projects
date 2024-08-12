import axios from "axios";
import { prismaClient } from "../client/db";
import JWTService from "./jwt";
import { redisClient } from "../client/redis";
import bcryptjs from "bcryptjs";

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

export interface SignInDetails {
    email: string,
    password: string
}

export interface SignUpDetails {
    name: string,
    email: string,
    password: string
}

const defaultProfileImageURL = "https://media.istockphoto.com/id/1305665241/vector/anonymous-gender-neutral-face-avatar-incognito-head-silhouette-stock-illustration.jpg?s=612x612&w=0&k=20&c=qA6GUTalFyrBCRVUzQgp2B5zODxmOA4NXTBcw9notYY=";
const defaultCoverImageURL = "https://plus.unsplash.com/premium_photo-1663954130790-e85da8e5539c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxhY2t8ZW58MHx8MHx8fDA%3D";

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
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    name: data.given_name + ' ' + data.family_name,
                    username: uname,
                    password: hashedPassword,
                    profileImageURL: defaultProfileImageURL,
                    coverImageURL: defaultCoverImageURL
                }
            });
        }
        const userInfo = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        // if(!userInfo) throw new Error('User with email not found');
        if(!userInfo){
            return {token: null, error: 'User with email not found'};
        }

        const userToken = JWTService.generateTokenForUser(userInfo);
        return {token: userToken, error: null};
    }

    public static async findUserAccount(userData: SignInDetails){
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: userData.email
            }
        });
        // if(!existingUser) throw new Error ('User does not exist. Try signing up instead.');
        if(!existingUser){
            return {token: null, error: 'User does not exist. Try signing up instead.'};
        }
        const validPassword = bcryptjs.compareSync(userData.password, existingUser.password);
        // if(!validPassword) throw new Error('Incorrect Password.');
        if(!validPassword){
            return {token: null, error: 'Incorrect Password.'};
        }

        const userToken = JWTService.generateTokenForUser(existingUser);
        return {token: userToken, error: null};
    }

    public static async createUserAccount(userData: SignUpDetails){
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: userData.email
            }
        });

        // if(existingUser) throw new Error ('User already exists. Try logging in instead.');
        if(existingUser){
            return {token: null, error: 'User already exists. Try logging in instead.'};
        }

        const uname = userData.name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);
        const hashedPassword = bcryptjs.hashSync(userData.password, 10)
        const newUser = await prismaClient.user.create({
            data: {
                name: userData.name,
                about: "Hey there! I am using twitter clone",
                username: uname,
                email: userData.email,
                password: hashedPassword,
                profileImageURL: defaultProfileImageURL,
                coverImageURL: defaultCoverImageURL,
            }
        });

        // if(!newUser) throw new Error('Error while signing up. Try again.');
        if(!newUser){
            return {token: null, error: 'Error while signing up. Try again.'}
        }
        await redisClient.set(`USER:${newUser.username}`, JSON.stringify(userData));
        const userToken = JWTService.generateTokenForUser(newUser);
        return {token: userToken, error: null};
    }

    public static async getUserById(id: string){
        return prismaClient.user.findUnique({
            where: { id }
        })
    }

    public static async getUserByUsername(username: string){
        const cachedUser = await redisClient.get(`USER:${username}`);
        // if(cachedUser) return JSON.parse(cachedUser);
        if(cachedUser){
            return JSON.parse(cachedUser);
        }

        const userData = await prismaClient.user.findUnique({
            where: { username: username }
        });

        // if(!userData) throw new Error('User does not exist');
        if(!userData){
            return null;
        }

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
        const updatedUser = await prismaClient.user.update({
            where: {
                id,
            }, 
            data: {
                name: userData.data.name,
                about: userData.data.about,
                profileImageURL: userData.data.profileImageURL,
                coverImageURL: userData.data.coverImageURL ? userData.data.coverImageURL : defaultCoverImageURL,
            },
        });
        // if(!updatedUser) throw new Error ('Error while updating data');
        if(!updatedUser){
            return {data: null, error: 'Error while updating data'}
        }
        await redisClient.set(`USER:${updatedUser.username}`, JSON.stringify(updatedUser));
        return {data: updatedUser, error: null};
    }

    public static async deleteUser(id: string){
        const deletedUser = await prismaClient.user.delete({
            where: {
                id
            },
        });
        if(!deletedUser){
            return {success: false, error: 'Error while deleting account'};
        }
        await redisClient.del(`USER:${deletedUser.username}`);
        await redisClient.del('ALL_POSTS');
        return {success: true, error: null};
    }
}

export default UserServices;