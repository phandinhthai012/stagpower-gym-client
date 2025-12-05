import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow additional properties
}

interface CalendarProps {
  schedules: Schedule[];
  onDayClick?: (date: Date, daySchedules: Schedule[]) => void;
  getScheduleDisplayText?: (schedule: Schedule) => string;
  getScheduleColor?: (schedule: Schedule) => string;
  className?: string;
}

export function Calendar({
  schedules,
  onDayClick,
  getScheduleDisplayText,
  getScheduleColor,
  className = ''
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Get current month and year for calendar header
  const currentMonth = currentDate.toLocaleDateString('vi-VN', { 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  // Default functions
  const defaultGetScheduleDisplayText = (schedule: Schedule) => {
    const time = new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return time;
  };

  const defaultGetScheduleColor = (schedule: Schedule) => {
    return 'bg-blue-100 text-blue-800';
  };

  const displayTextFn = getScheduleDisplayText || defaultGetScheduleDisplayText;
  const colorFn = getScheduleColor || defaultGetScheduleColor;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Calendar Header */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 text-center flex-1">{currentMonth}</h2>
            <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-2 sm:p-4 md:p-6 overflow-x-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 min-w-[320px]">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-1 sm:py-2 text-xs sm:text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[320px]">
            {Array.from({ length: 35 }, (_, i) => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              
              // Get first day of month and its day of week (0 = Sunday, 1 = Monday, etc.)
              const firstDayOfMonth = new Date(year, month, 1);
              const firstDayOfWeek = firstDayOfMonth.getDay();
              
              // Calculate the actual day number for this cell
              const dayNumber = i - firstDayOfWeek + 1;
              
              // Check if this day is in the current month
              const isCurrentMonth = dayNumber > 0 && dayNumber <= new Date(year, month + 1, 0).getDate();
              
              // Get schedules for this day
              const daySchedules = isCurrentMonth ? schedules.filter(s => {
                const scheduleDate = new Date(s.dateTime);
                return scheduleDate.getDate() === dayNumber && 
                       scheduleDate.getMonth() === month && 
                       scheduleDate.getFullYear() === year;
              }) : [];

              const hasSchedules = daySchedules.length > 0;
              const isClickable = hasSchedules && onDayClick;

              return (
                <div 
                  key={i} 
                  className={`min-h-[60px] sm:min-h-[80px] md:min-h-[100px] border border-gray-200 rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 transition-all ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    isClickable 
                      ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer active:bg-blue-100' 
                      : ''
                  }`}
                  onClick={() => {
                    if (isClickable && isCurrentMonth) {
                      const clickedDate = new Date(year, month, dayNumber);
                      onDayClick(clickedDate, daySchedules);
                    }
                  }}
                >
                  <div className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {isCurrentMonth ? dayNumber : ''}
                  </div>
                  
                  {hasSchedules && (
                    <div className="space-y-0.5 sm:space-y-1">
                      {daySchedules.slice(0, 2).map(schedule => (
                        <div 
                          key={schedule._id} 
                          className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate ${colorFn(schedule)}`}
                          title={displayTextFn(schedule)}
                        >
                          <span className="hidden sm:inline">{displayTextFn(schedule)}</span>
                          <span className="sm:hidden">
                            {new Date(schedule.dateTime).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                          +{daySchedules.length - 2}
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
    </div>
  );
}
