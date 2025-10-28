import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  status: 'UNREAD' | 'READ';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Notification[];
}

export const notificationApi = {
  // Get user notifications
  getMyNotifications: async (userId: string): Promise<NotificationsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_USER_NOTIFICATIONS(userId));
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<{ data: Notification }> => {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(notificationId));
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ data: Notification }> => {
    const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATION.DELETE(notificationId));
    return response.data;
  },
};

