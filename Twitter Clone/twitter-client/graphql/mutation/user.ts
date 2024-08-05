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