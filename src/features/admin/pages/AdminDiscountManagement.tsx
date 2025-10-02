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
import { mockDiscounts, type Discount } from '../../../mockdata/discounts';

export function AdminDiscountManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    type: '',
    discount_percentage: '',
    discount_amount: '',
    max_discount: '',
    bonus_days: '',
    conditions: '',
    package_types: [] as string[],
    duration_types: [] as string[],
    start_date: '',
    end_date: '',
    status: 'Active'
  });

  // Calculate statistics from mock data
  const totalDiscounts = mockDiscounts.length;
  const activeDiscounts = mockDiscounts.filter(discount => discount.status === 'Active').length;
  const inactiveDiscounts = mockDiscounts.filter(discount => discount.status === 'Inactive').length;
  const hssvDiscounts = mockDiscounts.filter(discount => discount.type === 'HSSV').length;
  const vipDiscounts = mockDiscounts.filter(discount => discount.type === 'VIP').length;


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
    if (discount.discount_percentage) {
      return `${discount.discount_percentage}%`;
    } else if (discount.discount_amount) {
      return `${discount.discount_amount.toLocaleString('vi-VN')} VNĐ`;
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

  const handleDeleteDiscount = (discount: Discount) => {
    if (confirm(`Bạn có chắc muốn xóa ưu đãi ${discount.name}?`)) {
      alert(`Đã xóa ưu đãi: ${discount.name}`);
    }
  };

  const handleViewDiscount = (discount: Discount) => {
    alert(`Xem chi tiết ưu đãi: ${discount.name}`);
  };

  const handleToggleStatus = (discount: Discount) => {
    const newStatus = discount.status === 'Active' ? 'Inactive' : 'Active';
    alert(`Đã ${newStatus === 'Active' ? 'kích hoạt' : 'tạm dừng'} ưu đãi: ${discount.name}`);
  };

  const handleAddDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm ưu đãi mới thành công!');
    setShowAddModal(false);
    setNewDiscount({
      name: '',
      type: '',
      discount_percentage: '',
      discount_amount: '',
      max_discount: '',
      bonus_days: '',
      conditions: '',
      package_types: [],
      duration_types: [],
      start_date: '',
      end_date: '',
      status: 'Active'
    });
  };

  const handleEditDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật ưu đãi thành công!');
    setShowEditModal(false);
  };

  // Filter discounts based on search and filters
  const filteredDiscounts = mockDiscounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.conditions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || discount.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddDiscount}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm ưu đãi mới
            </Button>
            <Button variant="outline">
              <Gift className="w-4 h-4 mr-2" />
              Tạo voucher
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Ưu đãi nhóm
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Báo cáo hiệu quả
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm ưu đãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại ưu đãi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="HSSV">HSSV</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Group">Group</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Voucher">Voucher</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Active">Đang hoạt động</SelectItem>
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

      {/* Discount Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              Danh sách ưu đãi ({filteredDiscounts.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Tên ưu đãi</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-left p-4">Giá trị</th>
                  <th className="text-left p-4">Điều kiện</th>
                  <th className="text-left p-4">Thời gian</th>
                  <th className="text-left p-4">Trạng thái</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{discount.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {discount.conditions.substring(0, 80)}...
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getTypeBadge(discount.type)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">
                          {formatDiscountValue(discount)}
                        </span>
                        {discount.bonus_days && (
                          <Badge variant="outline" className="text-xs">
                            +{discount.bonus_days} ngày
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {discount.package_types.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(discount.start_date)}</span>
                        <span className="text-gray-400">-</span>
                        <span>{formatDate(discount.end_date)}</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(discount.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDiscount(discount)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDiscount(discount)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(discount)}
                          className={discount.status === 'Active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {discount.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDiscount(discount)}
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
        </CardContent>
      </Card>

      {/* Add Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thêm Ưu Đãi Mới</CardTitle>
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
              <form onSubmit={handleAddDiscountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountName">Tên ưu đãi *</Label>
                    <Input
                      id="discountName"
                      value={newDiscount.name}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="VD: Ưu đãi HSSV - Giảm 15%"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountType">Loại ưu đãi *</Label>
                    <Select 
                      value={newDiscount.type} 
                      onValueChange={(value) => setNewDiscount(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại ưu đãi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HSSV">HSSV</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Voucher">Voucher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discountPercentage">Giảm giá %</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      value={newDiscount.discount_percentage}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_percentage: e.target.value }))}
                      placeholder="15"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountAmount">Giảm giá cố định (VNĐ)</Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      value={newDiscount.discount_amount}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_amount: e.target.value }))}
                      placeholder="100000"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={newDiscount.max_discount}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, max_discount: e.target.value }))}
                      placeholder="500000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bonusDays">Ngày tặng thêm</Label>
                    <Input
                      id="bonusDays"
                      type="number"
                      value={newDiscount.bonus_days}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, bonus_days: e.target.value }))}
                      placeholder="7"
                      min="0"
                      max="365"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountStatus">Trạng thái</Label>
                    <Select 
                      value={newDiscount.status} 
                      onValueChange={(value) => setNewDiscount(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Đang hoạt động</SelectItem>
                        <SelectItem value="Inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newDiscount.start_date}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newDiscount.end_date}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="conditions">Điều kiện áp dụng *</Label>
                  <textarea
                    id="conditions"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả điều kiện áp dụng ưu đãi..."
                    value={newDiscount.conditions}
                    onChange={(e) => setNewDiscount(prev => ({ ...prev, conditions: e.target.value }))}
                    required
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
                    Thêm ưu đãi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Discount Modal */}
      {showEditModal && selectedDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chỉnh Sửa Ưu Đãi</CardTitle>
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
              <form onSubmit={handleEditDiscountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editDiscountName">Tên ưu đãi</Label>
                    <Input
                      id="editDiscountName"
                      defaultValue={selectedDiscount.name}
                      placeholder="VD: Ưu đãi HSSV - Giảm 15%"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDiscountType">Loại ưu đãi</Label>
                    <Select defaultValue={selectedDiscount.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại ưu đãi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HSSV">HSSV</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Voucher">Voucher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editDiscountPercentage">Giảm giá %</Label>
                    <Input
                      id="editDiscountPercentage"
                      type="number"
                      defaultValue={selectedDiscount.discount_percentage || ''}
                      placeholder="15"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDiscountAmount">Giảm giá cố định (VNĐ)</Label>
                    <Input
                      id="editDiscountAmount"
                      type="number"
                      defaultValue={selectedDiscount.discount_amount || ''}
                      placeholder="100000"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editMaxDiscount">Giảm tối đa (VNĐ)</Label>
                    <Input
                      id="editMaxDiscount"
                      type="number"
                      defaultValue={selectedDiscount.max_discount || ''}
                      placeholder="500000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editBonusDays">Ngày tặng thêm</Label>
                    <Input
                      id="editBonusDays"
                      type="number"
                      defaultValue={selectedDiscount.bonus_days || ''}
                      placeholder="7"
                      min="0"
                      max="365"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDiscountStatus">Trạng thái</Label>
                    <Select defaultValue={selectedDiscount.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Đang hoạt động</SelectItem>
                        <SelectItem value="Inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editStartDate">Ngày bắt đầu</Label>
                    <Input
                      id="editStartDate"
                      type="date"
                      defaultValue={selectedDiscount.start_date}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEndDate">Ngày kết thúc</Label>
                    <Input
                      id="editEndDate"
                      type="date"
                      defaultValue={selectedDiscount.end_date}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editConditions">Điều kiện áp dụng</Label>
                  <textarea
                    id="editConditions"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả điều kiện áp dụng ưu đãi..."
                    defaultValue={selectedDiscount.conditions}
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
