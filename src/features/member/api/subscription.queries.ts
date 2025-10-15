import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from './subscription.api';
import { Subscription } from '../types';

// Query keys
export const subscriptionQueryKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...subscriptionQueryKeys.lists(), { filters }] as const,
  details: () => [...subscriptionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionQueryKeys.details(), id] as const,
  byMember: (memberId: string) => [...subscriptionQueryKeys.all, 'member', memberId] as const,
};

// Queries
export const useSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionQueryKeys.lists(),
    queryFn: subscriptionApi.getAllSubscriptions,
  });
};

export const useSubscription = (subscriptionId: string) => {
  return useQuery({
    queryKey: subscriptionQueryKeys.detail(subscriptionId),
    queryFn: () => subscriptionApi.getSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
  });
};

export const useSubscriptionsByMemberId = (memberId: string) => {
  return useQuery({
    queryKey: subscriptionQueryKeys.byMember(memberId),
    queryFn: () => subscriptionApi.getSubscriptionsByMemberId(memberId),
    enabled: !!memberId,
  });
};

// Mutations
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Subscription>) => subscriptionApi.createSubscription(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.byMember(variables.memberId) });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: Partial<Subscription> }) => 
      subscriptionApi.updateSubscription(subscriptionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.detail(variables.subscriptionId) });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => subscriptionApi.deleteSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.lists() });
    },
  });
};

export const useSuspendSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: { startDate: string; endDate: string; reason: string } }) => 
      subscriptionApi.suspendSubscription(subscriptionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.detail(variables.subscriptionId) });
    },
  });
};

export const useUnsuspendSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => subscriptionApi.unsuspendSubscription(subscriptionId),
    onSuccess: (_, subscriptionId) => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.detail(subscriptionId) });
    },
  });
};
