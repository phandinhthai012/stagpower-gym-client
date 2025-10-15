import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, PaginatedResponse, Package } from '../types';

export const packageApi = {
  // Get all packages
  getAllPackages: async (): Promise<ApiResponse<Package[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_ALL_PACKAGES);
    return response.data;
  },

  // Get package by ID
  getPackageById: async (packageId: string): Promise<ApiResponse<Package>> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_PACKAGE_BY_ID(packageId));
    return response.data;
  },

  // Get packages with pagination
  getPackagesWithPagination: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Package>> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_ALL_PACKAGES_WITH_PAGINATION, {
      params: { page, limit }
    });
    return response.data;
  }
};
