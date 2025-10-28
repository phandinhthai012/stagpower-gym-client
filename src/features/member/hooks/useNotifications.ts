import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const notificationQueryKeys = {
  all: ['member-notifications'] as const,
  list: (userId: string) => [...notificationQueryKeys.all, 'list', userId] as const,
};

// Get all user notifications
export const useMyNotifications = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || '';

  return useQuery({
    queryKey: notificationQueryKeys.list(userId),
    queryFn: () => notificationApi.getMyNotifications(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds - refresh more often for notifications
    refetchInterval: 60000, // Refetch every 60 seconds
  });
};

// Mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id || user?.id || '';

  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(userId) });
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id || user?.id || '';

  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(userId) });
      toast.success('Đã xóa thông báo');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa thông báo');
    },
  });
};

// Mark all as read (batch operation)
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id || user?.id || '';
  const { data } = useMyNotifications();

  return useMutation({
    mutationFn: async () => {
      const unreadNotifications = data?.data?.filter(n => n.status === 'UNREAD') || [];
      const promises = unreadNotifications.map(n => notificationApi.markAsRead(n._id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(userId) });
      toast.success('Đã đánh dấu tất cả là đã đọc');
    },
    onError: (error: any) => {
      toast.error('Có lỗi xảy ra khi đánh dấu đã đọc');
    },
  });
};

