import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Building2, 
  Plus, 
  Download, 
  BarChart3, 
  Map, 
  Edit, 
  Eye, 
  Users, 
  Pause, 
  Play, 
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  PauseCircle,
  MapPin,
  Phone,
  Clock,
  User
} from 'lucide-react';
import { mockBranches } from '../../../mockdata/branches';

export function AdminBranchManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    openingHours: '',
    description: '',
    status: 'Active'
  });

  // Calculate statistics from mock data
  const totalBranches = mockBranches.length;
  const activeBranches = mockBranches.filter(branch => branch.status === 'Active').length;
  const maintenanceBranches = mockBranches.filter(branch => branch.status === 'Maintenance').length;
  const totalStaff = mockBranches.reduce((sum, branch) => sum + (branch.staff_count || 0), 0);
  const totalMembers = mockBranches.reduce((sum, branch) => sum + (branch.member_count || 0), 0);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'Maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Bảo trì</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800">Tạm dừng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const handleAddBranch = () => {
    setShowAddModal(true);
  };

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleViewBranchDetails = (branch: any) => {
    alert(`Xem chi tiết chi nhánh: ${branch.name}`);
  };

  const handleManageStaff = (branch: any) => {
    alert(`Quản lý nhân viên chi nhánh: ${branch.name}`);
  };

  const handleDeactivateBranch = (branch: any) => {
    if (confirm(`Bạn có chắc muốn tạm dừng chi nhánh ${branch.name}?`)) {
      alert(`Đã tạm dừng chi nhánh: ${branch.name}`);
    }
  };

  const handleActivateBranch = (branch: any) => {
    if (confirm(`Bạn có chắc muốn mở lại chi nhánh ${branch.name}?`)) {
      alert(`Đã mở lại chi nhánh: ${branch.name}`);
    }
  };

  const handleExportData = () => {
    alert('Đang xuất dữ liệu chi nhánh...');
  };

  const handleShowReport = () => {
    alert('Đang tạo báo cáo chi nhánh...');
  };

  const handleShowMap = () => {
    alert('Đang mở bản đồ chi nhánh...');
  };

  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm chi nhánh mới thành công!');
    setShowAddModal(false);
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      openingHours: '',
      description: '',
      status: 'Active'
    });
  };

  const handleEditBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật thông tin chi nhánh thành công!');
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddBranch}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm chi nhánh mới
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Xuất dữ liệu
            </Button>
            <Button variant="outline" onClick={handleShowReport}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Báo cáo chi nhánh
            </Button>
            <Button variant="outline" onClick={handleShowMap}>
              <Map className="w-4 h-4 mr-2" />
              Xem bản đồ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm chi nhánh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Active">Đang hoạt động</SelectItem>
                <SelectItem value="Maintenance">Bảo trì</SelectItem>
                <SelectItem value="Inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Áp dụng bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockBranches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{branch.name}</h3>
                    <p className="text-sm text-gray-600">{branch.description}</p>
                  </div>
                </div>
                {getStatusBadge(branch.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {branch.status === 'Maintenance' ? 'Tạm đóng' : branch.opening_hours}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{branch.staff_count || 0} nhân viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{branch.member_count || 0} hội viên</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBranch(branch)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewBranchDetails(branch)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Chi tiết
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManageStaff(branch)}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Nhân viên
                </Button>
                {branch.status === 'Active' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeactivateBranch(branch)}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Tạm dừng
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleActivateBranch(branch)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Mở lại
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thêm Chi Nhánh Mới</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBranchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchName">Tên chi nhánh</Label>
                    <Input
                      id="branchName"
                      value={newBranch.name}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nhập tên chi nhánh..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="branchStatus">Trạng thái</Label>
                    <Select 
                      value={newBranch.status} 
                      onValueChange={(value) => setNewBranch(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Đang hoạt động</SelectItem>
                        <SelectItem value="Maintenance">Bảo trì</SelectItem>
                        <SelectItem value="Inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="branchAddress">Địa chỉ</Label>
                  <Input
                    id="branchAddress"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Nhập địa chỉ chi nhánh..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchPhone">Số điện thoại</Label>
                    <Input
                      id="branchPhone"
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="branchHours">Giờ mở cửa</Label>
                    <Input
                      id="branchHours"
                      value={newBranch.openingHours}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, openingHours: e.target.value }))}
                      placeholder="VD: 06:00 - 23:00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="branchDescription">Mô tả</Label>
                  <textarea
                    id="branchDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Nhập mô tả chi nhánh..."
                    value={newBranch.description}
                    onChange={(e) => setNewBranch(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chi nhánh
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chỉnh Sửa Chi Nhánh</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditBranchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editBranchName">Tên chi nhánh</Label>
                    <Input
                      id="editBranchName"
                      defaultValue={selectedBranch.name}
                      placeholder="Nhập tên chi nhánh..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editBranchStatus">Trạng thái</Label>
                    <Select defaultValue={selectedBranch.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Đang hoạt động</SelectItem>
                        <SelectItem value="Maintenance">Bảo trì</SelectItem>
                        <SelectItem value="Inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editBranchAddress">Địa chỉ</Label>
                  <Input
                    id="editBranchAddress"
                    defaultValue={selectedBranch.address}
                    placeholder="Nhập địa chỉ chi nhánh..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editBranchPhone">Số điện thoại</Label>
                    <Input
                      id="editBranchPhone"
                      defaultValue={selectedBranch.phone}
                      placeholder="Nhập số điện thoại..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editBranchHours">Giờ mở cửa</Label>
                    <Input
                      id="editBranchHours"
                      defaultValue={selectedBranch.opening_hours}
                      placeholder="VD: 06:00 - 23:00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editBranchDescription">Mô tả</Label>
                  <textarea
                    id="editBranchDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Nhập mô tả chi nhánh..."
                    defaultValue={selectedBranch.description}
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
