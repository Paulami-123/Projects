export const types = `#graphql
    scalar Date

    input CreatePostData {
        content:        String!
        postImages:     [String]
    }

    type Post {
        id:             ID!
        content:        String!
        images:         [String]
        author:         User!
        createdAt:      Date!
    }

`