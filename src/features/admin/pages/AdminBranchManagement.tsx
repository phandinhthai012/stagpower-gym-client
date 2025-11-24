import React, { useState, useEffect } from 'react';
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
  User,
  AtSign,
  Send
} from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
// import { mockBranches } from '../../../mockdata/branches';
import { useBranches, useCreateBranch, useUpdateBranch, useChangeBranchStatus } from '../hooks';
import { ModalCreateBranch } from '../components/branch-management/ModalCreateBranch';
import { ModelEditBranch } from '../components/branch-management/ModelEditBranch';
import { ModalBranchDetail } from '../components/branch-management/ModalBranchDetail';
import { ModalBranchStaff } from '../components/branch-management/ModalBranchStaff';

export function AdminBranchManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',           // ✅ Thêm
    openTime: '',        // ✅ Thêm
    closeTime: '',       // ✅ Thêm
    status: 'Active' as 'Active' | 'Maintenance' | 'Closed'
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    branch: any | null;
    action: 'deactivate' | 'activate' | null;
  }>({
    isOpen: false,
    branch: null,
    action: null
  });
  const { data: branches = [], isLoading, error } = useBranches();

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const changeBranchStatus = useChangeBranchStatus();
  console.log(branches);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-600">Đang tải dữ liệu chi nhánh...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-600">
          <p className="text-red-500">
            {error?.message || 'Có lỗi xảy ra khi tải dữ liệu chi nhánh'}
          </p>
        </div>
      </div>
    )
  }



  // Calculate statistics from mock data
  const totalBranches = branches.length;
  const activeBranches = branches.filter((branch: any) => branch.status === 'Active').length;
  const maintenanceBranches = branches.filter((branch: any) => branch.status === 'Maintenance').length;
  const closedBranches = branches.filter((branch: any) => branch.status === 'Closed').length;
  // const totalStaff = branches.reduce((sum: any, branch: any) => sum + (branch.staff_count || 0), 0);
  // const totalMembers = branches.reduce((sum: any, branch: any) => sum + (branch.member_count || 0), 0);
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'Maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Bảo trì</Badge>;
      case 'Closed':
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
    setSelectedBranch(branch);
    setShowDetailModal(true);
  };

  const handleEditFromDetail = () => {
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleManageStaff = (branch: any) => {
    setSelectedBranch(branch);
    setShowStaffModal(true);
  };

  const handleDeactivateBranch = (branch: any) => {
    setConfirmDialog({
      isOpen: true,
      branch: branch,
      action: 'deactivate'
    });
  };

  const handleActivateBranch = (branch: any) => {
    setConfirmDialog({
      isOpen: true,
      branch: branch,
      action: 'activate'
    });
  };
  const confirmAction = async () => {
    if (!confirmDialog.branch || !confirmDialog.action) return;

    try {
      const  newStatus = confirmDialog.action === 'deactivate' ? 'Maintenance' : 'Active';
      await changeBranchStatus.mutateAsync({
        branchId: confirmDialog.branch._id,
        status: newStatus
      });
      setConfirmDialog({
        isOpen: false,
        branch: null,
        action: null
      });
    } catch (error) {
      console.error('Error changing branch status:', error);
    }
  };

  const cancelAction = () => {
    setConfirmDialog({
      isOpen: false,
      branch: null,
      action: null
    });
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

  const handleAddBranchSubmit = async (BranchData: any) => {
    console.log(BranchData);
    try {
      const response = await createBranch.mutateAsync(BranchData);
      setShowAddModal(false);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBranchSubmit = async (branchData: any) => {
    console.log(branchData);
    try {
      const response = await updateBranch.mutateAsync({ branchId: selectedBranch._id, data: branchData });
      setShowEditModal(false);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* {statistics} */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng chi nhánh</p>
                <p className="text-2xl font-bold">{totalBranches}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{activeBranches}</p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceBranches}</p>
              </div>
              <Pause className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã đóng</p>
                <p className="text-2xl font-bold text-red-600">{closedBranches}</p>
              </div>
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
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
                <SelectItem value="Closed">Đóng cửa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Đặt lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Branch Button - Below filter */}
      <Card>
        <CardContent className="p-6">
          <Button onClick={handleAddBranch}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chi nhánh mới
          </Button>
        </CardContent>
      </Card>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBranches.map((branch: any) => (
          <Card key={branch._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{branch.name}</h3>
                    <p className="text-sm text-gray-500">ID: {branch._id}</p>
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
                  <Send className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{branch.email || 'Chưa có'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {branch.status === 'Maintenance' ? 'Tạm đóng' : `${branch.openTime} - ${branch.closeTime}`}
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
      <ModalCreateBranch
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBranchSubmit}
      />
      <ModelEditBranch
        isOpen={showEditModal}
        branchData={selectedBranch}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBranch(null);
        }}
        onSubmit={handleEditBranchSubmit}
      />
      <ModalBranchDetail
        isOpen={showDetailModal}
        branchData={selectedBranch}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBranch(null);
        }}
        onEdit={handleEditFromDetail}
      />
      <ModalBranchStaff
        isOpen={showStaffModal}
        branchData={selectedBranch}
        onClose={() => {
          setShowStaffModal(false);
          setSelectedBranch(null);
        }}
      />
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-red-600" />
                Xác nhận tạm dừng chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn tạm dừng chi nhánh{' '}
                  <span className="font-semibold text-blue-600">
                    {confirmDialog.branch?.name}
                  </span>?
                </p>
                <p className="text-sm text-gray-500">
                  Chi nhánh sẽ không thể tiếp nhận khách hàng mới sau khi tạm dừng.
                </p>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={cancelAction}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={confirmAction}
                    disabled={changeBranchStatus.isPending}
                  >
                    {changeBranchStatus.isPending ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Đang xử lý...</span>
                      </>
                    ) : (
                      confirmDialog.action === 'deactivate' ? 'Tạm dừng' : 'Mở lại'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
