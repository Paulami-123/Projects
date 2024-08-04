import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
    #graphql
    query VerifyUserGoogleToken($token: String!){
        verifyGoogleToken(token: $token)
    }
`)

export const getCurrentUserQuery = graphql(`
    query GetCurrentUser {
        getCurrentUser {
            id
            profileImageURL
            email
            firstName
            lastName
            username
            posts{
                id
                content
                author {
                    id
                    username
                    firstName
                    lastName
                    profileImageURL
                }
            }
        }
    }
`);

export const getUserByUsernameQuery = graphql(`
    #graphql
    query GetUserByUsername($username: String!){
        getUserByUsername(username: $username) {
            username
            id
            firstName
            lastName
            profileImageURL
            createdAt
            posts {
                id
                content
                imageURL
                createdAt
                author {
                    id
                    username
                    firstName
                    lastName
                    profileImageURL
                }
            }
        }
    }
`)