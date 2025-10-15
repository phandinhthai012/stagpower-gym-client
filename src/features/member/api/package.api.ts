import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { Package } from '../types';
import { CreatePackageRequest, UpdatePackageRequest } from '../../../types/package.types';

// API functions
export const packageApi = {
  // Get all packages
  getAllPackages: async (): Promise<Package[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_ALL_PACKAGES);
    return response.data.data;
  },

  // Get package by ID
  getPackageById: async (packageId: string): Promise<Package> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_PACKAGE_BY_ID(packageId));
    return response.data.data;
  },

  // Get packages with pagination
  getPackagesWithPagination: async (page: number = 1, limit: number = 10): Promise<any> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_ALL_PACKAGES_WITH_PAGINATION, {
      params: { page, limit }
    });
    return response.data;
  },

  // Create new package
  createPackage: async (data: CreatePackageRequest): Promise<Package> => {
    const response = await apiClient.post(API_ENDPOINTS.PACKAGE.CREATE_PACKAGE, data);
    return response.data.data;
  },

  // Update package
  updatePackage: async (packageId: string, data: UpdatePackageRequest): Promise<Package> => {
    const response = await apiClient.put(API_ENDPOINTS.PACKAGE.UPDATE_PACKAGE(packageId), data);
    return response.data.data;
  },

  // Delete package
  deletePackage: async (packageId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PACKAGE.DELETE_PACKAGE(packageId));
  },
};
