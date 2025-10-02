import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Dumbbell, 
  Search, 
  Filter, 
  Check, 
  Edit, 
  X, 
  Clock,
  User,
  Users,
  CalendarCheck
} from 'lucide-react';
import { mockUsers } from '../../../mockdata/users';
import { mockSchedules } from '../../../mockdata/schedules';
import { mockSubscriptions } from '../../../mockdata/subscriptions';

export function AdminPTSchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directScheduleForm, setDirectScheduleForm] = useState({
    staffSelect: '',
    workDate: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '22:00',
    shiftType: '',
    notes: ''
  });
  const [coachingScheduleForm, setCoachingScheduleForm] = useState({
    trainerSelect: '',
    memberSelect: '',
    sessionDateTime: new Date().toISOString().slice(0, 16),
    sessionDuration: '90',
    notes: ''
  });

  // Get staff and trainers
  const staffAndTrainers = mockUsers.filter(user => user.role === 'Trainer' || user.role === 'Staff');
  const trainers = mockUsers.filter(user => user.role === 'Trainer');
  const members = mockUsers.filter(user => user.role === 'Member');

  // Get schedules with member info
  const schedulesWithInfo = mockSchedules.map(schedule => {
    const trainer = mockUsers.find(user => user.id === schedule.trainer_id);
    const member = mockUsers.find(user => user.id === schedule.member_id);
    const subscription = mockSubscriptions.find(sub => sub.id === schedule.subscription_id);
    
    return {
      ...schedule,
      trainer,
      member,
      subscription
    };
  });

  const handleDirectScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directScheduleForm.staffSelect || !directScheduleForm.workDate || !directScheduleForm.shiftType) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    alert('Đã tạo lịch trực thành công!');
    setDirectScheduleForm({
      staffSelect: '',
      workDate: new Date().toISOString().split('T')[0],
      startTime: '06:00',
      endTime: '22:00',
      shiftType: '',
      notes: ''
    });
  };

  const handleCoachingScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachingScheduleForm.trainerSelect || !coachingScheduleForm.memberSelect || !coachingScheduleForm.sessionDateTime) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    alert('Đã tạo lịch hướng dẫn thành công!');
    setCoachingScheduleForm({
      trainerSelect: '',
      memberSelect: '',
      sessionDateTime: new Date().toISOString().slice(0, 16),
      sessionDuration: '90',
      notes: ''
    });
  };

  const handleShiftTypeChange = (value: string) => {
    switch (value) {
      case 'morning':
        setDirectScheduleForm(prev => ({ ...prev, startTime: '06:00', endTime: '14:00' }));
        break;
      case 'afternoon':
        setDirectScheduleForm(prev => ({ ...prev, startTime: '14:00', endTime: '22:00' }));
        break;
      case 'full':
        setDirectScheduleForm(prev => ({ ...prev, startTime: '06:00', endTime: '22:00' }));
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Direct Schedule Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Phân lịch trực cho PT/ Nhân viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDirectScheduleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="staffSelect">Chọn PT/Nhân viên</Label>
                <Select 
                  value={directScheduleForm.staffSelect} 
                  onValueChange={(value) => setDirectScheduleForm(prev => ({ ...prev, staffSelect: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn PT/ nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffAndTrainers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name} - {staff.role === 'Trainer' ? 'PT' : 'Nhân viên'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workDate">Ngày làm việc</Label>
                <Input
                  id="workDate"
                  type="date"
                  value={directScheduleForm.workDate}
                  onChange={(e) => setDirectScheduleForm(prev => ({ ...prev, workDate: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Giờ bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={directScheduleForm.startTime}
                    onChange={(e) => setDirectScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Giờ kết thúc</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={directScheduleForm.endTime}
                    onChange={(e) => setDirectScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shiftType">Loại ca làm việc</Label>
                <Select 
                  value={directScheduleForm.shiftType} 
                  onValueChange={(value) => {
                    setDirectScheduleForm(prev => ({ ...prev, shiftType: value }));
                    handleShiftTypeChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại ca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Ca sáng (06:00 - 14:00)</SelectItem>
                    <SelectItem value="afternoon">Ca chiều (14:00 - 22:00)</SelectItem>
                    <SelectItem value="full">Ca toàn ngày (06:00 - 22:00)</SelectItem>
                    <SelectItem value="custom">Ca bán thời gian (tùy chỉnh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="directNotes">Ghi chú</Label>
                <textarea
                  id="directNotes"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={2}
                  placeholder="Ghi chú về ca làm việc..."
                  value={directScheduleForm.notes}
                  onChange={(e) => setDirectScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full">
                Tạo lịch trực
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coaching Schedule Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-600" />
              Phân lịch hướng dẫn cho PT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCoachingScheduleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="trainerSelect">Chọn PT</Label>
                <Select 
                  value={coachingScheduleForm.trainerSelect} 
                  onValueChange={(value) => setCoachingScheduleForm(prev => ({ ...prev, trainerSelect: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn PT" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.full_name} - PT
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="memberSelect">Chọn hội viên</Label>
                <Select 
                  value={coachingScheduleForm.memberSelect} 
                  onValueChange={(value) => setCoachingScheduleForm(prev => ({ ...prev, memberSelect: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hội viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => {
                      const activeSub = mockSubscriptions.find(sub => 
                        sub.member_id === member.id && sub.status === 'Active'
                      );
                      const remainingSessions = activeSub?.pt_sessions_remaining || 0;
                      return (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name} - {member.member_info?.membership_level} (Còn {remainingSessions} buổi)
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessionDateTime">Ngày và giờ buổi tập</Label>
                <Input
                  id="sessionDateTime"
                  type="datetime-local"
                  value={coachingScheduleForm.sessionDateTime}
                  onChange={(e) => setCoachingScheduleForm(prev => ({ ...prev, sessionDateTime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sessionDuration">Thời lượng buổi tập (phút)</Label>
                <Select 
                  value={coachingScheduleForm.sessionDuration} 
                  onValueChange={(value) => setCoachingScheduleForm(prev => ({ ...prev, sessionDuration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 phút</SelectItem>
                    <SelectItem value="90">90 phút</SelectItem>
                    <SelectItem value="120">120 phút</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="coachingNotes">Ghi chú về buổi tập</Label>
                <textarea
                  id="coachingNotes"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  placeholder="Nhập ghi chú về buổi tập..."
                  value={coachingScheduleForm.notes}
                  onChange={(e) => setCoachingScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full">
                Tạo lịch hướng dẫn
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Trainer">PT</SelectItem>
                <SelectItem value="Staff">Nhân viên</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Pending">Chờ xác nhận</SelectItem>
                <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="Completed">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              Đặt lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-green-600" />
            Quản lý lịch làm việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Tên</th>
                  <th className="text-left p-3 font-medium text-gray-600">Ngày</th>
                  <th className="text-left p-3 font-medium text-gray-600">Giờ làm việc</th>
                  <th className="text-left p-3 font-medium text-gray-600">Loại buổi</th>
                  <th className="text-left p-3 font-medium text-gray-600">Hội viên</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {schedulesWithInfo.slice(0, 10).map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{schedule.trainer?.full_name}</p>
                        <p className="text-sm text-gray-500">{schedule.trainer?.role === 'Trainer' ? 'PT' : 'NV'}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {formatDateTime(schedule.date_time)}
                    </td>
                    <td className="p-3">
                      {formatTime(schedule.date_time)} - {formatTime(new Date(new Date(schedule.date_time).getTime() + schedule.duration_minutes * 60000).toISOString())}
                    </td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {schedule.member ? 'Cá nhân' : 'Trực'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {schedule.member ? (
                        <div>
                          <p className="font-medium text-gray-900">{schedule.member.full_name}</p>
                          {schedule.subscription && (
                            <div className="bg-blue-50 p-2 rounded text-xs mt-1">
                              <p><strong>Gói:</strong> {schedule.subscription.type} | <strong>Còn:</strong> {schedule.subscription.pt_sessions_remaining} buổi</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">---------</span>
                      )}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(schedule.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Số dòng/trang:</span>
              <Input type="number" value={10} min={5} max={50} className="w-16 h-8" />
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm">«</Button>
              <Button variant="outline" size="sm">‹</Button>
              <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">›</Button>
              <Button variant="outline" size="sm">»</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
