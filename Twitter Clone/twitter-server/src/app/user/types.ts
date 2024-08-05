export const types = `#graphql
    scalar Date

    type User {
        id:                 ID!
        firstName:          String!
        lastName:           String
        email:              String!
        profileImageURL:    String
        username:           String!
        posts:              [Post]
        createdAt:          Date
    }

    input SignInDetails {
        email:              String!
        password:           String!
    }

    input SignUpDetails {
        firstName:          String!
        lastName:           String
        email:              String!
        password:           String!
    }
`;