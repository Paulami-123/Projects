"use client"

import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function(){
    const { user } = useCurrentUser();
    const pathName = usePathname();
    console.log(pathName);
    return(
        <div>
            <div>
                <nav className="text-xl flex items-center gap-8 p-1 m-2 cursor-pointer">
                    <GoArrowLeft strokeWidth={1} />
                    <div>
                        <h1 className="font-bold text-gray-200">Paulami Banerjee</h1>
                        <p className="text-sm text-gray-500">2,000 posts</p>
                    </div>
                </nav>
                <div className="relative">
                    <img src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                    className="w-full object-fill h-48" />
                    <div className="flex justify-between items-center">
                        <div className="absolute top-32 left-5">
                            {user?.profileImageURL && (
                                <Image src={user.profileImageURL} alt={user.username} height={125} width={125} className="rounded-full border-black border-4" />
                            )}
                        </div>
                        <div className="flex gap-4 absolute top-48 pt-2 right-5 text-2xl items-center">
                            <HiOutlineDotsHorizontal className="rounded-full border border-gray-500" />
                            <button className="text-sm font-bold py-2 px-4 rounded-full bg-white text-black">Follow</button>
                        </div>
                    </div>
                </div>
                <div className="pb-5 border-b border-gray-600">
                    <div className="pt-20 pl-5">
                        {user && (
                            <div className="text-sm text-gray-400">
                                <h1 className="text-xl font-bold text-gray-200">{user?.firstName} {user?.lastName}</h1>
                                <p>@{user.username}</p>
                                <p className="pt-5 text-gray-200">Hey there! I am using Twitter Clone</p>
                                <div className="pt-2 flex gap-1 items-center">
                                    <FaRegCalendarAlt className="" />
                                    <p>Joined Aug 2024</p>
                                </div>
                                <div className="flex pt-2 gap-4">
                                    <div className="flex gap-1">
                                        <p className="font-bold text-gray-200">450</p> 
                                        <p>Following</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <p className="font-bold text-gray-200">450</p> 
                                        <p>Followers</p>
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <p>Not followed by anyone you're following</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {user&& user.posts?.map((post) => (
                    <FeedCard key={post?.id} post={post as Post} />
                )) }
            </div>
        </div>
    )
}