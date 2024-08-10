import { prismaClient } from "../client/db";
import { redisClient } from "../client/redis";

export interface CreatePostPayload {
    content: string;
    postImages: string[];
    userId: string;
  }
  
class PostServices {

    public static async createPost(data: CreatePostPayload){
        const rateLimitFlage = await redisClient.get(`RATE_LIMIT:POST:${data.userId}`);
        if(rateLimitFlage) throw new Error('Please wait for a while.');
        const post = await prismaClient.post.create({
            data: {
                content: data.content,
                images: data.postImages,
                author: {connect: {id: data.userId}},
            }
        });
        await redisClient.setex(`RATE_LIMIT:POST:${post.authorId}`, 10, 1);
        await redisClient.del('ALL_POSTS');
        return post;
    }

    public static async getAllPosts(){
        const cachedPosts = await redisClient.get('ALL_POSTS');
        if(cachedPosts) return JSON.parse(cachedPosts);
        const posts = await prismaClient.post.findMany({ 
            orderBy: { 
                createdAt: 'desc' ,
            } ,
        });
        await redisClient.set('ALL_POSTS', JSON.stringify(posts));
        return posts;
    }
}

export default PostServices;