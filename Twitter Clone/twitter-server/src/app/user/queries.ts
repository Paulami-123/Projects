export const queries = `#graphql 

    verifyGoogleToken(token: String!): TokenData
    getCurrentUser: User
    getUserByUsername(username: String!): User
    deleteUserAccount: DeleteUserType

`;