import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { LoadingSpinner } from '../../../components/common';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWithScrollLock } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { DeleteConfirmationDialog } from '../../../components/common/DeleteConfirmationDialog';
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  Users,
  Dumbbell,
  Search,
  Filter,
  X,
  Download
} from 'lucide-react';
import { mockPackages } from '../../../mockdata/packages';
import { ModalCreatePackage } from '../components/package-management/ModalCreatePackage';
import { ModalDetailPackage } from '../components/package-management/ModalDetailPackage';
import { ModalEditPackage } from '../components/package-management/ModalEditPackage';
import { usePackages, useDeletePackage } from '../hooks/usePackages';
import { useToast } from '../../../hooks/useToast';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';

interface AdminPackageManagementProps {
  onCreatePackage?: () => void;
  onViewPackage?: (pkg: any) => void;
  onEditPackage?: (pkg: any) => void;
  onDeletePackage?: (packageId: string) => void;
}

export function AdminPackageManagement({
  onCreatePackage,
  onViewPackage,
  onEditPackage,
  onDeletePackage
}: AdminPackageManagementProps = {}) {

  const { data: response, isLoading, isError } = usePackages();
  const mutateDeletePackage = useDeletePackage();
  const toast = useToast();
  const [packages, setPackages] = useState(response?.data || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [membershipTypeFilter, setMembershipTypeFilter] = useState('all');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  
  // Track dropdown open state to prevent scroll lock
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // modal create and view detail package
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //state confirm delete package
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    packageId: null as string | null,
    packageName: '',
    isLoading: false
  });

  useEffect(() => {
    if (response?.data) {
      setPackages(response.data);
    }
  }, [response?.data]);
  console.log(packages);
  
  // Filter packages with useMemo for optimization
  const filteredPackages = React.useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || pkg.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || pkg.packageCategory === categoryFilter;
      const matchesMembershipType = membershipTypeFilter === 'all' ||
        (pkg.membershipType && pkg.membershipType === membershipTypeFilter) ||
        (!pkg.membershipType && membershipTypeFilter === 'none');

      return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesMembershipType;
    });
  }, [packages, searchTerm, typeFilter, statusFilter, categoryFilter, membershipTypeFilter]);

  // Sort packages - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: filteredPackages,
    initialSort: { key: 'name', direction: 'asc' }
  });

  // Reset selected packages when filters or sort changes
  useEffect(() => {
    setSelectedPackages([]);
  }, [searchTerm, typeFilter, statusFilter, categoryFilter, membershipTypeFilter]);

  // Reset selected packages when sort changes
  const handleSort = (key: string) => {
    setSelectedPackages([]);
    requestSort(key);
  };

  // Calculate statistics
  const activePackages = packages.filter(pkg => pkg.status === 'Active').length;
  const membershipPackages = packages.filter(pkg => pkg.type === 'Membership').length;
  const comboPackages = packages.filter(pkg => pkg.type === 'Combo').length;
  const ptPackages = packages.filter(pkg => pkg.type === 'PT').length;

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setMembershipTypeFilter('all');
  };

  // Prevent scroll lock when dropdowns are open
  useEffect(() => {
    if (!isDropdownOpen) return;

    let rafId: number;
    let lastCheck = 0;
    const preventScrollLock = () => {
      const now = Date.now();
      if (now - lastCheck < 100) {
        if (isDropdownOpen) {
          rafId = requestAnimationFrame(preventScrollLock);
        }
        return;
      }
      lastCheck = now;

      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.removeAttribute('data-scroll-locked');
        if (scrollY) {
          const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
          window.scrollTo(0, y);
        }
      }
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }

      if (isDropdownOpen) {
        rafId = requestAnimationFrame(preventScrollLock);
      }
    };

    rafId = requestAnimationFrame(preventScrollLock);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDropdownOpen]);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPackages.length === sortedData.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(sortedData.map((pkg: any) => pkg._id || pkg.id));
    }
  };

  const handleViewPackage = (pkgId: any) => {
    console.log(pkgId);
    setSelectedPackageId(pkgId);
    setIsDetailModalOpen(true);
  };

  const handleEditPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setIsEditModalOpen(true);
  };

  const handleDeletePackage = (packageId: string, packageName: string) => {
    setDeleteDialog({
      isOpen: true,
      packageId: packageId,
      packageName: packageName,
      isLoading: false
    });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      packageId: null,
      packageName: '',
      isLoading: false
    });
  };

  const handleConfirmDeletePackage = async () => {
    if (!deleteDialog.packageId) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await mutateDeletePackage.mutateAsync(deleteDialog.packageId);
      toast.success('Xóa thành công! 🔥', `Gói tập "${deleteDialog.packageName}" đã bị xóa`);
      handleCancelDelete();

      onDeletePackage?.(deleteDialog.packageId);
    } catch (error) {
      toast.error('Xóa thất bại! 😭', `Gói tập "${deleteDialog.packageName}" đã bị xóa`);
      handleCancelDelete();
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCreatePackage = () => {
    setIsCreateModalOpen(true);
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPackageTypeColor = (type: string) => {
    switch (type) {
      case 'Membership': return 'bg-blue-100 text-blue-800';
      case 'Combo': return 'bg-orange-100 text-orange-800';
      case 'PT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'VIP': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý gói tập</h1>
        <p className="text-gray-600">Quản lý các gói tập và dịch vụ của phòng gym</p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label htmlFor="typeFilter">Loại gói</Label>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value)}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  requestAnimationFrame(() => {
                    if (document.body.style.position === 'fixed') {
                      const scrollY = document.body.style.top;
                      document.body.style.position = '';
                      document.body.style.top = '';
                      document.body.style.width = '';
                      document.body.style.overflow = '';
                      document.documentElement.style.overflow = '';
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
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Membership">Membership</SelectItem>
                  <SelectItem value="Combo">Combo</SelectItem>
                  <SelectItem value="PT">PT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="statusFilter">Trạng thái</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  requestAnimationFrame(() => {
                    if (document.body.style.position === 'fixed') {
                      const scrollY = document.body.style.top;
                      document.body.style.position = '';
                      document.body.style.top = '';
                      document.body.style.width = '';
                      document.body.style.overflow = '';
                      document.documentElement.style.overflow = '';
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
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Active">Hoạt động</SelectItem>
                  <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="categoryFilter">Thời hạn</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  requestAnimationFrame(() => {
                    if (document.body.style.position === 'fixed') {
                      const scrollY = document.body.style.top;
                      document.body.style.position = '';
                      document.body.style.top = '';
                      document.body.style.width = '';
                      document.body.style.overflow = '';
                      document.documentElement.style.overflow = '';
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
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="ShortTerm">Ngắn hạn</SelectItem>
                  <SelectItem value="MediumTerm">Trung hạn</SelectItem>
                  <SelectItem value="LongTerm">Dài hạn</SelectItem>
                  <SelectItem value="Trial">Gói thử</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Membership Type Filter */}
            <div>
              <Label htmlFor="membershipTypeFilter">Loại Membership</Label>
              <Select
                value={membershipTypeFilter}
                onValueChange={(value) => setMembershipTypeFilter(value)}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  requestAnimationFrame(() => {
                    if (document.body.style.position === 'fixed') {
                      const scrollY = document.body.style.top;
                      document.body.style.position = '';
                      document.body.style.top = '';
                      document.body.style.width = '';
                      document.body.style.overflow = '';
                      document.documentElement.style.overflow = '';
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
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="none">Không có</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full md:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị <span className="font-medium text-gray-900">{filteredPackages.length}</span> trong tổng số{' '}
              <span className="font-medium text-gray-900">{packages.length}</span> gói tập
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPackages.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedPackages.length} gói tập
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Kích hoạt
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Danh sách gói tập
            </CardTitle>
            <Button onClick={handleCreatePackage} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tạo gói tập mới</span>
            </Button>
          </div>
        </CardHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <LoadingSpinner
              size="md"
              className="mx-auto"
            />
          </div>
        ) : (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <NonSortableHeader className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedPackages.length === sortedData.length && sortedData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </NonSortableHeader>
                    <SortableTableHeader
                      label="Tên gói"
                      sortKey="name"
                      currentSortKey={getSortDirection('name') ? 'name' : ''}
                      sortDirection={getSortDirection('name')}
                      onSort={handleSort}
                      align="left"
                      className="p-3"
                    />
                    <SortableTableHeader
                      label="Loại"
                      sortKey="type"
                      currentSortKey={getSortDirection('type') ? 'type' : ''}
                      sortDirection={getSortDirection('type')}
                      onSort={handleSort}
                      align="left"
                      className="p-3"
                    />
                    <SortableTableHeader
                      label="Thời hạn"
                      sortKey="durationMonths"
                      currentSortKey={getSortDirection('durationMonths') ? 'durationMonths' : ''}
                      sortDirection={getSortDirection('durationMonths')}
                      onSort={handleSort}
                      align="left"
                      className="p-3"
                    />
                    <SortableTableHeader
                      label="Giá"
                      sortKey="price"
                      currentSortKey={getSortDirection('price') ? 'price' : ''}
                      sortDirection={getSortDirection('price')}
                      onSort={handleSort}
                      align="left"
                      className="p-3"
                    />
                    <SortableTableHeader
                      label="Trạng thái"
                      sortKey="status"
                      currentSortKey={getSortDirection('status') ? 'status' : ''}
                      sortDirection={getSortDirection('status')}
                      onSort={handleSort}
                      align="left"
                      className="p-3"
                    />
                    <NonSortableHeader label="Thao tác" align="left" className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((pkg: any) => (
                    <tr key={pkg._id || pkg.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedPackages.includes(pkg._id || pkg.id)}
                          onChange={() => handleSelectPackage(pkg._id || pkg.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{pkg.name}</p>
                          <p className="text-sm text-gray-500">{pkg.description}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <Badge className={`w-fit ${getPackageTypeColor(pkg.type)}`}>
                            {pkg.type}
                          </Badge>
                          {pkg.membershipType && (
                            <Badge className={`w-fit ${getMembershipTypeColor(pkg.membershipType)}`}>
                              {pkg.membershipType}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm text-gray-900">{pkg.durationMonths} tháng</p>
                          <p className="text-xs text-gray-500">{pkg.packageCategory}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{formatPrice(pkg.price)}</p>
                          {pkg.ptSessions && (
                            <p className="text-sm text-gray-500">{pkg.ptSessions} buổi PT</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {pkg.status === 'Active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPackage(pkg._id || pkg.id)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPackage(pkg._id || pkg.id)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePackage(pkg._id || pkg.id, pkg.name)}
                            title="Xóa gói tập"
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
          </CardContent>
        )}
      </Card>
      <ModalCreatePackage
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh data or show success message
          console.log('Package created successfully');
        }}
      />
      <ModalDetailPackage
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPackageId(null);
        }}
        packageId={selectedPackageId}
      />
      <ModalEditPackage
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPackageId(null);
        }}
        packageId={selectedPackageId}
      />
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDeletePackage}
        title="Xóa gói tập"
        description="Bạn có chắc chắn muốn xóa gói tập này không?(xóa gói tập sẽ xóa khỏi hệ thống và không thể khôi phục)"
      />

    </div>
  );
}

// Render modal outside of the main component to ensure it's above everything
export function AdminPackageManagementWithModal() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  return (
    <>
      <AdminPackageManagement
        onCreatePackage={() => setIsCreateModalOpen(true)}
        onViewPackage={(pkg) => {
          setSelectedPackage(pkg);
          setIsDetailModalOpen(true);
        }}
        onEditPackage={(pkg) => {
          setSelectedPackage(pkg);
          setIsDetailModalOpen(false);
          // TODO: Open edit modal
        }}
        onDeletePackage={(packageId) => {
          // TODO: Implement delete functionality
          console.log('Delete package:', packageId);
        }}
      />

      {/* Create Package Modal - Rendered at top level */}
      {isCreateModalOpen && (
        <ModalCreatePackage
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            // Refresh data or show success message
            console.log('Package created successfully');
          }}
        />
      )}

      {/* Detail Package Modal */}
      {/* {isDetailModalOpen && selectedPackage && (
        <ModalDetailPackage
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPackage(null);
          }}
          package={selectedPackage}
          onEdit={(pkg) => {
            setIsDetailModalOpen(false);
            setSelectedPackage(null);
            // TODO: Open edit modal
          }}
          onDelete={(packageId) => {
            // TODO: Implement delete functionality
            console.log('Delete package:', packageId);
          }}
        />
      )} */}
    </>
  );
}
