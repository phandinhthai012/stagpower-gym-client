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
        mutationFn: (data: any) => userApi.updateMyProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.me });
            toast.success('Thông tin cá nhân đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật thông tin: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
};
