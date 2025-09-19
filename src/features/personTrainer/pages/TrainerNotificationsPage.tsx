import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { 
  Bell, 
  MailOpen, 
  AlertTriangle, 
  CalendarCheck,
  List,
  Mail,
  Cog,
  Gift,
  Search,
  CheckCheck,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'schedule' | 'member' | 'system' | 'promotion';
  isRead: boolean;
  isImportant: boolean;
  timestamp: string;
  details?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Buổi dạy mới được đặt lịch",
    message: "Hội viên Nguyễn Thị A đã đặt lịch buổi PT cá nhân vào 08:00 ngày mai (16/01/2025).",
    type: "schedule",
    isRead: false,
    isImportant: false,
    timestamp: "2025-01-15T10:30:00",
    details: "Buổi tập sẽ diễn ra tại phòng tập chính với thời lượng 90 phút. Hội viên muốn tập cardio và strength training."
  },
  {
    id: 2,
    title: "Hội viên mới được phân công",
    message: "Bạn đã được phân công hướng dẫn hội viên mới: Trần Văn B. Hãy liên hệ để sắp xếp buổi tư vấn đầu tiên.",
    type: "member",
    isRead: false,
    isImportant: true,
    timestamp: "2025-01-15T09:15:00",
    details: "Hội viên mới có mục tiêu giảm cân và tăng cường sức khỏe. Cần lập kế hoạch tập luyện phù hợp."
  },
  {
    id: 3,
    title: "Hệ thống bảo trì",
    message: "Hệ thống sẽ được bảo trì từ 02:00-04:00 ngày 16/01/2025. Một số tính năng có thể bị gián đoạn.",
    type: "system",
    isRead: true,
    isImportant: true,
    timestamp: "2025-01-15T08:00:00",
    details: "Thời gian bảo trì: 02:00-04:00. Các tính năng bị ảnh hưởng: đặt lịch, thanh toán, báo cáo."
  },
  {
    id: 4,
    title: "Khuyến mãi đặc biệt",
    message: "Giảm 20% cho gói PT 3 tháng. Áp dụng từ 15/01-31/01/2025.",
    type: "promotion",
    isRead: true,
    isImportant: false,
    timestamp: "2025-01-15T07:30:00",
    details: "Khuyến mãi áp dụng cho tất cả gói PT 3 tháng. Khách hàng sẽ được giảm 20% phí dịch vụ."
  },
  {
    id: 5,
    title: "Buổi dạy bị hủy",
    message: "Buổi PT với Lê Thị C vào 14:00 hôm nay đã bị hủy. Lý do: khách hàng bận việc đột xuất.",
    type: "schedule",
    isRead: false,
    isImportant: false,
    timestamp: "2025-01-15T06:45:00",
    details: "Khách hàng sẽ liên hệ lại để sắp xếp lịch mới. Có thể tận dụng thời gian này cho các hoạt động khác."
  },
  {
    id: 6,
    title: "Đánh giá mới từ hội viên",
    message: "Bạn nhận được đánh giá 5 sao từ hội viên Phạm Văn D: 'Huấn luyện viên rất chuyên nghiệp và nhiệt tình'.",
    type: "member",
    isRead: true,
    isImportant: false,
    timestamp: "2025-01-14T20:15:00",
    details: "Đánh giá chi tiết: 'Huấn luyện viên rất chuyên nghiệp, nhiệt tình và có phương pháp tập luyện hiệu quả. Tôi rất hài lòng với kết quả đạt được.'"
  }
];

export function TrainerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important' | 'system' | 'promotion'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <Calendar className="w-5 h-5" />;
      case 'member': return <User className="w-5 h-5" />;
      case 'system': return <Cog className="w-5 h-5" />;
      case 'promotion': return <Gift className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'schedule': return 'bg-blue-500';
      case 'member': return 'bg-green-500';
      case 'system': return 'bg-orange-500';
      case 'promotion': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'schedule': return 'Lịch dạy';
      case 'member': return 'Hội viên';
      case 'system': return 'Hệ thống';
      case 'promotion': return 'Khuyến mãi';
      default: return type;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'unread' && !notification.isRead) ||
      (activeTab === 'important' && notification.isImportant) ||
      (activeTab === 'system' && notification.type === 'system') ||
      (activeTab === 'promotion' && notification.type === 'promotion');
    
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || notification.type === typeFilter;
    
    return matchesTab && matchesSearch && matchesType;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all': return notifications.length;
      case 'unread': return notifications.filter(n => !n.isRead).length;
      case 'important': return notifications.filter(n => n.isImportant).length;
      case 'system': return notifications.filter(n => n.type === 'system').length;
      case 'promotion': return notifications.filter(n => n.type === 'promotion').length;
      default: return 0;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông Báo</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng thông báo</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
            <p className="text-xs text-gray-500 mt-1">thông báo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Chưa đọc</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <MailOpen className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {notifications.filter(n => !n.isRead).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">thông báo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Quan trọng</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {notifications.filter(n => n.isImportant).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">thông báo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lịch dạy</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {notifications.filter(n => n.type === 'schedule').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">thông báo</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Container */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'Tất cả', icon: List },
              { key: 'unread', label: 'Chưa đọc', icon: Mail },
              { key: 'important', label: 'Quan trọng', icon: AlertTriangle },
              { key: 'system', label: 'Hệ thống', icon: Cog },
              { key: 'promotion', label: 'Khuyến mãi', icon: Gift }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'default' : 'outline'}
                onClick={() => setActiveTab(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
                <Badge variant="secondary" className="ml-1">
                  {getTabCount(key)}
                </Badge>
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả loại</option>
              <option value="schedule">Lịch dạy</option>
              <option value="member">Hội viên</option>
              <option value="system">Hệ thống</option>
              <option value="promotion">Khuyến mãi</option>
            </select>
            <Button onClick={markAllAsRead} className="bg-green-600 hover:bg-green-700">
              <CheckCheck className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      !notification.isRead 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : notification.isImportant
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-white`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {getTypeText(notification.type)}
                            </Badge>
                            {notification.isImportant && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Quan trọng
                              </Badge>
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime(notification.timestamp)}
                            </div>
                            {notification.details && (
                              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                Xem chi tiết
                              </span>
                            )}
                          </div>
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator className="my-4" />}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? 'Chưa có thông báo nào'
                    : `Không có thông báo ${activeTab === 'unread' ? 'chưa đọc' : activeTab} nào`
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
