import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar as CalendarComponent, ModalDaySchedules } from '../../../components/ui';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMySchedules, useCancelSchedule, useCompleteSchedule, useDeleteSchedule, useUpdateSchedule } from '../hooks';
import { ScheduleWithDetails } from '../types/schedule.types';
import { ModalCreateSchedule } from '../components';

export function TrainerSchedulePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialViewParam = searchParams.get('view');
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>(initialViewParam === 'list' ? 'list' : 'calendar');
  const [currentFilter, setCurrentFilter] = useState('all');
  const navigate = useNavigate();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDaySchedulesModal, setShowDaySchedulesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<ScheduleWithDetails[]>([]);

  // Data fetching
  const { data: schedulesData, isLoading, refetch } = useMySchedules();
  const cancelMutation = useCancelSchedule();
  const completeMutation = useCompleteSchedule();
  const deleteMutation = useDeleteSchedule();
  const updateMutation = useUpdateSchedule();

  const schedules = schedulesData || [];

  // Helper functions for safe data access
  const getMemberName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.memberId === 'object' && schedule.memberId?.fullName) {
      return schedule.memberId.fullName;
    }
    if (schedule.member?.fullName) {
      return schedule.member.fullName;
    }
    return 'Member';
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

  const getSubscriptionType = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.subscriptionId === 'object' && schedule.subscriptionId?.type) {
      return schedule.subscriptionId.type;
    }
    if (schedule.subscription?.type) {
      return schedule.subscription.type;
    }
    return 'PT cá nhân';
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
      case 'Completed': return 'Đã hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'NoShow': return 'Không đến';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <AlertCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'NoShow': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        const scheduleDate = new Date(schedule.dateTime).toISOString().split('T')[0];
        return scheduleDate === today;
      }
      if (currentFilter === 'week') {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        const scheduleDate = new Date(schedule.dateTime);
        return scheduleDate >= weekStart && scheduleDate <= weekEnd;
      }
      return schedule.status === currentFilter;
    });
  }, [schedules, currentFilter]);

  // Action handlers
  const handleCancelSchedule = async (scheduleId: string) => {
    if (!confirm('Bạn có chắc muốn hủy lịch này?')) return;
    try {
      await cancelMutation.mutateAsync(scheduleId);
      refetch();
    } catch (error) {
      console.error('Error cancelling schedule:', error);
    }
  };

  const handleCompleteSchedule = async (scheduleId: string) => {
    if (!confirm('Đánh dấu buổi tập này là đã hoàn thành?')) return;
    try {
      await completeMutation.mutateAsync(scheduleId);
      refetch();
    } catch (error) {
      console.error('Error completing schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Bạn có chắc muốn xóa lịch này?')) return;
    try {
      await deleteMutation.mutateAsync(scheduleId);
      refetch();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleConfirmSchedule = async (scheduleId: string) => {
    if (!confirm('Xác nhận lịch này?')) return;
    try {
      await updateMutation.mutateAsync({ 
        scheduleId, 
        data: { status: 'Confirmed' } 
      });
      refetch();
    } catch (error) {
      console.error('Error confirming schedule:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTrainerName = (schedule: ScheduleWithDetails) => {
    return 'PT'; // Trainer is always the current user
  };

  const handleDayClick = (date: Date, daySchedules: ScheduleWithDetails[]) => {
    setSelectedDate(date);
    setSelectedDaySchedules(daySchedules);
    setShowDaySchedulesModal(true);
  };

  return (
    <div>
      {/* Calendar Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {/* Calendar navigation is now handled by Calendar component */}
                  </div>

            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Lịch làm việc</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentView === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentView('calendar');
                  setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    params.set('view', 'calendar');
                    return params;
                  });
                }}
              >
                Lịch
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentView('list');
                  setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    params.set('view', 'list');
                    return params;
                  });
                }}
              >
                Danh sách
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar View */}
      {currentView === 'calendar' && (
        <CalendarComponent
          schedules={schedules}
          onDayClick={handleDayClick}
          getScheduleDisplayText={(schedule) => {
            const time = new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const memberName = getMemberName(schedule as ScheduleWithDetails);
            return `${time} - ${memberName}`;
          }}
          getScheduleColor={(schedule) => {
            return 'bg-blue-100 text-blue-800';
          }}
        />
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div>
          {/* Schedule Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bộ lọc lịch dạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'today', label: 'Hôm nay' },
                  { key: 'week', label: 'Tuần này' },
                  { key: 'Confirmed', label: 'Đã xác nhận' },
                  { key: 'Pending', label: 'Chờ xác nhận' },
                  { key: 'Completed', label: 'Đã hoàn thành' },
                  { key: 'Cancelled', label: 'Đã hủy' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={currentFilter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentFilter(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Danh sách lịch dạy ({filteredSchedules.length})
                </CardTitle>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm buổi dạy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => {
                      const scheduleDate = new Date(schedule.dateTime);
                      const dayOfWeek = scheduleDate.toLocaleDateString('vi-VN', { weekday: 'long' });
                      const dateStr = scheduleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const timeStr = scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={schedule._id} className="p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ borderLeftColor: schedule.status === 'Cancelled' ? '#ef4444' : schedule.status === 'Confirmed' ? '#22c55e' : '#eab308' }}>
                          <div className="flex items-start justify-between gap-4">
                            {/* Left: Member Info */}
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                {getMemberName(schedule).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                                  Buổi tập với {getMemberName(schedule)}
                                </h4>
                                <p className="text-sm text-blue-600 font-medium mb-2">
                                  Loại: {getSubscriptionType(schedule)}
                                </p>
                                
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
                                    <span className="font-semibold text-gray-700">Giờ: {timeStr}</span>
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
                                {getStatusText(schedule.status)}
                              </Badge>
                              <div className="flex gap-2">
                                {/* Hiển thị "Xác nhận" khi chưa xác nhận */}
                                {schedule.status === 'Pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmSchedule(schedule._id);
                                    }}
                                    disabled={updateMutation.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Xác nhận
                                  </Button>
                                )}
                                
                                {/* Hiển thị "Hoàn thành" khi đã xác nhận */}
                                {schedule.status === 'Confirmed' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCompleteSchedule(schedule._id);
                                    }}
                                    disabled={completeMutation.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Hoàn thành
                                  </Button>
                                )}
                                
                                {/* Hiển thị "Hủy" khi chưa xác nhận hoặc đã xác nhận */}
                                {(schedule.status === 'Pending' || schedule.status === 'Confirmed') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelSchedule(schedule._id);
                                    }}
                                    disabled={cancelMutation.isPending}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Hủy
                                  </Button>
                                )}
                                
                                {/* Luôn có nút "Xóa" */}
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 border-gray-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchedule(schedule._id);
                                  }}
                                  disabled={deleteMutation.isPending}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Không có lịch dạy nào</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Modals */}
      <ModalCreateSchedule
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <ModalDaySchedules
        isOpen={showDaySchedulesModal}
        onClose={() => {
          setShowDaySchedulesModal(false);
          setSelectedDate(null);
          setSelectedDaySchedules([]);
        }}
        date={selectedDate}
        schedules={selectedDaySchedules}
        getMemberName={getMemberName}
        getTrainerName={getTrainerName}
        getBranchName={getBranchName}
      />
    </div>
  );
}