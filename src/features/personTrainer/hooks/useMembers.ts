import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { useAuth } from '../../../contexts/AuthContext';
import { memberApi } from '../api/member.api';

export const memberQueryKeys = {
  all: ['members'] as const,
};

export const branchQueryKeys = {
  all: ['branches'] as const,
};

// Get all members that trainer is training (for dropdown in create schedule)
export const useMembers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: memberQueryKeys.all,
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get trainer's members from the member API
      const response = await memberApi.getTrainerMembers(user.id);
      return response.members || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all branches (for dropdown in create schedule)
export const useBranches = () => {
  return useQuery({
    queryKey: branchQueryKeys.all,
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES);
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
