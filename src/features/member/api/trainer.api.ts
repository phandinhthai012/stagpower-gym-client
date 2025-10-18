import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface TrainerUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  photo?: string;
  trainerInfo?: {
    specialty: string;
    experience_years: number;
    certificate?: string[];
  };
}

export const trainerApi = {
  // Get all trainers
  getAllTrainers: async (): Promise<TrainerUser[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_USERS_WITH_PAGINATION, {
      params: { 
        role: 'trainer', 
        status: 'active',
        limit: 100 // Get all active trainers
      }
    });
    return response.data.data?.data || [];
  },
};

