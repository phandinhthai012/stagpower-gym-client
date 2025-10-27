import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { Notification, NotificationsResponse, PaginatedNotificationsResponse } from '../types/notification.types';

export const notificationApi = {
  // Get user notifications
  getMyNotifications: async (userId: string): Promise<NotificationsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_USER_NOTIFICATIONS(userId));
    return response.data;
  },

  // Get user notifications with pagination
  getMyNotificationsPaginated: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedNotificationsResponse> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.NOTIFICATION.GET_USER_NOTIFICATIONS_PAGINATED(userId)}?page=${page}&limit=${limit}&sort=createdAt&order=desc`
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<{ data: Notification }> => {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(notificationId));
    return response.data;
  },

  // Mark notification as unread
  markAsUnread: async (notificationId: string): Promise<{ data: Notification }> => {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATION.MARK_AS_UNREAD(notificationId));
    return response.data;
  },

  // Delete notification (Admin/Staff only)
  deleteNotification: async (notificationId: string): Promise<{ data: Notification }> => {
    const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATION.DELETE(notificationId));
    return response.data;
  },
};

