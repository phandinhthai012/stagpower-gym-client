import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ModalCreateMember } from '../components/member-management/ModalCreateMember';
import { ModalDetailMember } from '../components/member-management/ModalDetailMember';
import { ModalEditMember } from '../components/member-management/ModalEditMember';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Download,
  Mail,
  Phone,
  Calendar,
  Package,
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
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';


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
  
  // Filter members
  const filteredMembers = React.useMemo(() => {
    return members.filter((member: any) => {
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
  }, [members, searchTerm, statusFilter, membershipFilter]);

  // Sort members - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: filteredMembers,
    initialSort: { key: 'fullName', direction: 'asc' }
  });

  // Debug: Check subscription data
  React.useEffect(() => {
    if (subscriptions.length > 0) {
      console.log('Subscriptions loaded:', subscriptions.length);
      console.log('First subscription:', subscriptions[0]);
      console.log('Package populated?', subscriptions[0]?.packageId);
    }
  }, [subscriptions]);

  if (isLoading || isLoadingSubscriptions || isLoadingCheckIns) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  if (isError || !response || !('success' in response) || !response.success) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      {response && 'message' in response ? response.message : 'Có lỗi xảy ra khi tải danh sách thành viên'}
    </div>;
  }

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
    if (selectedMembers.length === sortedData.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(sortedData.map((member: any) => member._id));
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
    const activeSub = subscriptions.find((sub: any) => {
      // Handle both ObjectId and string comparison
      const subMemberId = sub.memberId?._id || sub.memberId;
      const memberId = member._id;
      return String(subMemberId) === String(memberId) && sub.status === 'Active';
    });
    
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
      .filter((checkIn: any) => {
        const checkInMemberId = checkIn.memberId?._id || checkIn.memberId;
        return String(checkInMemberId) === String(memberId);
      })
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
                  <NonSortableHeader className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === sortedData.length && sortedData.length > 0}
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
                    align="left"
                  />
                  <SortableTableHeader
                    label="Thông tin liên hệ"
                    sortKey="email"
                    currentSortKey={getSortDirection('email') ? 'email' : ''}
                    sortDirection={getSortDirection('email')}
                    onSort={requestSort}
                    align="left"
                  />
                  <NonSortableHeader label="Gói tập" align="left" className="p-3" />
                  <SortableTableHeader
                    label="Trạng thái"
                    sortKey="status"
                    currentSortKey={getSortDirection('status') ? 'status' : ''}
                    sortDirection={getSortDirection('status')}
                    onSort={requestSort}
                    align="left"
                    className="p-3"
                  />
                  <NonSortableHeader label="Lần check-in cuối" align="left" className="p-3" />
                  <NonSortableHeader label="Thao tác" align="left" className="p-3" />
                </tr>
              </thead>
              <tbody>
                {sortedData.map((member: any) => {
                  const memberStatus = getMemberStatus(member);
                  const activeSub = subscriptions.find((sub: any) => {
                    const subMemberId = sub.memberId?._id || sub.memberId;
                    return String(subMemberId) === String(member._id) && sub.status === 'Active';
                  });
                  
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
                            <p className="text-sm font-medium text-gray-900">
                              {activeSub.packageId?.name || 'Gói tập'}
                            </p>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {activeSub.type || 'Membership'}
                            </Badge>
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  
  const handleOpenEditModal = (member: User) => {
    setSelectedMember(member);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };
  
  return (
    <>
      <AdminMemberManagement 
        onCreateMember={() => setIsCreateModalOpen(true)}
        onViewMember={(member) => {
          setSelectedMember(member);
          setIsDetailModalOpen(true);
        }}
        onEditMember={handleOpenEditModal}
        onDeleteMember={(memberId) => {
          // TODO: Implement delete functionality
          console.log('Delete member:', memberId);
        }}
      />
      
      {/* Create Member Modal */}
      <ModalCreateMember
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          console.log('Member created successfully');
        }}
      />

      {/* Detail Member Modal */}
      <ModalDetailMember
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onEdit={handleOpenEditModal}
        onDelete={(memberId) => {
          // TODO: Implement delete functionality
          console.log('Delete member:', memberId);
        }}
      />

      {/* Edit Member Modal */}
      <ModalEditMember
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember as any}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
      />
    </>
  );
}
