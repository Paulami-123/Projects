import { graphqlClient } from "@/clients/api";
import { followUserMutation } from "@/graphql/mutation/user";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import toast from "react-hot-toast";


const SideBar: React.FC = () => {

    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if(!googleToken){
        return toast.error(`Google token not found`);
      }
      
      const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});
  
      if(verifyGoogleToken?.error){
        return toast.error(verifyGoogleToken.error);
      }
      else if(verifyGoogleToken?.token){
        window.localStorage.setItem('token', verifyGoogleToken.token);
        toast.success(`Verification Successful`);
      }
  
      await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    }, [queryClient]);

    const handleFollowUser = useCallback(async(followId?: string) => {
      if(!followId) return;
      await graphqlClient.request(followUserMutation, {to: followId});
      await queryClient.invalidateQueries({queryKey: ['current-user']});
    }, [queryClient]);

    return (
        <div>
          {!user && 
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-xl font-bold">New to twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          }
          {user?.recommendedUsers && user.recommendedUsers.length>0 && 
            <div className="px-5 py-10">
              <h1 className="font-bold text-2xl">Who to follow</h1>
              { user.recommendedUsers.map((el) => (
                <div className="rounded-lg py-4">
                    <div className="flex justify-center items-center py-3 gap-2 ">
                    {el?.profileImageURL && 
                      <Image src={el.profileImageURL} alt={el.name} width={20} height={20} className="rounded-lg h-12 w-16" />
                    }
                    <div className="rounded-lg w-52 pr-12 pl-2">
                      <Link href={`/${el?.username}`} className="font-bold text-lg hover:underline">{el?.name}</Link>
                      <p className="text-gray-400">@{el?.username}</p>
                    </div>
                    <button onClick={() => handleFollowUser(el?.id)} className="bg-white text-black text-sm font-bold px-4 py-1 my-3 rounded-full">Follow</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
    )
}

export default SideBar;