import axios from "axios";

import API_CONFIG, { API_ENDPOINTS } from "../configs/Api";

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

// request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // save access token and refresh token in local storage
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers.RefreshToken = `Bearer ${refreshToken}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// response interceptor
apiClient.interceptors.response.use(
    // sau sửa tự động nếu có token trả về thì lưu lại
    (response) => {
        const { accessToken, refreshToken } = response.data || {};
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        return response;
    },
    // nếu lỗi 401 thì refresh token
    async (error) => {
        const originalRequest = error.config;
        console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
        });
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const oldRefreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, { 
                    refreshToken: oldRefreshToken 
                });
                const { accessToken, refreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Refreshtoken = `Bearer ${refreshToken}`;
                return apiClient(originalRequest);
            } catch (error) {
                console.error('Refresh token error:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // có thể redirect về trang login
                window.location.href = '/login';
                return Promise.reject(error);
            }

        }
        // xử lý lỗi 403
        if (error.response?.status === 403) {
            console.warn('Access denied - insufficient permissions');
            // You can show a toast notification here
        }

        // xử lý lỗi 500
        if (error.response?.status >= 500) {
            console.error('Server error occurred');
            // You can show a global error notification here
        }
        return Promise.reject(error);
    }
);

export default apiClient;
