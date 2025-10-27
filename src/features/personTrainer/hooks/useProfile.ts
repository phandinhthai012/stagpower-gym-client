import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const profileQueryKeys = {
  all: ['trainer-profile'] as const,
  profile: () => [...profileQueryKeys.all, 'detail'] as const,
  stats: (trainerId: string) => [...profileQueryKeys.all, 'stats', trainerId] as const,
};

// Get current trainer profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: profileQueryKeys.profile(),
    queryFn: () => profileApi.getMyProfile(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Get trainer statistics
export const useMyStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: profileQueryKeys.stats(user?.id || ''),
    queryFn: () => profileApi.getMyStats(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

// Update trainer profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: any) => profileApi.updateMyProfile(user?.id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['auth'] }); // Also refresh auth data
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!'
      );
    },
  });
};

