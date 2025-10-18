import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWithScrollLock } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  Clock,
  MapPin,
  Award,
  Phone,
  Mail,
  Dumbbell,
  Briefcase,
  Loader2
} from 'lucide-react';
import { StaffPTDetailModal, ModalCreateStaffPT } from '../components/staff-pt-management';
import { 
  useStaffTrainers,
  useUpdateStaffTrainer,
  useChangeStaffTrainerStatus,
  useBranches
} from '../hooks';
import { 
  StaffTrainerFormData,
  StaffTrainerUser,
  UpdateStaffTrainerRequest
} from '../types/staff-trainer.types';

export function AdminStaffPTManagement() {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'trainer' | 'staff' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending' | 'banned'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffTrainerUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffTrainerFormData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    cccd: '',
    role: 'trainer',
    status: 'active',
    specialty: '',
    experience_years: 0,
    certifications: [],
    working_hours: { start: '06:00', end: '22:00' },
    branch_id: '',
    position: '',
    permissions: [],
    managed_branches: []
  });

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
  const updateMutation = useUpdateStaffTrainer();
  const changeStatusMutation = useChangeStaffTrainerStatus();

  // Data from API
  console.log('📊 staffTrainersData:', staffTrainersData);
  const staffTrainers = Array.isArray(staffTrainersData?.data) 
    ? staffTrainersData.data 
    : [];
  const pagination = staffTrainersData?.pagination;
  console.log('👥 staffTrainers:', staffTrainers);
  console.log('📄 pagination:', pagination);

  const handleAddNew = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (user: StaffTrainerUser) => {
    const trainerInfo = user.role === 'trainer' ? user.trainerInfo : undefined;
    const staffInfo = user.role === 'staff' ? user.staffInfo : undefined;

    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      cccd: user.cccd,
      role: user.role,
      status: user.status,
      specialty: trainerInfo?.specialty || '',
      experience_years: trainerInfo?.experience_years || 0,
      certifications: trainerInfo?.certificate || [],
      working_hours: trainerInfo?.working_hour 
        ? { start: trainerInfo.working_hour[0] || '06:00', end: trainerInfo.working_hour[1] || '22:00' }
        : { start: '06:00', end: '22:00' },
      branch_id: staffInfo?.brand_id || '',
      position: staffInfo?.position || '',
      permissions: [],
      managed_branches: []
    });
    setEditingId(user._id);
    setShowEditForm(true);
  };

  const handleViewDetail = (user: StaffTrainerUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (formData.role === 'staff' && !formData.branch_id) {
      alert('Nhân viên phải chọn chi nhánh!');
      return;
    }

    try {
      // Update existing user
      const updateData: UpdateStaffTrainerRequest = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        cccd: formData.cccd,
      };

      if (formData.role === 'trainer') {
        updateData['trainerInfo.specialty'] = formData.specialty;
        updateData['trainerInfo.experience_years'] = formData.experience_years;
        updateData['trainerInfo.certificate'] = formData.certifications;
        updateData['trainerInfo.working_hour'] = [
          formData.working_hours?.start || '06:00',
          formData.working_hours?.end || '22:00'
        ];
      } else if (formData.role === 'staff') {
        updateData['staffInfo.brand_id'] = formData.branch_id;
        updateData['staffInfo.position'] = formData.position as 'manager' | 'receptionist' | 'staff';
      }

      await updateMutation.mutateAsync({
        userId: editingId!,
        data: updateData
      });
      
      setShowEditForm(false);
      setEditingId(null);
    } catch (error) {
      // Error handled by mutations
    }
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setEditingId(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhân viên & PT</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin nhân viên và huấn luyện viên</p>
        </div>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
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
                placeholder="Tìm kiếm theo tên, email, SĐT"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to page 1 when searching
                }}
                className="pl-10"
              />
            </div>
            
            <SelectWithScrollLock value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value as 'all' | 'trainer' | 'staff' | 'admin');
              setPage(1);
            }} lockScroll={true}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent lockScroll={true}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="trainer">PT</SelectItem>
                <SelectItem value="staff">Nhân viên</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </SelectWithScrollLock>

            <SelectWithScrollLock value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as 'all' | 'active' | 'inactive' | 'pending' | 'banned');
              setPage(1);
            }} lockScroll={true}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent lockScroll={true}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="banned">Bị khóa</SelectItem>
              </SelectContent>
            </SelectWithScrollLock>

            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form (inline) */}
      {showEditForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Chỉnh sửa thông tin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                {!editingId && (
                  <div>
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required={!editingId}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cccd">CCCD</Label>
                  <Input
                    id="cccd"
                    value={formData.cccd}
                    onChange={(e) => setFormData(prev => ({ ...prev, cccd: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <SelectWithScrollLock 
                    value={formData.gender} 
                    onValueChange={(value: 'male' | 'female' | 'other') => setFormData(prev => ({ ...prev, gender: value }))}
                    lockScroll={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </SelectWithScrollLock>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Vai trò *</Label>
                  <SelectWithScrollLock 
                    value={formData.role} 
                    onValueChange={(value: 'trainer' | 'staff' | 'admin') => setFormData(prev => ({ ...prev, role: value }))}
                    lockScroll={true}
                    disabled={!!editingId} // Không cho đổi role khi edit
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="trainer">PT</SelectItem>
                      <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </SelectWithScrollLock>
              <p className="text-xs text-gray-500 mt-1">Không thể thay đổi vai trò khi chỉnh sửa</p>
            </div>
          </div>

              {/* Role-specific Information */}
              {formData.role === 'trainer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                    Thông tin PT
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Chuyên môn</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                        placeholder="Yoga, Cardio, Strength Training..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="working_hours_start">Giờ làm việc bắt đầu</Label>
                      <Input
                        id="working_hours_start"
                        type="time"
                        value={formData.working_hours?.start}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          working_hours: { ...prev.working_hours!, start: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="working_hours_end">Giờ làm việc kết thúc</Label>
                      <Input
                        id="working_hours_end"
                        type="time"
                        value={formData.working_hours?.end}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          working_hours: { ...prev.working_hours!, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'staff' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Thông tin nhân viên
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch_id">Chi nhánh *</Label>
                      <SelectWithScrollLock 
                        value={formData.branch_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, branch_id: value }))}
                        lockScroll={true}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
                        <SelectContent lockScroll={true}>
                          {branches.map((branch) => (
                            <SelectItem key={branch._id} value={branch._id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectWithScrollLock>
                    </div>
                    <div>
                      <Label htmlFor="position">Vị trí</Label>
                      <SelectWithScrollLock 
                        value={formData.position} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                        lockScroll={true}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent lockScroll={true}>
                          <SelectItem value="manager">Quản lý</SelectItem>
                          <SelectItem value="receptionist">Lễ tân</SelectItem>
                          <SelectItem value="staff">Nhân viên</SelectItem>
                        </SelectContent>
                      </SelectWithScrollLock>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  Cập nhật
                </Button>
              </div>
            </form>
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
                      <th className="text-left p-3 font-medium text-gray-600">Thông tin</th>
                      <th className="text-left p-3 font-medium text-gray-600">Vai trò</th>
                      <th className="text-left p-3 font-medium text-gray-600">Chi nhánh</th>
                      <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                      <th className="text-left p-3 font-medium text-gray-600">Thông tin bổ sung</th>
                      <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffTrainers.map((user) => {
                      const trainerInfo = user.role === 'trainer' ? user.trainerInfo : undefined;
                      const staffInfo = user.role === 'staff' ? user.staffInfo : undefined;

                      return (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {staffTrainers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy nhân viên/PT nào</p>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.filteredRecords)} trong tổng số {pagination.filteredRecords} kết quả
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    >
                      «
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
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
                          className={page === pageNum ? 'bg-blue-600 text-white' : ''}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      ›
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={page === pagination.totalPages}
                    >
                      »
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <ModalCreateStaffPT
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Detail Modal */}
      {selectedUser && (
        <StaffPTDetailModal 
          user={selectedUser}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
