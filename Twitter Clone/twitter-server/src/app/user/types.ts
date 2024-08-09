export const types = `#graphql
    scalar Date

    type User {
        id:                 ID!
        name:               String!
        username:           String!
        about:              String
        email:              String!
        profileImageURL:    String!
        coverImageURL:      String!
        posts:              [Post]
        followers:          [User]
        following:          [User]
        recommendedUsers:   [User]
        createdAt:          Date
    }

    input SignInDetails {
        email:              String!
        password:           String!
    }

    input SignUpDetails {
        name:               String!
        email:              String!
        password:           String!
    }

    input UserUpdate {
        data:              UpdateDataType
    }

    input UpdateDataType {
        name:               String
        about:              String
        profileImageURL:    String
        coverImageURL:      String
    }
`;