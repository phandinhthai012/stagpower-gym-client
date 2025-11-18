import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../member/api/user.api";

const queryKeys = {
    membersWithActiveSubscriptions: ['membersWithActiveSubscriptions'],
    membersWithActivePTSubscriptions: ['membersWithActivePTSubscriptions'],
}

export const useMembersWithActiveSubscriptions = () => {
    return useQuery({
        queryKey: queryKeys.membersWithActiveSubscriptions,
        queryFn: userApi.getMembersWithActiveSubscriptions,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export const useMembersWithActivePTSubscriptions = () => {
    return useQuery({
        queryKey: queryKeys.membersWithActivePTSubscriptions,
        queryFn: userApi.getMembersWithActivePTSubscriptions,
        staleTime: 1000 * 60 * 5, // 5 minutes (PT subscriptions có thể thay đổi nhanh)
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}