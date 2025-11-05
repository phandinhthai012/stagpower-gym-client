import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface User {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  role: 'admin' | 'staff' | 'trainer' | 'member';
  status: 'active' | 'inactive' | 'pending' | 'Banned';
  memberInfo?: {
    membership_level: 'vip' | 'basic';
    qr_code?: string;
    notes?: string;
    is_student: boolean;
    total_spending: number;
    membership_month: number;
    current_brand_id?: string;
  };
  trainerInfo?: {
    specialty?: string;
    experience_years: number;
    certificate: string[];
    working_hour: string[];
  };
  staffInfo?: {
    brand_id?: string;
    position?: 'manager' | 'trainer' | 'staff' | 'receptionist';
  };
  adminInfo?: {
    permissions: string[];
    managed_branches: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  // Member specific fields
  'memberInfo.membership_level'?: 'vip' | 'basic';
  'memberInfo.is_student'?: boolean;
  'memberInfo.total_spending'?: number;
  'memberInfo.membership_month'?: number;
  'memberInfo.notes'?: string;
  // Trainer specific fields
  'trainerInfo.specialty'?: string;
  'trainerInfo.experience_years'?: number;
  'trainerInfo.certificate'?: string[];
  'trainerInfo.working_hour'?: string[];
  // Staff specific fields
  'staffInfo.brand_id'?: string;
  'staffInfo.position'?: 'manager' | 'trainer' | 'staff' | 'receptionist';
  // Admin specific fields
  'adminInfo.permissions'?: string[];
  'adminInfo.managed_branches'?: string[];
}

// API Functions
export const userApi = {
  // Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ME);
    return response.data.data;
  },

  // Lấy thông tin user theo ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_USER_BY_ID(userId));
    return response.data.data;
  },

  // Cập nhật profile của user hiện tại
  updateMyProfile: async (data: UpdateUserProfileRequest): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_MY_PROFILE, data);
    return response.data.data;
  },

  // Cập nhật profile của user khác (admin only)
  updateUser: async (userId: string, data: UpdateUserProfileRequest): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_USER(userId), data);
    return response.data.data;
  },

  // Thay đổi trạng thái user (admin only)
  changeUserStatus: async (userId: string, status: 'active' | 'inactive' | 'pending' | 'Banned'): Promise<User> => {
    const response = await apiClient.put(API_ENDPOINTS.USER.CHANGE_USER_STATUS(userId), { status });
    return response.data.data;
  },

  // Lấy danh sách members với phân trang
  getMembers: async (page: number = 1, limit: number = 10): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_MEMBERS, {
      params: { page, limit }
    });
    return response.data;
  },

  // Lấy danh sách staff
  getStaffs: async (): Promise<User[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_STAFFS);
    return response.data.data;
  },

  // Lấy danh sách users với phân trang
  getUsersWithPagination: async (page: number = 1, limit: number = 10): Promise<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_USERS_WITH_PAGINATION, {
      params: { page, limit }
    });
    return response.data;
  },

  getMembersWithActiveSubscriptions: async (): Promise<User[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_MEMBERS_WITH_ACTIVE_SUBSCRIPTIONS);
    return response.data.data;
  },
};
