import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MapPin
} from 'lucide-react';
import { 
  mockSchedules, 
  mockUsers,
  mockBranches,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';
import ModalCreateScheduleWithPT from '../components/ModalCreateScheduleWithPT';

export function MemberSchedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get member's schedule data
  const memberSchedules = useMemo(() => {
    if (!user?.id) return [];
    // refreshKey to re-compute when new item pushed
    return getMockDataByMemberId('schedules', user.id);
  }, [user?.id, refreshKey]);

  // Get trainers
  const trainers = useMemo(() => {
    return mockUsers.filter(u => u.role === 'Trainer');
  }, []);

  // Get branches
  const branches = useMemo(() => {
    return mockBranches;
  }, []);

  // Get trainer info
  const getTrainerInfo = (trainerId: string) => {
    return trainers.find(trainer => trainer.id === trainerId);
  };

  // Get branch info
  const getBranchInfo = (branchId: string) => {
    return branches.find(branch => branch.id === branchId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Filter schedules by date
  const todaySchedules = useMemo(() => {
    const today = new Date();
    return memberSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date_time);
      return scheduleDate.toDateString() === today.toDateString();
    });
  }, [memberSchedules]);

  // Upcoming schedules
  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return memberSchedules
      .filter(schedule => new Date(schedule.date_time) > now && schedule.status === 'Confirmed')
      .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
      .slice(0, 5);
  }, [memberSchedules]);

  // Recent schedules
  const recentSchedules = useMemo(() => {
    const now = new Date();
    return memberSchedules
      .filter(schedule => new Date(schedule.date_time) < now)
      .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
      .slice(0, 5);
  }, [memberSchedules]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đặt lịch PT</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý lịch tập với huấn luyện viên</p>
        </div>
        <ModalCreateScheduleWithPT
          trigger={
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Đặt lịch mới
            </Button>
          }
          open={openCreate}
          onOpenChange={setOpenCreate}
          onSuccess={(payload) => {
            if (!user) return;
            const id = Math.random().toString(16).slice(2);
            const newSchedule = {
              id,
              member_id: user.id,
              trainer_id: payload.trainer_id,
              subscription_id: 'local-mock',
              branch_id: payload.branch_id,
              note: payload.note,
              date_time: payload.date_time,
              duration_minutes: payload.duration_minutes,
              status: 'Confirmed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as any;
            // Push vào mock để demo
            (mockSchedules as any).unshift(newSchedule);
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>

      {/* Today's Schedule */}
      {todaySchedules.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              <span>Lịch tập hôm nay</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {todaySchedules.map((schedule) => {
                const trainer = getTrainerInfo(schedule.trainer_id);
                const branch = getBranchInfo(schedule.branch_id);
                return (
                  <div key={schedule.id} className="p-3 md:p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-sm md:text-base truncate">Buổi PT với {trainer?.full_name}</h4>
                          <Badge variant="outline" className={`${getStatusColor(schedule.status)} px-2 py-0.5 text-[10px] md:text-xs`}>{schedule.status}</Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-600">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(schedule.date_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{schedule.duration_minutes} phút</span>
                          {branch && (<span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{branch.name}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Calendar className="h-5 w-5" />
              <span>Lịch sắp tới</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => {
                  const trainer = getTrainerInfo(schedule.trainer_id);
                  const branch = getBranchInfo(schedule.branch_id);
                  return (
                    <div key={schedule.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm md:text-base">Buổi PT với {trainer?.full_name}</h4>
                          <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(schedule.date_time)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{schedule.duration_minutes} phút</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                          Hủy
                        </Button>
                        <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch sắp tới</h3>
                <p className="text-gray-500 mb-4">Đặt lịch PT để bắt đầu tập luyện</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Đặt lịch ngay
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Clock className="h-5 w-5" />
              <span>Lịch sử gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSchedules.length > 0 ? (
              <div className="space-y-4">
                {recentSchedules.map((schedule) => {
                  const trainer = getTrainerInfo(schedule.trainer_id);
                  return (
                    <div key={schedule.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(schedule.status)}`}>
                          {getStatusIcon(schedule.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm md:text-base">Buổi PT với {trainer?.full_name}</h4>
                          <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(schedule.date_time)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{schedule.duration_minutes} phút</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(schedule.status)} hidden sm:inline-flex`}>
                        {schedule.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử</h3>
                <p className="text-gray-500">Bắt đầu đặt lịch PT để xem lịch sử</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Trainers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Huấn luyện viên có sẵn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainers.slice(0, 6).map((trainer) => (
              <div key={trainer.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{trainer.full_name}</h4>
                    <p className="text-sm text-gray-600">Huấn luyện viên</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kinh nghiệm:</span>
                    <span>{trainer.trainer_info?.experience_years || 0} năm</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Chuyên môn:</span>
                    <span className="text-xs">
                      {trainer.trainer_info?.specialty?.join(', ') || 'Tổng hợp'}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Đặt lịch
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
