import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Calendar as CalendarComponent, ModalDaySchedules } from '../../../components/ui';
import { 
  Calendar, 
  Activity,
  Download,
  Loader2
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import { useCheckInMember, useMySchedules } from '../hooks';
import { exportWorkoutHistoryToExcel } from '../../../lib/excel-utils';
import { ScheduleWithDetails } from '../types/schedule.types';
import { toast } from 'sonner';

export function MemberHistory() {
  const { user } = useAuth();
  const memberId = user?._id || user?.id || '';

  // Modal state for day schedules
  const [showDaySchedulesModal, setShowDaySchedulesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<ScheduleWithDetails[]>([]);

  // Fetch data from APIs
  const { checkInHistory, isLoadingHistory } = useCheckInMember(memberId);
  const { data: schedulesData, isLoading: isLoadingSchedules } = useMySchedules();

  // Process schedules data for calendar
  const schedules = useMemo(() => {
    if (!schedulesData) return [];
    return (schedulesData || []) as ScheduleWithDetails[];
  }, [schedulesData]);

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

  // Helper functions for schedule display
  const getTrainerName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?.fullName) {
      return schedule.trainerId.fullName;
    }
    if (schedule.trainer?.fullName) {
      return schedule.trainer.fullName;
    }
    return 'PT';
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

  const getBranchAddress = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.branchId === 'object' && schedule.branchId?.address) {
      return schedule.branchId.address;
    }
    if (schedule.branch?.address) {
      return schedule.branch.address;
    }
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'NoShow': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'Đã xác nhận';
      case 'Pending': return 'Chờ xác nhận';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'NoShow': return 'Vắng mặt';
      default: return status;
    }
  };

  // Handle day click to show schedules modal
  const handleDayClick = (date: Date, daySchedules: ScheduleWithDetails[]) => {
    setSelectedDate(date);
    setSelectedDaySchedules(daySchedules);
    setShowDaySchedulesModal(true);
  };

  // Loading state
  const isLoading = isLoadingHistory || isLoadingSchedules;

  const handleExportReport = () => {
    try {
      const schedulesForExport = schedules.map((schedule: any) => ({
        ...schedule,
        id: schedule._id,
        date_time: schedule.dateTime,
        duration_minutes: schedule.durationMinutes,
        status: getStatusText(schedule.status),
      }));
      
      exportWorkoutHistoryToExcel(
        checkIns,
        schedulesForExport,
        user?.fullName || 'KhachHang'
      );
      toast.success('Đã xuất báo cáo lịch sử tập luyện thành công');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch tập</h1>
          <p className="text-base sm:text-sm text-gray-600 mt-1">Theo dõi lịch tập luyện và lịch sử check-in</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto text-base sm:text-sm" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Calendar View for Schedules */}
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center space-x-2 text-sm sm:text-base md:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Lịch tập luyện</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-2 md:p-4 pt-0">
          <CalendarComponent
            schedules={schedules}
            onDayClick={handleDayClick}
            getScheduleDisplayText={(schedule) => {
              const time = new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const trainerName = getTrainerName(schedule as ScheduleWithDetails);
              return `${time} - ${trainerName}`;
            }}
            getScheduleColor={(schedule) => {
              const status = (schedule as ScheduleWithDetails).status;
              if (status === 'Completed') {
                return 'bg-green-100 text-green-800';
              } else if (status === 'Confirmed') {
                return 'bg-blue-100 text-blue-800';
              } else if (status === 'Pending') {
                return 'bg-yellow-100 text-yellow-800';
              } else if (status === 'Cancelled') {
                return 'bg-red-100 text-red-800';
              }
              return 'bg-orange-100 text-orange-800';
            }}
          />
        </CardContent>
      </Card>

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

      {/* Modal for Day Schedules */}
      <ModalDaySchedules
        isOpen={showDaySchedulesModal}
        onClose={() => {
          setShowDaySchedulesModal(false);
          setSelectedDate(null);
          setSelectedDaySchedules([]);
        }}
        date={selectedDate}
        schedules={selectedDaySchedules}
        getTrainerName={getTrainerName}
        getBranchName={getBranchName}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </div>
  );
}
