import { graphql } from "@/gql";

export const signUpTokenMutation = graphql(`
    #graphql
    mutation UserSignUpToken($userData: SignUpDetails!){
        userSignUpToken(userData: $userData){
            token
            error
        }
    }
`);

export const signInTokenMutation = graphql(`
    #graphql
    mutation UserSignInToken($userData: SignInDetails!){
        userSignInToken(userData: $userData){
            token
            error
        }
    }
`);

export const updateUserMutation = graphql(`
    #graphql
    mutation UpdateUserData($userData: UserUpdate!){
        updateUserData(userData: $userData){
            data{
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
            error
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