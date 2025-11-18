import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Calendar as CalendarComponent, ModalDaySchedules } from '../../../components/ui';
import { 
  Calendar,
  CalendarCheck, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell,
  Search,
  Filter,
  Loader2,
  Eye,
  Clock,
  MapPin,
  User,
  XCircle
} from 'lucide-react';
import { ModalDirectSchedule, ModalCoachingSchedule } from '../components/schedule-management';
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
  
  // Filter states for CRUD view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending' | 'NoShow'>('all');
  const [page, setPage] = useState(1);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Data fetching
  const { data: allSchedules, isLoading, error } = useAllSchedules();
  const deleteScheduleMutation = useDeleteSchedule();

  // Calendar helpers
  const currentMonth = currentDate.toLocaleDateString('vi-VN', { 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  const formatTime = (dateTime: string) => {
    const d = new Date(dateTime);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTime: string) => {
    const d = new Date(dateTime);
    return d.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
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

  const getMemberName = (schedule: ScheduleWithDetails) => {
    if (typeof schedule.memberId === 'object' && schedule.memberId?.fullName) {
      return schedule.memberId.fullName;
    }
    if (schedule.member?.fullName) {
      return schedule.member.fullName;
    }
    return 'Member';
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

  const handleDayClick = (date: Date, daySchedules: ScheduleWithDetails[]) => {
    setSelectedDate(date);
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
      </div>

      {/* Custom Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
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
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowDirectScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Phân lịch trực
              </Button>
              <Button 
                onClick={() => setShowCoachingScheduleModal(true)}
                className="bg-orange-600 hover:bg-orange-700"
                size="sm"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Phân lịch PT
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* TAB 1: Calendar View */}
      {activeTab === 'calendar' && (
        <CalendarComponent
          schedules={allSchedules || []}
          onDayClick={handleDayClick}
          getScheduleDisplayText={(schedule) => {
            const time = new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const trainerName = getTrainerName(schedule as ScheduleWithDetails);
            return `${time} - ${trainerName}`;
          }}
          getScheduleColor={(schedule) => {
            return isDirectSchedule(schedule) 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-orange-100 text-orange-800';
          }}
        />
      )}

      {/* TAB 2: CRUD View */}
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
                
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => {
                    setStatusFilter(value as 'all' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending' | 'NoShow');
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="Pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="Completed">Hoàn thành</SelectItem>
                    <SelectItem value="Cancelled">Đã hủy</SelectItem>
                    <SelectItem value="NoShow">Vắng mặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Danh sách lịch ({allSchedules?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(allSchedules || []).length > 0 ? (
                    (allSchedules || []).map((schedule) => {
                      const scheduleDate = new Date(schedule.dateTime);
                      const dayOfWeek = scheduleDate.toLocaleDateString('vi-VN', { weekday: 'long' });
                      const dateStr = scheduleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const timeStr = scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={schedule._id} className="p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: isDirectSchedule(schedule) ? '#3b82f6' : '#f97316' }}>
                          <div className="flex items-start justify-between gap-4">
                            {/* Left: Schedule Info */}
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 ${isDirectSchedule(schedule) ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
                                {getTrainerName(schedule).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                                  {isDirectSchedule(schedule) ? 'Lịch trực' : 'Lịch PT'} - {getTrainerName(schedule)}
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
                                  {!isDirectSchedule(schedule) && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-700">Hội viên: {getMemberName(schedule)}</span>
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
                              <div className="flex gap-2">
                                <Badge variant="outline" className={`${isDirectSchedule(schedule) ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-orange-100 text-orange-800 border-orange-300'} text-xs font-semibold px-3 py-1`}>
                                  {isDirectSchedule(schedule) ? 'Lịch trực' : 'Lịch PT'}
                                </Badge>
                                <Badge variant="outline" className={`${
                                  schedule.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-300' :
                                  schedule.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                  schedule.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                                  schedule.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                  schedule.status === 'NoShow' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                  'bg-gray-100 text-gray-800 border-gray-300'
                                } text-xs font-semibold px-3 py-1`}>
                                  {schedule.status === 'Confirmed' ? 'Đã xác nhận' :
                                   schedule.status === 'Pending' ? 'Chờ xác nhận' :
                                   schedule.status === 'Cancelled' ? 'Đã hủy' :
                                   schedule.status === 'Completed' ? 'Hoàn thành' :
                                   schedule.status === 'NoShow' ? 'Vắng mặt' : schedule.status}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Xem
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
                                  onClick={() => {
                                    if (confirm('Bạn có chắc muốn xóa lịch này?')) {
                                      deleteScheduleMutation.mutate(schedule._id);
                                    }
                                  }}
                                  disabled={deleteScheduleMutation.isPending}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
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
                      <p>Không có lịch nào</p>
                    </div>
                  )}
                </div>
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
        getMemberName={getMemberName}
        getTrainerName={getTrainerName}
        getBranchName={getBranchName}
      />
    </div>
  );
}