import React, { useMemo, useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
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

  // Calculate schedule for selected date
  const selectedDateSchedule = useMemo(() => {
    const dateStart = new Date(selectedDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const isTomorrow = selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
    const isYesterday = selectedDate.toDateString() === new Date(Date.now() - 86400000).toDateString();

    let dateLabel = "Hôm nay";
    if (isTomorrow) dateLabel = "Ngày mai";
    else if (isYesterday) dateLabel = "Hôm qua";
    else if (!isToday) {
      dateLabel = selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
    }

    return schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.dateTime);
        return scheduleDate >= dateStart && scheduleDate < dateEnd;
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
          date: dateLabel,
          member: memberName,
          branch: branchName,
          type: 'PT cá nhân',
          duration: `${schedule.durationMinutes} phút`,
          status: schedule.status.toLowerCase(),
          note: schedule.notes || ''
        };
      });
  }, [schedules, selectedDate]);

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
    const activeSessions = selectedDateSchedule.length;
    
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
  }, [schedules, bookingRequests, selectedDateSchedule, uniqueMembers]);

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
          <CardContent className="py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-purple-900 text-sm sm:text-base">
                    Bạn có {stats.pendingRequests} yêu cầu đặt lịch đang chờ xử lý
                  </p>
                  <p className="text-sm sm:text-sm text-purple-700 line-clamp-1">
                    Xem và xác nhận các yêu cầu mới từ hội viên
                  </p>
                </div>
              </div>
              <Link to="/trainer/booking-requests" className="w-full sm:w-auto">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto text-sm">
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
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-lg sm:text-lg text-blue-900">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              Lịch dạy {selectedDate.toDateString() === new Date().toDateString() ? 'hôm nay' : selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
            </CardTitle>
            <p className="text-sm sm:text-sm text-gray-600">
              Các buổi tập đã lên lịch cho {selectedDate.toDateString() === new Date().toDateString() ? 'hôm nay' : selectedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateSchedule.length > 0 ? (
                selectedDateSchedule.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow gap-3 sm:gap-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-xs sm:text-sm">
                              {session.member.charAt(0)}
                            </span>
                          </div>
                          {session.status === 'confirmed' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{session.member}</h4>
                          <p className="text-sm sm:text-sm text-gray-600">{session.type} - {session.duration}</p>
                          <p className="text-sm sm:text-xs text-gray-500 flex items-center mt-0.5 sm:mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                            <span className="truncate">{session.branch}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 w-full sm:w-auto">
                        <p className="text-sm sm:text-sm font-semibold text-gray-900 flex-1 sm:flex-none">{session.time}</p>
                        <Badge 
                          variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                          className={`sm:mt-2 text-sm sm:text-xs ${
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
                    {index < selectedDateSchedule.length - 1 && <hr className="my-2 sm:my-3" />}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-xs sm:text-base">Không có buổi tập nào {selectedDate.toDateString() === new Date().toDateString() ? 'hôm nay' : 'vào ngày này'}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="flex gap-2 flex-1 sm:flex-none">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-sm sm:text-sm px-2 sm:px-4"
                  onClick={() => {
                    const prevDate = new Date(selectedDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    setSelectedDate(prevDate);
                  }}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Hôm qua</span>
                  <span className="sm:hidden">Qua</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-sm sm:text-sm px-2 sm:px-4"
                  onClick={() => {
                    const nextDate = new Date(selectedDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    setSelectedDate(nextDate);
                  }}
                >
                  <span className="hidden sm:inline">Ngày mai</span>
                  <span className="sm:hidden">Mai</span>
                  <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <Link to="/trainer/schedule" className="w-full sm:w-auto">
                <Button variant="secondary" className="flex items-center justify-center gap-2 w-full text-sm sm:text-sm">
                  <CalendarIcon className="w-4 h-4 sm:w-4 sm:h-4" />
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-lg sm:text-lg text-blue-900">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mr-2 sm:mr-3">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              Thao tác nhanh
            </CardTitle>
            <p className="text-sm sm:text-sm text-gray-600">
              Các hành động thường dùng
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <Link to="/trainer/schedule">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center text-center text-blue-800 hover:bg-blue-50 text-sm sm:text-sm">
                  <CalendarIcon className="w-6 h-6 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span>Xem lịch dạy</span>
                </Button>
              </Link>
              <Link to="/trainer/schedule">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center text-center text-green-800 hover:bg-green-50 text-base sm:text-sm">
                  <Plus className="w-6 h-6 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span>Thêm lịch dạy</span>
                </Button>
              </Link>
              <Link to="/trainer/member-management">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center text-center text-purple-800 hover:bg-purple-50 text-base sm:text-sm">
                  <BarChart3 className="w-6 h-6 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span>Ghi nhận tiến độ</span>
                </Button>
              </Link>
              <Link to="/trainer/notifications">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center text-center text-red-800 hover:bg-red-50 text-base sm:text-sm">
                  <Bell className="w-6 h-6 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span>Xem thông báo</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-lg sm:text-lg text-blue-900">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg mr-2 sm:mr-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              Hội viên gần đây
            </CardTitle>
            <p className="text-sm sm:text-sm text-gray-600">
              Danh sách các hội viên bạn đã tương tác gần đây
            </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {uniqueMembers.length > 0 ? (
              uniqueMembers.map((member) => (
              <div key={member.id} className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm mr-2 sm:mr-4 flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.name}</h4>
                  <p className="text-sm sm:text-sm text-gray-600">Buổi tập: {member.sessions}</p>
                  <p className="text-sm sm:text-xs text-gray-500 truncate">Lần cuối: {member.lastSession}</p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className={`text-sm sm:text-xs ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    <span className="hidden sm:inline">{member.status === 'active' ? 'Hoạt động' : 'Chờ xác nhận'}</span>
                    <span className="sm:hidden">{member.status === 'active' ? 'HĐ' : 'Chờ'}</span>
                  </Badge>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-6 sm:py-8 text-gray-500">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-xs sm:text-base">Chưa có hội viên nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}