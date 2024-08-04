export const queries = `#graphql 

    verifyGoogleToken(token: String!): String
    getCurrentUser: User
    getUserByUsername(username: String!): User

`;