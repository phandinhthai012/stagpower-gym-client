import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface CheckIn {
    _id: string;
    memberId: string;
    branchId: string;
    checkInTime: string;
    checkOutTime?: string;
    checkInMethod: 'QR_Code' | 'Manual' | 'Webcam' | 'Card' | 'Biometric';
    duration?: number;
    status: 'Active' | 'Completed' | 'Cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GenerateQRCodeResponse {
    success: boolean;
    message: string;
    data: string; // Base64 QR Code Data URL
}

export interface CheckInHistoryResponse {
    success: boolean;
    message: string;
    data: CheckIn[];
}

export interface CreateCheckInResponse {
    success: boolean;
    message: string;
    data: CheckIn;
}

export const checkinApi = {
    createCheckIn: async (data: any): Promise<CreateCheckInResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.CHECK_IN.CREATE_CHECK_IN, data);
        return response.data;
    },
    createCheckInByQRcode: async (data:any) :Promise<CreateCheckInResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.CHECK_IN.PROCESS_QR_CODE_CHECK_IN, data);
        return response.data;
    },
    generateQRCode: async (memberId: string): Promise<GenerateQRCodeResponse> => {
        const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GENERATE_QR_CODE_CHECK_IN(memberId));
        return response.data;
    },
    getCheckInHistory: async (memberId: string): Promise<CheckInHistoryResponse> => {
        const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GET_CHECK_IN_BY_MEMBER_ID(memberId));
        return response.data;
    },
    getActiveCheckIn: async (memberId: string): Promise<CheckIn | null> => {
        const response = await apiClient.get(API_ENDPOINTS.CHECK_IN.GET_CHECK_IN_BY_MEMBER_ID(memberId));
        return response.data.data.find((ci: CheckIn) => ci.status === 'Active') || null;
    },
    checkOut: async (checkInId: string): Promise<CheckIn> => {
        const response = await apiClient.put(API_ENDPOINTS.CHECK_IN.CHECK_OUT_CHECK_IN(checkInId));
        return response.data.data;
    },
}