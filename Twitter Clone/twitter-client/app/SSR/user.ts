'use server'

import { graphqlClient } from "@/clients/api";
import { Post, User } from "@/gql/graphql";
import { getAllPostsQuery } from "@/graphql/query/post";
import { getUserByUsernameQuery } from "@/graphql/query/user";


export const getUserData = async (username: string) => {
  
  if(!username) return { notFound: true, props: { userInfo: undefined } }

  const userInfo = await graphqlClient.request(getUserByUsernameQuery, { username: username });

  if (!userInfo.getUserByUsername) return { notFound: true };
  return {
    props: {
      userInfo: userInfo.getUserByUsername as User,
    },
  };
};

// export const followUser = async (to: string) => {
//     if(!to) return { notFound: true, props: undefined };
//     const 
// }