export const mutations = `#graphql
    userSignUpToken(userData: SignUpDetails!): TokenData
    userSignInToken(userData: SignInDetails!): TokenData
    updateUserData(userData: UserUpdate!): UserData
    followUser(to: ID!): Boolean
    unfollowUser(to: ID!): Boolean
`