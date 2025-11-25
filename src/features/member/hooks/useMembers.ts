import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { userApi } from '../api/user.api';
import memberService from '../services/member.service';
import { toast } from 'sonner';

export const useMembers = () => {
    return useQuery({
        queryKey: queryKeys.members,
        queryFn: memberService.getAllMembers,
    });
}

export const useMe = () => {
    return useQuery({
        queryKey: queryKeys.me,
        queryFn: userApi.getMe,
    });
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ data, userId }: { data: any; userId: string }) => userApi.updateMyProfile(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.me });
            // Don't show toast here, let the component handle it
        },
        onError: (error: any) => {
            // Don't show toast here, let the component handle it
            console.error('Update profile error:', error);
        },
    });
};
