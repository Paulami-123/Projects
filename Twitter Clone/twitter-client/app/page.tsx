"use client"

import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard/page";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { BsTwitter } from "react-icons/bs";
import { CgFormatSlash } from "react-icons/cg";
import { CiUser } from "react-icons/ci";
import { GoBell, GoBookmark, GoHome, GoSearch } from "react-icons/go";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
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

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if(!googleToken){
      return toast.error(`Google token not found`);
    }
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});

    toast.success(`Verification Successful`);
    console.log(verifyGoogleToken);
    if(verifyGoogleToken){
      window.localStorage.setItem('token', verifyGoogleToken);
    }
  }, [])

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
                  <span className="hidden lg:block">{item.title}</span>
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
          <div>
            <div className="border border-t border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                    <Image src={'https://avatars.githubusercontent.com/u/161676355?v=4'}
                    alt="user-image" height={50} width={50} className="outline outline-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5 hidden lg:block">
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-xl font-bold">New to twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle}
                // onSuccess={(credentialResponse) => {
                //   handleLoginWithGoogle(credentialResponse)}}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
          </div>
        </div>
      </div>
    </div>
  );
}