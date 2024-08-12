'use server'

import { graphqlClient } from "@/clients/api";
import {  User } from "@/gql/graphql";
import { signInTokenMutation, signUpTokenMutation } from "@/graphql/mutation/user";
import { getUserByUsernameQuery } from "@/graphql/query/user";

export interface SignInType {
  email: string,
  password: string
}

export interface SignUpType {
  email: string,
  password: string,
  name: string
}

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

export const getSignInToken = async(userData: SignInType) => {
  if(!userData) return { notFound: true, userSignInToken: undefined }

  const token = await graphqlClient.request(signInTokenMutation, {userData});
  return {
    userSignInToken: token.userSignInToken
  };
}

export const getSignUpToken = async(userData: SignUpType) => {
  if(!userData) return { notFound: true,  userSignUpToken: undefined }

  const token = await graphqlClient.request(signUpTokenMutation, {userData});
  return {
    userSignUpToken: token.userSignUpToken
  };
}