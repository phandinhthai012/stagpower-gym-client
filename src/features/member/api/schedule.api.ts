import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { CreateScheduleRequest, ScheduleWithDetails } from '../types/schedule.types';

export const scheduleApi = {
  // Get my schedules
  getMySchedules: async (memberId: string): Promise<ScheduleWithDetails[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_MY_SCHEDULES(memberId));
    return response.data.data || [];
  },

  // Create new schedule
  createSchedule: async (data: CreateScheduleRequest, memberId: string): Promise<ScheduleWithDetails> => {
    const payload = {
      ...data,
      memberId, // Add memberId from logged-in user
    };
    const response = await apiClient.post(API_ENDPOINTS.SCHEDULE.CREATE_SCHEDULE, payload);
    return response.data.data;
  },

  // Cancel schedule
  cancelSchedule: async (scheduleId: string): Promise<ScheduleWithDetails> => {
    const response = await apiClient.put(
      API_ENDPOINTS.SCHEDULE.UPDATE_SCHEDULE(scheduleId),
      { status: 'Cancelled' }
    );
    return response.data.data;
  },

  // Get schedule detail
  getScheduleById: async (scheduleId: string): Promise<ScheduleWithDetails> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_ID(scheduleId));
    return response.data.data;
  },

  // Get schedules by trainer ID
  getSchedulesByTrainerId: async (trainerId: string): Promise<ScheduleWithDetails[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId));
    return response.data.data || [];
  },
};

