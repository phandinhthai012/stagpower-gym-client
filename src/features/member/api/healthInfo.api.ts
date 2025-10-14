import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface HealthInfo {
  _id?: string;
  memberId: string;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  age?: number;
  bodyFatPercent?: number;
  medicalHistory?: string;
  allergies?: string;
  goal: 'WeightLoss' | 'MuscleGain' | 'Health';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  fitnessLevel: 'Low' | 'Medium' | 'High';
  preferredTime?: 'Morning' | 'Afternoon' | 'Evening';
  weeklySessions?: '1-2' | '3-4' | '5+';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHealthInfoRequest {
  height: number;
  weight: number;
  gender: 'male' | 'female';
  age?: number;
  bodyFatPercent?: number;
  medicalHistory?: string;
  allergies?: string;
  goal: 'WeightLoss' | 'MuscleGain' | 'Health';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  fitnessLevel: 'Low' | 'Medium' | 'High';
  preferredTime?: 'Morning' | 'Afternoon' | 'Evening';
  weeklySessions?: '1-2' | '3-4' | '5+';
}

export interface UpdateHealthInfoRequest extends Partial<CreateHealthInfoRequest> {}

// API Functions
export const healthInfoApi = {
  // Lấy thông tin sức khỏe của member hiện tại
  getMyHealthInfo: async (): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_MY_HEALTH_INFO);
    return response.data.data;
  },

  // Lấy thông tin sức khỏe theo member ID
  getHealthInfoByMemberId: async (memberId: string): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_MEMBER_ID(memberId));
    return response.data.data;
  },

  // Tạo thông tin sức khỏe mới
  createHealthInfo: async (memberId: string, data: CreateHealthInfoRequest): Promise<HealthInfo> => {
    const response = await apiClient.post(API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(memberId), data);
    return response.data.data;
  },

  // Cập nhật thông tin sức khỏe
  updateHealthInfo: async (healthInfoId: string, data: UpdateHealthInfoRequest): Promise<HealthInfo> => {
    const response = await apiClient.put(API_ENDPOINTS.HEALTH_INFO.UPDATE_HEALTH_INFO(healthInfoId), data);
    return response.data.data;
  },

  // Lấy thông tin sức khỏe theo ID
  getHealthInfoById: async (healthInfoId: string): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_ID(healthInfoId));
    return response.data.data;
  },
};
