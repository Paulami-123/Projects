import FeedCard from "@/components/FeedCard/page";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { CgFormatSlash } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { GoBell, GoBookmark, GoHome } from "react-icons/go";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { HiOutlineEnvelope, HiOutlineUsers } from "react-icons/hi2";

interface TwittersidebarButton {
  title: string,
  icon: React.ReactNode
}

const sidebarMenuItems: TwittersidebarButton[] = [{
  title: 'Home',
  icon: <GoHome />
}, {
  title: 'Explore',
  icon: <FiSearch />
}, {
  title: 'Notifiactions',
  icon: <GoBell />
}, {
  title: 'Messages',
  icon: <HiOutlineEnvelope />
}, {
  title: 'Grok',
  icon: <CgFormatSlash className="outline outline-[0.5px] rounded-md" />
}, {
  title: 'Bookmarks',
  icon: <GoBookmark />
}, {
  title: 'Communities',
  icon: <HiOutlineUsers />
}, {
  title: 'User',
  icon: <CiUser />
}, {
  title: 'More',
  icon: <HiOutlineDotsCircleHorizontal />
}]

export default function Home() {
  return (
    <div className="bg-black text-white px-5">
      <div className="grid grid-cols-12 gap-3 h-screen w-screen pl-40 pr-48">
        <div className="col-span-3 pt-1">
          <div className="text-4xl h-fit w-fit rounded-full hover:bg-gray-200 dark:text-white p-4 cursor-pointer">
            <BsTwitter />
          </div>
          <div className="mt-4 text-xl text-gray-200 pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title} className="flex justify-start items-center gap-4 rounded-full hover:bg-gray-800 px-5 py-2 w-fit cursor-pointer">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <button className="bg-[#1d9bf0] px-4 py-2 rounded-full w-4/5 font-semibold text-white text-lg hover:bg-[#1e93e3]">
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-6 mr-6 border-x-[1px] border-gray-600 h-screen overflow-scroll no-scrollbar">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
