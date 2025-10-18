import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  memberInfo?: {
    membership_level: 'vip' | 'basic';
  };
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
}

export const memberApi = {
  getAllMembers: async (): Promise<Member[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_USERS_WITH_PAGINATION, {
      params: { 
        role: 'member', 
        status: 'active',
        limit: 100
      }
    });
    return response.data.data?.data || [];
  },
};

export const branchApi = {
  getAllBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES_PUBLIC);
    return response.data.data || [];
  },
};
