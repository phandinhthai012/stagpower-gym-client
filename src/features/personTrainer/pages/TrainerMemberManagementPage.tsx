import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Star,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Phone,
  Crown
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { mockUsers, mockSchedules, mockSubscriptions, mockHealthInfo, getMockDataByTrainerId } from '../../../mockdata';

export function TrainerMemberManagementPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');

  // Get trainer's members from mockdata
  const trainerSchedules = getMockDataByTrainerId('schedules', user?.id || '');
  const trainerMemberIds = Array.from(new Set(trainerSchedules.map(s => s.member_id)));
  const trainerMembers = mockUsers.filter(u => 
    u.role === 'Member' && trainerMemberIds.includes(u.id)
  );

  // Enhance members with additional data
  const enhancedMembers = trainerMembers.map(member => {
    const memberSchedules = trainerSchedules.filter(s => s.member_id === member.id);
    const memberSubscription = mockSubscriptions.find(sub => sub.member_id === member.id);
    const memberHealthInfo = mockHealthInfo.find(health => health.member_id === member.id);
    const completedSessions = memberSchedules.filter(s => s.status === 'Completed').length;
    const totalSessions = memberSchedules.length;
    const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    return {
      id: member.id,
      name: member.full_name,
      avatar: member.full_name.split(' ').map(n => n[0]).join('').substring(0, 2),
      email: member.email,
      phone: member.phone,
      package: memberSubscription?.type?.toLowerCase() || 'membership',
      status: member.status.toLowerCase(),
      joinDate: member.join_date,
      lastSession: memberSchedules.length > 0 
        ? new Date(memberSchedules.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0].date_time).toLocaleDateString('vi-VN')
        : 'Chưa có buổi tập',
      totalSessions: completedSessions,
      rating: 4.5 + Math.random() * 0.5, // Mock rating
      progress: progress,
      goal: memberHealthInfo?.goal || 'Health',
      notes: member.member_info?.notes || 'Không có ghi chú'
    };
  });

  const filteredMembers = enhancedMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || member.status === statusFilter;
    const matchesPackage = !packageFilter || member.package === packageFilter;
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'suspended': return 'Tạm ngưng';
      default: return status;
    }
  };

  const getPackageText = (packageType: string) => {
    switch (packageType) {
      case 'pt': return 'PT cá nhân';
      case 'combo': return 'Combo';
      case 'membership': return 'Membership';
      default: return packageType;
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'pt': return 'bg-blue-100 text-blue-800';
      case 'combo': return 'bg-purple-100 text-purple-800';
      case 'membership': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'WeightLoss': return 'Giảm cân';
      case 'MuscleGain': return 'Tăng cơ';
      case 'Health': return 'Sức khỏe';
      default: return goal;
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc & Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm hội viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Tạm ngưng</option>
            </select>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả gói tập</option>
              <option value="pt">PT cá nhân</option>
              <option value="combo">Combo</option>
              <option value="membership">Membership</option>
            </select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hội viên
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            Danh sách hội viên ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop/Table view */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Hội viên</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Gói</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Buổi</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Đánh giá</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Tiến độ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Mục tiêu</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Lần cuối</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {member.avatar}
                          </div>
                          {member.package === 'pt' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div> 
                          <div className="font-semibold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-600">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getPackageColor(member.package)}>{getPackageText(member.package)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(member.status)}>{getStatusText(member.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-blue-600 font-semibold">{member.totalSessions}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{member.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${member.progress}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-green-600">{member.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{getGoalText(member.goal)}</td>
                    <td className="px-4 py-3 text-gray-600">{member.lastSession}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm"><Phone className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list view */}
          <div className="md:hidden space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.avatar}
                      </div>
                      {member.package === 'pt' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-600">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><Phone className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gói</span>
                    <Badge className={getPackageColor(member.package)}>{getPackageText(member.package)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trạng thái</span>
                    <Badge className={getStatusColor(member.status)}>{getStatusText(member.status)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Buổi</span>
                    <span className="font-semibold text-blue-600">{member.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đánh giá</span>
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold"><Star className="w-4 h-4 fill-current" />{member.rating.toFixed(1)}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="text-green-600 font-semibold">{member.progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${member.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mục tiêu</span>
                    <span className="font-medium text-gray-900">{getGoalText(member.goal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lần cuối</span>
                    <span className="text-gray-600">{member.lastSession}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>
            <div className="text-sm text-gray-600">
              Trang 1 / 1
            </div>
            <Button variant="outline" size="sm">
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}