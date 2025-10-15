import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { ApiResponse, Subscription } from '../types';

export const subscriptionApi = {
  // Get all subscriptions
  getAllSubscriptions: async (): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_ALL_SUBSCRIPTIONS);
    return response.data;
  },

  // Get subscriptions by member ID
  getSubscriptionsByMemberId: async (memberId: string): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId));
    return response.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_ID(subscriptionId));
    return response.data;
  },

  // Create subscription
  createSubscription: async (subscriptionData: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.CREATE_SUBSCRIPTION, subscriptionData);
    return response.data;
  },

  // Update subscription
  updateSubscription: async (subscriptionId: string, subscriptionData: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.put(API_ENDPOINTS.SUBSCRIPTION.UPDATE_SUBSCRIPTION(subscriptionId), subscriptionData);
    return response.data;
  },

  // Suspend subscription
  suspendSubscription: async (subscriptionId: string, reason: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.SUSPEND_SUBSCRIPTION(subscriptionId), { reason });
    return response.data;
  },

  // Unsuspend subscription
  unsuspendSubscription: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.UNSUSPEND_SUBSCRIPTION(subscriptionId));
    return response.data;
  }
};
