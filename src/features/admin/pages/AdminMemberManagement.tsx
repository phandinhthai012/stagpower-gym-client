import React, { useState, useEffect } from 'react';
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
import { useSubscriptions, useCheckIns, useMembersWithPagination } from '../hooks';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';
import { exportSelectedMembersToExcel } from '../../../lib/excel-utils';
import { useSuspendSubscription } from '../../member/hooks/useSubscriptions';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Label } from '../../../components/ui/label';
import { toast } from 'sonner';


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
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendStartDate, setSuspendStartDate] = useState('');
  const [suspendEndDate, setSuspendEndDate] = useState('');
  const [suspendError, setSuspendError] = useState('');

  // Fetch members with pagination
  const { data: membersData, isLoading, isError } = useMembersWithPagination({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    membership_level: membershipFilter !== 'all' ? membershipFilter : undefined,
  });

  const members = membersData?.data || [];
  const pagination = membersData?.pagination;
  
  // Fetch subscriptions and check-ins
  const {data: subscriptionsResponse, isLoading: isLoadingSubscriptions} = useSubscriptions();
  const subscriptions = subscriptionsResponse && 'success' in subscriptionsResponse && subscriptionsResponse.success 
    ? subscriptionsResponse.data || [] 
    : mockSubscriptions; // Fallback to mock data if API fails
  
  const {data: checkInsResponse, isLoading: isLoadingCheckIns} = useCheckIns();
  const checkIns = checkInsResponse && 'success' in checkInsResponse && checkInsResponse.success 
    ? checkInsResponse.data || [] 
    : mockCheckIns; // Fallback to mock data if API fails

  // Suspend subscription mutation
  const suspendSubscriptionMutation = useSuspendSubscription();
  
  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, membershipFilter]);

  // Track dropdown open state to prevent unnecessary scroll unlock
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Define getMemberStatus before using it
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

  // Prevent scroll lock when dropdowns are open (only when dropdown is actually open)
  useEffect(() => {
    if (!isDropdownOpen) return;

    let rafId: number;
    let lastCheck = 0;
    const preventScrollLock = () => {
      const now = Date.now();
      // Throttle to prevent flickering - only check every 100ms
      if (now - lastCheck < 100) {
        if (isDropdownOpen) {
          rafId = requestAnimationFrame(preventScrollLock);
        }
        return;
      }
      lastCheck = now;

      // Check if body has fixed position (indicating scroll lock)
      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        // Remove data-scroll-locked attribute if present
        document.body.removeAttribute('data-scroll-locked');
        if (scrollY) {
          const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
          window.scrollTo(0, y);
        }
      }
      // Also check for data-scroll-locked attribute
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }

      // Continue checking only if dropdown is still open
      if (isDropdownOpen) {
        rafId = requestAnimationFrame(preventScrollLock);
      }
    };

    // Start checking
    rafId = requestAnimationFrame(preventScrollLock);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDropdownOpen]);

  // Add computed status field for sorting
  const membersWithComputedStatus = members.map((member: any) => {
    const memberStatus = getMemberStatus(member);
    return {
      ...member,
      computedStatus: memberStatus.status, // Add computed status for sorting
    };
  });

  // Sort members - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: membersWithComputedStatus,
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

  if (isError) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      Có lỗi xảy ra khi tải danh sách thành viên
    </div>;
  }

  // Calculate statistics from pagination
  const totalMembers = pagination?.total || 0;
  // Note: Statistics are calculated from all data, not just current page
  // For accurate stats, we'd need a separate API endpoint
  const activeMembers = members.filter((member: any) => member.status?.toLowerCase() === 'active').length;
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMembershipFilter('all');
    setPage(1);
  };

  const handleExportSelected = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hội viên để xuất dữ liệu');
      return;
    }

    try {
      toast.loading('Đang tải dữ liệu...', { id: 'export-loading' });
      
      // Fetch tất cả members (không filter) để lấy được tất cả members đã chọn từ mọi trang
      const { userApi } = await import('../../member/api/user.api');
      
      // Fetch tất cả members với limit lớn, không filter để lấy tất cả
      let allMembers: any[] = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await userApi.getMembersWithPagination({
          page: currentPage,
          limit: 100, // Fetch từng batch 100
        });
        
        const pageMembers = response?.data || [];
        allMembers.push(...pageMembers);
        
        const totalPages = response?.pagination?.totalPages || 1;
        hasMore = currentPage < totalPages;
        currentPage++;
      }
      
      // Filter chỉ lấy các members đã chọn
      const selectedMembersData = allMembers.filter((member: any) => 
        selectedMembers.includes(member._id)
      );

      if (selectedMembersData.length === 0) {
        toast.error('Không tìm thấy dữ liệu của các hội viên đã chọn', { id: 'export-loading' });
        return;
      }

      toast.success(`Đã tải ${selectedMembersData.length} hội viên, đang xuất file...`, { id: 'export-loading' });
      
      exportSelectedMembersToExcel({
        members: selectedMembersData,
        subscriptions,
        checkIns,
        payments: [], // You may want to fetch payments if needed
      });

      toast.success(`Đã xuất dữ liệu của ${selectedMembersData.length} hội viên thành công!`, { id: 'export-loading' });
    } catch (error) {
      console.error('Error exporting selected members:', error);
      toast.error('Có lỗi xảy ra khi xuất dữ liệu', { id: 'export-loading' });
    }
  };

  const handleSuspendClick = () => {
    // Set default dates (today to 30 days from now)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    setSuspendStartDate(today.toISOString().split('T')[0]);
    setSuspendEndDate(endDate.toISOString().split('T')[0]);
    setSuspendReason('');
    setSuspendError('');
    setShowSuspendDialog(true);
  };

  const handleConfirmSuspend = async () => {
    // Clear previous error
    setSuspendError('');

    if (!suspendReason.trim()) {
      setSuspendError('Vui lòng nhập lý do tạm ngưng');
      return;
    }

    if (!suspendStartDate || !suspendEndDate) {
      setSuspendError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    const selectedMembersData = sortedData.filter((member: any) => 
      selectedMembers.includes(member._id)
    );

    // Find active subscriptions for selected members
    const membersToSuspend: Array<{ memberId: string; subscriptionId: string }> = [];
    
    selectedMembersData.forEach((member: any) => {
      const activeSub = subscriptions.find((sub: any) => {
        const subMemberId = sub.memberId?._id || sub.memberId;
        const memberId = member._id || member.id;
        return String(subMemberId) === String(memberId) && sub.status === 'Active';
      });

      if (activeSub) {
        membersToSuspend.push({
          memberId: member._id,
          subscriptionId: activeSub._id || activeSub.id,
        });
      }
    });

    if (membersToSuspend.length === 0) {
      setSuspendError('Không tìm thấy gói tập đang hoạt động nào để tạm ngưng');
      return;
    }

    // Suspend all subscriptions
    try {
      const suspendPromises = membersToSuspend.map(({ subscriptionId }) =>
        suspendSubscriptionMutation.mutateAsync({
          subscriptionId,
          data: {
            startDate: suspendStartDate,
            endDate: suspendEndDate,
            reason: suspendReason,
          },
        })
      );

      await Promise.all(suspendPromises);
      
      toast.success(`Đã tạm ngưng ${membersToSuspend.length} gói tập thành công!`);
      setShowSuspendDialog(false);
      setSelectedMembers([]);
      setSuspendReason('');
    } catch (error) {
      console.error('Error suspending subscriptions:', error);
      // Error is already handled by mutation
    }
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-[20%]">
              <Select 
                value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                // Prevent scroll lock when dropdown opens/closes
                // Use requestAnimationFrame to ensure this runs after Radix UI's scroll lock
                requestAnimationFrame(() => {
                  // Restore scroll styles to prevent lock
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    // Remove data-scroll-locked attribute if present
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
              >
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
            </div>

            <div className="w-full md:w-[20%]">
              <Select 
                value={membershipFilter} 
              onValueChange={(value) => {
                setMembershipFilter(value);
                setPage(1);
              }}
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                // Prevent scroll lock when dropdown opens/closes
                // Use requestAnimationFrame to ensure this runs after Radix UI's scroll lock
                requestAnimationFrame(() => {
                  // Restore scroll styles to prevent lock
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    // Remove data-scroll-locked attribute if present
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Loại membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleResetFilters} className="w-full md:w-auto">
              Đặt lại
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
                <Button variant="outline" size="sm" onClick={handleExportSelected}>
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={handleSuspendClick}
                  disabled={suspendSubscriptionMutation.isPending}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Tạm ngưng
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Danh sách hội viên ({pagination?.filteredRecords || members.length})
            </CardTitle>
            <Button onClick={onCreateMember} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hội viên
            </Button>
          </div>
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
                    sortKey="computedStatus"
                    currentSortKey={getSortDirection('computedStatus') ? 'computedStatus' : ''}
                    sortDirection={getSortDirection('computedStatus')}
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

          {/* Pagination */}
          {pagination && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {pagination.totalPages > 1 
                    ? `Hiển thị ${((page - 1) * limit) + 1} - ${Math.min(page * limit, pagination.filteredRecords)} trong tổng số ${pagination.filteredRecords} kết quả`
                    : `Hiển thị ${pagination.filteredRecords} kết quả`
                  }
                </span>
              </div>
              {pagination.totalPages > 1 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1 || isLoading}
                    title="Trang đầu"
                  >
                    «
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    title="Trang trước"
                  >
                    ‹
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={isLoading}
                        className={page === pageNum ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages || isLoading}
                    title="Trang sau"
                  >
                    ›
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(pagination.totalPages)}
                    disabled={page === pagination.totalPages || isLoading}
                    title="Trang cuối"
                  >
                    »
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Tạm ngưng gói tập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn tạm ngưng gói tập của {selectedMembers.length} hội viên được chọn?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-start-date">Ngày bắt đầu tạm ngưng</Label>
              <Input
                id="suspend-start-date"
                type="date"
                value={suspendStartDate}
                onChange={(e) => setSuspendStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspend-end-date">Ngày kết thúc tạm ngưng</Label>
              <Input
                id="suspend-end-date"
                type="date"
                value={suspendEndDate}
                onChange={(e) => setSuspendEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">
                Lý do tạm ngưng {suspendError ? (
                  <span className="text-red-600 text-sm">{suspendError}</span>
                ) : (
                  <span className="text-red-600">*</span>
                )}
              </Label>
              <Input
                id="suspend-reason"
                placeholder="Nhập lý do tạm ngưng..."
                value={suspendReason}
                onChange={(e) => {
                  setSuspendReason(e.target.value);
                  if (suspendError) setSuspendError(''); // Clear error when user types
                }}
                className={suspendError ? 'border-red-500' : ''}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSuspend}
              disabled={suspendSubscriptionMutation.isPending}
              className="text-white bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              {suspendSubscriptionMutation.isPending ? 'Đang xử lý...' : 'Xác nhận tạm ngưng'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
