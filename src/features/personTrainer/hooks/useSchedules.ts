import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '../api/schedule.api';
import { CreateScheduleRequest, UpdateScheduleRequest } from '../types/schedule.types';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const scheduleQueryKeys = {
  all: ['trainer-schedules'] as const,
  mySchedules: (trainerId: string) => [...scheduleQueryKeys.all, 'my', trainerId] as const,
  detail: (id: string) => [...scheduleQueryKeys.all, 'detail', id] as const,
};

export const useMySchedules = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: scheduleQueryKeys.mySchedules(user?.id || ''),
    queryFn: () => scheduleApi.getMySchedules(user?.id || ''),
    enabled: !!user?.id,
  });
};

export const useScheduleDetail = (scheduleId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.detail(scheduleId),
    queryFn: () => scheduleApi.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => {
      if (!user?.id) {
        throw new Error('Trainer not logged in');
      }
      return scheduleApi.createSchedule(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Tạo lịch thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch!');
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: UpdateScheduleRequest }) => 
      scheduleApi.updateSchedule(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Cập nhật lịch thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật lịch!');
    },
  });
};

export const useCancelSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.cancelSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Hủy lịch thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch!');
    },
  });
};

export const useCompleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.completeSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Hoàn thành buổi tập!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi hoàn thành buổi tập!');
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      toast.success('Xóa lịch thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa lịch!');
    },
  });
};
