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
  Calendar,
  Clock,
  MapPin,
  Award,
  Phone,
  Mail,
  User,
  Dumbbell,
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockUsers, mockBranches } from '../../../mockdata';
import { StaffPTDetailModal } from '../components/StaffPTDetailModal';

interface StaffPTFormData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  cccd: string;
  role: 'Trainer' | 'Staff';
  status: 'Active' | 'Inactive' | 'Suspended';
  // Trainer specific
  specialty?: string[];
  experience_years?: number;
  certifications?: string[];
  working_hours?: {
    start: string;
    end: string;
  };
  // Staff specific
  branch_id?: string;
  position?: string;
  // Admin specific
  permissions?: string[];
  managed_branches?: string[];
}

export function AdminStaffPTManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffPTFormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    date_of_birth: '',
    cccd: '',
    role: 'Trainer',
    status: 'Active',
    specialty: [],
    experience_years: 0,
    certifications: [],
    working_hours: { start: '06:00', end: '22:00' },
    branch_id: '',
    position: '',
    permissions: [],
    managed_branches: []
  });

  // Get staff and trainers from mockdata
  const staffAndTrainers = mockUsers.filter(user => user.role === 'Trainer' || user.role === 'Staff');
  
  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return staffAndTrainers.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffAndTrainers, searchTerm, roleFilter, statusFilter]);

  const handleAddNew = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      date_of_birth: '',
      cccd: '',
      role: 'Trainer',
      status: 'Active',
      specialty: [],
      experience_years: 0,
      certifications: [],
      working_hours: { start: '06:00', end: '22:00' },
      branch_id: '',
      position: '',
      permissions: [],
      managed_branches: []
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (user: any) => {
    setFormData({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      cccd: user.cccd,
      role: user.role,
      status: user.status,
      specialty: user.trainer_info?.specialty || [],
      experience_years: user.trainer_info?.experience_years || 0,
      certifications: user.trainer_info?.certifications || [],
      working_hours: user.trainer_info?.working_hours || { start: '06:00', end: '22:00' },
      branch_id: user.staff_info?.branch_id || '',
      position: user.staff_info?.position || '',
      permissions: user.admin_info?.permissions || [],
      managed_branches: user.admin_info?.managed_branches || []
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleViewDetail = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên/PT này?')) {
      // In real app, call API to delete
      alert('Đã xóa thành công!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (formData.role === 'Staff' && !formData.branch_id) {
      alert('Nhân viên phải chọn chi nhánh!');
      return;
    }

    // In real app, call API to save
    if (editingId) {
      alert('Đã cập nhật thành công!');
    } else {
      alert('Đã thêm mới thành công!');
    }
    
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'Suspended':
        return <Badge className="bg-red-100 text-red-800">Tạm ngưng</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Chưa xác định</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Trainer':
        return <Badge className="bg-orange-100 text-orange-800">PT</Badge>;
      case 'Staff':
        return <Badge className="bg-blue-100 text-blue-800">Nhân viên</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getBranchName = (branchId: string) => {
    return mockBranches.find(b => b.id === branchId)?.name || 'Chưa chọn';
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <SelectWithScrollLock value={roleFilter} onValueChange={setRoleFilter} lockScroll={true}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent lockScroll={true}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Trainer">PT</SelectItem>
                <SelectItem value="Staff">Nhân viên</SelectItem>
              </SelectContent>
            </SelectWithScrollLock>

            <SelectWithScrollLock value={statusFilter} onValueChange={setStatusFilter} lockScroll={true}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent lockScroll={true}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Không hoạt động</SelectItem>
                <SelectItem value="Suspended">Tạm ngưng</SelectItem>
              </SelectContent>
            </SelectWithScrollLock>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}>
              Đặt lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              {editingId ? 'Chỉnh sửa thông tin' : 'Thêm nhân viên/PT mới'}
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
                    onValueChange={(value: 'Male' | 'Female' | 'Other') => setFormData(prev => ({ ...prev, gender: value }))}
                    lockScroll={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </SelectWithScrollLock>
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Ngày sinh</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Vai trò *</Label>
                  <SelectWithScrollLock 
                    value={formData.role} 
                    onValueChange={(value: 'Trainer' | 'Staff') => setFormData(prev => ({ ...prev, role: value }))}
                    lockScroll={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="Trainer">PT</SelectItem>
                      <SelectItem value="Staff">Nhân viên</SelectItem>
                    </SelectContent>
                  </SelectWithScrollLock>
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <SelectWithScrollLock 
                    value={formData.status} 
                    onValueChange={(value: 'Active' | 'Inactive' | 'Suspended') => setFormData(prev => ({ ...prev, status: value }))}
                    lockScroll={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="Active">Hoạt động</SelectItem>
                      <SelectItem value="Inactive">Không hoạt động</SelectItem>
                      <SelectItem value="Suspended">Tạm ngưng</SelectItem>
                    </SelectContent>
                  </SelectWithScrollLock>
                </div>
              </div>

              {/* Role-specific Information */}
              {formData.role === 'Trainer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                    Thông tin PT
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {formData.role === 'Staff' && (
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
                          {mockBranches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectWithScrollLock>
                    </div>
                    <div>
                      <Label htmlFor="position">Vị trí</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Ví dụ: Lễ tân, Quản lý chi nhánh"
                      />
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
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
            Danh sách nhân viên & PT ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {filteredData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
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
                      {user.role === 'Staff' ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {getBranchName(user.staff_info?.branch_id || '')}
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
                      {user.role === 'Trainer' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Award className="w-3 h-3" />
                            {user.trainer_info?.experience_years || 0} năm kinh nghiệm
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {user.trainer_info?.working_hours?.start} - {user.trainer_info?.working_hours?.end}
                          </div>
                          {user.trainer_info?.specialty && user.trainer_info.specialty.length > 0 && (
                            <div className="text-xs text-gray-600">
                              Chuyên môn: {user.trainer_info.specialty.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {user.staff_info?.position || 'Nhân viên'}
                        </div>
                      )}
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
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy nhân viên/PT nào</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Hiển thị {filteredData.length} kết quả</span>
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

      {/* Detail Modal */}
      <StaffPTDetailModal 
        user={selectedUser}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}