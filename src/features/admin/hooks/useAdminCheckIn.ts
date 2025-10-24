import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query'
import { adminCheckInApi } from '../api/checkin.api';
import { queryKeys } from '../../../constants/queryKeys';
import { toast } from 'sonner';

export const useAdminManageCheckInList = () => {
    return useQuery({
        queryKey: queryKeys.checkIns,
        queryFn: () => adminCheckInApi.getAllCheckIns(),
        staleTime: 1000 * 60 * 10, // 10 phút
        gcTime: 1000 * 60 * 10, // 10 phút
        retry: 1,
        placeholderData: keepPreviousData,
    }); 
}


export const useAdminCheckIn = () => {
    const queryClient = useQueryClient();

    const adminCheckInMutation = useMutation({
        mutationFn: (data: any) => adminCheckInApi.createCheckIn(data),
        onSuccess: (response) => {
            const memberId = response?.data?.memberId;
            queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
            queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
            queryClient.invalidateQueries({ queryKey: ['checkin-history'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.checkIns });
            toast.success('Check-in thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Lỗi khi check-in');
        }
    });


    const adminQRCheckInMutation = useMutation({
        mutationFn: (data: any) => adminCheckInApi.createCheckInByQRCode(data),
        onSuccess: (response) => {
            const memberId = response?.data?.memberId;
            queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
            queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
            queryClient.invalidateQueries({ queryKey: ['checkin-history'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.checkIns });
            toast.success('Check-in bằng QR code thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Lỗi khi check-in bằng QR code');
        }
    });

    return {
        adminCheckIn: adminCheckInMutation.mutateAsync,
        isCheckingIn: adminCheckInMutation.isPending,

        adminQRCheckIn: adminQRCheckInMutation.mutateAsync,
        isCheckingInQR: adminQRCheckInMutation.isPending,
    };
};