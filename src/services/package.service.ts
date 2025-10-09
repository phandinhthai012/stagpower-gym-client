import apiClient from "../configs/AxiosConfig";
import { API_ENDPOINTS } from "../configs/Api";


interface Package {
   _id: string;
   name: string;
   type: string;
   packageCategory: string;
   durationMonths: number;
   membershipType: string;
   price: number;
   ptSessions: number;
   ptSessionDuration: number;
   branchAccess: string;
   isTrial: boolean;
   maxTrialDays: number;
   description: string;
   status: string;
   createdAt: string;
   updatedAt: string;
}

const packageService = {
    getAllPackages: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_ALL_PACKAGES);
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
            const response = await apiClient.get(API_ENDPOINTS.PACKAGE.GET_PACKAGE_BY_ID(packageId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    createPackage: async (packageData: Package): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.PACKAGE.CREATE_PACKAGE, packageData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Tạo gói tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    updatePackageById: async (packageId: string, packageData: Package): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.PACKAGE.UPDATE_PACKAGE(packageId), packageData);
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
            const response = await apiClient.delete(API_ENDPOINTS.PACKAGE.DELETE_PACKAGE(packageId));
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