import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { 
  Bell, 
  AlertTriangle, 
  List,
  Mail,
  CheckCheck,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks';
import { Notification } from '../types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function TrainerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch real data
  const { data, isLoading, error } = useMyNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INFO': return <Info className="w-5 h-5" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'ERROR': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'INFO': return 'Thông tin';
      case 'WARNING': return 'Cảnh báo';
      case 'ERROR': return 'Lỗi';
      default: return type;
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'unread' && notification.status === 'UNREAD');
      
      const matchesType = !typeFilter || notification.type === typeFilter;
      
      return matchesTab && matchesType;
    });
  }, [notifications, activeTab, typeFilter]);

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all': return notifications.length;
      case 'unread': return notifications.filter(n => n.status === 'UNREAD').length;
      default: return 0;
    }
  };

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: vi 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải thông báo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-red-600">
          Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Thông Báo</h1>

      {/* Tabs Container */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'Tất cả', icon: List },
              { key: 'unread', label: 'Chưa đọc', icon: Mail },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'default' : 'outline'}
                onClick={() => setActiveTab(key as any)}
                className="flex items-center gap-2 text-sm sm:text-sm h-10 sm:h-10"
              >
                <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
                {label}
                <Badge variant="secondary" className="ml-1 text-xs sm:text-xs">
                  {getTabCount(key)}
                </Badge>
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-sm"
            >
              <option value="">Tất cả loại</option>
              <option value="INFO">Thông tin</option>
              <option value="WARNING">Cảnh báo</option>
              <option value="ERROR">Lỗi</option>
            </select>
            <Button 
              onClick={markAllAsRead} 
              className="bg-green-600 hover:bg-green-700 text-sm sm:text-sm w-full sm:w-auto h-10 sm:h-10"
              disabled={markAllAsReadMutation.isPending || notifications.filter(n => n.status === 'UNREAD').length === 0}
            >
              <CheckCheck className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2 sm:space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <div key={notification._id}>
                  <div 
                    className={`p-3 sm:p-6 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      notification.status === 'UNREAD'
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => notification.status === 'UNREAD' && markAsRead(notification._id)}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-1.5 sm:mb-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{notification.title}</h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs sm:text-xs">
                              {getTypeText(notification.type)}
                            </Badge>
                            {notification.status === 'UNREAD' && (
                              <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-sm leading-relaxed">{notification.message}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <Clock className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-1.5 flex-shrink-0" />
                            <span>{formatTime(notification.createdAt)}</span>
                          </div>
                          {notification.status === 'UNREAD' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="text-xs sm:text-sm w-full sm:w-auto h-9 sm:h-9"
                              disabled={markAsReadMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-1" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator className="my-2 sm:my-4" />}
                </div>
              ))
            ) : (
              <div className="text-center py-10 sm:py-12">
                <Bell className="w-16 h-16 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  {activeTab === 'all' 
                    ? 'Chưa có thông báo nào'
                    : 'Không có thông báo chưa đọc nào'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
