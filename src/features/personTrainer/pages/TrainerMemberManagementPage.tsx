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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng hội viên</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{enhancedMembers.length}</div>
            <p className="text-xs text-gray-500 mt-1">hội viên đang phụ trách</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hoạt động</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {enhancedMembers.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">hội viên đang tập</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tạm ngưng</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {enhancedMembers.filter(m => m.status === 'suspended').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">hội viên tạm ngưng</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Đánh giá TB</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {(enhancedMembers.reduce((sum, m) => sum + m.rating, 0) / enhancedMembers.length).toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">sao từ hội viên</p>
          </CardContent>
        </Card>
      </div>

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

      {/* Members Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {member.avatar}
                        </span>
                      </div>
                      {member.package === 'pt' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gói tập:</span>
                    <Badge className={getPackageColor(member.package)}>
                      {getPackageText(member.package)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge className={getStatusColor(member.status)}>
                      {getStatusText(member.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Buổi tập:</span>
                    <span className="text-sm font-semibold text-blue-600">{member.totalSessions}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Đánh giá:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-yellow-600">{member.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiến độ:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${member.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{member.progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mục tiêu:</span>
                    <span className="text-sm font-medium text-gray-900">{getGoalText(member.goal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tập lần cuối:</span>
                    <span className="text-sm text-gray-500">{member.lastSession}</span>
                  </div>
                </div>

                {member.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Ghi chú:</strong> {member.notes}
                    </p>
                  </div>
                )}
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