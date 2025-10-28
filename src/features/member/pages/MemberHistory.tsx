import React, { useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  History, 
  Calendar, 
  Clock, 
  Activity,
  TrendingUp,
  Target,
  Award,
  Download,
  Loader2
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import { useCheckInMember, useMySchedules } from '../hooks';

export function MemberHistory() {
  const { user } = useAuth();
  const memberId = user?._id || user?.id || '';

  // Fetch data from APIs
  const { checkInHistory, isLoadingHistory } = useCheckInMember(memberId);
  const { data: schedulesData, isLoading: isLoadingSchedules } = useMySchedules();

  // Process check-ins data
  const checkIns = useMemo(() => {
    if (!checkInHistory) return [];
    return checkInHistory
      .map((checkIn: any) => {
        // Calculate duration in minutes
        let duration = 0;
        if (checkIn.checkInTime && checkIn.checkOutTime) {
          const checkInTime = new Date(checkIn.checkInTime).getTime();
          const checkOutTime = new Date(checkIn.checkOutTime).getTime();
          duration = Math.round((checkOutTime - checkInTime) / (1000 * 60));
        }
        return {
          ...checkIn,
          id: checkIn._id,
          check_in_time: checkIn.checkInTime,
          duration,
          status: checkIn.status === 'checked_in' ? 'Đang tập' : checkIn.status === 'checked_out' ? 'Đã check-out' : checkIn.status,
        };
      })
      .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime());
  }, [checkInHistory]);

  // Process schedules data
  const schedules = useMemo(() => {
    if (!schedulesData) return [];
    return (schedulesData || [])
      .map((schedule: any) => ({
        ...schedule,
        id: schedule._id,
        date_time: schedule.dateTime,
        duration_minutes: schedule.durationMinutes,
        status: schedule.status === 'Confirmed' ? 'Đã xác nhận' : 
                schedule.status === 'Pending' ? 'Chờ xác nhận' :
                schedule.status === 'Completed' ? 'Hoàn thành' :
                schedule.status === 'Cancelled' ? 'Đã hủy' : schedule.status,
      }))
      .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
  }, [schedulesData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCheckIns = checkIns.length;
    const totalSchedules = schedules.length;
    const completedSchedules = schedules.filter(s => s.status === 'Hoàn thành').length;
    const totalWorkoutTime = checkIns
      .filter(c => c.duration)
      .reduce((sum, c) => sum + (c.duration || 0), 0);
    
    // Weekly stats
    const weeklyCheckIns = checkIns.filter(c => {
      const checkInTime = c.check_in_time || c.checkInTime;
      if (!checkInTime) return false;
      const checkInDate = new Date(checkInTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return checkInDate >= weekAgo;
    }).length;

    return {
      totalCheckIns,
      totalSchedules,
      completedSchedules,
      totalWorkoutTime,
      weeklyCheckIns
    };
  }, [checkIns, schedules]);

  // Loading state
  const isLoading = isLoadingHistory || isLoadingSchedules;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-base sm:text-sm">Đang tải lịch sử...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch sử tập luyện</h1>
          <p className="text-base sm:text-sm text-gray-600 mt-1">Theo dõi tiến độ và lịch sử tập luyện</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto text-base sm:text-sm">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalCheckIns}</p>
                <p className="text-xs sm:text-sm text-gray-600">Tổng lần check-in</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{Math.round(stats.totalWorkoutTime / 60)}h</p>
                <p className="text-xs sm:text-sm text-gray-600">Tổng thời gian tập</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{stats.completedSchedules}</p>
                <p className="text-xs sm:text-sm text-gray-600">Buổi PT hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{stats.weeklyCheckIns}</p>
                <p className="text-xs sm:text-sm text-gray-600">Lần tập tuần này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Check-in History */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Activity className="h-5 w-5" />
              <span>Lịch sử check-in</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {checkIns.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {checkIns.slice(0, 10).map((checkIn) => (
                  <div key={checkIn.id || checkIn._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-base sm:text-sm">Check-in</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(checkIn.check_in_time || checkIn.checkInTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-base sm:text-sm font-medium">
                        {checkIn.duration ? `${checkIn.duration} phút` : 'Đang tập'}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {checkIn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử check-in</h3>
                <p className="text-base sm:text-sm text-gray-500">Bắt đầu tập luyện để xem lịch sử</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PT Schedule History */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Target className="h-5 w-5" />
              <span>Lịch sử PT</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {schedules.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {schedules.slice(0, 10).map((schedule) => (
                  <div key={schedule.id || schedule._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-base sm:text-sm">Buổi PT</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(schedule.date_time || schedule.dateTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-base sm:text-sm font-medium">
                        {schedule.duration_minutes || schedule.durationMinutes} phút
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử PT</h3>
                <p className="text-base sm:text-sm text-gray-500">Đặt lịch PT để xem lịch sử</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Calendar className="h-5 w-5" />
            <span>Hoạt động theo tháng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {(() => {
              const monthlyActivity = checkIns.reduce((acc, checkIn) => {
                const checkInTime = checkIn.check_in_time || checkIn.checkInTime;
                if (!checkInTime) return acc;
                
                const month = new Date(checkInTime).toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long' 
                });
                if (!acc[month]) {
                  acc[month] = { checkIns: 0, totalTime: 0 };
                }
                acc[month].checkIns++;
                acc[month].totalTime += checkIn.duration || 0;
                return acc;
              }, {} as Record<string, { checkIns: number; totalTime: number }>);

              return Object.entries(monthlyActivity)
                .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                .slice(0, 6)
                .map(([month, data]) => (
                  <div key={month} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-base sm:text-sm">{month}</h4>
                      <p className="text-base sm:text-sm text-gray-600">
                        {(data as { checkIns: number }).checkIns} lần check-in
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base sm:text-lg font-semibold">
                        {Math.round((data as { totalTime: number }).totalTime / 60)}h {(data as { totalTime: number }).totalTime % 60}m
                      </p>
                      <p className="text-base sm:text-sm text-gray-600">Tổng thời gian</p>
                    </div>
                  </div>
                ));
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
