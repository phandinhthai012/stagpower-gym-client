import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWithScrollLock } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Dumbbell, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Clock,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye
} from 'lucide-react';
import { ModalDirectSchedule, ModalCoachingSchedule, ModalDaySchedules } from '../components/schedule-management';
import { useAllSchedules, useDeleteSchedule } from '../hooks';
import { ScheduleWithDetails } from '../types/schedule.types';

export function AdminPTSchedule() {
  // Tab state
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Modal states
  const [showDirectScheduleModal, setShowDirectScheduleModal] = useState(false);
  const [showCoachingScheduleModal, setShowCoachingScheduleModal] = useState(false);
  const [showDaySchedulesModal, setShowDaySchedulesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<ScheduleWithDetails[]>([]);
  
  // Filter states for calendar view
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  
  // Filter states for CRUD view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch data
  const { data: schedulesData, isLoading } = useAllSchedules();
  const deleteMutation = useDeleteSchedule();

  const allSchedules = schedulesData || [];

  // Get current month and year for calendar header
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }).toUpperCase();

  // Filter schedules for calendar view
  const filteredSchedulesForCalendar = allSchedules.filter(schedule => {
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
      const itemDate = new Date(schedule.dateTime);
      return itemDate >= weekStart && itemDate <= weekEnd;
    }
    return schedule.status.toLowerCase() === currentFilter.toLowerCase();
  });

  // Filter schedules for CRUD view
  const filteredSchedulesForCRUD = allSchedules.filter(schedule => {
    const matchesSearch = searchTerm === '' || (
      schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate for CRUD view
  const paginatedSchedules = filteredSchedulesForCRUD.slice(
    (page - 1) * limit,
    page * limit
  );

  const totalPages = Math.ceil(filteredSchedulesForCRUD.length / limit);

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này?')) {
      try {
        await deleteMutation.mutateAsync(scheduleId);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa xác định</Badge>;
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

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('vi-VN');
  };

  const isDirectSchedule = (schedule: any) => {
    return schedule.notes?.startsWith('[LỊCH TRỰC]') || 
           (schedule.memberId === schedule.trainerId);
  };

  const getScheduleType = (schedule: any) => {
    if (isDirectSchedule(schedule)) {
      return { label: 'Lịch trực', color: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'Lịch PT', color: 'bg-orange-100 text-orange-800' };
  };

  const handleDayClick = (dayNumber: number) => {
    if (!dayNumber) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const clickedDate = new Date(year, month, dayNumber);
    
    const daySchedules = allSchedules.filter(s => {
      const scheduleDate = new Date(s.dateTime);
      return scheduleDate.getDate() === dayNumber &&
             scheduleDate.getMonth() === month &&
             scheduleDate.getFullYear() === year;
    });

    setSelectedDate(clickedDate);
    setSelectedDaySchedules(daySchedules);
    setShowDaySchedulesModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Lịch Làm Việc & PT</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch trực và lịch hướng dẫn PT</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowDirectScheduleModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Phân lịch trực
          </Button>
          <Button 
            onClick={() => setShowCoachingScheduleModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Phân lịch PT
          </Button>
        </div>
      </div>

      {/* Custom Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar className="w-4 h-4" />
              Lịch Làm Việc
            </Button>
            <Button
              variant={activeTab === 'crud' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setActiveTab('crud')}
            >
              <CalendarCheck className="w-4 h-4" />
              Quản Lý Lịch
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* TAB 1: Calendar View - Lịch làm việc của toàn bộ nhân viên */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 text-center">{currentMonth}</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={currentView === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('calendar')}
                  >
                    Lịch
                  </Button>
                  <Button
                    variant={currentView === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('list')}
                  >
                    Danh sách
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar View */}
          {currentView === 'calendar' && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNumber = i < 31 ? i + 1 : '';
                    const daySchedules = allSchedules.filter(s => {
                      const scheduleDate = new Date(s.dateTime);
                      return scheduleDate.getDate() === dayNumber && 
                             scheduleDate.getMonth() === currentDate.getMonth();
                    });

                    const hasSchedules = daySchedules.length > 0;
                    
                    return (
                      <div 
                        key={i} 
                        className={`min-h-[100px] border border-gray-200 rounded-lg p-2 transition-all ${
                          hasSchedules 
                            ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => hasSchedules && dayNumber && handleDayClick(dayNumber as number)}
                      >
                        <div className={`text-sm font-medium mb-2 ${
                          hasSchedules ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {dayNumber}
                        </div>
                        {hasSchedules && (
                          <div className="space-y-1">
                            {daySchedules.slice(0, 2).map(schedule => (
                              <div 
                                key={schedule._id} 
                                className={`text-xs p-1 rounded truncate ${
                                  isDirectSchedule(schedule)
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-orange-100 text-orange-800'
                                }`}
                                title={`${formatTime(schedule.dateTime)} - ${schedule.notes || 'Buổi tập'}`}
                              >
                                {formatTime(schedule.dateTime)}
                              </div>
                            ))}
                            {daySchedules.length > 2 && (
                              <div className="text-xs text-gray-500 font-medium">
                                +{daySchedules.length - 2} khác
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* List View */}
          {currentView === 'list' && (
            <div>
              {/* Schedule Filters */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Bộ lọc lịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'today', label: 'Hôm nay' },
                      { key: 'week', label: 'Tuần này' },
                      { key: 'confirmed', label: 'Đã xác nhận' },
                      { key: 'pending', label: 'Chờ xác nhận' },
                      { key: 'completed', label: 'Đã hoàn thành' }
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
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    Danh sách lịch ({filteredSchedulesForCalendar.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                      <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSchedulesForCalendar.length > 0 ? (
                        filteredSchedulesForCalendar.map((schedule) => (
                          <div
                            key={schedule._id}
                            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                  <Dumbbell className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {schedule.trainer?.fullName || 'PT'}
                                  </h4>
                                  <div className="text-sm text-gray-600">
                                    {isDirectSchedule(schedule) ? (
                                      <>
                                        <Badge className="bg-blue-100 text-blue-800 mr-2">Lịch trực</Badge>
                                        <span>{schedule.durationMinutes} phút</span>
                                      </>
                                    ) : (
                                      <span>{schedule.member?.fullName || 'Hội viên'} • {schedule.durationMinutes} phút</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">{schedule.notes?.replace('[LỊCH TRỰC] ', '')}</p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-lg font-bold text-blue-600">
                                    {formatTime(schedule.dateTime)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{formatDate(schedule.dateTime)}</p>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(schedule.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Không có lịch nào</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CRUD View - Quản lý lịch */}
      {activeTab === 'crud' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                Tìm kiếm và lọc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo ghi chú"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                
                <SelectWithScrollLock 
                  value={statusFilter} 
                  onValueChange={(value) => {
                    setStatusFilter(value as 'all' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending');
                    setPage(1);
                  }} 
                  lockScroll={true}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent lockScroll={true}>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="Pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="Completed">Hoàn thành</SelectItem>
                    <SelectItem value="Cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </SelectWithScrollLock>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPage(1);
                  }}
                >
                  Đặt lại
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-green-600" />
                Danh sách lịch ({filteredSchedulesForCRUD.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-600">PT</th>
                          <th className="text-left p-3 font-medium text-gray-600">Hội viên</th>
                          <th className="text-left p-3 font-medium text-gray-600">Ngày giờ</th>
                          <th className="text-left p-3 font-medium text-gray-600">Thời lượng</th>
                          <th className="text-left p-3 font-medium text-gray-600">Chi nhánh</th>
                          <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                          <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSchedules.map((schedule) => (
                          <tr key={schedule._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {schedule.trainer?.fullName?.charAt(0) || 'P'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {schedule.trainer?.fullName || 'Chưa có PT'}
                                  </p>
                                  {schedule.trainer?.trainerInfo && (
                                    <p className="text-xs text-gray-500">
                                      {schedule.trainer.trainerInfo.specialty}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              {isDirectSchedule(schedule) ? (
                                <Badge className="bg-blue-100 text-blue-800">Lịch trực</Badge>
                              ) : schedule.member ? (
                                <div>
                                  <p className="font-medium text-gray-900">{schedule.member.fullName}</p>
                                  {schedule.member.memberInfo && (
                                    <Badge className="text-xs mt-1" variant="outline">
                                      {schedule.member.memberInfo.membership_level.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">{formatDateTime(schedule.dateTime)}</p>
                                  <p className="text-sm text-gray-500">{formatTime(schedule.dateTime)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline">{schedule.durationMinutes} phút</Badge>
                            </td>
                            <td className="p-3">
                              <p className="text-sm">{schedule.branch?.name || 'N/A'}</p>
                            </td>
                            <td className="p-3">
                              {getStatusBadge(schedule.status)}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDelete(schedule._id)}
                                  className="text-red-600 hover:text-red-700"
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {paginatedSchedules.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Không tìm thấy lịch nào</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                          Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, filteredSchedulesForCRUD.length)} trong tổng số {filteredSchedulesForCRUD.length} kết quả
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                        >
                          «
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          ‹
                        </Button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className={page === pageNum ? 'bg-blue-600 text-white' : ''}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          ›
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                        >
                          »
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      <ModalDirectSchedule
        isOpen={showDirectScheduleModal}
        onClose={() => setShowDirectScheduleModal(false)}
      />

      <ModalCoachingSchedule
        isOpen={showCoachingScheduleModal}
        onClose={() => setShowCoachingScheduleModal(false)}
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
      />
    </div>
  );
}
