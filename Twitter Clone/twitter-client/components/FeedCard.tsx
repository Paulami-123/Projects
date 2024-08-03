import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa6";
import { IoHeartOutline } from "react-icons/io5";
import { GoBookmark, GoUpload } from "react-icons/go";
import { Post } from "@/gql/graphql";

interface FeedCardProps {
    post: Post
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const { post } = props;
    const [postedOn, setPostedOn] = useState('');
    useEffect(() => {
        const hours = new Date(post.createdAt).getHours() - new Date().getHours();
        if(hours>=1){
            if(hours>=1 && hours<24){
                setPostedOn(`${hours}h ago`)
            }
            else if(hours>=24 && hours<48){
                setPostedOn('Yesterday');
            }
            else if(hours>=48 && hours<24*7){
                setPostedOn(`${hours/24}d ago`);
            }
            else{
                setPostedOn(new Date().toDateString().substring(4));
            }
        }
        else{
            const minutes = new Date(post.createdAt).getMinutes() - new Date().getMinutes();
            if(minutes<0){
                setPostedOn("Just Now");
            }
            else{
                setPostedOn(`${minutes}m ago`);
            }
        }
    }, [])
    return(
        <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">
                    {post.author?.profileImageURL && (
                        <Image src={post.author?.profileImageURL}
                        alt={post.author.firstName+" "+post.author.lastName} height={50} width={50} className="rounded-full" />
                    )}
                </div>
                <div className="col-span-11 text-white">
                    <div className="flex gap-2 text-gray-500">
                        <h5 className="font-bold text-white">{post.author?.firstName+" "+post.author?.lastName}</h5>
                        <h5>{"@"+post.author?.username}</h5>
                        <div>•</div>
                        <h5>{postedOn}</h5>
                    </div>
                    <p>{post.content}</p>
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