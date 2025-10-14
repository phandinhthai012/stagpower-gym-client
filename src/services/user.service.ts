import apiClient from "../configs/AxiosConfig";
import { API_ENDPOINTS } from "../configs/Api";


const userService = {
    getAllUsersWithPagination: async (params: { page: number; limit: number }): Promise<any> => {
        try {
            const { page, limit } = params;
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_USERS_WITH_PAGINATION, { params });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách người dùng thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getAllMembers: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_MEMBERS);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getAllStaffs: async (): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_STAFFS);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách nhân viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getUserById: async (userId: string): Promise<any> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_USER_BY_ID(userId));
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy thông tin người dùng thất bại',
                error: error?.response?.data || error
            };
        }
    },
    // update my profile
    updateMyProfile: async (payload: any): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_USER(payload.userId), payload);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Cập nhật thông tin thất bại',
                error: error?.response?.data || error
            };
        }
    },
    // change user status
    changeUserStatus: async (userId: string, status: string): Promise<any> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USER.CHANGE_USER_STATUS(userId), { status });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Thay đổi trạng thái người dùng thất bại',
                error: error?.response?.data || error
            };
        }
    },
    // create user
    createUser: async (payload: any): Promise<any> => {
        try {
            const { fullName, email, phone, gender, dateOfBirth, photo, status, memberInfo } = payload;
            if (!fullName || !email || !phone || !gender || !dateOfBirth || !photo || !status || !memberInfo) {
                return {
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin',
                    error: null
                };
            }
            const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_USER, { fullName, email, phone, gender, dateOfBirth, photo, status, memberInfo });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Tạo thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    // createTrainer: async (payload: any): Promise<any> => {
    //     try {
    //         const { fullName, email, phone, gender, dateOfBirth, photo, status, trainerInfo } = payload;
    //         if (!fullName || !email || !phone || !gender || !dateOfBirth || !photo || !status || !trainerInfo) {
    //             return {
    //                 success: false,
    //                 message: 'Vui lòng điền đầy đủ thông tin',
    //                 error: null
    //             };
    //         }
    //         const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_TRAINER, { fullName, email, phone, gender, dateOfBirth, photo, status, trainerInfo });
    //         return response.data;
    //     } catch (error: any) {
    //         return {
    //             success: false,
    //             message: error?.response?.data?.message || error?.message || 'Tạo PT thất bại',
    //             error: error?.response?.data || error
    //         };
    //     }
    // },
    // createStaff: async (payload: any): Promise<any> => {
    //     try {
    //         const { fullName, email, phone, gender, dateOfBirth, photo, status, staffInfo } = payload;
    //         if (!fullName || !email || !phone || !gender || !dateOfBirth || !photo || !status || !staffInfo) {
    //             return {
    //                 success: false,
    //                 message: 'Vui lòng điền đầy đủ thông tin',
    //                 error: null
    //             };
    //         }
    //         const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_STAFF, { fullName, email, phone, gender, dateOfBirth, photo, status, staffInfo });
    //         return response.data;
    //     } catch (error: any) {
    //         return {
    //             success: false,
    //             message: error?.response?.data?.message || error?.message || 'Tạo nhân viên thất bại',
    //             error: error?.response?.data || error
    //         };
    //     }
    // },
    // createAdmin: async (payload: any): Promise<any> => {
    //     try {
    //         const { fullName, email, phone, gender, dateOfBirth, photo, status, adminInfo } = payload;
    //         if (!fullName || !email || !phone || !gender || !dateOfBirth || !photo || !status || !adminInfo) {
    //             return {
    //                 success: false,
    //                 message: 'Vui lòng điền đầy đủ thông tin',
    //                 error: null
    //             };
    //         }
    //         const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_ADMIN, { fullName, email, phone, gender, dateOfBirth, photo, status, adminInfo });
    //         return response.data;
    //     } catch (error: any) {
    //         return {
    //             success: false,
    //             message: error?.response?.data?.message || error?.message || 'Tạo admin thất bại',
    //             error: error?.response?.data || error
    //         };
    //     }
    // },
}

export default userService;