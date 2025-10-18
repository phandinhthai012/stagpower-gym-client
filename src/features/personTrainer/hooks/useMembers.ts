import { useQuery } from '@tanstack/react-query';
import { memberApi, branchApi } from '../api/member.api';

export const memberQueryKeys = {
  all: ['members'] as const,
};

export const branchQueryKeys = {
  all: ['branches'] as const,
};

export const useMembers = () => {
  return useQuery({
    queryKey: memberQueryKeys.all,
    queryFn: () => memberApi.getAllMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBranches = () => {
  return useQuery({
    queryKey: branchQueryKeys.all,
    queryFn: () => branchApi.getAllBranches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
