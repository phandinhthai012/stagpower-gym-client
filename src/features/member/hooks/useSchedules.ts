import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '../api/schedule.api';
import { CreateScheduleRequest } from '../types/schedule.types';
import { useAuth } from '../../../contexts/AuthContext';

// Query keys
export const scheduleQueryKeys = {
  all: ['member-schedules'] as const,
  mySchedules: (memberId: string) => [...scheduleQueryKeys.all, 'my', memberId] as const,
  detail: (id: string) => [...scheduleQueryKeys.all, 'detail', id] as const,
  byTrainer: (trainerId: string) => [...scheduleQueryKeys.all, 'trainer', trainerId] as const,
};

// Get my schedules
export const useMySchedules = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: scheduleQueryKeys.mySchedules(user?.id || ''),
    queryFn: () => scheduleApi.getMySchedules(user?.id || ''),
    enabled: !!user?.id,
  });
};

// Create schedule
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => {
      if (!user?.id) {
        throw new Error('User not logged in');
      }
      return scheduleApi.createSchedule(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },
  });
};

// Cancel schedule
export const useCancelSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (scheduleId: string) => scheduleApi.cancelSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },
  });
};

// Get schedule detail
export const useScheduleDetail = (scheduleId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.detail(scheduleId),
    queryFn: () => scheduleApi.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
};

// Get schedules by trainer ID
export const useSchedulesByTrainer = (trainerId: string) => {
  return useQuery({
    queryKey: scheduleQueryKeys.byTrainer(trainerId),
    queryFn: () => scheduleApi.getSchedulesByTrainerId(trainerId),
    enabled: !!trainerId,
  });
};

