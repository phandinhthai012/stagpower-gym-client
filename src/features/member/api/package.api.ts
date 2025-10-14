import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { Package, CreatePackageRequest, UpdatePackageRequest } from '../../../types/package.types';

// API functions
export const packageApi = {
  // Get all packages
  getAllPackages: async (): Promise<Package[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGES.GET_ALL);
    return response.data.data;
  },

  // Get package by ID
  getPackageById: async (packageId: string): Promise<Package> => {
    const response = await apiClient.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(packageId));
    return response.data.data;
  },

  // Create new package
  createPackage: async (data: CreatePackageRequest): Promise<Package> => {
    const response = await apiClient.post(API_ENDPOINTS.PACKAGES.CREATE, data);
    return response.data.data;
  },

  // Update package
  updatePackage: async (packageId: string, data: UpdatePackageRequest): Promise<Package> => {
    const response = await apiClient.put(API_ENDPOINTS.PACKAGES.UPDATE(packageId), data);
    return response.data.data;
  },

  // Delete package
  deletePackage: async (packageId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PACKAGES.DELETE(packageId));
  },
};
