import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ModalCreateMember } from '../components/member-management/ModalCreateMember';
import { ModalDetailMember } from '../components/member-management/ModalDetailMember';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Mail,
  Phone,
  Calendar,
  Package,
  QrCode,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { User } from '../../../mockdata/users';
import { mockSubscriptions } from '../../../mockdata/subscriptions';
import { mockCheckIns } from '../../../mockdata/checkIns';
import { useMembers } from '../../member/hooks/useMembers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscriptions, useCheckIns } from '../hooks';


interface AdminMemberManagementProps {
  onCreateMember?: () => void;
  onViewMember?: (member: User) => void;
  onEditMember?: (member: User) => void;
  onDeleteMember?: (memberId: string) => void;
}

export function AdminMemberManagement({ 
  onCreateMember, 
  onViewMember, 
  onEditMember, 
  onDeleteMember 
}: AdminMemberManagementProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Filter members
  // const members = mockUsers.filter(user => user.role === 'Member');
  const {data: response, isLoading, isError} = useMembers();
  const members = response && 'success' in response && response.success ? response.data || [] : [];
  
  // Fetch subscriptions and check-ins
  const {data: subscriptionsResponse, isLoading: isLoadingSubscriptions} = useSubscriptions();
  const subscriptions = subscriptionsResponse && 'success' in subscriptionsResponse && subscriptionsResponse.success 
    ? subscriptionsResponse.data || [] 
    : mockSubscriptions; // Fallback to mock data if API fails
  
  const {data: checkInsResponse, isLoading: isLoadingCheckIns} = useCheckIns();
  const checkIns = checkInsResponse && 'success' in checkInsResponse && checkInsResponse.success 
    ? checkInsResponse.data || [] 
    : mockCheckIns; // Fallback to mock data if API fails
  
  console.log('members', members);
  console.log('subscriptions', subscriptions);
  console.log('checkIns', checkIns);

  if (isLoading || isLoadingSubscriptions || isLoadingCheckIns) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  if (isError || !response || !('success' in response) || !response.success) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      {response && 'message' in response ? response.message : 'Có lỗi xảy ra khi tải danh sách thành viên'}
    </div>;
  }
  const filteredMembers = members.filter((member: any) => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || member.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Support both snake_case (mock) and camelCase (API)
    const membershipLevel = member.memberInfo?.membership_level || member.member_info?.membership_level || 'basic';
    const matchesMembership = membershipFilter === 'all' || 
                             (membershipFilter === 'basic' && membershipLevel.toLowerCase() === 'basic') ||
                             (membershipFilter === 'vip' && membershipLevel.toLowerCase() === 'vip');

    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter((member: any) => member.status.toLowerCase() === 'active').length;
  const vipMembers = members.filter((member: any) => {
    const level = member.memberInfo?.membership_level || member.member_info?.membership_level || '';
    return level.toLowerCase() === 'vip';
  }).length;
  const hssvMembers = members.filter((member: any) => 
    member.memberInfo?.is_hssv || member.member_info?.is_hssv
  ).length;


  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter((id: string) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((member: any) => member._id));
    }
  };

  const handleViewMember = (member: User) => {
    onViewMember?.(member);
  };

  const handleEditMember = (member: User) => {
    onEditMember?.(member);
  };

  const handleDeleteMember = (memberId: string) => {
    onDeleteMember?.(memberId);
  };

  const getMemberStatus = (member: any) => {
    const activeSub = subscriptions.find((sub: any) => 
      sub.memberId === member._id && sub.status === 'Active'
    );
    
    if (!activeSub) return { status: 'Không có gói', color: 'bg-red-100 text-red-800' };
    
    const now = new Date();
    const endDate = new Date(activeSub.endDate);
    
    if (now > endDate) {
      return { status: 'Hết hạn', color: 'bg-red-100 text-red-800' };
    }
    
    if (activeSub.isSuspended) {
      return { status: 'Tạm ngưng', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { status: 'Đang hoạt động', color: 'bg-green-100 text-green-800' };
  };

  const getLastCheckIn = (memberId: string) => {
    const memberCheckIns = checkIns
      .filter((checkIn: any) => checkIn.memberId === memberId)
      .sort((a: any, b: any) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
    
    const lastCheckIn = memberCheckIns[0];
    
    return lastCheckIn ? new Date(lastCheckIn.checkInTime).toLocaleDateString('vi-VN') : 'Chưa có';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loại membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full" onClick={onCreateMember}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm hội viên
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedMembers.length} hội viên
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <UserX className="w-4 h-4 mr-2" />
                  Tạm ngưng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Danh sách hội viên ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 font-medium text-gray-600">Hội viên</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thông tin liên hệ</th>
                  <th className="text-left p-3 font-medium text-gray-600">Gói tập</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Lần check-in cuối</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member: any) => {
                  const memberStatus = getMemberStatus(member);
                  const activeSub = subscriptions.find((sub: any) => 
                    sub.memberId === member._id && sub.status === 'Active'
                  );
                  
                  return (
                    <tr key={member._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => handleSelectMember(member._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.fullName}</p>
                            <p className="text-sm text-gray-500">ID: {member.uid}</p>
                            {(member.memberInfo?.is_hssv || member.member_info?.is_hssv) && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">HSSV</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {activeSub ? (
                          <div className="space-y-1">
                            <Badge className="bg-blue-100 text-blue-800">
                              {activeSub.type || 'Membership'}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {activeSub.membershipType || member.memberInfo?.membership_level || 'Basic'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Hết hạn: {new Date(activeSub.endDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">Không có gói</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge className={memberStatus.color}>
                          {memberStatus.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          {getLastCheckIn(member._id)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewMember(member)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditMember(member)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="Mã QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMember(member._id)}
                            title="Xóa thành viên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

// Render modal outside of the main component to ensure it's above everything
export function AdminMemberManagementWithModal() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  
  return (
    <>
      <AdminMemberManagement 
        onCreateMember={() => setIsCreateModalOpen(true)}
        onViewMember={(member) => {
          setSelectedMember(member);
          setIsDetailModalOpen(true);
        }}
        onEditMember={(member) => {
          setSelectedMember(member);
          setIsDetailModalOpen(false);
          // TODO: Open edit modal
        }}
        onDeleteMember={(memberId) => {
          // TODO: Implement delete functionality
          console.log('Delete member:', memberId);
        }}
      />
      
      {/* Create Member Modal - Rendered at top level */}
      <ModalCreateMember
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh data or show success message
          console.log('Member created successfully');
        }}
      />

      {/* Detail Member Modal - Rendered at top level */}
      <ModalDetailMember
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onEdit={(member) => {
          setIsDetailModalOpen(false);
          setSelectedMember(null);
          // TODO: Open edit modal
        }}
        onDelete={(memberId) => {
          // TODO: Implement delete functionality
          console.log('Delete member:', memberId);
        }}
      />
    </>
  );
}
