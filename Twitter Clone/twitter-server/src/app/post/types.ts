export const types = `#graphql
    scalar Date

    input CreatePostData {
        content:        String!
        imageURL:       String
    }

    type Post {
        id:             ID!
        content:        String!
        imageURL:       String
        author:         User
    }

`