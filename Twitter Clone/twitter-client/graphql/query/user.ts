import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
    #graphql
    query VerifyUserGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }
`);

export const getCurrentUserQuery = graphql(`
    #graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            profileImageURL
            coverImageURL
            email
            name
            about
            username
            followers {
                id
                name
                username
                profileImageURL
            }
            following {
                id
                name
                username
                profileImageURL
            }
            recommendedUsers {
                id
                name
                username
                profileImageURL
            }
            posts{
                id
                content
                images
                author {
                    id
                    username
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
            name
            about
            profileImageURL
            coverImageURL
            followers {
                id
                name
                username
                profileImageURL
            }
            following {
                id
                name
                username
                profileImageURL
            }
            createdAt
            posts {
                id
                content
                images
                createdAt
                author {
                    id
                    username
                    name
                    profileImageURL
                }
            }
        }
    }
`);

export const deleteUserAccountQuery = graphql(`
    #graphql
    query DeleteUserAccount{
        deleteUserAccount
    }
`)