import { useQuery } from '@tanstack/react-query';
import { branchApi, Branch } from '../api/branch.api';

export const useBranches = () => {
  return useQuery<Branch[]>({
    queryKey: ['landing', 'branches'],
    queryFn: () => branchApi.getAllBranches(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on error
  });
};

