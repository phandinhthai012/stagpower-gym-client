import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import checkInService from '../services/checkIn.service';
import { checkinApi } from '../api/checkin.api';
import { toast } from 'sonner';

const QUERY_KEYS = {
    historyCheckIns: (memberId: string) => ['checkin-history', memberId],
    activeCheckIn: (memberId: string) => ['active-checkin', memberId],
}

export const useCheckIns = () => {
    return useQuery({
        queryKey: queryKeys.checkIns,
        queryFn: () => checkInService.getAllCheckIns(),
    });
}

export const useCheckInByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: queryKeys.memberCheckIns(memberId),
        queryFn: () => checkInService.getCheckInByMemberId(memberId),
    });
}

export const useCheckInMember = (memberId: string) => {
    const queryClient = useQueryClient();
    // Query: Get QR Code
    const {
        data: qrCodeResponse,
        isLoading: isLoadingQR,
        error: qrError,
        refetch: refetchQRCode
    } = useQuery({
        queryKey: ['checkin-qr', memberId],
        queryFn: () => checkinApi.generateQRCode(memberId),
        enabled: !!memberId,
        staleTime: 25 * 60 * 1000, // QR hết hạn sau 30 phút, refetch sau 25 phút
        retry: 1
    });
    // // Query: Get Check-in History
    const {
        data: historyResponse,
        isLoading: isLoadingHistory,
        error: historyError,
        refetch: refetchHistory
    } = useQuery({
        queryKey: QUERY_KEYS.historyCheckIns(memberId),
        queryFn: () => checkinApi.getCheckInHistory(memberId),
        enabled: !!memberId,
        refetchInterval: 60000, // Refetch mỗi 60 giây
    });
    // Query: Get Active Check-in
    const {
        data: activeCheckIn,
        isLoading: isLoadingActive
    } = useQuery({
        queryKey: ['active-checkin', memberId],
        queryFn: () => checkinApi.getActiveCheckIn(memberId),
        enabled: !!memberId,
        refetchInterval: 30000, // Refetch mỗi 30 giây
    });

    // // Mutation: Check-out
    const checkOutMutation = useMutation({
        mutationFn: (checkInId: string) => checkinApi.checkOut(checkInId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
            queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
            //   toast.success('Đã check-out thành công! Cảm ơn bạn đã tập luyện.');
        },
        onError: (error: any) => {
            //   toast.error(error?.response?.data?.message || 'Có lỗi khi check-out');
        }
    });
    const createCheckInMutation = useMutation({
        mutationFn: (data: any) => checkinApi.createCheckIn(data),
        onSuccess: (response) => {
            const data = response?.data;
            const memberId = data?.memberId;
            queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
            queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi tạo check-in');
        }
    });


    const createCheckInByQRCodeMutation = useMutation({
        mutationFn: (data: any) => checkinApi.createCheckInByQRcode(data),
        onSuccess: (response) => {
            const data = response?.data;
            const memberId = data?.memberId;
            queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
            queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi tạo check-in');
        }
    });
    return {
        // QR Code
        qrCodeDataUrl: qrCodeResponse?.data,
        isLoadingQR,
        qrError,
        refetchQRCode,

        // // History
        checkInHistory: historyResponse?.data || [],
        isLoadingHistory,
        historyError,
        refetchHistory,

        // // Active check-in
        activeCheckIn,
        isLoadingActive,

        // Check-out
        checkOut: checkOutMutation.mutate,
        isCheckingOut: checkOutMutation.isPending,

        // Create check-in fake để test api 
        createCheckIn: createCheckInMutation.mutate,
        isCreatingCheckIn: createCheckInMutation.isPending,

        // Create check-in by QR code fake để test api
        createCheckInByQRCode: createCheckInByQRCodeMutation.mutateAsync,
        isCreatingCheckInByQRCode: createCheckInByQRCodeMutation.isPending,
    };
}

// export const useCreateCheckIn = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: any) => checkinApi.createCheckIn(data),
//         onSuccess: (response) => {
//             const data = response?.data;
//             const memberId = data?.memberId;
//             queryClient.invalidateQueries({ queryKey: ['checkin-history', memberId] });
//             queryClient.invalidateQueries({ queryKey: ['active-checkin', memberId] });
//         },
//         onError: (error:any) => {
//             toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi tạo check-in');
//         }
//     });
// }