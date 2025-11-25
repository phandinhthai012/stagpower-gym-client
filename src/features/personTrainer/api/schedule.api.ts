import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { CreateScheduleRequest, ScheduleWithDetails, UpdateScheduleRequest } from '../types/schedule.types';

export const scheduleApi = {
  // Get schedules for a specific trainer
  getMySchedules: async (trainerId: string): Promise<ScheduleWithDetails[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId));
    return response.data.data || [];
  },

  // Get schedule by ID
  getScheduleById: async (scheduleId: string): Promise<ScheduleWithDetails> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_ID(scheduleId));
    return response.data.data;
  },

  // Create new schedule
  createSchedule: async (data: CreateScheduleRequest, trainerId: string): Promise<ScheduleWithDetails> => {
    const payload = {
      ...data,
      trainerId, // Add trainerId from logged-in trainer
    };
    const response = await apiClient.post(API_ENDPOINTS.SCHEDULE.CREATE_SCHEDULE, payload);
    return response.data.data;
  },

  // Update schedule
  updateSchedule: async (scheduleId: string, data: UpdateScheduleRequest): Promise<ScheduleWithDetails> => {
    const response = await apiClient.put(API_ENDPOINTS.SCHEDULE.UPDATE_SCHEDULE(scheduleId), data);
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

  // Complete schedule
  completeSchedule: async (scheduleId: string): Promise<ScheduleWithDetails> => {
    const response = await apiClient.put(
      API_ENDPOINTS.SCHEDULE.UPDATE_SCHEDULE(scheduleId),
      { status: 'Completed' }
    );
    return response.data.data;
  },

  // Delete schedule
  deleteSchedule: async (scheduleId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SCHEDULE.DELETE_SCHEDULE(scheduleId));
  },

  // Get schedules by trainer ID
  getSchedulesByTrainerId: async (trainerId: string): Promise<ScheduleWithDetails[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId));
    return response.data.data || [];
  },
};
