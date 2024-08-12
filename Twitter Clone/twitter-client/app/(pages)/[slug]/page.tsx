"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { notFound, usePathname } from "next/navigation";
import { Post, User } from "@/gql/graphql";
import { GoArrowLeft } from "react-icons/go";
import { useCurrentUser } from "@/hooks/user";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import FeedCard from "@/components/FeedCard";
import EditDataModal from "@/components/EditDataModal";
import { graphqlClient } from "@/clients/api";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import { getUserData } from "@/SSR/user";
import toast from "react-hot-toast";

interface ServerProps {
    userInfo?: User
}

export interface EditProps {
    name?: string
    about?: string|null
    coverImageURL?: string
    profileImageURL?: string
}

const UserProfilePage: NextPage = () =>{
    const { user: currentUser } = useCurrentUser();
    const [userData, setUserData] = useState<ServerProps>({});
    const [editData, setEditData] = useState<EditProps>({})
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
                const { props } = await getUserData(username);
                if(props?.userInfo){
                    setUserData(props);
                    setEditData({
                        name: props?.userInfo?.name,
                        about: props?.userInfo?.about,
                        profileImageURL: props?.userInfo?.profileImageURL,
                        coverImageURL: props?.userInfo?.coverImageURL
                    });
                }
                else{
                    toast.error("User does not exist.");
                    window.history.replaceState(null, '', '/home');
                    window.location.reload();
                }
            } catch(err){
                console.log(err);
                return;
            }
        }
        fetchData();
    }, []);

    const amIFollowing = useMemo(() => {
        if(!userData?.userInfo) return false;
        return ((currentUser?.following?.findIndex((el) => el?.id===userData.userInfo?.id) ?? -1)>=0);
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

    const handleGoBack = () => {
        window.history.replaceState(null, '', '/home');
        window.location.reload();
    }

   return (
    <div>
        <div>
            <nav className="text-xl flex items-center gap-8 p-1 m-2 cursor-pointer">
                <GoArrowLeft strokeWidth={1} onClick={handleGoBack} />
                <div>
                    <h1 className="font-bold text-gray-200">{userData?.userInfo?.name}</h1>
                    <p className="text-sm text-gray-500">{userData?.userInfo?.posts?.length} posts</p>
                </div>
            </nav>
            <div className="relative">
                {userData?.userInfo?.coverImageURL ? (
                    <img src={userData?.userInfo?.coverImageURL} className="w-full object-fill h-48" />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-slate-900 to-blue-900" />
                )}
                <div className="flex justify-between items-center">
                    <div className="absolute left-5 top-32">
                        {userData?.userInfo?.profileImageURL && (
                            <img src={userData.userInfo.profileImageURL} alt={userData?.userInfo?.username} className="rounded-full w-36 h-36 border-black border-4 text-center" />
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
                        </div>
                    )}
                </div>
            </div>
            {userData?.userInfo&& userData.userInfo?.posts?.map((post) => (
                <FeedCard key={post?.id} post={post as Post} />
            )) }
        </div>
        {showEditModal && <EditDataModal data={editData} />}
    </div>
   )
}

export default UserProfilePage;

