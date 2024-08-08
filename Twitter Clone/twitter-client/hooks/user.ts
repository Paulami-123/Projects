import { graphqlClient } from "@/clients/api";
import { UserUpdate } from "@/gql/graphql";
import { updateUserMutation } from "@/graphql/mutation/user";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['Current-User'],
        queryFn: () => graphqlClient.request(getCurrentUserQuery)
    });

    return{ ...query, user: query.data?.getCurrentUser };
};

// export const useGetUserFromUsername = () => {
//     const q
// }

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (userData: UserUpdate) => graphqlClient.request(updateUserMutation, { userData }),
        onMutate: (payload) => toast.loading('Updating Information', {id: "1"}),
        onSuccess: async(payload) => {
            await queryClient.invalidateQueries({queryKey: ['Current-User']});
            toast.success('Information updated', {id: "1"})
        },
    });
    return mutation;
}