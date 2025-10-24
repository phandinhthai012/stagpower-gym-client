import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../member/api/user.api";

const queryKeys = {
    membersWithActiveSubscriptions: ['membersWithActiveSubscriptions'],
}

export const useMembersWithActiveSubscriptions = () => {
    return useQuery({
        queryKey: queryKeys.membersWithActiveSubscriptions,
        queryFn: userApi.getMembersWithActiveSubscriptions,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}