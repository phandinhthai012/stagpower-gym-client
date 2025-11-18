import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  X, 
  Calendar,
  Clock,
  User,
  Dumbbell,
  MapPin,
  FileText
} from 'lucide-react';
import { ScheduleWithDetails } from '../../types/schedule.types';
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalDaySchedulesProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  schedules: ScheduleWithDetails[];
}

export function ModalDaySchedules({ isOpen, onClose, date, schedules }: ModalDaySchedulesProps) {
  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

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
    const d = new Date(dateTime);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const isDirectSchedule = (schedule: ScheduleWithDetails) => {
    return schedule.notes?.startsWith('[LỊCH TRỰC]') || 
           (schedule.memberId === schedule.trainerId);
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

  // Sort schedules by time
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lịch làm việc</h2>
              <p className="text-sm text-gray-500 font-normal mt-1">
                {formatDate(date)}
              </p>
            </div>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Không có lịch làm việc</p>
              <p className="text-sm">Ngày này chưa có lịch nào được phân công</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSchedules.map((schedule, index) => (
                <Card key={schedule._id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      {/* Left side - Main info */}
                      <div className="flex gap-4 flex-1">
                        {/* Time indicator */}
                        <div className="flex flex-col items-center min-w-[80px]">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatTime(schedule.dateTime)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {schedule.durationMinutes} phút
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          {/* Trainer/Staff */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {(typeof schedule.trainerId === 'object' ? schedule.trainerId?.fullName : schedule.trainer?.fullName)?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-gray-900">
                                {(typeof schedule.trainerId === 'object' ? schedule.trainerId?.fullName : schedule.trainer?.fullName) || `Trainer ${(typeof schedule.trainerId === 'string' ? schedule.trainerId : schedule.trainerId?._id || '').slice(-4)}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {(typeof schedule.trainerId === 'object' ? schedule.trainerId?.trainerInfo : schedule.trainer?.trainerInfo) ? 'Personal Trainer' : 'Nhân viên'}
                              </p>
                              {(typeof schedule.trainerId === 'object' ? schedule.trainerId?.trainerInfo : schedule.trainer?.trainerInfo) && (
                                <p className="text-xs text-blue-600 font-medium">
                                  {(typeof schedule.trainerId === 'object' ? schedule.trainerId?.trainerInfo : schedule.trainer?.trainerInfo)?.specialty}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Type - Direct or PT */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {isDirectSchedule(schedule) ? (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Calendar className="w-3 h-3 mr-1" />
                                Lịch trực
                              </Badge>
                            ) : (
                              <>
                                <Badge className="bg-orange-100 text-orange-800">
                                  <Dumbbell className="w-3 h-3 mr-1" />
                                  Lịch PT
                                </Badge>
                                {(typeof schedule.memberId === 'object' ? schedule.memberId : schedule.member) && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="font-medium">
                                      {(typeof schedule.memberId === 'object' ? schedule.memberId?.fullName : schedule.member?.fullName)}
                                    </span>
                                    {(typeof schedule.memberId === 'object' ? schedule.memberId?.memberInfo : schedule.member?.memberInfo) && (
                                      <Badge variant="outline" className="text-xs ml-1">
                                        {(typeof schedule.memberId === 'object' ? schedule.memberId?.memberInfo : schedule.member?.memberInfo)?.membership_level?.toUpperCase()}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Branch */}
                          {(typeof schedule.branchId === 'object' ? schedule.branchId : schedule.branch) && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {(typeof schedule.branchId === 'object' ? schedule.branchId?.name : schedule.branch?.name)}
                            </div>
                          )}

                          {/* Notes */}
                          {schedule.notes && (
                            <div className="flex items-start gap-1 text-sm text-gray-600">
                              <FileText className="w-3 h-3 text-gray-400 mt-0.5" />
                              <p className="flex-1">{schedule.notes.replace('[LỊCH TRỰC] ', '')}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side - Status */}
                      <div className="ml-4">
                        {getStatusBadge(schedule.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

