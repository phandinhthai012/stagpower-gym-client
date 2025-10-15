import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

// Types
export interface Subscription {
  _id: string;
  memberId: string;
  packageId: string;
  branchId: string;
  type: 'Membership' | 'Combo' | 'PT';
  membershipType: 'Basic' | 'VIP';
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'Active' | 'Expired' | 'Suspended' | 'PendingPayment';
  ptSessionsRemaining?: number;
  ptSessionsUsed?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  memberId: string;
  packageId: string;
  branchId: string;
  type: 'Membership' | 'Combo' | 'PT';
  membershipType: 'Basic' | 'VIP';
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'Active' | 'Expired' | 'Suspended' | 'PendingPayment';
  ptSessionsRemaining?: number;
  ptSessionsUsed?: number;
}

export interface UpdateSubscriptionRequest {
  memberId?: string;
  packageId?: string;
  branchId?: string;
  type?: 'Membership' | 'Combo' | 'PT';
  membershipType?: 'Basic' | 'VIP';
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  status?: 'Active' | 'Expired' | 'Suspended' | 'PendingPayment';
  ptSessionsRemaining?: number;
  ptSessionsUsed?: number;
}

// API functions
export const subscriptionApi = {
  // Get all subscriptions
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_ALL_SUBSCRIPTIONS);
    return response.data.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (subscriptionId: string): Promise<Subscription> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_ID(subscriptionId));
    return response.data.data;
  },

  // Get subscriptions by member ID
  getSubscriptionsByMemberId: async (memberId: string): Promise<Subscription[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId));
    return response.data.data;
  },

  // Create new subscription
  createSubscription: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.CREATE_SUBSCRIPTION, data);
    return response.data.data;
  },

  // Update subscription
  updateSubscription: async (subscriptionId: string, data: UpdateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.put(API_ENDPOINTS.SUBSCRIPTION.UPDATE_SUBSCRIPTION(subscriptionId), data);
    return response.data.data;
  },

  // Delete subscription
  deleteSubscription: async (subscriptionId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SUBSCRIPTION.DELETE_SUBSCRIPTION(subscriptionId));
  },

  // Suspend subscription
  suspendSubscription: async (subscriptionId: string, data: { startDate: string; endDate: string; reason: string }): Promise<Subscription> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.SUSPEND_SUBSCRIPTION(subscriptionId), data);
    return response.data.data;
  },

  // Unsuspend subscription
  unsuspendSubscription: async (subscriptionId: string): Promise<Subscription> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.UNSUSPEND_SUBSCRIPTION(subscriptionId));
    return response.data.data;
  },
};
