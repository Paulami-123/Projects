import { graphql } from "@/gql";

export const signUpTokenMutation = graphql(`
    #graphql
    mutation UserSignUpToken($userData: SignUpDetails!){
        userSignUpToken(userData: $userData)
    }
`);

export const signInTokenMutation = graphql(`
    #graphql
    mutation UserSignInToken($userData: SignInDetails!){
        userSignInToken(userData: $userData)
    }
`);

export const updateUserMutation = graphql(`
    #graphql
    mutation UpdateUserData($userData: UserUpdate!){
        updateUserData(userData: $userData){
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
                profileImageURL
                coverImageURL
            }
            following {
                id
                name
                profileImageURL
                coverImageURL
            }
            posts{
                id
                content
                images
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

export const followUserMutation = graphql(`
    #graphql
    mutation FollowUser($to: ID!){
        followUser(to: $to)
    }
`);

export const unfollowUserMutation = graphql(`
    #graphql
    mutation UnfollowUser($to: ID!){
        unfollowUser(to: $to)
    }
`);