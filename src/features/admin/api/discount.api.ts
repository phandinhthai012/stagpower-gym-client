import { API_ENDPOINTS } from '../../../configs/Api';
import apiClient from '../../../configs/AxiosConfig';
import { Discount, CreateDiscountData, UpdateDiscountData, DiscountSearchParams } from '../types/discount.types';

export const discountApi = {
  // Get all discounts
  getAllDiscounts: async (): Promise<Discount[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT.GET_ALL_DISCOUNTS);
    return response.data.data;
  },

  // Get discount by ID
  getDiscountById: async (discountId: string): Promise<Discount> => {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT.GET_DISCOUNT_BY_ID(discountId));
    return response.data.data;
  },

  // Create new discount
  createDiscount: async (discountData: CreateDiscountData): Promise<Discount> => {
    const response = await apiClient.post(API_ENDPOINTS.DISCOUNT.CREATE_DISCOUNT, discountData);
    return response.data.data;
  },

  // Update discount
  updateDiscount: async (discountId: string, discountData: UpdateDiscountData): Promise<Discount> => {
    const response = await apiClient.put(API_ENDPOINTS.DISCOUNT.UPDATE_DISCOUNT(discountId), discountData);
    return response.data.data;
  },

  // Change discount status
  changeDiscountStatus: async (discountId: string, status: string): Promise<Discount> => {
    const response = await apiClient.put(API_ENDPOINTS.DISCOUNT.CHANGE_DISCOUNT_STATUS(discountId), { status });
    return response.data.data;
  },

  // Delete discount
  deleteDiscount: async (discountId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DISCOUNT.DELETE_DISCOUNT(discountId));
  },

  // Search discounts (using GET_ALL_DISCOUNTS with query params)
  searchDiscounts: async (searchParams: DiscountSearchParams): Promise<Discount[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DISCOUNT.GET_ALL_DISCOUNTS, {
      params: searchParams
    });
    return response.data.data;
  }
};
