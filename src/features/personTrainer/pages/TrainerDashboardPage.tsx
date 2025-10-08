import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Users, 
  Calendar, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  BarChart3,
  Bell,
  TrendingUp,
  Star,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { mockUsers, mockSchedules, mockSubscriptions, getMockDataByTrainerId } from '../../../mockdata';

export function TrainerDashboardPage() {
  const { user } = useAuth();
  
  // Get trainer's data from mockdata
  const trainerSchedules = getMockDataByTrainerId('schedules', user?.id || '');
  const trainerMembers = mockUsers.filter(u => 
    u.role === 'Member' && 
    trainerSchedules.some(s => s.member_id === u.id)
  );
  
  // Get today's schedule
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = trainerSchedules.filter(schedule => 
    schedule.date_time.startsWith(today)
  ).map(schedule => {
    const member = mockUsers.find(u => u.id === schedule.member_id);
    const subscription = mockSubscriptions.find(sub => sub.id === schedule.subscription_id);
    const packageType = subscription?.type || 'PT';
    
    return {
      id: schedule.id,
      time: new Date(schedule.date_time).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: "Hôm nay",
      member: member?.fullName || 'Unknown',
      type: packageType === 'PT' ? 'PT cá nhân' : packageType === 'Combo' ? 'PT combo' : 'Membership',
      duration: `${schedule.duration_minutes} phút`,
      status: schedule.status.toLowerCase(),
      note: schedule.note
    };
  });

  // Get recent members (last 5 members with recent sessions)
  const recentMembers = trainerMembers.slice(0, 5).map(member => {
    const memberSchedules = trainerSchedules.filter(s => s.member_id === member.id);
    const lastSession = memberSchedules
      .filter(s => s.status === 'Completed')
      .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];
    
    const lastSessionTime = lastSession 
      ? new Date(lastSession.date_time).toLocaleDateString('vi-VN')
      : 'Chưa có buổi tập';
    
    return {
      id: member.id,
      name: member.fullName,
      avatar: member.fullName.split(' ').map(n => n[0]).join('').substring(0, 2),
      lastSession: lastSessionTime,
      status: member.status.toLowerCase(),
      sessions: memberSchedules.filter(s => s.status === 'Completed').length
    };
  });

  // Calculate stats
  const totalClients = trainerMembers.length;
  const activeSessions = todaySchedule.length;
  const upcomingSessions = trainerSchedules.filter(s => 
    new Date(s.date_time) > new Date() && s.status === 'Confirmed'
  ).length;
  const completedSessions = trainerSchedules.filter(s => s.status === 'Completed').length;
  const averageRating = 4.8; // Mock rating
  const monthlyRevenue = 15000000; // Mock revenue

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Hội Viên</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalClients}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 từ tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Buổi Tập Hôm Nay</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{activeSessions}</div>
            <p className="text-xs text-gray-500 mt-1">
              {upcomingSessions} buổi sắp tới
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Đánh Giá Trung Bình</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{averageRating}</div>
            <p className="text-xs text-gray-500 mt-1">
              {completedSessions} buổi đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doanh Thu Tháng</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {(monthlyRevenue / 1000000).toFixed(1)}M VNĐ
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% từ tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-blue-900">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              Lịch dạy hôm nay
            </CardTitle>
            <p className="text-sm text-gray-600">
              Các buổi tập đã lên lịch cho hôm nay
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.length > 0 ? (
                todaySchedule.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-sm">
                              {session.member.charAt(0)}
                            </span>
                          </div>
                          {session.status === 'confirmed' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{session.member}</h4>
                          <p className="text-sm text-gray-600">{session.type} - {session.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{session.time}</p>
                        <Badge 
                          variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                          className={`mt-2 ${
                            session.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : session.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {session.status === 'confirmed' ? 'Đã xác nhận' : session.status === 'pending' ? 'Chờ xác nhận' : 'Đã hoàn thành'}
                        </Badge>
                      </div>
                    </div>
                    {index < todaySchedule.length - 1 && <hr className="my-3" />}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Không có buổi tập nào hôm nay</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Hôm qua
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  Ngày mai
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Link to="/trainer/schedule">
                <Button variant="secondary" className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-blue-900">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              Thao tác nhanh
            </CardTitle>
            <p className="text-sm text-gray-600">
              Các hành động thường dùng
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/trainer/schedule">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center text-blue-800 hover:bg-blue-50">
                  <CalendarIcon className="w-6 h-6 mb-2" />
                  <span>Xem lịch dạy</span>
                </Button>
              </Link>
              <Link to="/trainer/schedule">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center text-green-800 hover:bg-green-50">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Thêm lịch dạy</span>
                </Button>
              </Link>
              <Link to="/trainer/progress">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center text-purple-800 hover:bg-purple-50">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Ghi nhận tiến độ</span>
                </Button>
              </Link>
              <Link to="/trainer/notifications">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center text-red-800 hover:bg-red-50">
                  <Bell className="w-6 h-6 mb-2" />
                  <span>Xem thông báo</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg text-blue-900">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            Hội viên gần đây
          </CardTitle>
          <p className="text-sm text-gray-600">
            Danh sách các hội viên bạn đã tương tác gần đây
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMembers.map((member) => (
              <div key={member.id} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">Buổi tập: {member.sessions}</p>
                  <p className="text-xs text-gray-500">Lần cuối: {member.lastSession}</p>
                </div>
                <div className="ml-auto">
                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className={`${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {member.status === 'active' ? 'Hoạt động' : 'Chờ xác nhận'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}