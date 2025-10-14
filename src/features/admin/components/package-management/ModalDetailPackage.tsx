import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { 
  X, 
  Package as PackageIcon, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  Users,
  Dumbbell,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useScrollLock } from '../../../../hooks/useScrollLock';

import { Package } from '../../../../types/package.types';

interface ModalDetailPackageProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package | null;
  onEdit?: (pkg: Package) => void;
  onDelete?: (packageId: string) => void;
}

export function ModalDetailPackage({ 
  isOpen, 
  onClose, 
  package: pkg, 
  onEdit, 
  onDelete 
}: ModalDetailPackageProps) {
  useScrollLock(isOpen, { preserveScrollPosition: true });

  if (!isOpen || !pkg) return null;

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

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'ShortTerm': return 'Ngắn hạn';
      case 'MediumTerm': return 'Trung hạn';
      case 'LongTerm': return 'Dài hạn';
      case 'Trial': return 'Gói thử';
      default: return category;
    }
  };

  const getStatusDisplay = (status: string) => {
    return status === 'Active' ? 'Hoạt động' : 'Ngừng hoạt động';
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết gói tập
              </h2>
              <p className="text-sm text-gray-500">Thông tin chi tiết về gói tập</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Package Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{pkg.name}</h2>
              <p className="text-gray-600">{pkg.description}</p>
              <div className="flex items-center space-x-2">
                <Badge className={`${getPackageTypeColor(pkg.type)}`}>
                  {pkg.type}
                </Badge>
                {pkg.membershipType && (
                  <Badge className={`${getMembershipTypeColor(pkg.membershipType)}`}>
                    {pkg.membershipType}
                  </Badge>
                )}
                <Badge className={getStatusColor(pkg.status)}>
                  {getStatusDisplay(pkg.status)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(pkg.price)}
              </div>
              <p className="text-sm text-gray-500">Giá gói tập</p>
            </div>
          </div>

          <Separator />

          {/* Package Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>Thông tin cơ bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Loại gói:</span>
                  <Badge className={`${getPackageTypeColor(pkg.type)}`}>
                    {pkg.type}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Thời hạn:</span>
                  <span className="text-sm text-gray-900">{pkg.durationMonths} tháng</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Phân loại:</span>
                  <span className="text-sm text-gray-900">{getCategoryDisplay(pkg.packageCategory)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <Badge className={getStatusColor(pkg.status)}>
                    {getStatusDisplay(pkg.status)}
                  </Badge>
                </div>
                {pkg.membershipType && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Loại Membership:</span>
                    <Badge className={`${getMembershipTypeColor(pkg.membershipType)}`}>
                      {pkg.membershipType}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing & Sessions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Giá cả & Buổi tập</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Giá gói:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Thời hạn:</span>
                  <span className="text-sm text-gray-900">{pkg.durationMonths} tháng</span>
                </div>
                {pkg.ptSessions && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Buổi PT:</span>
                    <span className="text-sm text-gray-900">{pkg.ptSessions} buổi</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Giá/ tháng:</span>
                  <span className="text-sm text-gray-900">
                    {formatPrice(pkg.price / pkg.durationMonths)}
                  </span>
                </div>
                {pkg.ptSessions && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Giá/ buổi PT:</span>
                    <span className="text-sm text-gray-900">
                      {formatPrice(pkg.price / pkg.ptSessions)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          {pkg.features && pkg.features.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span>Tính năng gói tập</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>Thông tin thời gian</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Ngày tạo:</span>
                <span className="text-sm text-gray-900">
                  {new Date(pkg.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Cập nhật lần cuối:</span>
                <span className="text-sm text-gray-900">
                  {new Date(pkg.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                <span>Thao tác nhanh</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => onEdit?.(pkg)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa gói tập</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement duplicate functionality
                    console.log('Duplicate package:', pkg._id);
                  }}
                  className="flex items-center space-x-2"
                >
                  <PackageIcon className="w-4 h-4" />
                  <span>Sao chép gói tập</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement toggle status functionality
                    console.log('Toggle status:', pkg._id);
                  }}
                  className="flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {pkg.status === 'Active' ? 'Tạm ngưng' : 'Kích hoạt'}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDelete?.(pkg._id)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa gói tập</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
