import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar,
  CreditCard,
  Package,
  Activity,
  Trash2,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import { useMyNotifications, useMarkAsRead, useDeleteNotification, useMarkAllAsRead } from '../hooks';

export function MemberNotifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Fetch notifications from API
  const { data: notificationsResponse, isLoading, error } = useMyNotifications();
  const markAsReadMutation = useMarkAsRead();
  const deleteMutation = useDeleteNotification();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Process and map notifications data
  const notifications = useMemo(() => {
    if (!notificationsResponse?.data) return [];
    
    return notificationsResponse.data.map((notification) => {
      // Map API type to component type
      let type: 'success' | 'warning' | 'error' | 'info' = 'info';
      let icon = Info;
      
      if (notification.type === 'ERROR') {
        type = 'error';
        icon = AlertTriangle;
      } else if (notification.type === 'WARNING') {
        type = 'warning';
        icon = AlertTriangle;
      } else if (notification.type === 'INFO') {
        // Try to determine icon based on title/message
        const titleLower = notification.title.toLowerCase();
        const messageLower = notification.message.toLowerCase();
        
        if (titleLower.includes('thành công') || titleLower.includes('success')) {
          type = 'success';
          icon = CheckCircle;
        } else if (titleLower.includes('check-in') || messageLower.includes('check-in')) {
          icon = Activity;
        } else if (titleLower.includes('pt') || titleLower.includes('lịch')) {
          icon = Calendar;
        } else if (titleLower.includes('thanh toán') || titleLower.includes('payment')) {
          icon = CreditCard;
          type = 'success';
        } else if (titleLower.includes('gói') || titleLower.includes('package')) {
          icon = Package;
        }
      }
      
      return {
        id: notification._id,
        type,
        title: notification.title,
        message: notification.message,
        timestamp: new Date(notification.createdAt),
        read: notification.status === 'READ',
        icon,
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notificationsResponse]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  }, [notifications, filter]);

  // Statistics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const read = notifications.filter(n => n.read).length;
    return { total, unread, read };
  }, [notifications]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thông báo này?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Vừa xong';
    } else if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else {
      return `${days} ngày trước`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span>Đang tải thông báo...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="py-12 text-center text-red-600">
            Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-600 mt-1">Quản lý thông báo và cập nhật</p>
        </div>
        <div className="flex space-x-2">
          {stats.unread > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {markAllAsReadMutation.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
            </Button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Tổng thông báo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unread}</p>
                <p className="text-sm text-gray-600">Chưa đọc</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.read}</p>
                <p className="text-sm text-gray-600">Đã đọc</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tất cả ({stats.total})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc ({stats.unread})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
        >
          Đã đọc ({stats.read})
        </Button>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        
                        <div className="mt-3 flex items-center space-x-2">
                          <Badge variant="outline" className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              Đánh dấu đã đọc
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 
                 filter === 'read' ? 'Không có thông báo đã đọc' : 
                 'Không có thông báo'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Bạn sẽ nhận được thông báo mới tại đây' : 
                 'Tất cả thông báo đã được xử lý'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
