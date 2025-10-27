import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

// Get my health info
export const useMyHealthInfo = () => {
  return useQuery({
    queryKey: ['health-info', 'me'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.HEALTH_INFO.GET_MY_HEALTH_INFO);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Get health info by member ID
export const useHealthInfoByMemberId = (memberId: string | null | undefined) => {
  return useQuery({
    queryKey: ['health-info', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_MEMBER_ID(memberId)
        );
        return response.data;
      } catch (error: any) {
        // 404 is expected when member doesn't have health info yet
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!memberId, // Only run if memberId exists
    staleTime: 1000 * 60 * 5,
    retry: false, // Don't retry on 404 errors
    meta: {
      errorMessage: null, // Suppress error logging
    },
  });
};

// Get health info by ID
export const useHealthInfoById = (healthInfoId: string | null | undefined) => {
  return useQuery({
    queryKey: ['health-info', healthInfoId],
    queryFn: async () => {
      if (!healthInfoId) return null;
      const response = await axiosInstance.get(
        API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_ID(healthInfoId)
      );
      return response.data;
    },
    enabled: !!healthInfoId,
    staleTime: 1000 * 60 * 5,
  });
};

// Create health info
export const useCreateHealthInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ memberId, data }: { memberId: string; data: any }) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(memberId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-info'] });
    },
  });
};

// Update health info
export const useUpdateHealthInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ healthInfoId, data }: { healthInfoId: string; data: any }) => {
      const response = await axiosInstance.put(
        API_ENDPOINTS.HEALTH_INFO.UPDATE_HEALTH_INFO(healthInfoId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-info'] });
    },
  });
};
