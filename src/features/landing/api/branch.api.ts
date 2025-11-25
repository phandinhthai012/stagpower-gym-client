import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'Active' | 'Maintenance' | 'Closed';
  openTime?: string;
  closeTime?: string;
}

export const branchApi = {
  // Get all branches (public endpoint)
  getAllBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES_PUBLIC);
    return response.data.data || [];
  }
};

