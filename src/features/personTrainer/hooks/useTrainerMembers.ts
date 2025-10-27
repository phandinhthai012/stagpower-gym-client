import { useQuery, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../api/member.api';
import { useAuth } from '../../../contexts/AuthContext';

export const trainerMembersQueryKeys = {
  all: ['trainer-members'] as const,
  list: (trainerId: string) => [...trainerMembersQueryKeys.all, 'list', trainerId] as const,
  detail: (memberId: string, trainerId: string) => 
    [...trainerMembersQueryKeys.all, 'detail', memberId, trainerId] as const,
};

// Get all members for the logged-in trainer
export const useTrainerMembers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerMembersQueryKeys.list(user?.id || ''),
    queryFn: () => memberApi.getTrainerMembers(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Get detailed info for a specific member
export const useMemberDetail = (memberId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: trainerMembersQueryKeys.detail(memberId, user?.id || ''),
    queryFn: () => memberApi.getMemberDetail(memberId, user?.id || ''),
    enabled: !!memberId && !!user?.id,
  });
};

// Prefetch member detail for faster modal loading
export const usePrefetchMemberDetail = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return (memberId: string) => {
    queryClient.prefetchQuery({
      queryKey: trainerMembersQueryKeys.detail(memberId, user?.id || ''),
      queryFn: () => memberApi.getMemberDetail(memberId, user?.id || ''),
    });
  };
};

