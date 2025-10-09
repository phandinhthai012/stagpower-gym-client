import apiClient from "../configs/AxiosConfig";
import { API_ENDPOINTS } from "../configs/Api";
import { ApiResponse,ApiError,ApiResult } from "../types/api.types";


interface CheckIn {
    memberId: string;
    branchId: string;
    checkInTime: string;
    checkOutTime: string;
    checkInMethod: string;
    validationError: string;
    duration: number;
    status: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

const checkInService = {
    createCheckIn: async (checkIn: CheckIn): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.CHECK_IN.CREATE_CHECK_IN, checkIn);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Tạo check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getAllCheckIns: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GET_ALL_CHECK_INS);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getCheckInById: async (checkInId: string): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GET_CHECK_IN_BY_ID(checkInId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
    updateCheckInById: async (checkInId: string, checkIn: CheckIn): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.CHECK_IN.UPDATE_CHECK_IN_BY_ID(checkInId), checkIn);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Cập nhật check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getCheckInByMemberId: async (memberId: string): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GET_CHECK_IN_BY_MEMBER_ID(memberId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
    checkOutCheckIn: async (checkInId: string): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.CHECK_IN.CHECK_OUT_CHECK_IN(checkInId));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Check-out check-in thất bại',
                error: error?.response?.data || error
            };
        }
    },
}

export default checkInService;