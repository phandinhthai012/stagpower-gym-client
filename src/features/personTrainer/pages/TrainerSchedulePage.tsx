import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { mockUsers, mockSchedules, mockSubscriptions, getMockDataByTrainerId } from '../../../mockdata';

export function TrainerSchedulePage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [currentFilter, setCurrentFilter] = useState('all');

  // Get trainer's schedules from mockdata
  const trainerSchedules = getMockDataByTrainerId('schedules', user?.id || '');
  
  // Enhance schedules with member and subscription data
  const enhancedSchedules = trainerSchedules.map(schedule => {
    const member = mockUsers.find(u => u.id === schedule.member_id);
    const subscription = mockSubscriptions.find(sub => sub.id === schedule.subscription_id);
    
    return {
      id: schedule.id,
      date: schedule.date_time.split('T')[0],
      time: new Date(schedule.date_time).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      member: member?.full_name || 'Unknown',
      type: subscription?.type?.toLowerCase() || 'pt',
      duration: schedule.duration_minutes,
      status: schedule.status.toLowerCase(),
      note: schedule.note,
      dateTime: schedule.date_time
    };
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'pt': return 'PT cá nhân';
      case 'combo': return 'PT combo';
      case 'membership': return 'Membership';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSchedule = enhancedSchedules.filter(item => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return item.date === today;
    }
    if (currentFilter === 'week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    }
    return item.status === currentFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get current month and year for calendar header
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Calendar Header */}
      <Card className="mb-6">
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
              <h2 className="text-2xl font-bold text-gray-900">{currentMonth}</h2>
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
              {/* Calendar days would be generated here */}
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = i < 31 ? i + 1 : '';
                const daySchedules = enhancedSchedules.filter(s => {
                  const scheduleDate = new Date(s.date);
                  return scheduleDate.getDate() === dayNumber;
                });
                
                return (
                  <div key={i} className="min-h-[100px] border border-gray-200 rounded-lg p-2">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {dayNumber}
                    </div>
                    {daySchedules.length > 0 && (
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map(schedule => (
                          <div key={schedule.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                            {schedule.time} - {schedule.member}
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-gray-500">
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
              <CardTitle>Bộ lọc lịch dạy</CardTitle>
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
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Danh sách lịch dạy ({filteredSchedule.length})
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm buổi dạy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item) => (
                    <div key={item.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {item.member.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{item.member}</h4>
                            <p className="text-sm text-gray-600">{getTypeText(item.type)} • {item.duration} phút</p>
                            <p className="text-xs text-gray-500">{item.note}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-lg font-bold text-blue-600">{item.time}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{formatDate(item.date)}</p>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusText(item.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Không có lịch dạy nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}