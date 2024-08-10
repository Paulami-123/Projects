"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { notFound, usePathname } from "next/navigation";
import { Post, User } from "@/gql/graphql";
import { GoArrowLeft } from "react-icons/go";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import FeedCard from "@/components/FeedCard";
import { Modal } from "flowbite-react";
import { TbCameraPlus } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import EditDataModal from "@/components/EditDataModal";
import { graphqlClient } from "@/clients/api";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import { getUserData } from "@/app/SSR/user";

interface ServerProps {
    userInfo?: User
}

export interface EditProps {
    id?: string
    name?: string
    about?: string
    coverImageURL?: string
    profileImageURL?: string
}

const UserProfilePage: NextPage = () =>{
    const { user: currentUser } = useCurrentUser();
    const [userData, setUserData] = useState<ServerProps>();
    const [showEditModal, setShowEditModal] = useState(false);
    const queryClient = useQueryClient();
    const pathname = usePathname();
    if(!pathname){
      notFound();
    }
    const username = pathname.substring(1);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    useEffect(() => {
        const fetchData = async() => {
            try{
                const { props, notFound: error } = await getUserData(username);
                setUserData(props);
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const amIFollowing = useMemo(() => {
        if(!userData?.userInfo) return false;
        //Edit here
        return ((currentUser?.following?.findIndex((el: any) => el?.id===userData.userInfo?.id) ?? -1)>=0);
    }, [currentUser?.id, userData?.userInfo]);

    const handleFollowUser = useCallback(async() => {
        if(!userData?.userInfo?.id) return;
        await graphqlClient.request(followUserMutation, {to: userData?.userInfo.id});
        await queryClient.invalidateQueries({queryKey: ['current-user']});
    }, [userData?.userInfo?.id, queryClient]);

    const handleUnfollowUser = useCallback(async() => {
        if(!userData?.userInfo?.id) return;
        await graphqlClient.request(unfollowUserMutation, {to: userData?.userInfo.id});
        await queryClient.invalidateQueries({queryKey: ['current-user']});
    }, [userData?.userInfo?.id, queryClient]);

   return (
    <div>
        <div>
            <nav className="text-xl flex items-center gap-8 p-1 m-2 cursor-pointer">
                <GoArrowLeft strokeWidth={1} />
                <div>
                    <h1 className="font-bold text-gray-200">{userData?.userInfo?.name}</h1>
                    <p className="text-sm text-gray-500">{userData?.userInfo?.posts?.length} posts</p>
                </div>
            </nav>
            <div className="relative">
                <img src={userData?.userInfo?.coverImageURL}
                className="w-full object-fill h-48" />
                <div className="flex justify-between items-center">
                    <div className="absolute top-32 left-5">
                        {userData?.userInfo?.profileImageURL && (
                            <img src={userData.userInfo?.profileImageURL} alt={userData.userInfo?.username} className="rounded-full w-36 h-36 border-black border-4" />
                        )}
                    </div>
                    <div className="absolute top-48 pt-2 right-5 text-2xl items-center">
                        {currentUser?.username===userData?.userInfo?.username ? (
                            <button className="text-sm font-bold py-2 px-4 rounded-full border-gray-300 text-white" onClick={() => {
                                setShowEditModal(!showEditModal);
                                setShowEditModal(!showEditModal);
                            }}>Edit Profile</button>
                        ) : (
                            <div className="flex gap-4 ">
                                <HiOutlineDotsHorizontal className="rounded-full border border-gray-500" />
                                {amIFollowing ? (
                                    <button onClick={handleUnfollowUser} className="text-sm font-bold py-2 px-4 rounded-full border border-white">
                                        Unfollow
                                    </button>
                                ) : ( 
                                    <button onClick={handleFollowUser} className="text-sm font-bold py-2 px-4 rounded-full bg-white text-black">
                                        Follow
                                    </button>
                                )} 
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="pb-5 border-b border-gray-600">
                <div className="pt-20 pl-5">
                    {userData && (
                        <div className="text-sm text-gray-400">
                            <h1 className="text-xl font-bold text-gray-200">{userData.userInfo?.name}</h1>
                            <p>@{userData.userInfo?.username}</p>
                            <p className="pt-5 text-gray-200">{userData.userInfo?.about}</p>
                            <div className="pt-2 flex gap-1 items-center">
                                <FaRegCalendarAlt className="" />
                                <p>Joined {months[new Date(userData.userInfo?.createdAt).getMonth()-1]} {new Date(userData.userInfo?.createdAt).getFullYear()}</p>
                            </div>
                            <div className="flex pt-2 gap-4">
                                <div className="flex gap-1">
                                    <p className="font-bold text-gray-200">{userData.userInfo?.following?.length}</p> 
                                    <p>Following</p>
                                </div>
                                <div className="flex gap-1">
                                    <p className="font-bold text-gray-200">{userData.userInfo?.followers?.length}</p> 
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
            {userData?.userInfo&& userData.userInfo?.posts?.map((post) => (
                <FeedCard key={post?.id} post={post as Post} />
            )) }
        </div>
        {showEditModal && <EditDataModal username={username as string} show={showEditModal} />}
    </div>
   )
}

export default UserProfilePage;

