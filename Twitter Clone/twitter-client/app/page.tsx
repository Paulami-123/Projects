"use client"

import { graphqlClient } from "@/clients/api";
import Footer from "@/components/Footer";
import { signInTokenMutation, signUpTokenMutation } from "@/graphql/mutation/user";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FaXTwitter } from "react-icons/fa6";


interface SignInType {
  email: string,
  password: string
}
interface SignUpType {
  email: string,
  password: string,
  firstName: string,
  lastName?: string
}

export default function Home() {

  const { user } = useCurrentUser();
  const router = useRouter();
  if(user){
    router.push('/home');
  }
  const queryClient = useQueryClient();
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [userSignInDetails, setUserSignInDetails] = useState<SignInType>({
    email: '',
    password: ''
  });
  const [userSignUpDetails, setUserSignUpDetails] = useState<SignUpType>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if(!googleToken){
      return toast.error(`Google token not found`);
    }
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});
    console.log(verifyGoogleToken);

    toast.success(`Verification Successful`);
    if(verifyGoogleToken){
      window.localStorage.setItem('token', verifyGoogleToken);
    }
    
    await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    router.push('/home');
    return;
  }, [queryClient]);

  const handleLogin = useCallback(async(userData: SignInType) => {
    const { userSignInToken } = await graphqlClient.request(signInTokenMutation, { userData }); 
    console.log(userSignInToken);

    if(userSignInToken){
      toast.success(`Verification successful`);
      window.localStorage.setItem('token', userSignInToken);
      await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
      router.push('/home');
    }
    else{
      toast.error('Error');
    }

    return;
  }, [queryClient]);

  const handleSignUp = useCallback(async(userData: SignUpType) => {
    console.log(userData);
    const { userSignUpToken } = await graphqlClient.request(signUpTokenMutation, { userData });

    if(userSignUpToken){
      toast.success(`Verification successful`);
      window.localStorage.setItem('token', userSignUpToken);
      await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
      router.push('/home');
    }
    else{
      toast.error('Error');
    }
    
    return;

  }, [queryClient]);

  return (
    <div className={`bg-black px-5 text-gray-200 ${showModal1? 'opacity-70': 'opacity-100'}`}>
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
            <button className="bg-[#1d9bf0] hover:bg-[#1e93e3] text-sm font-bold px-20 py-2 rounded-full text-white" onClick={() => setShowModal2(true)}>
              Create Account
            </button>
            <p className="text-xs pt-2">By signing up, you agree to the 
              <a href="#" className="text-[#1d9bf0]"> Terms of Service</a> <br /> and <a href="#" className="text-[#1d9bf0]">
              Privacy Policy</a>, including <a href="#" className="text-[#1d9bf0]"> Cookie Use</a>.
            </p>
            <p className="pt-12 pb-4 font-bold">Already have an account?</p>
            <button className="px-28 py-2 items-center text-[#1d9bf0] font-bold border border-gray-500 border-x-2 rounded-full" onClick={() => {setShowModal1(true)}}>
              Sign In
            </button>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <Modal show={showModal1} onClose={() => setShowModal1(false)} popup size={'lg'}>
        <Modal.Header className="bg-black" />
        <Modal.Body className="bg-black text-gray-300 px-36">
          <div>
            <div className="flex justify-center">
              <FaXTwitter size={35} />
            </div>
            <div className="flex justify-center">
              <div className="text-center items-center">
                <h1 className="text-3xl font-bold text-start py-6">Sign in to X</h1>
                <button className="py-2">
                  <GoogleLogin onSuccess={handleLoginWithGoogle} shape="pill" size="large" width={'268px'} text="signup_with" />
                </button>
                <p>or</p>
                <form>
                  <input type="email" required placeholder="Enter email" onChange={(e) => {
                    setUserSignInDetails({...userSignInDetails, email: e.target.value});
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-72 my-4" />
                  <input type="password" required placeholder="Enter password" onChange={(e) => {
                    setUserSignInDetails({...userSignInDetails, password: e.target.value});
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-72 my-4" />
                  <div>
                  <button className="rounded-full py-1 px-28 bg-white text-black font-bold" onClick={() => {
                    setUserSignInDetails(userSignInDetails);
                    handleLogin(userSignInDetails);
                    }}>Sign In</button>
                  </div>
                </form>
                <p className="text-sm text-gray-500 py-4 text-start pb-28">Don't have an account?
                  <Link href='#' className="text-blue-500" onClick={() => {
                    setShowModal1(false);
                    setShowModal2(true);
                  }}>Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModal2} onClose={() => setShowModal2(false)} popup size={'lg'}>
        <Modal.Header className="bg-black" />
        <Modal.Body className="bg-black text-gray-300 px-36">
          <div>
            <div className="flex justify-center">
              <FaXTwitter size={35} />
            </div>
            <div className="flex justify-center">
              <div className="text-center items-center">
                <h1 className="text-3xl font-bold text-start py-6">Sign in to X</h1>
                <button className="py-2">
                  <GoogleLogin onSuccess={handleLoginWithGoogle} shape="pill" size="large" width={'268px'} text="signup_with" />
                </button>
                <p>or</p>
                <form>
                  <div className="flex justify-between">
                    <input type="text" required placeholder="First Name" onChange={(e) => {
                    setUserSignUpDetails({...userSignUpDetails, firstName: e.target.value});
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-32 my-4" />
                    <input type="text" placeholder="Last name" onChange={(e) => {
                    setUserSignUpDetails({...userSignUpDetails, lastName: e.target.value})
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-32 my-4" />
                  </div>
                  <input type="email" required placeholder="Email" onChange={(e) => {
                    setUserSignUpDetails({...userSignUpDetails, email: e.target.value})
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-72 my-4" />
                  <input type="password" required placeholder="Enter password" onChange={(e) => {
                    setUserSignUpDetails({...userSignUpDetails, password: e.target.value})
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-72 my-4" />
                  <div>
                    <button className="rounded-full py-1 px-28 bg-white text-black font-bold" type="submit" onClick={() => {
                      handleSignUp(userSignUpDetails);
                    }}>Sign Up</button>
                  </div>
                </form>
                <p className="text-sm text-gray-500 py-4 text-start">Have an account already?
                  <Link href='#' className="text-blue-500" onClick={() => {
                    setShowModal2(false);
                    setShowModal1(true);
                  }}>Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}