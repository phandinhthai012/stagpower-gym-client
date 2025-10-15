import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, Branch } from '../types';

export const branchApi = {
  // Get all branches (public endpoint for members)
  getAllBranches: async (): Promise<ApiResponse<Branch[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES_PUBLIC);
    return response.data;
  },

  // Get branch by ID
  getBranchById: async (branchId: string): Promise<ApiResponse<Branch>> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_BRANCH_BY_ID(branchId));
    return response.data;
  }
};
