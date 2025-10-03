import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
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
  X
} from 'lucide-react';
import { mockPackages } from '../../../mockdata/packages';
import { ModalCreatePackage } from '../components/package-management/ModalCreatePackage';

export function AdminPackageManagement() {
  const [packages] = useState(mockPackages);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [membershipTypeFilter, setMembershipTypeFilter] = useState('all');

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || pkg.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || pkg.package_category === categoryFilter;
    const matchesMembershipType = membershipTypeFilter === 'all' || 
                                 (pkg.membership_type && pkg.membership_type === membershipTypeFilter) ||
                                 (!pkg.membership_type && membershipTypeFilter === 'none');

    return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesMembershipType;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Active">Hoạt động</SelectItem>
                  <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="categoryFilter">Thời hạn</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời hạn" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="ShortTerm">Ngắn hạn</SelectItem>
                  <SelectItem value="MediumTerm">Trung hạn</SelectItem>
                  <SelectItem value="LongTerm">Dài hạn</SelectItem>
                  <SelectItem value="Trial">Gói thử</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Membership Type Filter */}
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="membershipTypeFilter">Loại Membership</Label>
                <Select value={membershipTypeFilter} onValueChange={setMembershipTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại membership" />
                  </SelectTrigger>
                  <SelectContent lockScroll={true}>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="none">Không có</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Xóa bộ lọc</span>
                </Button>
              </div>
            </div>
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

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Danh sách gói tập
            </CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tạo gói tập mới</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Tên gói</th>
                  <th className="text-left p-3 font-medium text-gray-600">Loại</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thời hạn</th>
                  <th className="text-left p-3 font-medium text-gray-600">Giá</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
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
                        {pkg.membership_type && (
                          <Badge className={`w-fit ${getMembershipTypeColor(pkg.membership_type)}`}>
                            {pkg.membership_type}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-gray-900">{pkg.duration_months} tháng</p>
                        <p className="text-xs text-gray-500">{pkg.package_category}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{formatPrice(pkg.price)}</p>
                        {pkg.pt_sessions && (
                          <p className="text-sm text-gray-500">{pkg.pt_sessions} buổi PT</p>
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
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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

      {/* Create Package Modal */}
      <ModalCreatePackage
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          // TODO: Refresh data
          console.log('Package created successfully');
        }}
      />
    </div>
  );
}
