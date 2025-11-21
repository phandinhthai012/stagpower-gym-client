import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface CheckInRequest {
    memberId: string;
    branchId: string;
    checkInMethod?: 'Manual' | 'QR_Code';
    notes?: string;
}

export interface CheckInRequestQRCode {
    token: string;
    branchId: string;
}

export const adminCheckInApi = {
    // Admin check-in member
    createCheckIn: async (data: CheckInRequest) => {
        const response = await apiClient.post(`${API_ENDPOINTS.CHECK_IN.CREATE_CHECK_IN}`,
            data
        );
        return response.data;
    },

    createCheckInByQRCode: async (data: CheckInRequestQRCode) => {
        const response = await apiClient.post(`${API_ENDPOINTS.CHECK_IN.PROCESS_QR_CODE_CHECK_IN}`,
            data
        );
        return response.data;
    },

    getAllCheckIns: async () => {
        const response = await apiClient.get(`${API_ENDPOINTS.CHECK_IN.GET_ALL_CHECK_INS}`);
        return response.data;
    },

    checkOutCheckIn: async (checkInId: string) => {
        const response = await apiClient.put(`${API_ENDPOINTS.CHECK_IN.CHECK_OUT_CHECK_IN(checkInId)}`);
        return response.data;
    },
}