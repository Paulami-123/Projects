import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
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
  
      toast.success(`Verification Successful`);
      if(verifyGoogleToken){
        window.localStorage.setItem('token', verifyGoogleToken);
      }
  
      await queryClient.invalidateQueries({ queryKey: ['Current-User'] });
    }, [queryClient])

    return (
        <div>
          {!user && 
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-xl font-bold">New to twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          }
        </div>
    )
}

export default SideBar;