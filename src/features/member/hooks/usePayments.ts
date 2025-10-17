import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import { toast } from 'sonner';

export const usePayments = () => {
    return useQuery({
        queryKey: ['payments'],
        queryFn: paymentApi.getAllPayments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePaymentById = (paymentId: string) => {
    return useQuery({
        queryKey: ['payment', paymentId],
        queryFn: () => paymentApi.getPaymentById(paymentId),
        enabled: !!paymentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePaymentsByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: ['payments', 'member', memberId],
        queryFn: () => paymentApi.getPaymentsByMemberId(memberId),
        enabled: !!memberId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => paymentApi.createPayment(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment record đã được tạo thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi tạo payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUpdatePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: string; data: any }) => 
            paymentApi.updatePayment(paymentId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useCompletePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (paymentId: string) => paymentApi.completePayment(paymentId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment đã được hoàn tất!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi hoàn tất payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (paymentId: string) => paymentApi.deletePayment(paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member'] });
            toast.success('Payment đã được xóa!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi xóa payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const usePaymentStats = () => {
    return useQuery({
        queryKey: ['paymentStats'],
        queryFn: paymentApi.getPaymentStats,
    });
};
