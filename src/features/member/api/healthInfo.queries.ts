import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthInfoApi, CreateHealthInfoRequest, UpdateHealthInfoRequest } from './healthInfo.api';

export const useHealthInfo = (memberId?: string) => {
  return useQuery({
    queryKey: ['healthInfo', memberId],
    queryFn: () => memberId 
      ? healthInfoApi.getHealthInfoByMemberId(memberId)
      : healthInfoApi.getMyHealthInfo(),
    enabled: !!memberId || true, // Always enabled for current user
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors (health info not found)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateHealthInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: CreateHealthInfoRequest }) =>
      healthInfoApi.createHealthInfo(memberId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch health info queries
      queryClient.invalidateQueries({ queryKey: ['healthInfo'] });
      queryClient.invalidateQueries({ queryKey: ['healthInfo', variables.memberId] });
    },
  });
};

export const useUpdateHealthInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ healthInfoId, data }: { healthInfoId: string; data: UpdateHealthInfoRequest }) =>
      healthInfoApi.updateHealthInfo(healthInfoId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch health info queries
      queryClient.invalidateQueries({ queryKey: ['healthInfo'] });
      queryClient.invalidateQueries({ queryKey: ['healthInfo', data.memberId] });
    },
  });
};
