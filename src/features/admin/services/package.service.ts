import apiClient from "../../../configs/AxiosConfig";
import { API_ENDPOINTS } from "../../../configs/Api";
import { Package } from "../../../types/package.types";

const packageService = {
    getAllPackages: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PACKAGES.GET_ALL);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getPackageById: async (packageId: string): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(packageId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy thông tin gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    createPackage: async (packageData: Package): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.PACKAGES.CREATE, packageData);
            return response.data;
        } catch (error) {
            console.error('Error creating package:', error);
            console.error('Error response:', error?.response?.data);
            console.error('Error status:', error?.response?.status);
            console.error('Error details:', JSON.stringify(error?.response?.data?.details, null, 2));
            throw error; // Throw error để React Query có thể handle
        }
    },
    updatePackageById: async (packageId: string, packageData: Package): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.PACKAGES.UPDATE(packageId), packageData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Cập nhật gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    deletePackageById: async (packageId: string): Promise<any> => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.PACKAGES.DELETE(packageId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Xóa gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
}

export default packageService;
