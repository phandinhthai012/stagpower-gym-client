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
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 text-center">{currentMonth}</h2>
            </div>
            <div className="flex gap-2">
              {/* Empty div for spacing */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
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
                  className={`min-h-[100px] border border-gray-200 rounded-lg p-2 transition-all ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    isClickable 
                      ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer' 
                      : ''
                  }`}
                  onClick={() => {
                    if (isClickable && isCurrentMonth) {
                      const clickedDate = new Date(year, month, dayNumber);
                      onDayClick(clickedDate, daySchedules);
                    }
                  }}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {isCurrentMonth ? dayNumber : ''}
                  </div>
                  
                  {hasSchedules && (
                    <div className="space-y-1">
                      {daySchedules.slice(0, 2).map(schedule => (
                        <div 
                          key={schedule._id} 
                          className={`text-xs p-1 rounded truncate ${colorFn(schedule)}`}
                          title={displayTextFn(schedule)}
                        >
                          {displayTextFn(schedule)}
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
    </div>
  );
}
