import apiClient from "../../../configs/AxiosConfig";
import { API_ENDPOINTS } from "../../../configs/Api";
import { ApiResponse,ApiError,ApiResult } from "../../../types/api.types";

export interface Member {
    _id: string;
    uid: string;
    role: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    cccd: string;
    dateOfBirth: string;
    photo: string;
    joinDate: string;
    status: string;
    member_info: {
        membership_level: string;
        qr_code: string;
        health_info_id: string;
        notes: string;
        is_hssv: boolean;
        total_spending: number;
        membership_month: number;
        current_brand_id: string;
    };
    createdAt: string;
    updatedAt: string;
}

const memberService ={
    getAllMembers: async (): Promise<ApiResult<Member[]>> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_ALL_MEMBERS);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getMemberById: async (id: string): Promise<ApiResult<Member>> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USER.GET_USER_BY_ID(id));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy thông tin thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    createMember: async (member: Member): Promise<ApiResult<Member>> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_USER, member);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Tạo thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    updateMember: async (id: string, member: Member): Promise<ApiResult<Member>> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_USER(id), member);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Cập nhật thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    },
    changeMemberStatus: async (id: string, status: string): Promise<ApiResult<Member>> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USER.CHANGE_USER_STATUS(id), { status });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Thay đổi trạng thái thành viên thất bại',
                error: error?.response?.data || error
            };
        }
    }
  
}

export default memberService;
