import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { scheduleApi } from '../api/schedule.api';
import {
  ScheduleFilters,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '../types/schedule.types';

/**
 * Query keys for schedules
 */
export const scheduleQueryKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleQueryKeys.all, 'list'] as const,
  list: (filters: ScheduleFilters) =>
    [...scheduleQueryKeys.lists(), { filters }] as const,
  details: () => [...scheduleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleQueryKeys.details(), id] as const,
  byTrainer: (trainerId: string) => 
    [...scheduleQueryKeys.all, 'trainer', trainerId] as const,
  byMember: (memberId: string) => 
    [...scheduleQueryKeys.all, 'member', memberId] as const,
};

/**
 * Hook to get paginated schedules with filters
 */
export const useSchedules = (filters?: ScheduleFilters) => {
  return useQuery({
    queryKey: scheduleQueryKeys.list(filters || {}),
    queryFn: () => scheduleApi.getSchedulesPaginated(filters),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to get all schedules (without pagination)
 */
export const useAllSchedules = () => {
  return useQuery({
    queryKey: scheduleQueryKeys.lists(),
    queryFn: scheduleApi.getAllSchedules,
  });
};

/**
 * Hook to get schedule by ID
 */
export const useSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.detail(scheduleId),
    queryFn: () => scheduleApi.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
};

/**
 * Hook to get schedules by trainer ID
 */
export const useSchedulesByTrainer = (trainerId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.byTrainer(trainerId),
    queryFn: () => scheduleApi.getSchedulesByTrainerId(trainerId),
    enabled: !!trainerId,
  });
};

/**
 * Hook to get schedules by member ID
 */
export const useSchedulesByMember = (memberId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.byMember(memberId),
    queryFn: () => scheduleApi.getSchedulesByMemberId(memberId),
    enabled: !!memberId,
  });
};

/**
 * Hook to create schedule
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) =>
      scheduleApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Đã tạo lịch thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi tạo lịch';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

/**
 * Hook to update schedule
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      data,
    }: {
      scheduleId: string;
      data: UpdateScheduleRequest;
    }) => scheduleApi.updateSchedule(scheduleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.detail(variables.scheduleId),
      });
      toast.success('Đã cập nhật lịch thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi cập nhật lịch';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

/**
 * Hook to delete schedule
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Đã xóa lịch thành công!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi xóa lịch';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};

