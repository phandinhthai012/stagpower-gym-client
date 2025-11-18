import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { AxiosError } from 'axios';
import { User } from '../../../contexts/AuthContext';

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    gender?: string;
    dateOfBirth?: string;
};

export type LoginResponse = {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
    message?: string;
};

export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};

const authService = {
    login: async (payload: LoginRequest): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
            return response.data;
        } catch (error: any) {
            // Return error data instead of throwing
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Đăng nhập thất bại',
                error: error?.response?.data || error
            };
        }
    },

    logout: async (refreshToken: string): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken: refreshToken });
            return response.data;
        } catch (error: any) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Đăng xuất thất bại',
                error: error?.response?.data || error
            };
        }
    },

    register: async (payload: RegisterRequest): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Đăng ký thất bại',
                error: error?.response?.data || error
            };
        }
    },

    logoutAllDevices: async (): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL_DEVICES);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Đăng xuất tất cả thiết bị thất bại',
                error: error?.response?.data || error
            };
        }
    },

    getCurrentUser: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ME);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy thông tin người dùng thất bại',
                error: error?.response?.data || error
            };
        }
    },

    forgotPassword: async (email: string): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Gửi OTP thất bại',
                error: error?.response?.data || error
            };
        }
    },

    verifyOtp: async (email: string, otp: string): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Xác thực OTP thất bại',
                error: error?.response?.data || error
            };
        }
    },

    resendOtp: async (email: string): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Gửi lại OTP thất bại',
                error: error?.response?.data || error
            };
        }
    },

    resetPassword: async (email: string, otp: string, newPassword: string): Promise<any> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, otp, newPassword });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Đặt lại mật khẩu thất bại',
                error: error?.response?.data || error
            };
        }
    },
}

export default authService;
