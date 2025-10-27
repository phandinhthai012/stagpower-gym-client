import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

// Get all subscriptions
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION.GET_ALL_SUBSCRIPTIONS);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Get subscription by member ID
export const useSubscriptionByMemberId = (memberId: string | null | undefined) => {
  return useQuery({
    queryKey: ['subscription', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const response = await axiosInstance.get(
        API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId)
      );
      return response.data;
    },
    enabled: !!memberId, // Only run if memberId exists
    staleTime: 1000 * 60 * 5,
  });
};

