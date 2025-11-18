import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Percent, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Gift,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Target
} from 'lucide-react';
import { useDiscounts, useDeleteDiscount, useChangeDiscountStatus } from '../hooks/useDiscounts';
import { Discount } from '../types/discount.types';
import { ModalCreateDiscount, ModalEditDiscount, ModalViewDiscount } from '../components/discounts-management';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';

export function AdminDiscountManagement() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  // API hooks
  const { data: discounts = [], isLoading, error } = useDiscounts();
  const deleteDiscountMutation = useDeleteDiscount();
  const changeStatusMutation = useChangeDiscountStatus();

  // Calculate statistics from API data
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter(discount => discount.status === 'Active').length;
  const inactiveDiscounts = discounts.filter(discount => discount.status === 'Inactive').length;
  const hssvDiscounts = discounts.filter(discount => discount.type === 'HSSV').length;
  const vipDiscounts = discounts.filter(discount => discount.type === 'VIP').length;


  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'HSSV':
        return <Badge className="bg-purple-100 text-purple-800">HSSV</Badge>;
      case 'VIP':
        return <Badge className="bg-orange-100 text-orange-800">VIP</Badge>;
      case 'Group':
        return <Badge className="bg-blue-100 text-blue-800">Group</Badge>;
      case 'Company':
        return <Badge className="bg-green-100 text-green-800">Company</Badge>;
      case 'Voucher':
        return <Badge className="bg-pink-100 text-pink-800">Voucher</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800">Tạm dừng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDiscountValue = (discount: Discount) => {
    if (discount.discountPercentage) {
      return `${discount.discountPercentage}%`;
    } else if (discount.discountAmount) {
      return `${discount.discountAmount.toLocaleString('vi-VN')} VNĐ`;
    }
    return 'N/A';
  };

  const handleAddDiscount = () => {
    setShowAddModal(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowEditModal(true);
  };

  const handleViewDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowViewModal(true);
  };

  const handleDeleteDiscount = async (discount: Discount) => {
    if (confirm(`Bạn có chắc muốn xóa ưu đãi ${discount.name}?`)) {
      try {
        await deleteDiscountMutation.mutateAsync(discount._id);
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  const handleToggleStatus = async (discount: Discount) => {
    const newStatus = discount.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await changeStatusMutation.mutateAsync({
        id: discount._id,
        status: newStatus
      });
    } catch (error) {
      console.error('Error changing discount status:', error);
    }
  };

  // Filter discounts based on search and filters
  const filteredDiscounts = React.useMemo(() => {
    return discounts.filter(discount => {
      const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discount.conditions.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || discount.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [discounts, searchTerm, typeFilter, statusFilter]);

  // Sort discounts - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: filteredDiscounts,
    initialSort: { key: 'name', direction: 'asc' }
  });

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  // Paginate sorted data
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedData.slice(start, end);
  }, [sortedData, page, limit]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / limit);
  const filteredRecords = sortedData.length;

  // Reset selected discounts when filters or sort changes
  React.useEffect(() => {
    setSelectedDiscounts([]);
  }, [searchTerm, typeFilter, statusFilter]);

  // Reset selected discounts when sort changes
  const handleSort = (key: string) => {
    setSelectedDiscounts([]);
    requestSort(key);
  };

  const handleSelectDiscount = (discountId: string) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountId) 
        ? prev.filter((id: string) => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDiscounts.length === paginatedData.length) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(paginatedData.map((discount: Discount) => discount._id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm ưu đãi..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
            </div>
            
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại ưu đãi" />
              </SelectTrigger>
              <SelectContent lockScroll={false}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="HSSV">HSSV</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Group">Group</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Voucher">Voucher</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent lockScroll={false}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Active">Đang hoạt động</SelectItem>
                <SelectItem value="Inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleAddDiscount}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm ưu đãi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDiscounts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedDiscounts.length} ưu đãi
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Gift className="w-4 h-4 mr-2" />
                  Kích hoạt hàng loạt
                </Button>
                <Button variant="outline" size="sm">
                  <XCircle className="w-4 h-4 mr-2" />
                  Tạm dừng hàng loạt
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa hàng loạt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Management Table */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              Danh sách ưu đãi ({filteredDiscounts.length})
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
                      checked={selectedDiscounts.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </NonSortableHeader>
                  <SortableTableHeader
                    label="Tên ưu đãi"
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
                  <NonSortableHeader label="Giá trị" align="left" className="p-3" />
                  <NonSortableHeader label="Điều kiện" align="left" className="p-3" />
                  <SortableTableHeader
                    label="Thời gian"
                    sortKey="startDate"
                    currentSortKey={getSortDirection('startDate') ? 'startDate' : ''}
                    sortDirection={getSortDirection('startDate')}
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
                {paginatedData.map((discount) => (
                  <tr key={discount._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedDiscounts.includes(discount._id)}
                        onChange={() => handleSelectDiscount(discount._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-semibold text-gray-900">{discount.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {discount.conditions.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{getTypeBadge(discount.type)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">
                          {formatDiscountValue(discount)}
                        </span>
                        {discount.bonusDays && (
                          <Badge variant="outline" className="text-xs">
                            +{discount.bonusDays} ngày
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {discount.packageTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(discount.startDate)}</span>
                        <span className="text-gray-400">-</span>
                        <span>{formatDate(discount.endDate)}</span>
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(discount.status)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDiscount(discount)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDiscount(discount)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(discount)}
                          className={discount.status === 'Active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          title={discount.status === 'Active' ? 'Tạm dừng' : 'Kích hoạt'}
                        >
                          {discount.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDiscount(discount)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa ưu đãi"
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

          {/* Pagination */}
          {filteredRecords > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {totalPages > 1 
                    ? `Hiển thị ${((page - 1) * limit) + 1} - ${Math.min(page * limit, filteredRecords)} trong tổng số ${filteredRecords} kết quả`
                    : `Hiển thị ${filteredRecords} kết quả`
                  }
                </span>
              </div>
              {totalPages > 1 && (
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
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
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
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                    title="Trang sau"
                  >
                    ›
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages || isLoading}
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

      {/* Modals */}
      <ModalCreateDiscount
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ModalEditDiscount
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        discount={selectedDiscount}
      />

      <ModalViewDiscount
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        discount={selectedDiscount}
      />
    </div>
  );
}
