import { graphqlClient } from "@/clients/api"
import { CreatePostData } from "@/gql/graphql"
import { createPostMutation } from "@/graphql/mutation/post"
import { getAllPostsQuery } from "@/graphql/query/post"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload: CreatePostData) => graphqlClient.request(createPostMutation, { payload }),
        onMutate: (payload) => toast.loading('Creating Post', {id: "1"}),
        onSuccess: async(payload) => {
            await queryClient.invalidateQueries({queryKey: ['All-Posts']});
            toast.success('Post Uploaded', {id: "1"})
        },
    });
    return mutation;
}

export const useGetAllPosts = () => {
    const query = useQuery({
        queryKey: ['All-Posts'],
        queryFn: () => graphqlClient.request(getAllPostsQuery),
    });
    return { ...query, posts: query.data?.getAllPosts };
}