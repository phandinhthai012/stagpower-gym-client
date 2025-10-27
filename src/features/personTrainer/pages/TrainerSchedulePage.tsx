import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Timeline } from '../../../components/ui';
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
  const [currentView, setCurrentView] = useState<'timeline' | 'list'>(initialViewParam === 'list' ? 'list' : 'timeline');
  const [currentFilter, setCurrentFilter] = useState('today'); // Default to "today"
  const navigate = useNavigate();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

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



  return (
    <div>
      {/* Calendar Header */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Title - Center on mobile */}
            <div className="text-center sm:text-center">
              <h2 className="text-2xl sm:text-2xl font-bold text-gray-900">Lịch làm việc</h2>
            </div>
            
            {/* View Toggle - Full width on mobile */}
            <div className="flex gap-2 w-full sm:w-auto sm:self-center">
              <Button
                variant={currentView === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentView('timeline');
                  setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    params.set('view', 'timeline');
                    return params;
                  });
                }}
                className="flex-1 sm:flex-none text-base sm:text-sm"
              >
                <Clock className="w-4 h-4 mr-1.5 sm:mr-2" />
                Timeline
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
                className="flex-1 sm:flex-none text-base sm:text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
                Danh sách
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline View */}
      {currentView === 'timeline' && (
        <>
          <Timeline
            schedules={schedules}
            getMemberName={getMemberName}
            getBranchName={getBranchName}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            onActionClick={(action, schedule) => {
              switch (action) {
                case 'confirm':
                  handleConfirmSchedule(schedule._id);
                  break;
                case 'complete':
                  handleCompleteSchedule(schedule._id);
                  break;
                case 'cancel':
                  handleCancelSchedule(schedule._id);
                  break;
                case 'delete':
                  handleDeleteSchedule(schedule._id);
                  break;
              }
            }}
          />
          
          {/* Floating Add Button */}
          <Button
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40"
            onClick={() => setShowCreateModal(true)}
            title="Thêm buổi dạy"
          >
            <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
          </Button>
        </>
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div>
          {/* Schedule Filters */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-xl">Bộ lọc lịch dạy</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-3">
                {/* Time Filters */}
                <div>
                  <p className="text-sm sm:text-sm text-gray-500 mb-2 font-medium">Thời gian:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'today', label: 'Hôm nay' },
                      { key: 'week', label: 'Tuần này' },
                      { key: 'all', label: 'Tất cả' },
                    ].map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={currentFilter === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentFilter(key)}
                        className="text-base sm:text-sm"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <p className="text-sm sm:text-sm text-gray-500 mb-2 font-medium">Trạng thái:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'Pending', label: 'Chờ xác nhận', color: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' },
                      { key: 'Confirmed', label: 'Đã xác nhận', color: 'border-green-300 text-green-700 hover:bg-green-50' },
                      { key: 'Completed', label: 'Đã hoàn thành', color: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
                      { key: 'Cancelled', label: 'Đã hủy', color: 'border-red-300 text-red-700 hover:bg-red-50' }
                    ].map(({ key, label, color }) => (
                      <Button
                        key={key}
                        variant={currentFilter === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentFilter(key)}
                        className={`text-sm sm:text-sm ${currentFilter !== key ? color : ''}`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule List */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                <CardTitle className="flex items-center text-xl sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  Danh sách lịch dạy ({filteredSchedules.length})
                </CardTitle>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-base sm:text-base"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm buổi dạy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoading ? (
                <div className="flex justify-center py-6 sm:py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => {
                      const scheduleDate = new Date(schedule.dateTime);
                      const dayOfWeek = scheduleDate.toLocaleDateString('vi-VN', { weekday: 'long' });
                      const dateStr = scheduleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const timeStr = scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={schedule._id} className="p-3 sm:p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: schedule.status === 'Cancelled' ? '#ef4444' : schedule.status === 'Confirmed' ? '#22c55e' : '#eab308' }}>
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                            {/* Left: Member Info */}
                            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0 w-full">
                              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md flex-shrink-0">
                                {getMemberName(schedule).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg sm:text-lg text-gray-900 mb-1 truncate">
                                  Buổi tập với {getMemberName(schedule)}
                                </h4>
                                <p className="text-base sm:text-sm text-blue-600 font-medium mb-2">
                                  Loại: {getSubscriptionType(schedule)}
                                </p>
                                
                                {/* Date & Time Info */}
                                <div className="space-y-1 sm:space-y-1.5 mb-2">
                                  <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-sm">
                                    <Calendar className="h-4 w-4 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                    <span className="font-semibold text-gray-700">{dayOfWeek}</span>
                                    <span className="text-gray-600">-</span>
                                    <span className="text-gray-700 truncate">{dateStr}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-sm flex-wrap">
                                    <Clock className="h-4 w-4 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                    <span className="font-semibold text-gray-700">Giờ: {timeStr}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-gray-700">Thời lượng: {schedule.durationMinutes} phút</span>
                                  </div>
                                  {getBranchName(schedule) && (
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-sm">
                                      <MapPin className="h-4 w-4 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                      <span className="text-gray-700 truncate">{getBranchName(schedule)}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Notes */}
                                {schedule.notes && (
                                  <p className="text-sm sm:text-xs text-gray-500 italic mt-2 line-clamp-2">
                                    📝 {schedule.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Status & Actions */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                              <Badge variant="outline" className={`${getStatusColor(schedule.status)} text-sm sm:text-xs font-semibold px-2 sm:px-3 py-1 flex-shrink-0`}>
                                {getStatusText(schedule.status)}
                              </Badge>
                              <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end">
                                {/* Hiển thị "Xác nhận" khi chưa xác nhận */}
                                {schedule.status === 'Pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-300 text-sm sm:text-sm px-2 sm:px-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmSchedule(schedule._id);
                                    }}
                                    disabled={updateMutation.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3 sm:mr-1" />
                                    <span className="hidden sm:inline">Xác nhận</span>
                                  </Button>
                                )}
                                
                                {/* Hiển thị "Hoàn thành" khi đã xác nhận */}
                                {schedule.status === 'Confirmed' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-300 text-sm sm:text-sm px-2 sm:px-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCompleteSchedule(schedule._id);
                                    }}
                                    disabled={completeMutation.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3 sm:mr-1" />
                                    <span className="hidden sm:inline">Hoàn thành</span>
                                  </Button>
                                )}
                                
                                {/* Hiển thị "Hủy" khi chưa xác nhận hoặc đã xác nhận */}
                                {(schedule.status === 'Pending' || schedule.status === 'Confirmed') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300 text-sm sm:text-sm px-2 sm:px-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelSchedule(schedule._id);
                                    }}
                                    disabled={cancelMutation.isPending}
                                  >
                                    <XCircle className="h-3 w-3 sm:mr-1" />
                                    <span className="hidden sm:inline">Hủy</span>
                                  </Button>
                                )}
                                
                                {/* Luôn có nút "Xóa" */}
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 border-gray-300 text-sm sm:text-sm px-2 sm:px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchedule(schedule._id);
                                  }}
                                  disabled={deleteMutation.isPending}
                                >
                                  <span className="hidden sm:inline">Xóa</span>
                                  <span className="sm:hidden">🗑️</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                      <p className="text-base sm:text-base">Không có lịch dạy nào</p>
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
    </div>
  );
}