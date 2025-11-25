import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { healthInfoApi } from '../api/healthInfo.api';

// Get my health info (latest record - member 1-N healthInfo relationship)
export const useMyHealthInfo = () => {
  return useQuery({
    queryKey: ['health-info', 'me'],
    queryFn: async () => {
      try {
        // Use healthInfoApi to get transformed data (lowercase enums -> PascalCase)
        // Returns the latest healthInfo record (sorted by createdAt desc)
        return await healthInfoApi.getMyHealthInfo();
      } catch (error: any) {
        // 404 is expected when member doesn't have health info yet
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry on 404 errors
  });
};

// Get latest health info by member ID (member 1-N healthInfo relationship, returns latest)
export const useHealthInfoByMemberId = (memberId: string | null | undefined) => {
  return useQuery({
    queryKey: ['health-info', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      try {
        // Use healthInfoApi to get transformed data (lowercase enums -> PascalCase)
        // Returns the latest healthInfo record (sorted by createdAt desc)
        return await healthInfoApi.getHealthInfoByMemberId(memberId);
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
  });
};

// Get all health info records by member ID
export const useAllHealthInfoByMemberId = (memberId: string | null | undefined) => {
  return useQuery({
    queryKey: ['health-info', 'member', memberId, 'all'],
    queryFn: async () => {
      if (!memberId) return [];
      try {
        // Use healthInfoApi to get transformed data (lowercase enums -> PascalCase)
        return await healthInfoApi.getAllHealthInfoByMemberId(memberId);
      } catch (error: any) {
        // 404 is expected when member doesn't have health info yet
        if (error?.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!memberId, // Only run if memberId exists
    staleTime: 1000 * 60 * 5,
    retry: false, // Don't retry on 404 errors
  });
};

// Get health info by ID
export const useHealthInfoById = (healthInfoId: string | null | undefined) => {
  return useQuery({
    queryKey: ['health-info', healthInfoId],
    queryFn: async () => {
      if (!healthInfoId) return null;
      try {
        // Use healthInfoApi to get transformed data (lowercase enums -> PascalCase)
        return await healthInfoApi.getHealthInfoById(healthInfoId);
      } catch (error: any) {
        // 404 is expected when health info doesn't exist
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!healthInfoId,
    staleTime: 1000 * 60 * 5,
    retry: false, // Don't retry on 404 errors
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
      // API returns: { success, statusCode, message, data }
      return response.data.data;
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
      // API returns: { success, statusCode, message, data }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-info'] });
    },
  });
};
