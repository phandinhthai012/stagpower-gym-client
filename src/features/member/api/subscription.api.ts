import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, Subscription } from '../types';

// API functions
export const subscriptionApi = {
  // Get all subscriptions
  getAllSubscriptions: async (): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_ALL_SUBSCRIPTIONS);
    return response.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_ID(subscriptionId));
    return response.data;
  },

  // Get subscriptions by member ID
  getSubscriptionsByMemberId: async (memberId: string): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId));
    return response.data;
  },

  // Create new subscription
  createSubscription: async (data: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.CREATE_SUBSCRIPTION, data);
    return response.data;
  },

  // Update subscription
  updateSubscription: async (subscriptionId: string, data: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.put(API_ENDPOINTS.SUBSCRIPTION.UPDATE_SUBSCRIPTION(subscriptionId), data);
    return response.data;
  },

  // Delete subscription
  deleteSubscription: async (subscriptionId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SUBSCRIPTION.DELETE_SUBSCRIPTION(subscriptionId));
  },

  // Suspend subscription
  suspendSubscription: async (subscriptionId: string, data: { startDate: string; endDate: string; reason: string }): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.SUSPEND_SUBSCRIPTION(subscriptionId), data);
    return response.data;
  },

  // Unsuspend subscription
  unsuspendSubscription: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.UNSUSPEND_SUBSCRIPTION(subscriptionId));
    return response.data;
  },
};
