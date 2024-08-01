import { graphql } from "@/gql";

export const getAllPostsQuery = graphql(`
  query GetAllPosts {
    getAllPosts {
      id
      content
      imageURL
      author {
        id
        username
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);