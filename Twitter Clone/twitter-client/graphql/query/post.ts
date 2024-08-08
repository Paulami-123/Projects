import { graphql } from "@/gql";

export const getAllPostsQuery = graphql(`
  query GetAllPosts {
    getAllPosts {
      id
      content
      images
      createdAt
      author {
        id
        username
        name
        profileImageURL
      }
    }
  }
`);