import React, { useMemo } from 'react';
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
  Loader2,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useMySchedules, useMyBookingRequests } from '../hooks';
import { ScheduleWithDetails } from '../types/schedule.types';

export function TrainerDashboardPage() {
  const { user } = useAuth();
  
  // Fetch real data from API
  const { data: schedulesData, isLoading: isLoadingSchedules } = useMySchedules();
  const { data: bookingRequestsData, isLoading: isLoadingRequests } = useMyBookingRequests();

  const schedules = schedulesData || [];
  const bookingRequests = bookingRequestsData || [];

  // Helper function to safely get member name
  const getMemberName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.memberId === 'object' && schedule.memberId?.fullName) {
      return schedule.memberId.fullName;
    }
    return 'Unknown Member';
  };

  // Helper function to get branch name
  const getBranchName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.branchId === 'object' && schedule.branchId?.name) {
      return schedule.branchId.name;
    }
    return 'Chi nhánh chưa xác định';
  };

  // Helper function to get member initials
  const getMemberInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Calculate today's schedule
  const todaySchedule = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.dateTime);
        return scheduleDate >= today && scheduleDate < tomorrow;
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .map(schedule => {
        const memberName = getMemberName(schedule);
        const branchName = getBranchName(schedule);
        
        return {
          id: schedule._id,
          time: new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          date: "Hôm nay",
          member: memberName,
          branch: branchName,
          type: 'PT cá nhân',
          duration: `${schedule.durationMinutes} phút`,
          status: schedule.status.toLowerCase(),
          note: schedule.notes || ''
        };
      });
  }, [schedules]);

  // Calculate unique members (from completed sessions)
  const uniqueMembers = useMemo(() => {
    const memberMap = new Map();
    
    schedules.forEach(schedule => {
      const memberId = typeof schedule.memberId === 'object' 
        ? schedule.memberId._id 
        : schedule.memberId;
      const memberName = getMemberName(schedule);
      
      if (!memberMap.has(memberId)) {
        const memberSchedules = schedules.filter(s => {
          const sMemId = typeof s.memberId === 'object' ? s.memberId._id : s.memberId;
          return sMemId === memberId;
        });
        
        const completedSessions = memberSchedules.filter(s => s.status === 'Completed');
        const lastSession = completedSessions
          .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];
        
        memberMap.set(memberId, {
          id: memberId,
          name: memberName,
          avatar: getMemberInitials(memberName),
          lastSession: lastSession 
            ? new Date(lastSession.dateTime).toLocaleDateString('vi-VN')
            : 'Chưa có buổi tập',
          status: 'active',
          sessions: completedSessions.length
        });
      }
    });
    
    return Array.from(memberMap.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  }, [schedules]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalClients = uniqueMembers.length;
    const activeSessions = todaySchedule.length;
    
    const upcomingSessions = schedules.filter(s => 
      new Date(s.dateTime) > now && s.status === 'Confirmed'
    ).length;
    
    const completedSessions = schedules.filter(s => 
      s.status === 'Completed'
    ).length;

    const monthlyCompletedSessions = schedules.filter(s => 
      s.status === 'Completed' && new Date(s.dateTime) >= thisMonth
    ).length;

    // Mock revenue calculation (100k per session)
    const monthlyRevenue = monthlyCompletedSessions * 100000;

    // Pending booking requests
    const pendingRequests = bookingRequests.filter(r => r.status === 'Pending').length;

    return {
      totalClients,
      activeSessions,
      upcomingSessions,
      completedSessions,
      monthlyRevenue,
      pendingRequests,
      averageRating: 4.8 // TODO: Implement real rating system
    };
  }, [schedules, bookingRequests, todaySchedule, uniqueMembers]);

  // Show loading state
  if (isLoadingSchedules || isLoadingRequests) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Booking Requests Alert */}
      {stats.pendingRequests > 0 && (
        <Card className="border-l-4 border-l-purple-500 bg-purple-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900">
                    Bạn có {stats.pendingRequests} yêu cầu đặt lịch đang chờ xử lý
                  </p>
                  <p className="text-sm text-purple-700">
                    Xem và xác nhận các yêu cầu mới từ hội viên
                  </p>
                </div>
              </div>
              <Link to="/trainer/booking-requests">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Xem ngay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

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
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {session.branch}
                          </p>
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
            {uniqueMembers.length > 0 ? (
              uniqueMembers.map((member) => (
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
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có hội viên nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}