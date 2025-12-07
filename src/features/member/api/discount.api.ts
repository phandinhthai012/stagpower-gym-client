// Tạo file mới này
import { API_ENDPOINTS } from '../../../configs/Api';
import apiClient from '../../../configs/AxiosConfig';

export interface ValidateDiscountCodeRequest {
  code: string;
  memberId: string;
  packageId: string;
  originalAmount: number;
  packageType?: string; // Optional - backend có thể tự lấy từ packageId
  packageCategory?: string;
}

export interface ValidateDiscountCodeResponse {
  discount: any;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  bonusDays: number;
  discountDetails: {
    discountId: string;
    type: string;
    discountPercentage?: number;
    discountAmount: number;
    description: string;
  };
}

export const memberDiscountApi = {
  validateDiscountCode: async (data: ValidateDiscountCodeRequest): Promise<ValidateDiscountCodeResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.DISCOUNT.VALIDATE_CODE, data);
    return response.data.data;
  },
};