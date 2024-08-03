"use client"

import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import PostCard from "@/components/PostCard";
import { Post } from "@/gql/graphql";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useGetAllPosts } from "@/hooks/post";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { BsFeather, BsTwitter } from "react-icons/bs";
import { CgFormatSlash } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { GoBell, GoBookmark, GoHome, GoSearch } from "react-icons/go";
import { HiDotsHorizontal, HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { HiOutlineEnvelope, HiOutlineUsers } from "react-icons/hi2";

interface TwittersidebarButton {
  title: string,
  icon: React.ReactNode
}

const sidebarMenuItems: TwittersidebarButton[] = [{
  title: 'Home',
  icon: <GoHome size={30} strokeWidth={0.75} />
}, {
  title: 'Explore',
  icon: <GoSearch size={25} strokeWidth={0.75} />
}, {
  title: 'Notifiactions',
  icon: <GoBell size={25} strokeWidth={0.75} />
}, {
  title: 'Messages',
  icon: <HiOutlineEnvelope size={25} strokeWidth={2} />
}, {
  title: 'Grok',
  icon: <CgFormatSlash className="outline outline-[2px] rounded-md"  size={20} strokeWidth={1} />
}, {
  title: 'Bookmarks',
  icon: <GoBookmark size={25} strokeWidth={0.75} />
}, {
  title: 'Communities',
  icon: <HiOutlineUsers size={25} strokeWidth={2} />
}, {
  title: 'User',
  icon: <CiUser size={25} strokeWidth={1} />
}, {
  title: 'More',
  icon: <HiOutlineDotsCircleHorizontal size={25} strokeWidth={2} />
}]

export default function Home() {

  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllPosts();
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if(!googleToken){
      return toast.error(`Google token not found`);
    }
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});

    toast.success(`Verification Successful`);
    if(verifyGoogleToken){
      window.localStorage.setItem('token', verifyGoogleToken);
    }

    await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
    <div className="bg-black text-white px-5">
      <div className="grid grid-cols-12 gap-3 h-screen w-screen pl-40 pr-48">
        <div className="col-span-2 lg:col-span-3 pt-1 relative">
          <div className="text-4xl h-fit w-fit rounded-full hover:bg-gray-200 dark:text-white p-4 cursor-pointer">
            <BsTwitter />
          </div>
          <div className="mt-4 text-xl text-gray-200 pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title} className="flex justify-start items-center gap-4 rounded-full hover:bg-gray-800 px-5 py-2 w-fit cursor-pointer">
                  <span>{item.icon}</span>
                  <span className="hidden lg:block">{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <button className="hidden md:block bg-[#1d9bf0] px-4 py-3 rounded-full w-4/5 font-semibold text-white text-base hover:bg-[#1e93e3]">
                Post
              </button>
              <button className="block md:hidden bg-[#1d9bf0] ml-2 p-3 rounded-full text-white hover:bg-[#1e93e3]">
                <BsFeather strokeWidth={0.75} />
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 grid grid-cols-9 gap-2 hover:bg-gray-800 lg:px-4 lg:py-2 items-center rounded-full cursor-pointer">
              {user && user.profileImageURL && (
                <div className="col-span-9 lg:col-span-2 lg:pr-2">
                  <Image className="rounded-full outline" src={user.profileImageURL} alt={user.firstName} height={50} width={50} />
                </div>
              )}
              <div className="col-span-0 hidden lg:block lg:col-span-6">
                <h3 className="text-s font-bold">{user?.firstName}</h3>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              <div className="col-span-0 hidden lg:block lg:col-span-1">
                <HiDotsHorizontal />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 lg:col-span-6 mx-6 border-x-[1px] border-gray-600 h-screen overflow-scroll no-scrollbar">
          {user && (<>
            <PostCard />
          </>)}
          {posts && posts.map((post) => post ? <FeedCard key={post?.id} post={post as Post} /> : null)}
        </div>
        <div className="col-span-0 lg:col-span-3 p-5 hidden lg:block">
          {!user && 
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-xl font-bold">New to twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          }
        </div>
      </div>
    </div>
    </QueryClientProvider>
  );
}