"use client"

import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";
import { getUserByUsernameQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface ServerProps {
    username: string
    id: string
    firstName: string
    lastName: string
    profileImageURL: string
    createdAt: string
    posts: Post[]
}

const UserProfilePage = () =>{
    const { user } = useCurrentUser();
    const [userData, setUserData] = useState<ServerProps>();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const pathname = usePathname();
        if(!pathname){
            notFound();
        }
    useEffect(() => {
        async function getData(username: string) {
            const res:any = await graphqlClient.request(getUserByUsernameQuery, { username: username });
            if(!res){
                notFound();
            }
            setUserData(res.getUserByUsername);
        }
        getData(pathname.substring(1));
    }, []);

    return(
        <div>
            <div>
                <nav className="text-xl flex items-center gap-8 p-1 m-2 cursor-pointer">
                    <GoArrowLeft strokeWidth={1} />
                    <div>
                        <h1 className="font-bold text-gray-200">{userData?.firstName} {userData?.lastName}</h1>
                        <p className="text-sm text-gray-500">{userData?.posts.length} posts</p>
                    </div>
                </nav>
                <div className="relative">
                    <img src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
                    className="w-full object-fill h-48" />
                    <div className="flex justify-between items-center">
                        <div className="absolute top-32 left-5">
                            {userData?.profileImageURL && (
                                <Image src={userData.profileImageURL} alt={userData.username} height={125} width={125} className="rounded-full border-black border-4" />
                            )}
                        </div>
                        <div className="absolute top-48 pt-2 right-5 text-2xl items-center">
                            {user?.username===userData?.username ? (
                                <button className="text-sm font-bold py-2 px-4 rounded-full border-gray-300 text-white">Edit Profile</button>
                            ) : (
                                <div className="flex gap-4 ">
                                    <HiOutlineDotsHorizontal className="rounded-full border border-gray-500" />
                                    <button className="text-sm font-bold py-2 px-4 rounded-full bg-white text-black">Follow</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pb-5 border-b border-gray-600">
                    <div className="pt-20 pl-5">
                        {userData && (
                            <div className="text-sm text-gray-400">
                                <h1 className="text-xl font-bold text-gray-200">{userData?.firstName} {userData?.lastName}</h1>
                                <p>@{userData.username}</p>
                                <p className="pt-5 text-gray-200">Hey there! I am using Twitter Clone</p>
                                <div className="pt-2 flex gap-1 items-center">
                                    <FaRegCalendarAlt className="" />
                                    <p>Joined {months[new Date(userData.createdAt).getMonth()-1]} {new Date(userData.createdAt).getFullYear()}</p>
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
                {userData&& userData.posts?.map((post) => (
                    <FeedCard key={post?.id} post={post as Post} redirect={false} />
                )) }
            </div>
        </div>
    )
}

export default UserProfilePage;