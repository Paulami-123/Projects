export const mutations = `#graphql
    userSignUpToken(userData: SignUpDetails!): String
    userSignInToken(userData: SignInDetails!): String
    updateUserData(userData: UserUpdate!): User
    followUser(to: ID!): Boolean
    unfollowUser(to: ID!): Boolean
`