import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';
import { Subscription } from '../types';

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionApi.getAllSubscriptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubscriptionsByMemberId = (memberId: string) => {
  return useQuery({
    queryKey: ['subscriptions', 'member', memberId],
    queryFn: () => subscriptionApi.getSubscriptionsByMemberId(memberId),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubscriptionById = (subscriptionId: string) => {
  return useQuery({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => subscriptionApi.getSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionData: Partial<Subscription>) => subscriptionApi.createSubscription(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Đăng ký gói tập thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi đăng ký gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: Partial<Subscription> }) => 
      subscriptionApi.updateSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Cập nhật gói tập thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useSuspendSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, reason }: { subscriptionId: string; reason: string }) => 
      subscriptionApi.suspendSubscription(subscriptionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Tạm ngưng gói tập thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tạm ngưng gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useUnsuspendSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => subscriptionApi.unsuspendSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Kích hoạt lại gói tập thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi kích hoạt lại gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};
