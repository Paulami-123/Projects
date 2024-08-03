"use client"

import MenuBar from "@/components/MenuBar";
import SideBar from "@/components/SideBar";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function({children} : {children : React.ReactNode}){
    const queryClient = useQueryClient();
  
    return (
        <QueryClientProvider client={queryClient}>
        <div className="bg-black text-white px-5">
          <div className="grid grid-cols-12 gap-3 h-screen w-screen pl-40 pr-48">
            <div className="col-span-2 lg:col-span-3 pt-1 relative">
              <MenuBar />
            </div>
            <div className="col-span-10 lg:col-span-6 mr-6 border-x-[1px] border-gray-600 h-screen overflow-scroll no-scrollbar">
              {children}
            </div>
            <div className="col-span-0 lg:col-span-3 p-5 hidden lg:block">
              <SideBar />
            </div>
          </div>
        </div>
        </QueryClientProvider>
      );
}