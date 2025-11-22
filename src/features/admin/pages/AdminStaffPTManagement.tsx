import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  MapPin,
  Award,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { StaffPTDetailModal, ModalCreateStaffPT, ModalEditStaffPT } from '../components/staff-pt-management';
import { 
  useStaffTrainers,
  useChangeStaffTrainerStatus,
  useBranches
} from '../hooks';
import { 
  StaffTrainerUser
} from '../types/staff-trainer.types';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';
import { useAuth } from '../../../contexts/AuthContext';

export function AdminStaffPTManagement() {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'trainer' | 'staff' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending' | 'banned'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffTrainerUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Check if current user is staff (limited permissions)
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const isAdmin = user?.role === 'admin';

  // Fetch data
  const { data: staffTrainersData, isLoading } = useStaffTrainers({
    page,
    limit,
    search: searchTerm,
    role: roleFilter === 'all' ? '' : roleFilter,
    status: statusFilter === 'all' ? '' : statusFilter,
  });

  const { data: branchesData } = useBranches();
  const branches = branchesData || [];

  // Mutations
  const changeStatusMutation = useChangeStaffTrainerStatus();

  // Data from API
  console.log('📊 staffTrainersData:', staffTrainersData);
  const staffTrainers = Array.isArray(staffTrainersData?.data) 
    ? staffTrainersData.data 
    : [];
  const pagination = staffTrainersData?.pagination;
  console.log('👥 staffTrainers:', staffTrainers);
  console.log('📄 pagination:', pagination);

  // Sort staff trainers - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: staffTrainers,
    initialSort: { key: 'fullName', direction: 'asc' }
  });

  // Reset selected users when page changes
  React.useEffect(() => {
    setSelectedUsers([]);
  }, [page]);

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

  // Reset selected users when sort changes
  const handleSort = (key: string) => {
    setSelectedUsers([]);
    requestSort(key);
  };

  const handleAddNew = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (user: StaffTrainerUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewDetail = (user: StaffTrainerUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEditFromDetail = () => {
    // Đóng modal detail và mở modal edit
    setShowDetailModal(false);
    setShowEditModal(true);
    // selectedUser đã được set rồi, giữ nguyên
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa nhân viên/PT này?')) {
      try {
        await changeStatusMutation.mutateAsync({
          userId,
          status: 'inactive'
        });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa xác định</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'trainer':
        return <Badge className="bg-orange-100 text-orange-800">PT</Badge>;
      case 'staff':
        return <Badge className="bg-blue-100 text-blue-800">Nhân viên</Badge>;
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b._id === branchId)?.name || 'Chưa chọn';
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === sortedData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedData.map((user: StaffTrainerUser) => user._id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhân viên & PT</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin nhân viên và huấn luyện viên</p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        )}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email, SĐT"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to page 1 when searching
                }}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-[20%]">
              <Select 
                value={roleFilter} 
                onValueChange={(value) => {
                  setRoleFilter(value as 'all' | 'trainer' | 'staff' | 'admin');
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
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="trainer">PT</SelectItem>
                  <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[20%]">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value as 'all' | 'active' | 'inactive' | 'pending' | 'banned');
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
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="banned">Bị khóa</SelectItem>
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
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedUsers.length} nhân viên/PT
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vô hiệu hóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff/PT List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Danh sách nhân viên & PT ({pagination?.filteredRecords || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <NonSortableHeader className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === sortedData.length && sortedData.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </NonSortableHeader>
                      <SortableTableHeader
                        label="Thông tin"
                        sortKey="fullName"
                        currentSortKey={getSortDirection('fullName') ? 'fullName' : ''}
                        sortDirection={getSortDirection('fullName')}
                        onSort={handleSort}
                        align="left"
                        className="p-3"
                      />
                      <SortableTableHeader
                        label="Vai trò"
                        sortKey="role"
                        currentSortKey={getSortDirection('role') ? 'role' : ''}
                        sortDirection={getSortDirection('role')}
                        onSort={handleSort}
                        align="left"
                        className="p-3"
                      />
                      <NonSortableHeader label="Chi nhánh" align="left" className="p-3" />
                      <SortableTableHeader
                        label="Trạng thái"
                        sortKey="status"
                        currentSortKey={getSortDirection('status') ? 'status' : ''}
                        sortDirection={getSortDirection('status')}
                        onSort={handleSort}
                        align="left"
                        className="p-3"
                      />
                      <NonSortableHeader label="Thông tin bổ sung" align="left" className="p-3" />
                      <NonSortableHeader label="Thao tác" align="left" className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((user) => {
                      const trainerInfo = user.role === 'trainer' ? user.trainerInfo : undefined;
                      const staffInfo = user.role === 'staff' ? user.staffInfo : undefined;

                      return (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleSelectUser(user._id)}
                              className="rounded"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  {user.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="p-3">
                            {user.role === 'staff' && staffInfo?.brand_id ? (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {getBranchName(staffInfo.brand_id)}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <MapPin className="w-3 h-3" />
                                Tất cả chi nhánh
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="p-3">
                            {user.role === 'trainer' && trainerInfo ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Award className="w-3 h-3" />
                                  {trainerInfo.experience_years || 0} năm kinh nghiệm
                                </div>
                                {trainerInfo.working_hour && trainerInfo.working_hour.length >= 2 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock className="w-3 h-3" />
                                    {trainerInfo.working_hour[0]} - {trainerInfo.working_hour[1]}
                                  </div>
                                )}
                                {trainerInfo.specialty && (
                                  <div className="text-xs text-gray-600">
                                    Chuyên môn: {trainerInfo.specialty}
                                  </div>
                                )}
                              </div>
                            ) : staffInfo ? (
                              <div className="text-sm text-gray-600">
                                {staffInfo.position || 'Nhân viên'}
                              </div>
                            ) : null}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewDetail(user)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleDelete(user._id)}
                                    className="text-red-600 hover:text-red-700"
                                    disabled={changeStatusMutation.isPending}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {sortedData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy nhân viên/PT nào</p>
                </div>
              )}

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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {/* Create Modal */}
      <ModalCreateStaffPT
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Edit Modal */}
      <ModalEditStaffPT
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Detail Modal */}
      <StaffPTDetailModal 
        user={selectedUser}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        onEdit={handleEditFromDetail}
      />
    </div>
  );
}
