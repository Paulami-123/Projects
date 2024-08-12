import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa6";
import { IoHeartOutline } from "react-icons/io5";
import { GoBookmark, GoUpload } from "react-icons/go";
import { Post } from "@/gql/graphql";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllPostsQuery } from "@/graphql/query/post";

interface FeedCardProps {
    post: Post
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const post = props.post;
    const [postedOn, setPostedOn] = useState('');
    useEffect(() => {
        const minutes = Math.floor((new Date().getTime() - new Date(post.createdAt).getTime())/(60*1000));
        if(minutes<=0){
            setPostedOn('Just Now');
        }
        else if(minutes>0 && minutes<60){
            setPostedOn(`${minutes}m ago`);
        }
        else{
            const hrs = Math.floor(minutes/60);
            if(hrs<24){
                setPostedOn(`${hrs}h ago`);
            }
            else if(hrs>=24 && hrs<48){
                setPostedOn('1 day ago');
            }
            else if(hrs>=48 && hrs<24*7){
                const days = Math.floor(hrs/24)
                setPostedOn(`${days} day ago`)
            }
            else{
                setPostedOn(new Date(post.createdAt).toDateString().substring(4))
            }
        }
    }, [])
    return(
        <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1 mt-2">
                    {post.author?.profileImageURL && (
                        <img src={post.author.profileImageURL}
                        alt={post.author.name} className="rounded-full w-full h-4 lg:h-10 hidden md:block" />
                    )}
                </div>
                <div className="col-span-11 text-white">
                    <div className="flex gap-2 text-gray-500">
                        <Link href={`/${post.author.username}`}
                        className="font-bold text-white hover:underline">
                            {post.author.name}
                        </Link>
                        <h5>{"@"+post.author?.username}</h5>
                        <div className="hidden lg:block">•</div>
                        <h5 className="hidden lg:block">{postedOn}</h5>
                    </div>
                    <p>{post.content}</p>
                    <div>
                        {post?.images && post.images.map((img) => (
                            <Image src={img || '#'} alt="image" width={125} height={125} className="w-full p-3 rounded-lg" />
                        ))}
                    </div>
                    <div className="flex justify-between mt-5 text-xl text-gray-500 items-center">
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <FaRetweet />
                        </div>
                        <div>
                            <IoHeartOutline />
                        </div>
                        <div>
                            <GoBookmark />
                        </div>
                        <div>
                            <GoUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard;

export const getServerSideProps: GetServerSideProps = async(context) => {
    const allPosts = await graphqlClient.request(getAllPostsQuery);
    return {
        props: {
            posts: allPosts.getAllPosts
        }
    }
}