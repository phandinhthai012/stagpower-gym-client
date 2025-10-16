import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, Payment } from '../types';

// Payment API functions
export const paymentApi = {
  // Create new payment
  createPayment: async (data: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_PAYMENT, data);
    return response.data;
  },

  // Get all payments
  getAllPayments: async (): Promise<ApiResponse<Payment[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_ALL_PAYMENTS);
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_PAYMENT_BY_ID(paymentId));
    return response.data;
  },

  // Get payments by member ID
  getPaymentsByMemberId: async (memberId: string): Promise<ApiResponse<Payment[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_PAYMENT_BY_MEMBERID(memberId));
    return response.data;
  },

  // Update payment
  updatePayment: async (paymentId: string, data: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.put(API_ENDPOINTS.PAYMENT.UPDATE_PAYMENT(paymentId), data);
    return response.data;
  },

  // Delete payment
  deletePayment: async (paymentId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PAYMENT.DELETE_PAYMENT(paymentId));
  },

  // Complete payment (for cash/bank transfer confirmation)
  completePayment: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT.COMPLETE_PAYMENT(paymentId));
    return response.data;
  },

  // Create Momo payment
  createMomoPayment: async (data: Partial<Payment>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_PAYMENT_MOMO, data);
    return response.data;
  },
};
