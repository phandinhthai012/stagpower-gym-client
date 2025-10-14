import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'Active' | 'Inactive';
}

// API functions
export const branchApi = {
  // Get all branches
  getAllBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCHES.GET_ALL);
    return response.data.data;
  },

  // Get branch by ID
  getBranchById: async (branchId: string): Promise<Branch> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(branchId));
    return response.data.data;
  },

  // Create new branch
  createBranch: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await apiClient.post(API_ENDPOINTS.BRANCHES.CREATE, data);
    return response.data.data;
  },

  // Update branch
  updateBranch: async (branchId: string, data: UpdateBranchRequest): Promise<Branch> => {
    const response = await apiClient.put(API_ENDPOINTS.BRANCHES.UPDATE(branchId), data);
    return response.data.data;
  },

  // Delete branch
  deleteBranch: async (branchId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.BRANCHES.DELETE(branchId));
  },

  // Change branch status
  changeBranchStatus: async (branchId: string, status: 'Active' | 'Inactive'): Promise<Branch> => {
    const response = await apiClient.put(API_ENDPOINTS.BRANCHES.CHANGE_STATUS(branchId), { status });
    return response.data.data;
  },
};
