import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { branchApi } from '../api/branch.api';
import { toast } from 'sonner';

// Query keys
export const branchQueryKeys = {
  all: ['branches'] as const,
  lists: () => [...branchQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...branchQueryKeys.lists(), { filters }] as const,
  details: () => [...branchQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchQueryKeys.details(), id] as const,
};

// Queries
export const useBranches = () => {
  return useQuery({
    queryKey: branchQueryKeys.lists(),
    queryFn: branchApi.getAllBranches,
  });
};

export const useBranch = (branchId: string) => {
  return useQuery({
    queryKey: branchQueryKeys.detail(branchId),
    queryFn: () => branchApi.getBranchById(branchId),
    enabled: !!branchId,
  });
};

// Mutations
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: branchApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.lists() });
      toast.success('Chi nhánh đã được tạo thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tạo chi nhánh: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ branchId, data }: { branchId: string; data: any }) => 
      branchApi.updateBranch(branchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.detail(variables.branchId) });
      toast.success('Chi nhánh đã được cập nhật thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật chi nhánh: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: branchApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.lists() });
      toast.success('Chi nhánh đã được xóa thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi xóa chi nhánh: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

export const useChangeBranchStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ branchId, status }: { branchId: string; status: 'Active' | 'Inactive' }) => 
      branchApi.changeBranchStatus(branchId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchQueryKeys.detail(variables.branchId) });
      toast.success('Trạng thái chi nhánh đã được cập nhật!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};
