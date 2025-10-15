import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: subscriptionApi.getAllSubscriptions,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useSubscriptionById = (subscriptionId: string) => {
    return useQuery({
        queryKey: ['subscription', subscriptionId],
        queryFn: () => subscriptionApi.getSubscriptionById(subscriptionId),
        enabled: !!subscriptionId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useSubscriptionsByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: ['subscriptions', 'member', memberId],
        queryFn: () => subscriptionApi.getSubscriptionsByMemberId(memberId),
        enabled: !!memberId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => subscriptionApi.createSubscription(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member', response.data.memberId] });
            toast.success('Đăng ký gói tập thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi đăng ký gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: any }) => 
            subscriptionApi.updateSubscription(subscriptionId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member', response.data.memberId] });
            toast.success('Thông tin đăng ký đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật đăng ký: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useDeleteSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (subscriptionId: string) => subscriptionApi.deleteSubscription(subscriptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member'] });
            toast.success('Đăng ký đã được hủy!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi hủy đăng ký: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useSuspendSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: { startDate: string; endDate: string; reason: string } }) => 
            subscriptionApi.suspendSubscription(subscriptionId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member', response.data.memberId] });
            toast.success('Gói tập đã được tạm ngưng!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi tạm ngưng gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUnsuspendSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (subscriptionId: string) => subscriptionApi.unsuspendSubscription(subscriptionId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member', response.data.memberId] });
            toast.success('Gói tập đã được kích hoạt lại!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi kích hoạt gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}
