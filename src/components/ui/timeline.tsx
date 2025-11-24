import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';
import { format, addDays, subDays, startOfDay, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Schedule {
  _id: string;
  dateTime: string;
  durationMinutes: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';
  notes?: string;
  memberId: any;
  trainerId: any;
  branchId: any;
  subscriptionId?: any;
  [key: string]: any;
}

interface TimelineProps {
  schedules: Schedule[];
  getMemberName: (schedule: Schedule) => string;
  getBranchName: (schedule: Schedule) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onActionClick?: (action: string, schedule: Schedule) => void;
  className?: string;
  showDeleteButton?: boolean;
}

export function Timeline({
  schedules,
  getMemberName,
  getBranchName,
  getStatusColor,
  getStatusText,
  onActionClick,
  className = '',
  showDeleteButton = true
}: TimelineProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Filter schedules for selected date
  const daySchedules = schedules
    .filter(s => isSameDay(new Date(s.dateTime), selectedDate))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Generate time slots (6:00 - 22:00)
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Date Navigation */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={goToPreviousDay} className="text-base sm:text-sm">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Hôm qua</span>
            </Button>
            
            <div className="flex-1 text-center">
              <h2 className="text-xl sm:text-xl font-bold text-gray-900">
                {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
              </h2>
              {isToday && (
                <Badge className="bg-blue-100 text-blue-800 text-sm sm:text-sm mt-1">
                  Hôm nay
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isToday && (
                <Button variant="outline" size="sm" onClick={goToToday} className="text-sm sm:text-sm">
                  Hôm nay
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={goToNextDay} className="text-base sm:text-sm">
                <span className="hidden sm:inline mr-1">Ngày mai</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {daySchedules.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600" />
                <span className="font-semibold text-gray-900 text-base sm:text-base">
                  {daySchedules.length} buổi tập
                </span>
              </div>
              <div className="flex gap-2 sm:gap-3 text-sm sm:text-sm flex-wrap">
                {daySchedules.filter(s => s.status === 'Pending').length > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {daySchedules.filter(s => s.status === 'Pending').length} Chờ XN
                  </Badge>
                )}
                {daySchedules.filter(s => s.status === 'Confirmed').length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    {daySchedules.filter(s => s.status === 'Confirmed').length} Đã XN
                  </Badge>
                )}
                {daySchedules.filter(s => s.status === 'Completed').length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {daySchedules.filter(s => s.status === 'Completed').length} Hoàn thành
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          {daySchedules.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {daySchedules.map((schedule) => {
                const startTime = new Date(schedule.dateTime);
                const endTime = new Date(startTime.getTime() + schedule.durationMinutes * 60000);
                const timeRange = `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;
                
                return (
                  <div 
                    key={schedule._id} 
                    className="relative pl-12 sm:pl-16 pb-4 border-l-4 border-blue-300 last:border-l-0 last:pb-0"
                  >
                    {/* Time Label */}
                    <div className="absolute left-0 top-0 text-right pr-3 sm:pr-4">
                      <div className="font-bold text-base sm:text-base text-gray-900">
                        {format(startTime, 'HH:mm')}
                      </div>
                      <div className="text-sm sm:text-sm text-gray-500">
                        {schedule.durationMinutes}p
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500 border-2 sm:border-4 border-white shadow-md"></div>

                    {/* Session Card */}
                    <div className={`p-3 sm:p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-all ${
                      schedule.status === 'Confirmed' ? 'bg-green-50 border-green-200' :
                      schedule.status === 'Pending' ? 'bg-yellow-50 border-yellow-200' :
                      schedule.status === 'Completed' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-base flex-shrink-0">
                              {getMemberName(schedule).charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-lg sm:text-lg text-gray-900 truncate">
                                {getMemberName(schedule)}
                              </h4>
                              <p className="text-sm sm:text-sm text-gray-600">
                                {timeRange}
                              </p>
                            </div>
                          </div>

                          {getBranchName(schedule) && (
                            <div className="flex items-center gap-1.5 text-sm sm:text-sm text-gray-600 mb-1">
                              <MapPin className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                              <span className="truncate">{getBranchName(schedule)}</span>
                            </div>
                          )}

                          {schedule.notes && (
                            <p className="text-sm sm:text-sm text-gray-500 italic mt-2 line-clamp-2">
                              📝 {schedule.notes}
                            </p>
                          )}
                        </div>

                        {/* Right: Status & Actions */}
                        <div className="flex flex-row sm:flex-col items-start gap-2 sm:gap-2">
                          <Badge className={`${getStatusColor(schedule.status)} text-sm sm:text-sm font-semibold`}>
                            {getStatusText(schedule.status)}
                          </Badge>
                          
                          {onActionClick && (
                            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                              {schedule.status === 'Pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-300 hover:bg-blue-50 text-sm sm:text-sm px-2.5"
                                  onClick={() => onActionClick('confirm', schedule)}
                                >
                                  <span className="hidden sm:inline">Xác nhận</span>
                                  <span className="sm:hidden">✓</span>
                                </Button>
                              )}
                              {schedule.status === 'Confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-300 hover:bg-green-50 text-sm sm:text-sm px-2.5"
                                  onClick={() => onActionClick('complete', schedule)}
                                >
                                  <span className="hidden sm:inline">Hoàn thành</span>
                                  <span className="sm:hidden">✓✓</span>
                                </Button>
                              )}
                              {(schedule.status === 'Pending' || schedule.status === 'Confirmed') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50 text-sm sm:text-sm px-2.5"
                                  onClick={() => onActionClick('cancel', schedule)}
                                >
                                  <span className="hidden sm:inline">Hủy</span>
                                  <span className="sm:hidden">✕</span>
                                </Button>
                              )}
                              {showDeleteButton && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-gray-600 border-gray-300 hover:bg-gray-50 text-sm sm:text-sm px-2.5"
                                  onClick={() => onActionClick('delete', schedule)}
                                >
                                  <span className="hidden sm:inline">Xóa</span>
                                  <span className="sm:hidden">🗑️</span>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 text-gray-500">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg sm:text-lg font-medium mb-1">Không có buổi tập nào</p>
              <p className="text-base sm:text-sm text-gray-400">
                {isToday ? 'Hôm nay bạn rảnh rỗi!' : 'Chưa có lịch dạy trong ngày này'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

