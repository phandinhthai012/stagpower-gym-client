import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { X, Clock, User, MapPin, Calendar, UserX } from 'lucide-react';

interface Schedule {
  _id: string;
  dateTime: string;
  durationMinutes: number;
  status: string;
  notes?: string;
  [key: string]: any; // Allow additional properties
}

interface ModalDaySchedulesProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  schedules: Schedule[];
  getMemberName?: (schedule: Schedule) => string;
  getTrainerName?: (schedule: Schedule) => string;
  getBranchName?: (schedule: Schedule) => string;
  getStatusColor?: (status: string) => string;
  getStatusText?: (status: string) => string;
  onOpenChangeSchedule?: (schedule: Schedule) => void;
}

export function ModalDaySchedules({
  isOpen,
  onClose,
  date,
  schedules,
  getMemberName,
  getTrainerName,
  getBranchName,
  getStatusColor,
  getStatusText,
  onOpenChangeSchedule
}: ModalDaySchedulesProps) {
  if (!isOpen || !date) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Default functions
  const defaultGetMemberName = (schedule: Schedule) => {
    if (typeof schedule.memberId === 'object' && schedule.memberId?.fullName) {
      return schedule.memberId.fullName;
    }
    if (schedule.member?.fullName) {
      return schedule.member.fullName;
    }
    return 'Member';
  };

  const defaultGetTrainerName = (schedule: Schedule) => {
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?.fullName) {
      return schedule.trainerId.fullName;
    }
    if (schedule.trainer?.fullName) {
      return schedule.trainer.fullName;
    }
    return 'PT';
  };

  const defaultGetBranchName = (schedule: Schedule) => {
    if (typeof schedule.branchId === 'object' && schedule.branchId?.name) {
      return schedule.branchId.name;
    }
    if (schedule.branch?.name) {
      return schedule.branch.name;
    }
    return '';
  };

  const defaultGetStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'NoShow': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const defaultGetStatusText = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'Đã xác nhận';
      case 'Pending': return 'Chờ xác nhận';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'NoShow': return 'Không đến';
      default: return status;
    }
  };

  const memberNameFn = getMemberName || defaultGetMemberName;
  const trainerNameFn = getTrainerName || defaultGetTrainerName;
  const branchNameFn = getBranchName || defaultGetBranchName;
  const statusColorFn = getStatusColor || defaultGetStatusColor;
  const statusTextFn = getStatusText || defaultGetStatusText;

  // Helper to get trainer ID from schedule
  const getTrainerId = (schedule: Schedule): string => {
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?._id) {
      return schedule.trainerId._id;
    }
    if (schedule.trainer?._id) {
      return schedule.trainer._id;
    }
    if (typeof schedule.trainerId === 'string') {
      return schedule.trainerId;
    }
    return '';
  };

  // Helper to determine trainer role from schedule
  const getTrainerRole = (schedule: Schedule): 'trainer' | 'staff' => {
    // Check if trainer has trainerInfo (PT) or not (staff)
    const hasTrainerInfo = 
      (typeof schedule.trainerId === 'object' && schedule.trainerId?.trainerInfo) ||
      (schedule.trainer?.trainerInfo);
    
    return hasTrainerInfo ? 'trainer' : 'staff';
  };

  // Check if schedule can be changed (not completed, cancelled, or no-show)
  const canChangeSchedule = (schedule: Schedule): boolean => {
    return schedule.status === 'Pending' || schedule.status === 'Confirmed';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Lịch ngày {formatDate(date)}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => {
                const scheduleDate = new Date(schedule.dateTime);
                const dayOfWeek = scheduleDate.toLocaleDateString('vi-VN', { weekday: 'long' });
                const dateStr = scheduleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const timeStr = scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={schedule._id} className="p-4 bg-white border-l-4 rounded-lg shadow-sm" style={{ borderLeftColor: schedule.status === 'Cancelled' ? '#ef4444' : schedule.status === 'Confirmed' ? '#22c55e' : '#eab308' }}>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Schedule Info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {trainerNameFn(schedule).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                            Buổi tập với {memberNameFn(schedule)}
                          </h4>
                          <p className="text-sm text-blue-600 font-medium mb-2">
                            PT: {trainerNameFn(schedule)}
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
                            {branchNameFn(schedule) && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{branchNameFn(schedule)}</span>
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
                        <Badge variant="outline" className={`${statusColorFn(schedule.status)} text-xs font-semibold px-3 py-1`}>
                          {statusTextFn(schedule.status)}
                        </Badge>
                        {/* Action Button - Change PT/Staff */}
                        {onOpenChangeSchedule && getTrainerId(schedule) && canChangeSchedule(schedule) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChangeSchedule(schedule)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Đổi {getTrainerRole(schedule) === 'trainer' ? 'PT' : 'Nhân viên'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không có lịch nào trong ngày này</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
