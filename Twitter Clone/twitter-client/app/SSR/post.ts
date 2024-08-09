import { graphqlClient } from "@/clients/api";
import { Post } from "@/gql/graphql";
import { getAllPostsQuery } from "@/graphql/query/post";

export const getAllPosts = async () => {
    const allPosts = await graphqlClient.request(getAllPostsQuery);
    if(!allPosts.getAllPosts) return { notFound: true }
    return {
      props : {
        data : allPosts.getAllPosts as Post[]
      },
    };
};