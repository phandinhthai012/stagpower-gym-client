import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

// Get all check-ins
export const useCheckIns = () => {
  return useQuery({
    queryKey: ['check-ins'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.CHECK_IN.GET_ALL_CHECK_INS);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Get check-ins by member ID
export const useCheckInsByMemberId = (memberId: string | null | undefined) => {
  return useQuery({
    queryKey: ['check-ins', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const response = await axiosInstance.get(
        API_ENDPOINTS.CHECK_IN.GET_CHECK_IN_BY_MEMBER_ID(memberId)
      );
      return response.data;
    },
    enabled: !!memberId, // Only run if memberId exists
    staleTime: 1000 * 60 * 5,
  });
};

