import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import {
  Schedule,
  ScheduleWithDetails,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleFilters,
  PaginatedScheduleResponse,
} from '../types/schedule.types';

/**
 * API functions for Schedule management
 */
export const scheduleApi = {
  /**
   * Get all schedules with pagination and filters
   */
  getSchedulesPaginated: async (
    filters?: ScheduleFilters
  ): Promise<PaginatedScheduleResponse> => {
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      search: filters?.search || '',
      status: filters?.status || '',
    };

    const response = await apiClient.get(
      API_ENDPOINTS.SCHEDULE.GET_ALL_SCHEDULES_WITH_PAGINATION,
      { params }
    );

    return response.data.data;
  },

  /**
   * Get all schedules (without pagination)
   */
  getAllSchedules: async (): Promise<ScheduleWithDetails[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE.GET_ALL_SCHEDULES);
    return response.data.data;
  },

  /**
   * Get schedule by ID
   */
  getScheduleById: async (scheduleId: string): Promise<ScheduleWithDetails> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_ID(scheduleId)
    );
    return response.data.data;
  },

  /**
   * Get schedules by trainer ID
   */
  getSchedulesByTrainerId: async (trainerId: string): Promise<Schedule[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId)
    );
    return response.data.data;
  },

  /**
   * Get schedules by member ID
   */
  getSchedulesByMemberId: async (memberId: string): Promise<Schedule[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_MEMBERID(memberId)
    );
    return response.data.data;
  },

  /**
   * Create new schedule
   */
  createSchedule: async (data: CreateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.post(
      API_ENDPOINTS.SCHEDULE.CREATE_SCHEDULE,
      data
    );
    return response.data.data;
  },

  /**
   * Update schedule
   */
  updateSchedule: async (
    scheduleId: string,
    data: UpdateScheduleRequest
  ): Promise<Schedule> => {
    const response = await apiClient.put(
      API_ENDPOINTS.SCHEDULE.UPDATE_SCHEDULE(scheduleId),
      data
    );
    return response.data.data;
  },

  /**
   * Delete schedule
   */
  deleteSchedule: async (scheduleId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SCHEDULE.DELETE_SCHEDULE(scheduleId));
  },
};

