import { API_ENDPOINTS } from '../../../configs/Api';
import apiClient from '../../../configs/AxiosConfig';
import { DiscountType, CreateDiscountTypeData, UpdateDiscountTypeData } from '../types/discountType.types';

export const discountTypeApi = {
  // Get all discount types
  getAllDiscountTypes: async (): Promise<DiscountType[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT_TYPE.GET_ALL_DISCOUNT_TYPES);
    return response.data.data;
  },

  // Get discount type by ID
  getDiscountTypeById: async (discountTypeId: string): Promise<DiscountType> => {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT_TYPE.GET_DISCOUNT_TYPE_BY_ID(discountTypeId));
    return response.data.data;
  },

  // Create new discount type
  createDiscountType: async (discountTypeData: CreateDiscountTypeData): Promise<DiscountType> => {
    const response = await apiClient.post(API_ENDPOINTS.DISCOUNT_TYPE.CREATE_DISCOUNT_TYPE, discountTypeData);
    return response.data.data;
  },

  // Update discount type
  updateDiscountType: async (discountTypeId: string, discountTypeData: UpdateDiscountTypeData): Promise<DiscountType> => {
    const response = await apiClient.put(
      API_ENDPOINTS.DISCOUNT_TYPE.UPDATE_DISCOUNT_TYPE(discountTypeId),
      discountTypeData
    );
    return response.data.data;
  },

  // Delete discount type
  deleteDiscountType: async (discountTypeId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DISCOUNT_TYPE.DELETE_DISCOUNT_TYPE(discountTypeId));
  },
};