import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Dumbbell,
  BarChart3,
  Clock,
  MapPin,
  Bell
} from 'lucide-react';
import { mockUsers } from '../../../mockdata/users';
import { mockPackages } from '../../../mockdata/packages';
import { mockCheckIns } from '../../../mockdata/checkIns';
import { mockPayments } from '../../../mockdata/payments';
import { getRecentActivities, activityTypeDisplay, activityTypeColor } from '../../../mockdata/activityLogs';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  // Calculate statistics from mock data
  const totalMembers = mockUsers.filter(user => user.role === 'Member').length;
  const activeMembers = mockUsers.filter(user => user.role === 'Member' && user.status === 'Active').length;
  const totalTrainers = mockUsers.filter(user => user.role === 'Trainer').length;
  const totalStaff = mockUsers.filter(user => user.role === 'Staff').length;
  
  // Calculate revenue from payments
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyRevenue = mockPayments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Get active check-ins
  const activeCheckIns = mockCheckIns.filter(checkIn => checkIn.status === 'Active').length;
  
  // Get recent trainers
  const trainers = mockUsers.filter(user => user.role === 'Trainer').slice(0, 3);
  
  // Get recent activities
  const recentActivities = getRecentActivities(5);


  const quickActions = [
    { 
      title: 'Thêm Hội Viên Mới', 
      icon: Users, 
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/members')
    },
    { 
      title: 'Tạo Gói Tập', 
      icon: Dumbbell, 
      color: 'bg-green-500',
      onClick: () => navigate('/admin/packages')
    },
    { 
      title: 'Xem Báo Cáo', 
      icon: BarChart3, 
      color: 'bg-orange-500',
      onClick: () => navigate('/admin/reports')
    },
    { 
      title: 'Quản Lý Lịch PT', 
      icon: Calendar, 
      color: 'bg-purple-500',
      onClick: () => navigate('/admin/pt-schedule')
    }
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Chào mừng trở lại, Admin!
              </h1>
              <p className="text-blue-100 max-w-2xl">
                Đây là trung tâm quản lý phòng gym của bạn. Quản lý hội viên, PT, gói tập, doanh thu và check-in một cách dễ dàng. 
                Theo dõi báo cáo chi tiết và tùy chỉnh hệ thống với giao diện thân thiện, bảo mật cao!
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trainers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Huấn Luyện Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainers.map((trainer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {trainer.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{trainer.full_name}</h4>
                    <p className="text-sm text-gray-600">
                      {trainer.trainer_info?.specialty?.join(', ') || 'PT'}
                    </p>
                  </div>
                  <Badge variant="secondary">Hoạt động</Badge>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/admin/staff-pt-management')}
              >
                Xem tất cả huấn luyện viên
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Trạng Thái Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{activeCheckIns}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">{activeCheckIns}</h3>
              <p className="text-gray-600 mb-4">Hội viên đang tập</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hôm nay</span>
                  <span className="font-medium">{activeCheckIns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tuần này</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tháng này</span>
                  <span className="font-medium">1,234</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Thao Tác Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                    onClick={action.onClick}
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-center">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Hoạt Động Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              // Get user name from mockUsers
              const user = mockUsers.find(u => u.id === activity.user_id);
              const userName = user?.full_name || 'Người dùng';
              
              // Format time ago
              const formatTimeAgo = (dateString: string) => {
                const now = new Date();
                const activityDate = new Date(dateString);
                const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
                
                if (diffInMinutes < 60) {
                  return `${diffInMinutes} phút trước`;
                } else if (diffInMinutes < 1440) {
                  const hours = Math.floor(diffInMinutes / 60);
                  return `${hours} giờ trước`;
                } else {
                  const days = Math.floor(diffInMinutes / 1440);
                  return `${days} ngày trước`;
                }
              };
              
              const activityType = activityTypeColor[activity.activity_type] || 'info';
              const activityDisplay = activityTypeDisplay[activity.activity_type] || activity.description;
              
              return (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activityType === 'success' ? 'bg-green-500' : 
                    activityType === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activityDisplay}</p>
                    <p className="text-sm text-gray-600">{userName}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}