import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status: 'Active' | 'Maintenance' | 'Closed';
  openTime: string;        // ✅ Thêm
  closeTime: string; 
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId?: string;
  status?: 'Active' | 'Maintenance' | 'Closed';
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'Active' | 'Maintenance' | 'Closed';
}

// API functions
export const branchApi = {
  // Get all branches
  getAllBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES);
    return response.data.data;
  },

  // Get branch by ID
  getBranchById: async (branchId: string): Promise<Branch> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCH.GET_BRANCH_BY_ID(branchId));
    return response.data.data;
  },

  // Create new branch
  createBranch: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await apiClient.post(API_ENDPOINTS.BRANCH.CREATE_BRANCH, data);
    return response.data.data;
  },

  // Update branch
  updateBranch: async (branchId: string, data: UpdateBranchRequest): Promise<Branch> => {
    const response = await apiClient.put(API_ENDPOINTS.BRANCH.UPDATE_BRANCH(branchId), data);
    return response.data.data;
  },

  // Delete branch
  deleteBranch: async (branchId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.BRANCH.DELETE_BRANCH(branchId));
  },

  // Change branch status
  changeBranchStatus: async (branchId: string, status: 'Active' | 'Maintenance' | 'Closed'): Promise<Branch> => {
    const response = await apiClient.put(API_ENDPOINTS.BRANCH.CHANGE_BRANCH_STATUS(branchId), { status });
    return response.data.data;
  },
};
