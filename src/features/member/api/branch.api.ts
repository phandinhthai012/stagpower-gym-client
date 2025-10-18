import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, Branch } from '../types';

export const branchApi = {
  // Get all branches (public endpoint for members)
  getAllBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES_PUBLIC);
    return response.data.data || [];
  },

  // Get branch by ID
  getBranchById: async (branchId: string): Promise<Branch> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_BRANCH_BY_ID(branchId));
    return response.data.data;
  }
};
