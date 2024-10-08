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
  name: string
}

export default function Home() {

  const { user } = useCurrentUser();
  if(user){
    window.history.replaceState(null, '', '/home');
    window.location.reload();
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
    name: ''
  });

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if(!googleToken){
      return toast.error(`Google token not found`);
    }
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});

    if(verifyGoogleToken?.error){
      return toast.error(verifyGoogleToken.error)
    }
    else if(verifyGoogleToken?.token){
      window.localStorage.setItem('token', verifyGoogleToken.token);
      toast.success(`Verification Successful`);
    }
    
    await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    return;
  }, [queryClient]);

  const handleLogin = async(userData: SignInType) => {
    const { userSignInToken } = await graphqlClient.request(signInTokenMutation, { userData }); 
    // const { userSignInToken } = await getSignInToken(userData); 
    if(userSignInToken?.error){
      return toast.error(userSignInToken.error);
    }
    else if(userSignInToken?.token){
      window.localStorage.setItem('token', userSignInToken.token);
      toast.success(`Verification Successful`);
    }
    await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    
    return;
  };

  const handleSignUp = async(userData: SignUpType) => {
    const { userSignUpToken } = await graphqlClient.request(signUpTokenMutation, { userData });
    // const { userSignUpToken } = await getSignUpToken(userData);

    if(userSignUpToken?.error){
      return toast.error(userSignUpToken.error);
    }
    else if(userSignUpToken?.token){
      window.localStorage.setItem('token', userSignUpToken.token);
      toast.success(`Verification successful`);
    }
    
    await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    // return;

  };

  return (
    <div className={`bg-black px-5 text-gray-200 ${showModal1? 'opacity-70': 'opacity-100'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 w-5/5 h-full">
        <div className="col-span-6 flex justify-start p-5 lg:justify-center lg:items-center">
          <FaXTwitter className="lg:h-96 lg:w-96 h-16 w-16 md:ml-24 sm:ml-12 lg:mt-12" />
        </div>
        <div className="col-span-6 flex justify-center lg:pt-40">
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
      <div className="lg:pt-20 pt-12 pb-4">
        <Footer />
      </div>
      <Modal show={showModal1} onClose={() => setShowModal1(false)} popup size={'sm'} className="justify-start lg:justify-center">
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
      <Modal show={showModal2} onClose={() => setShowModal2(false)} popup size={'sm'} className="justify-start lg:justify-center">
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
                  <input type="text" required placeholder="Name" onChange={(e) => {
                    setUserSignUpDetails({...userSignUpDetails, name: e.target.value});
                  }} className="border border-gray-600 rounded-lg bg-black p-4 w-72 my-4" />
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