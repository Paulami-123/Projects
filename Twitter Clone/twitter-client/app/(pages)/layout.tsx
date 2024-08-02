"use client"

import FeedCard from "@/components/FeedCard";
import MenuBar from "@/components/MenuBar";
import PostCard from "@/components/PostCard";
import SideBar from "@/components/SideBar";
import { Post } from "@/gql/graphql";
import { useGetAllPosts } from "@/hooks/post";
import { useCurrentUser } from "@/hooks/user";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function({children} : {children : React.ReactNode}){

    const { user } = useCurrentUser();
    const { posts = [] } = useGetAllPosts();
    const queryClient = useQueryClient();
  
    return (
        <QueryClientProvider client={queryClient}>
        <div className="bg-black text-white px-5">
          <div className="grid grid-cols-12 gap-3 h-screen w-screen pl-40 pr-48">
            <div className="col-span-3 pt-1">
              <MenuBar />
            </div>
            <div className="col-span-6 mr-6 border-x-[1px] border-gray-600 h-screen overflow-scroll no-scrollbar">
              {children}
            </div>
            <div className="col-span-3 p-5 hidden lg:block">
              <SideBar />
            </div>
          </div>
        </div>
        </QueryClientProvider>
      );
}