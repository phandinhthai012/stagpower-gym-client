import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';

export const useSubscriptions = () => {
    return useQuery({
        queryKey: queryKeys.subscriptions,
        queryFn: subscriptionApi.getAllSubscriptions,
    });
}

export const useSubscriptionById = (subscriptionId: string) => {
    return useQuery({
        queryKey: queryKeys.subscription(subscriptionId),
        queryFn: () => subscriptionApi.getSubscriptionById(subscriptionId),
    });
}

export const useSubscriptionsByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: queryKeys.memberSubscriptions(memberId),
        queryFn: () => subscriptionApi.getSubscriptionsByMemberId(memberId),
    });
}

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => subscriptionApi.createSubscription(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
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
            queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
            toast.success('Gói tập đã được kích hoạt lại!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi kích hoạt gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}
