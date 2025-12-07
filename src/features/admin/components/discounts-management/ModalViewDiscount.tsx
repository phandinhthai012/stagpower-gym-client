import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Label } from '../../../../components/ui/label';
import { Discount } from '../../types/discount.types';
import {
  X,
  Percent,
  DollarSign,
  Calendar,
  Clock,
  Gift,
  Tag,
  Users,
  Package,
  CheckCircle,
  XCircle,
  Hash,
  ShoppingCart,
  Users2
} from 'lucide-react';

interface ModalViewDiscountProps {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount | null;
}

export function ModalViewDiscount({ isOpen, onClose, discount }: ModalViewDiscountProps) {
  if (!isOpen || !discount) return null;

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
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Đang hoạt động
        </Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Tạm dừng
        </Badge>;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              Chi Tiết Ưu Đãi
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Tên ưu đãi</Label>
                <p className="text-lg font-semibold">{discount.name}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Loại ưu đãi</Label>
                <div className="mt-1">{getTypeBadge(discount.type)}</div>
              </div>
            </div>
            {discount.code && (
              <div>
                <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Mã giảm giá
                </Label>
                <p className="mt-1 text-lg font-mono font-semibold text-blue-600 bg-blue-50 p-2 rounded-md">
                  {discount.code}
                </p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-600">Điều kiện áp dụng</Label>
              <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">
                {discount.conditions}
              </p>
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Cấu hình giảm giá
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Giá trị giảm giá</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatDiscountValue(discount)}
                </p>
              </div>

              {discount.maxDiscount && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Giảm tối đa</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {discount.maxDiscount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              )}
              {discount.minPurchaseAmount !== undefined && discount.minPurchaseAmount > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-600">Số tiền tối thiểu</span>
                  </div>
                  <p className="text-xl font-bold text-yellow-600">
                    {discount.minPurchaseAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              )}

              {discount.bonusDays && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Ngày tặng thêm</span>
                  </div>
                  <p className="text-xl font-bold text-purple-600">
                    +{discount.bonusDays} ngày
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Trạng thái</Label>
              <div className="mt-1">{getStatusBadge(discount.status)}</div>
            </div>
          </div>

          {/* Package and Duration Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-4 h-4" />
              Loại gói và thời hạn áp dụng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Loại thời hạn</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {discount.durationTypes.length > 0 ? (
                    discount.durationTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Không có</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Loại gói</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {discount.packageTypes.length > 0 ? (
                    discount.packageTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Không có</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              Giới hạn sử dụng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {discount.bonusDays && discount.bonusDays > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Ngày tặng thêm</span>
                  </div>
                  <p className="text-xl font-bold text-purple-600">
                    +{discount.bonusDays} ngày
                  </p>
                </div>
              )} */}

              {discount.usageLimit !== null && discount.usageLimit !== undefined && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-600">Giới hạn sử dụng</span>
                  </div>
                  <p className="text-xl font-bold text-indigo-600">
                    {discount.usageLimit.toLocaleString('vi-VN')} lần
                  </p>
                </div>
              )}

              {discount.usageLimit === null && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Giới hạn sử dụng</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-600">
                    Không giới hạn
                  </p>
                </div>
              )}

              {discount.usageCount !== undefined && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-gray-600">Đã sử dụng</span>
                  </div>
                  <p className="text-xl font-bold text-teal-600">
                    {discount.usageCount.toLocaleString('vi-VN')} lần
                    {discount.usageLimit !== null && discount.usageLimit !== undefined && (
                      <span className="text-sm font-normal text-gray-500 block mt-1">
                        / {discount.usageLimit.toLocaleString('vi-VN')} lần
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Thời gian áp dụng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Ngày bắt đầu</span>
                </div>
                <p className="text-lg font-semibold text-blue-600">
                  {formatDate(discount.startDate)}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Ngày kết thúc</span>
                </div>
                <p className="text-lg font-semibold text-red-600">
                  {formatDate(discount.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Thông tin hệ thống
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label className="text-sm font-medium text-gray-600">Ngày tạo</Label>
                <p>{formatDate(discount.createdAt)}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Cập nhật lần cuối</Label>
                <p>{formatDate(discount.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
