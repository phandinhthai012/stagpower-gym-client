import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  Loader2
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import ModalCreateScheduleWithPT from '../components/ModalCreateScheduleWithPT';
import { useMySchedules, useCancelSchedule } from '../hooks';
import { ScheduleWithDetails } from '../types/schedule.types';
import { toast } from 'sonner';

export function MemberSchedule() {
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);

  // Use real API
  const { data: schedulesData, isLoading, refetch } = useMySchedules();
  const cancelMutation = useCancelSchedule();

  const schedules = schedulesData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'NoShow':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTrainerName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?.fullName) {
      return schedule.trainerId.fullName;
    }
    if (schedule.trainer?.fullName) {
      return schedule.trainer.fullName;
    }
    return 'PT';
  };

  const getTrainerSpecialty = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?.trainerInfo) {
      return schedule.trainerId.trainerInfo.specialty;
    }
    if (schedule.trainer?.trainerInfo) {
      return schedule.trainer.trainerInfo.specialty;
    }
    return '';
  };

  const getBranchName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.branchId === 'object' && schedule.branchId?.name) {
      return schedule.branchId.name;
    }
    if (schedule.branch?.name) {
      return schedule.branch.name;
    }
    return '';
  };

  // Filter schedules by date
  const todaySchedules = useMemo(() => {
    const today = new Date();
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.dateTime);
      return scheduleDate.toDateString() === today.toDateString();
    });
  }, [schedules]);

  // Upcoming schedules
  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return schedules
      .filter(schedule => new Date(schedule.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 5);
  }, [schedules]);

  // Recent schedules
  const recentSchedules = useMemo(() => {
    const now = new Date();
    return schedules
      .filter(schedule => new Date(schedule.dateTime) < now)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 5);
  }, [schedules]);

  const handleCancelSchedule = async (scheduleId: string) => {
    if (!confirm('Bạn có chắc muốn hủy lịch này?')) return;

    try {
      await cancelMutation.mutateAsync(scheduleId);
      toast.success('Đã hủy lịch thành công!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đặt lịch PT</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý lịch tập với huấn luyện viên</p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Đặt lịch mới
        </Button>
      </div>

      {/* Today's Schedule */}
      {todaySchedules.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              <span>Lịch tập hôm nay</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {todaySchedules.map((schedule) => {
                const timeStr = new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={schedule._id} className="p-4 bg-white rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {getTrainerName(schedule).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-gray-900 mb-1">
                            Tập PT với {getTrainerName(schedule)}
                          </h4>
                          {getTrainerSpecialty(schedule) && (
                            <p className="text-xs text-blue-600 font-medium mb-2">
                              {getTrainerSpecialty(schedule)}
                            </p>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-700">Giờ tập: {timeStr}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-700">{schedule.durationMinutes} phút</span>
                            </div>
                            {getBranchName(schedule) && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{getBranchName(schedule)}</span>
                              </div>
                            )}
                          </div>
                          {schedule.notes && (
                            <p className="text-xs text-gray-500 italic mt-2">📝 {schedule.notes}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(schedule.status)} text-xs font-semibold px-3 py-1 whitespace-nowrap`}>
                        {schedule.status === 'Pending' ? 'Chờ xác nhận' :
                         schedule.status === 'Confirmed' ? 'Đã xác nhận' :
                         schedule.status === 'Cancelled' ? 'Đã hủy' :
                         schedule.status === 'Completed' ? 'Hoàn thành' : schedule.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              <span>Lịch sắp tới</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => {
                  const scheduleDate = new Date(schedule.dateTime);
                  const dayOfWeek = scheduleDate.toLocaleDateString('vi-VN', { weekday: 'long' });
                  const dateStr = scheduleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const timeStr = scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={schedule._id} className="p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: schedule.status === 'Cancelled' ? '#ef4444' : schedule.status === 'Confirmed' ? '#22c55e' : '#eab308' }}>
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Trainer Info */}
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                            {getTrainerName(schedule).charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                              Tập PT với {getTrainerName(schedule)}
                            </h4>
                            {getTrainerSpecialty(schedule) && (
                              <p className="text-sm text-blue-600 font-medium mb-2">
                                Chuyên môn: {getTrainerSpecialty(schedule)}
                              </p>
                            )}
                            
                            {/* Date & Time Info */}
                            <div className="space-y-1.5 mb-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-semibold text-gray-700">{dayOfWeek}</span>
                                <span className="text-gray-600">-</span>
                                <span className="text-gray-700">{dateStr}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-semibold text-gray-700">Giờ tập: {timeStr}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-700">Thời lượng: {schedule.durationMinutes} phút</span>
                              </div>
                              {getBranchName(schedule) && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-700">{getBranchName(schedule)}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Notes */}
                            {schedule.notes && (
                              <p className="text-xs text-gray-500 italic mt-2">
                                📝 {schedule.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Status & Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={`${getStatusColor(schedule.status)} text-xs font-semibold px-3 py-1`}>
                            {schedule.status === 'Pending' ? 'Chờ xác nhận' :
                             schedule.status === 'Confirmed' ? 'Đã xác nhận' :
                             schedule.status === 'Cancelled' ? 'Đã hủy' :
                             schedule.status === 'Completed' ? 'Hoàn thành' : schedule.status}
                          </Badge>
                          {(schedule.status === 'Pending' || schedule.status === 'Confirmed') && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
                              onClick={() => handleCancelSchedule(schedule._id)}
                              disabled={cancelMutation.isPending}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Hủy lịch
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch sắp tới</h3>
                <p className="text-gray-500 mb-4">Đặt lịch PT để bắt đầu tập luyện</p>
                <Button onClick={() => setOpenCreate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Đặt lịch ngay
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Clock className="h-5 w-5" />
              <span>Lịch sử gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSchedules.length > 0 ? (
              <div className="space-y-4">
                {recentSchedules.map((schedule) => (
                  <div key={schedule._id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm md:text-base truncate">
                          Buổi PT với {getTrainerName(schedule)}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-600 mt-1 flex-wrap gap-y-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(schedule.dateTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{schedule.durationMinutes} phút</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(schedule.status)} hidden sm:inline-flex`}>
                      {schedule.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử</h3>
                <p className="text-gray-500">Bắt đầu đặt lịch PT để xem lịch sử</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Schedule Modal */}
      <ModalCreateScheduleWithPT
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
