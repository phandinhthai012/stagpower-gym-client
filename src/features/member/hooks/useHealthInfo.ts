import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { healthInfoApi } from '../api/healthInfo.api';
import { toast } from 'sonner';

export const useHealthInfo = () => {
    return useQuery({
        queryKey: queryKeys.healthInfo,
        queryFn: healthInfoApi.getMyHealthInfo,
        retry: (failureCount, error: any) => {
            // Don't retry on 404 errors (health info not found)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

export const useCreateHealthInfo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ memberId, data }: { memberId: string; data: any }) => 
            healthInfoApi.createHealthInfo(memberId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.healthInfo });
            toast.success('Thông tin sức khỏe đã được tạo!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi tạo thông tin sức khỏe: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUpdateHealthInfo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ healthInfoId, data }: { healthInfoId: string; data: any }) => 
            healthInfoApi.updateHealthInfo(healthInfoId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.healthInfo });
            toast.success('Thông tin sức khỏe đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật thông tin sức khỏe: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
};
