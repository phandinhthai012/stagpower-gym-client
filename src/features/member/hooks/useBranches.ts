import { useQuery } from '@tanstack/react-query';
import { branchApi } from '../api/branch.api';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => branchApi.getAllBranches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBranchById = (branchId: string) => {
  return useQuery({
    queryKey: ['branch', branchId],
    queryFn: () => branchApi.getBranchById(branchId),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
