import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import {
  StaffTrainerUser,
  CreateStaffTrainerRequest,
  UpdateStaffTrainerRequest,
  StaffTrainerFilters,
  PaginatedResponse,
} from '../types/staff-trainer.types';

/**
 * API functions for Staff & Trainer management
 */
export const staffTrainerApi = {
  /**
   * Get all staff and trainers with pagination and filters
   */
  getStaffTrainersPaginated: async (
    filters?: StaffTrainerFilters
  ): Promise<PaginatedResponse<StaffTrainerUser>> => {
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      sort: filters?.sort || 'createdAt',
      order: filters?.order || 'desc',
      search: filters?.search || '',
      role: filters?.role || '',
      status: filters?.status || '',
    };

    const response = await apiClient.get(
      API_ENDPOINTS.USER.GET_ALL_STAFFS_WITH_PAGINATION,
      { params }
    );

    // API returns: { success, data: { data: [], pagination: {} } }
    return response.data.data;
  },

  /**
   * Get all staff and trainers (without pagination)
   */
  getAllStaffTrainers: async (): Promise<StaffTrainerUser[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_STAFFS);
    // API returns: { success, data: [...] }
    return response.data.data;
  },

  /**
   * Get staff/trainer by ID
   */
  getStaffTrainerById: async (userId: string): Promise<StaffTrainerUser> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_USER_BY_ID(userId));
    return response.data.data;
  },

  /**
   * Create new staff or trainer
   */
  createStaffTrainer: async (
    data: CreateStaffTrainerRequest
  ): Promise<StaffTrainerUser> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_USER, data);
    return response.data.data;
  },

  /**
   * Update staff or trainer
   */
  updateStaffTrainer: async (
    userId: string,
    data: UpdateStaffTrainerRequest
  ): Promise<StaffTrainerUser> => {
    const response = await apiClient.put(
      API_ENDPOINTS.USER.UPDATE_USER(userId),
      data
    );
    return response.data.data;
  },

  /**
   * Change staff/trainer status
   */
  changeStatus: async (
    userId: string,
    status: 'active' | 'inactive' | 'pending' | 'banned'
  ): Promise<StaffTrainerUser> => {
    const response = await apiClient.put(
      API_ENDPOINTS.USER.CHANGE_USER_STATUS(userId),
      { status }
    );
    return response.data.data;
  },

  /**
   * Delete staff or trainer (not available in current API, placeholder for future)
   */
  deleteStaffTrainer: async (userId: string): Promise<void> => {
    // Note: Current API doesn't have delete endpoint for users
    // This is a placeholder - may need to use status change to 'inactive' instead
    throw new Error('Delete user not implemented in API. Use status change instead.');
  },

  /**
   * Get trainers only
   */
  getTrainers: async (): Promise<StaffTrainerUser[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_STAFFS);
    const allStaff = response.data.data;
    return allStaff.filter((user: StaffTrainerUser) => user.role === 'trainer');
  },

  /**
   * Get staff only
   */
  getStaff: async (): Promise<StaffTrainerUser[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_STAFFS);
    const allStaff = response.data.data;
    return allStaff.filter(
      (user: StaffTrainerUser) => user.role === 'staff' || user.role === 'admin'
    );
  },
};

