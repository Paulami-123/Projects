"use client"

import { graphqlClient } from "@/clients/api";
import Footer from "@/components/Footer";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { FaXTwitter } from "react-icons/fa6";

export default function Home() {

  const { user } = useCurrentUser();
  const router = useRouter()
  if(user){
    router.push('/home');
  }
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
    router.push('/home');
    return;
  }, [queryClient])

  return (
    <div className="bg-black px-5 text-gray-200 ">
      <div className="grid grid-cols-1 md:grid-cols-12 w-5/5 h-screen">
        <div className="col-span-6 flex justify-center items-center text-9xl md:text-2xl">
          <FaXTwitter size={400} />
        </div>
        <div className="col-span-6 flex justify-center pt-40">
          <div className="items-center">
            <h1 className="text-6xl font-extrabold">Happening now</h1>
            <h1 className="text-3xl font-extrabold pt-12">Join Today.</h1>
            <button className="pt-6">
              <GoogleLogin onSuccess={handleLoginWithGoogle} shape="pill" size="large" width={'268px'} text="signup_with" />
            </button>
            <p className="py-2 pl-32">or</p>
            <button className="bg-[#1d9bf0] hover:bg-[#1e93e3] text-sm font-bold px-20 py-2 rounded-full text-white">Create Account</button>
            <p className="text-xs pt-2">By signing up, you agree to the 
              <a href="#" className="text-[#1d9bf0]"> Terms of Service</a> <br /> and <a href="#" className="text-[#1d9bf0]">
              Privacy Policy</a>, including <a href="#" className="text-[#1d9bf0]"> Cookie Use</a>.
            </p>
            <p className="pt-12 pb-4 font-bold">Already have an account?</p>
            <button className="px-28 py-2 items-center text-[#1d9bf0] font-bold border border-gray-500 border-x-2 rounded-full">
              Sign In
            </button>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}