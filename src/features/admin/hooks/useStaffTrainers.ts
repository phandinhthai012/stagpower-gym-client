import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { staffTrainerApi } from '../api/staff-trainer.api';
import {
  StaffTrainerFilters,
  CreateStaffTrainerRequest,
  UpdateStaffTrainerRequest,
} from '../types/staff-trainer.types';

/**
 * Query keys for staff and trainers
 */
export const staffTrainerQueryKeys = {
  all: ['staff-trainers'] as const,
  lists: () => [...staffTrainerQueryKeys.all, 'list'] as const,
  list: (filters: StaffTrainerFilters) =>
    [...staffTrainerQueryKeys.lists(), { filters }] as const,
  details: () => [...staffTrainerQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffTrainerQueryKeys.details(), id] as const,
  trainers: () => [...staffTrainerQueryKeys.all, 'trainers'] as const,
  staff: () => [...staffTrainerQueryKeys.all, 'staff'] as const,
};

/**
 * Hook to get paginated staff and trainers with filters
 */
export const useStaffTrainers = (filters?: StaffTrainerFilters) => {
  return useQuery({
    queryKey: staffTrainerQueryKeys.list(filters || {}),
    queryFn: () => staffTrainerApi.getStaffTrainersPaginated(filters),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to get all staff and trainers (without pagination)
 */
export const useAllStaffTrainers = () => {
  return useQuery({
    queryKey: staffTrainerQueryKeys.lists(),
    queryFn: staffTrainerApi.getAllStaffTrainers,
  });
};

/**
 * Hook to get staff/trainer by ID
 */
export const useStaffTrainer = (userId: string) => {
  return useQuery({
    queryKey: staffTrainerQueryKeys.detail(userId),
    queryFn: () => staffTrainerApi.getStaffTrainerById(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to get trainers only
 */
export const useTrainers = () => {
  return useQuery({
    queryKey: staffTrainerQueryKeys.trainers(),
    queryFn: staffTrainerApi.getTrainers,
  });
};

/**
 * Hook to get staff only
 */
export const useStaff = () => {
  return useQuery({
    queryKey: staffTrainerQueryKeys.staff(),
    queryFn: staffTrainerApi.getStaff,
  });
};

/**
 * Hook to create staff or trainer
 */
export const useCreateStaffTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffTrainerRequest) =>
      staffTrainerApi.createStaffTrainer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffTrainerQueryKeys.all });
      toast.success('Đã tạo nhân viên/PT thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi tạo nhân viên/PT';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

/**
 * Hook to update staff or trainer
 */
export const useUpdateStaffTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateStaffTrainerRequest;
    }) => staffTrainerApi.updateStaffTrainer(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffTrainerQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffTrainerQueryKeys.detail(variables.userId),
      });
      toast.success('Đã cập nhật thông tin thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

/**
 * Hook to change staff/trainer status
 */
export const useChangeStaffTrainerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: 'active' | 'inactive' | 'pending' | 'banned';
    }) => staffTrainerApi.changeStatus(userId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffTrainerQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffTrainerQueryKeys.detail(variables.userId),
      });
      toast.success('Đã thay đổi trạng thái thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi thay đổi trạng thái';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

/**
 * Hook to delete staff or trainer
 */
export const useDeleteStaffTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => staffTrainerApi.deleteStaffTrainer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffTrainerQueryKeys.all });
      toast.success('Đã xóa nhân viên/PT thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi xóa nhân viên/PT';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

