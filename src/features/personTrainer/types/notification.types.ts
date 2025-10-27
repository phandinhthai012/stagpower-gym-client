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

export interface PaginatedNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Notification[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'WARNING' | 'ERROR';
  status?: 'UNREAD' | 'READ';
}

