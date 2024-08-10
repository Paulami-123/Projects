/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    #graphql\n    mutation CreatePost($payload: CreatePostData!) {\n        createPost(payload: $payload) {\n            id\n        }\n    }\n": types.CreatePostDocument,
    "\n    #graphql\n    mutation UserSignUpToken($userData: SignUpDetails!){\n        userSignUpToken(userData: $userData)\n    }\n": types.UserSignUpTokenDocument,
    "\n    #graphql\n    mutation UserSignInToken($userData: SignInDetails!){\n        userSignInToken(userData: $userData)\n    }\n": types.UserSignInTokenDocument,
    "\n    #graphql\n    mutation UpdateUserData($userData: UserUpdate!){\n        updateUserData(userData: $userData){\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n": types.UpdateUserDataDocument,
    "\n    #graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n": types.FollowUserDocument,
    "\n    #graphql\n    mutation UnfollowUser($to: ID!){\n        unfollowUser(to: $to)\n    }\n": types.UnfollowUserDocument,
    "\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      images\n      createdAt\n      author {\n        id\n        username\n        name\n        profileImageURL\n      }\n    }\n  }\n": types.GetAllPostsDocument,
    "\n    #graphql\n    query VerifyUserGoogleToken($token: String!) {\n        verifyGoogleToken(token: $token)\n    }\n": types.VerifyUserGoogleTokenDocument,
    "\n    #graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            recommendedUsers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    profileImageURL\n                }\n            }\n        }\n    }\n": types.GetCurrentUserDocument,
    "\n    #graphql\n    query GetUserByUsername($username: String!){\n        getUserByUsername(username: $username) {\n            username\n            id\n            name\n            about\n            profileImageURL\n            coverImageURL\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            createdAt\n            posts {\n                id\n                content\n                images\n                createdAt\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n": types.GetUserByUsernameDocument,
    "\n    #graphql\n    query DeleteUserAccount{\n        deleteUserAccount\n    }\n": types.DeleteUserAccountDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation CreatePost($payload: CreatePostData!) {\n        createPost(payload: $payload) {\n            id\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation CreatePost($payload: CreatePostData!) {\n        createPost(payload: $payload) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UserSignUpToken($userData: SignUpDetails!){\n        userSignUpToken(userData: $userData)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UserSignUpToken($userData: SignUpDetails!){\n        userSignUpToken(userData: $userData)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UserSignInToken($userData: SignInDetails!){\n        userSignInToken(userData: $userData)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UserSignInToken($userData: SignInDetails!){\n        userSignInToken(userData: $userData)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UpdateUserData($userData: UserUpdate!){\n        updateUserData(userData: $userData){\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UpdateUserData($userData: UserUpdate!){\n        updateUserData(userData: $userData){\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    mutation UnfollowUser($to: ID!){\n        unfollowUser(to: $to)\n    }\n"): (typeof documents)["\n    #graphql\n    mutation UnfollowUser($to: ID!){\n        unfollowUser(to: $to)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      images\n      createdAt\n      author {\n        id\n        username\n        name\n        profileImageURL\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      images\n      createdAt\n      author {\n        id\n        username\n        name\n        profileImageURL\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query VerifyUserGoogleToken($token: String!) {\n        verifyGoogleToken(token: $token)\n    }\n"): (typeof documents)["\n    #graphql\n    query VerifyUserGoogleToken($token: String!) {\n        verifyGoogleToken(token: $token)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            recommendedUsers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    profileImageURL\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            profileImageURL\n            coverImageURL\n            email\n            name\n            about\n            username\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            recommendedUsers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            posts{\n                id\n                content\n                images\n                author {\n                    id\n                    username\n                    profileImageURL\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query GetUserByUsername($username: String!){\n        getUserByUsername(username: $username) {\n            username\n            id\n            name\n            about\n            profileImageURL\n            coverImageURL\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            createdAt\n            posts {\n                id\n                content\n                images\n                createdAt\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    #graphql\n    query GetUserByUsername($username: String!){\n        getUserByUsername(username: $username) {\n            username\n            id\n            name\n            about\n            profileImageURL\n            coverImageURL\n            followers {\n                id\n                name\n                username\n                profileImageURL\n            }\n            following {\n                id\n                name\n                username\n                profileImageURL\n            }\n            createdAt\n            posts {\n                id\n                content\n                images\n                createdAt\n                author {\n                    id\n                    username\n                    name\n                    profileImageURL\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    #graphql\n    query DeleteUserAccount{\n        deleteUserAccount\n    }\n"): (typeof documents)["\n    #graphql\n    query DeleteUserAccount{\n        deleteUserAccount\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;