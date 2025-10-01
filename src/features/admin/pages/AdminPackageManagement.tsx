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
  Percent, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Calendar,
  Users,
  Dumbbell
} from 'lucide-react';
import { mockPackages } from '../../../mockdata/packages';
import { mockDiscounts } from '../../../mockdata/discounts';

export function AdminPackageManagement() {
  const [packages] = useState(mockPackages);
  const [discounts] = useState(mockDiscounts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  // Calculate statistics
  const activePackages = packages.filter(pkg => pkg.status === 'Active').length;
  const membershipPackages = packages.filter(pkg => pkg.type === 'Membership').length;
  const comboPackages = packages.filter(pkg => pkg.type === 'Combo').length;
  const ptPackages = packages.filter(pkg => pkg.type === 'PT').length;

  const statsCards = [
    { title: 'Gói đang hoạt động', value: activePackages, icon: Package, color: 'text-blue-600' },
    { title: 'Gói Membership', value: membershipPackages, icon: Users, color: 'text-green-600' },
    { title: 'Gói Combo', value: comboPackages, icon: Dumbbell, color: 'text-orange-600' },
    { title: 'Gói PT riêng', value: ptPackages, icon: Calendar, color: 'text-purple-600' }
  ];

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Package */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Tạo gói tập mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packageName">Tên gói</Label>
                  <Input id="packageName" placeholder="VD: Gói VIP 6 tháng" />
                </div>
                <div>
                  <Label htmlFor="packageType">Loại gói</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại gói" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Membership">Membership</SelectItem>
                      <SelectItem value="Combo">Combo (Membership + PT)</SelectItem>
                      <SelectItem value="PT">PT riêng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packageCategory">Thời hạn</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời hạn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ShortTerm">Ngắn hạn (1 tháng)</SelectItem>
                      <SelectItem value="MediumTerm">Trung hạn (3-6 tháng)</SelectItem>
                      <SelectItem value="LongTerm">Dài hạn (12 tháng)</SelectItem>
                      <SelectItem value="Trial">Gói thử (1-7 ngày)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="durationMonths">Số tháng</Label>
                  <Input id="durationMonths" type="number" placeholder="1, 3, 6, 12" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="membershipType">Loại Membership</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic (1 chi nhánh)</SelectItem>
                      <SelectItem value="VIP">VIP (Tất cả chi nhánh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="packagePrice">Giá gốc (VNĐ)</Label>
                  <Input id="packagePrice" type="number" placeholder="2000000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ptSessions">Số buổi PT</Label>
                  <Input id="ptSessions" type="number" placeholder="0 nếu không có PT" />
                </div>
                <div>
                  <Label htmlFor="ptSessionDuration">Thời lượng buổi PT (phút)</Label>
                  <Input id="ptSessionDuration" type="number" placeholder="90" />
                </div>
              </div>

              <div>
                <Label htmlFor="branchAccess">Quyền truy cập</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quyền" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">1 chi nhánh</SelectItem>
                    <SelectItem value="All">Tất cả chi nhánh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="packageDescription">Mô tả gói</Label>
                <textarea 
                  id="packageDescription" 
                  className="w-full p-3 border border-gray-300 rounded-md resize-none" 
                  rows={3} 
                  placeholder="Mô tả chi tiết về gói tập..."
                />
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Tạo gói tập
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Discount Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-green-600" />
              Quản lý ưu đãi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="discountName">Tên ưu đãi</Label>
                <Input id="discountName" placeholder="VD: Ưu đãi HSSV" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Loại ưu đãi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HSSV">HSSV</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Group">Nhóm bạn</SelectItem>
                      <SelectItem value="Company">Công ty</SelectItem>
                      <SelectItem value="Voucher">Voucher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountPercentage">Giảm giá (%)</Label>
                  <Input id="discountPercentage" type="number" placeholder="10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountAmount">Giảm giá cố định (VNĐ)</Label>
                  <Input id="discountAmount" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="bonusDays">Số ngày tặng thêm</Label>
                  <Input id="bonusDays" type="number" placeholder="7" />
                </div>
              </div>

              <div>
                <Label htmlFor="discountConditions">Điều kiện áp dụng</Label>
                <textarea 
                  id="discountConditions" 
                  className="w-full p-3 border border-gray-300 rounded-md resize-none" 
                  rows={2} 
                  placeholder="Mô tả điều kiện áp dụng..."
                />
              </div>

              <Button className="w-full">
                <Percent className="w-4 h-4 mr-2" />
                Tạo ưu đãi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Danh sách gói tập
          </CardTitle>
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
                {packages.slice(0, 10).map((pkg) => (
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

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-green-600" />
            Danh sách ưu đãi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Tên ưu đãi</th>
                  <th className="text-left p-3 font-medium text-gray-600">Loại</th>
                  <th className="text-left p-3 font-medium text-gray-600">Giảm giá</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thời gian</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {discounts.slice(0, 10).map((discount) => (
                  <tr key={discount.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{discount.name}</p>
                        <p className="text-sm text-gray-500">{discount.conditions}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {discount.type}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        {discount.discount_percentage && (
                          <p className="text-sm text-gray-900">{discount.discount_percentage}%</p>
                        )}
                        {discount.discount_amount && (
                          <p className="text-sm text-gray-900">{formatPrice(discount.discount_amount)}</p>
                        )}
                        {discount.bonus_days && (
                          <p className="text-xs text-gray-500">+{discount.bonus_days} ngày</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(discount.start_date).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          đến {new Date(discount.end_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={discount.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {discount.status === 'Active' ? 'Hoạt động' : 'Ngừng hoạt động'}
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
    </div>
  );
}
