import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';
import { 
  Users, 
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Crown,
  Loader2,
  Calendar,
  Mail,
  Phone as PhoneIcon,
  Award
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTrainerMembers } from '../hooks/useTrainerMembers';
import { MemberDetailModal } from '../components/MemberDetailModal';
import { TrainerMember } from '../types/member.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSortableTable } from '../../../hooks/useSortableTable';

export function TrainerMemberManagementPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Fetch real data from API
  const { data, isLoading, error } = useTrainerMembers();
  const members = data?.members || [];

  // Apply filters
  const filteredMembers = members.filter((member: TrainerMember) => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || member.status === statusFilter;
    
    // Filter by package type based on active subscriptions
    const matchesPackage = !packageFilter || 
      member.activeSubscriptions?.some(sub => sub.type.toLowerCase() === packageFilter);
    
    // Filter by goal
    const matchesGoal = !goalFilter || member.healthInfo?.goal === goalFilter;
    
    return matchesSearch && matchesStatus && matchesPackage && matchesGoal;
  });

  // Add computed fields for sorting
  const membersWithComputedFields = filteredMembers.map(member => {
    // Calculate achievements
    const achievements = [];
    if (member.completedSessions >= 5) achievements.push('Hoàn thành 5 buổi');
    if (member.completedSessions >= 10) achievements.push('Hoàn thành 10 buổi');
    if (member.progress >= 50) achievements.push('Đạt 50% mục tiêu');
    if (member.progress >= 80) achievements.push('Đạt 80% mục tiêu');
    if (member.healthInfo?.goal === 'WeightLoss' && member.completedSessions >= 8) {
      achievements.push('Giảm cân thành công');
    }
    if (member.healthInfo?.goal === 'MuscleGain' && member.completedSessions >= 12) {
      achievements.push('Tăng cơ thành công');
    }
    
    return {
      ...member,
      primaryPackageType: member.activeSubscriptions?.[0]?.type || 'zzz',
      achievements,
    };
  });

  // Apply sorting
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: membersWithComputedFields,
    initialSort: { key: 'fullName', direction: 'asc' },
  });

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member._id));
    }
  };

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

  const getGoalText = (goal?: string) => {
    switch (goal) {
      case 'WeightLoss': return 'Giảm cân';
      case 'MuscleGain': return 'Tăng cơ';
      case 'Health': return 'Sức khỏe';
      default: return 'Chưa xác định';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải danh sách hội viên...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-red-600">
          Có lỗi xảy ra khi tải danh sách hội viên. Vui lòng thử lại sau.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Filters and Search */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-xl">Bộ lọc & Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-11 text-base sm:text-sm h-11 sm:h-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ kích hoạt</option>
                <option value="banned">Đã khóa</option>
            </select>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
                className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
            >
              <option value="">Tất cả gói tập</option>
              <option value="pt">PT cá nhân</option>
              <option value="combo">Combo</option>
              <option value="membership">Membership</option>
            </select>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
              >
                <option value="">Tất cả mục tiêu</option>
                <option value="WeightLoss">Giảm cân</option>
                <option value="MuscleGain">Tăng cơ</option>
                <option value="Health">Sức khỏe</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <span className="text-base sm:text-sm text-gray-600 font-medium">
                Đã chọn {selectedMembers.length} hội viên
              </span>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button variant="outline" size="sm" className="text-base sm:text-sm w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi thông báo
                </Button>
                <Button variant="outline" size="sm" className="text-base sm:text-sm w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Tạo lịch nhóm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center text-2xl sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
              <Users className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Danh sách hội viên ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop/Table view */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <NonSortableHeader>
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </NonSortableHeader>
                  <SortableTableHeader
                    label="Hội viên"
                    sortKey="fullName"
                    currentSortKey={getSortDirection('fullName') ? 'fullName' : ''}
                    sortDirection={getSortDirection('fullName')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Thông tin liên hệ"
                    sortKey="email"
                    currentSortKey={getSortDirection('email') ? 'email' : ''}
                    sortDirection={getSortDirection('email')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Gói tập"
                    sortKey="primaryPackageType"
                    currentSortKey={getSortDirection('primaryPackageType') ? 'primaryPackageType' : ''}
                    sortDirection={getSortDirection('primaryPackageType')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Trạng thái"
                    sortKey="status"
                    currentSortKey={getSortDirection('status') ? 'status' : ''}
                    sortDirection={getSortDirection('status')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Buổi tập"
                    sortKey="completedSessions"
                    currentSortKey={getSortDirection('completedSessions') ? 'completedSessions' : ''}
                    sortDirection={getSortDirection('completedSessions')}
                    onSort={requestSort}
                    align="center"
                  />
                  <SortableTableHeader
                    label="Tiến độ"
                    sortKey="progress"
                    currentSortKey={getSortDirection('progress') ? 'progress' : ''}
                    sortDirection={getSortDirection('progress')}
                    onSort={requestSort}
                    align="center"
                  />
                  <SortableTableHeader
                    label="Mục tiêu"
                    sortKey="healthInfo.goal"
                    currentSortKey={getSortDirection('healthInfo.goal') ? 'healthInfo.goal' : ''}
                    sortDirection={getSortDirection('healthInfo.goal')}
                    onSort={requestSort}
                  />
                  <SortableTableHeader
                    label="Thành tích"
                    sortKey="achievements.length"
                    currentSortKey={getSortDirection('achievements.length') ? 'achievements.length' : ''}
                    sortDirection={getSortDirection('achievements.length')}
                    onSort={requestSort}
                    align="center"
                  />
                  <SortableTableHeader
                    label="Lần cuối"
                    sortKey="lastSessionDate"
                    currentSortKey={getSortDirection('lastSessionDate') ? 'lastSessionDate' : ''}
                    sortDirection={getSortDirection('lastSessionDate')}
                    onSort={requestSort}
                  />
                  <NonSortableHeader label="Thao tác" />
                </tr>
              </thead>
              <tbody>
                {sortedData.map((member) => {
                  const primaryPackage = member.activeSubscriptions?.[0];
                  const hasVIPPackage = member.activeSubscriptions?.some(s => s.type === 'PT' || s.membershipType === 'VIP');
                  
                  return (
                    <tr key={member._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => handleSelectMember(member._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {member.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                            {hasVIPPackage && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                <Crown className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div> 
                            <div className="font-medium text-gray-900 text-sm">{member.fullName}</div>
                            <div className="text-xs text-gray-500">
                              {member.memberInfo?.membership_level === 'vip' ? (
                                <Badge className="bg-purple-100 text-purple-800 text-xs py-0 px-1">VIP</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-600 text-xs py-0 px-1">Basic</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <PhoneIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{member.phone}</span>
                        </div>
                      </div>
                    </td>
                      <td className="p-2">
                        {primaryPackage ? (
                          <div className="space-y-0.5">
                            <Badge className={`${getPackageColor(primaryPackage.type.toLowerCase())} text-xs`}>
                              {getPackageText(primaryPackage.type.toLowerCase())}
                            </Badge>
                            {(primaryPackage.type === 'PT' || primaryPackage.type === 'Combo') && (
                              <p className="text-xs text-gray-500">
                                {primaryPackage.ptsessionsRemaining || 0} buổi
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {format(new Date(primaryPackage.endDate), 'dd/MM/yyyy', { locale: vi })}
                            </p>
                      </div>
                        ) : (
                          <span className="text-xs text-red-600">Không có gói</span>
                        )}
                    </td>
                      <td className="p-2">
                        <Badge className={`${getStatusColor(member.status)} text-xs`}>
                          {getStatusText(member.status)}
                        </Badge>
                    </td>
                      <td className="p-2">
                        <div className="flex flex-col items-center gap-0.5 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Hoàn thành:</span>
                            <span className="text-blue-600 font-semibold">{member.completedSessions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Sắp tới:</span>
                            <span className="text-orange-600 font-semibold">{member.upcomingSessions}</span>
                          </div>
                      </div>
                    </td>
                      <td className="p-2">
                      <div className="flex flex-col items-center gap-1">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full" style={{ width: `${member.progress}%` }} />
                        </div>
                          <span className="text-xs font-semibold text-green-600">{member.progress}%</span>
                      </div>
                    </td>
                      <td className="p-2 text-gray-800 text-xs">{getGoalText(member.healthInfo?.goal)}</td>
                      <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                          <Award className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-semibold text-purple-700 text-sm">{member.achievements?.length || 0}</span>
                        </div>
                      </td>
                      <td className="p-2 text-xs text-gray-600">
                        {member.lastSessionDate
                          ? format(new Date(member.lastSessionDate), 'dd/MM/yyyy', { locale: vi })
                          : 'Chưa có'}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMember(member._id)}
                            title="Xem chi tiết"
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list view */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {sortedData.map((member) => {
              const primaryPackage = member.activeSubscriptions?.[0];
              const hasVIPPackage = member.activeSubscriptions?.some(s => s.type === 'PT' || s.membershipType === 'VIP');
              
              return (
                <div key={member._id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {member.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        {hasVIPPackage && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-lg mb-1 truncate">{member.fullName}</div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base text-gray-600 truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base text-gray-600">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMember(member._id)}
                      className="h-9 w-9 p-0 flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-base">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Gói tập</span>
                      <div className="text-right">
                        {primaryPackage ? (
                          <>
                            <Badge className={`${getPackageColor(primaryPackage.type.toLowerCase())} text-base`}>
                              {getPackageText(primaryPackage.type.toLowerCase())}
                            </Badge>
                            {(primaryPackage.type === 'PT' || primaryPackage.type === 'Combo') && (
                              <p className="text-base text-gray-500 mt-1">
                                {primaryPackage.ptsessionsRemaining || 0} buổi
                              </p>
                            )}
                          </>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 text-base">Chưa có</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Trạng thái</span>
                      <Badge className={`${getStatusColor(member.status)} text-base`}>{getStatusText(member.status)}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Hoàn thành</span>
                      <span className="font-bold text-blue-600 text-lg">{member.completedSessions}/{member.totalSessions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Sắp tới</span>
                      <span className="flex items-center gap-1.5 text-orange-600 font-bold text-lg">
                        <Calendar className="w-4 h-4" />
                        {member.upcomingSessions}
                      </span>
                    </div>
                    
                    <div className="py-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-600 font-semibold">Tiến độ</span>
                        <span className="text-green-600 font-bold text-lg">{member.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: `${member.progress}%` }} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Mục tiêu</span>
                      <span className="font-semibold text-gray-900 text-base">{getGoalText(member.healthInfo?.goal)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Thành tích</span>
                      <span className="flex items-center gap-1.5 text-purple-700 font-bold text-lg">
                        <Award className="w-4 h-4" />
                        {member.achievements?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600 font-semibold">Lần tập cuối</span>
                      <span className="text-gray-700 font-medium text-base">
                        {member.lastSessionDate
                          ? format(new Date(member.lastSessionDate), 'dd/MM/yyyy', { locale: vi })
                          : 'Chưa có'}
                      </span>
                    </div>
                  </div>
              </div>
              );
            })}
          </div>

          {/* Empty State */}
          {sortedData.length === 0 && (
            <div className="text-center py-10 sm:py-12">
              <Users className="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2 text-base sm:text-base">
                {searchTerm || statusFilter || packageFilter 
                  ? 'Không tìm thấy hội viên phù hợp'
                  : 'Chưa có hội viên nào'}
              </p>
              {(searchTerm || statusFilter || packageFilter || goalFilter) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setPackageFilter('');
                    setGoalFilter('');
                  }}
                  className="mt-2 text-sm"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {sortedData.length > 0 && (
            <div className="flex justify-between items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <Button variant="outline" size="sm" className="text-base sm:text-sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </Button>
              <div className="text-base sm:text-sm text-gray-600 text-center font-medium">
                Hiển thị {sortedData.length} hội viên
              </div>
              <Button variant="outline" size="sm" className="text-base sm:text-sm">
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          memberId={selectedMember}
          onClose={() => setSelectedMember(null)}
          onCreateSchedule={(memberId) => {
            // Navigate to create schedule page or open modal
            console.log('Create schedule for member:', memberId);
            // TODO: Implement create schedule functionality
          }}
        />
      )}
    </div>
  );
}