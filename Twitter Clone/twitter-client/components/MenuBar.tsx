"use client"

import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { BsFeather, BsTwitter } from "react-icons/bs";
import { CgFormatSlash } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { GoBell, GoBookmark, GoHome, GoSearch } from "react-icons/go";
import { HiDotsHorizontal, HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { HiOutlineEnvelope, HiOutlineUsers } from "react-icons/hi2";
import PostCard from "./PostCard";
import { FaXTwitter } from "react-icons/fa6";

interface TwittersidebarButton {
  title: string,
  icon: React.ReactNode
  link: string
}

const MenuBar: React.FC = () => {

    const { user } = useCurrentUser();

    const sidebarMenuItems: TwittersidebarButton[] = useMemo( 
      () => [
        {
          title: 'Home',
          icon: <GoHome size={30} strokeWidth={0.75} />,
          link: `/home`
        }, {
          title: 'Explore',
          icon: <GoSearch size={25} strokeWidth={0.75} />,
          link: `/`
        }, {
          title: 'Notifiactions',
          icon: <GoBell size={25} strokeWidth={0.75} />,
          link: `/`
        }, {
          title: 'Messages',
          icon: <HiOutlineEnvelope size={25} strokeWidth={2} />,
          link: `/`
        }, {
          title: 'Grok',
          icon: <CgFormatSlash className="outline outline-[2px] rounded-md"  size={20} strokeWidth={1} />,
          link: `/`
        }, {
          title: 'Bookmarks',
          icon: <GoBookmark size={25} strokeWidth={0.75} />,
          link: `/`
        }, {
          title: 'Communities',
          icon: <HiOutlineUsers size={25} strokeWidth={2} />,
          link: `/`
        }, {
          title: 'Profile',
          icon: <CiUser size={25} strokeWidth={1} />,
          link: `/${user?.username}`
        }, {
          title: 'More',
          icon: <HiOutlineDotsCircleHorizontal size={25} strokeWidth={2} />,
          link: `/`
        }],
      [user?.id]);
      
      const [showLogOutModal, setShowLogOutModal] = useState(false);
      const [showPostModal, setShowPostModal] = useState(false);
      const queryClient = useQueryClient(); 
      
      const handleLogout = async() =>{
        window.localStorage.removeItem('token');
        await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
      }

    return (
        <div>
            <div className="text-4xl h-fit w-fit rounded-full hover:bg-gray-800 dark:text-white p-4 cursor-pointer">
            <FaXTwitter />
          </div>
          <div className="mt-4 text-xl text-gray-200 pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <Link href={item.link} className="flex justify-start items-center gap-4 rounded-full hover:bg-gray-800 px-5 py-2 w-fit cursor-pointer">
                    <span>{item.icon}</span>
                    <span className="hidden lg:block">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <button onClick={() => setShowPostModal(true)} className="hidden lg:block bg-[#1d9bf0] px-4 py-3 rounded-full w-4/5 font-semibold text-white text-base hover:bg-[#1e93e3]">
                Post
              </button>
              <button onClick={() => setShowPostModal(true)} className="block lg:hidden bg-[#1d9bf0] ml-2 p-3 rounded-full text-white hover:bg-[#1e93e3]">
                <BsFeather strokeWidth={0.75} />
              </button>
            </div>
          </div>
          {user && (
            <div>
              {showLogOutModal && (
                  <div className="absolute bottom-8 lg:bottom-20 bg-black outline-white w-72 my-3 outline lg:bg-transparent md:outline-gray-700 outline-[0.5px] rounded-xl text-start">
                    <button className="p-3 pl-4 font-bold" onClick={() => {
                      handleLogout();
                      setShowLogOutModal(false);
                    }}>Log out @{user.username}</button>
                  </div>
                )}
              <div className="absolute bottom-5 grid grid-cols-9 gap-2 lg:hover:bg-gray-800 w-full px-4 py-2 items-center rounded-full cursor-pointer">
                {user && user.profileImageURL && (
                  <div className="col-span-9 lg:col-span-2 lg:pr-2 hidden lg:block">
                    <img className="rounded-full w-full h-9 object-fill" src={user.profileImageURL} alt={user.name} />
                  </div>
                )}
                <div className="col-span-0 hidden lg:block lg:col-span-6">
                  <h3 className="text-s font-bold">{user.name}</h3>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
                <div className="col-span-1" onClick={() => setShowLogOutModal(!showLogOutModal)}>
                  <HiDotsHorizontal />
                </div>
              </div>
            </div>
          )}
          <Modal show={showPostModal} onClose={() => setShowPostModal(false)} popup size={'lg'}>
            <Modal.Header className="bg-black" />
            <Modal.Body className="bg-black">
              <PostCard />
            </Modal.Body>
          </Modal>
        </div>
    )
}

export default MenuBar;