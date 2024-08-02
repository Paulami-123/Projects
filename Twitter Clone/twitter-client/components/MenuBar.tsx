"use client"

import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import React from "react";
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

const MenuBar: React.FC = () => {

    const { user } = useCurrentUser();

    return (
        <div>
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
            <div className="absolute bottom-5 left-40 grid grid-cols-9 gap-2 hover:bg-gray-800 px-4 py-2 items-center rounded-full cursor-pointer">
              {user && user.profileImageURL && (
                <div className="col-span-2 pr-2">
                  <Image className="rounded-full" src={user.profileImageURL} alt={user.firstName} height={50} width={50} />
                </div>
              )}
              <div className="col-span-6 lg:visible">
                <h3 className="text-s font-bold">{user?.firstName}</h3>
                <p className="text-gray-600">@paulami</p>
              </div>
              <div className="col-span-1 lg:visible">
                <HiDotsHorizontal />
              </div>
            </div>
          )}
        </div>
    )
}

export default MenuBar;