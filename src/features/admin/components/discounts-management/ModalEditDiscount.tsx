import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useUpdateDiscount } from '../../hooks/useDiscounts';
import { useDiscountTypes } from '../../hooks/useDiscountTypes';
import { Discount, UpdateDiscountData } from '../../types/discount.types';
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
  Edit,
  Hash,
  ShoppingCart,
  Users2
} from 'lucide-react';

interface ModalEditDiscountProps {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount | null;
}

export function ModalEditDiscount({ isOpen, onClose, discount }: ModalEditDiscountProps) {
  const [formData, setFormData] = useState<UpdateDiscountData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newDurationType, setNewDurationType] = useState('');
  const [newPackageType, setNewPackageType] = useState('');

  // Scroll lock effect
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const updateDiscountMutation = useUpdateDiscount();
  const { data: discountTypes = [] } = useDiscountTypes();

  // Initialize form data when discount changes
  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name,
        code: discount.code || '',
        type: discount.type,
        discountPercentage: discount.discountPercentage,
        discountAmount: discount.discountAmount,
        maxDiscount: discount.maxDiscount,
        minPurchaseAmount: discount.minPurchaseAmount,
        bonusDays: discount.bonusDays,
        usageLimit: discount.usageLimit ?? null,
        conditions: discount.conditions,
        durationTypes: discount.durationTypes,
        packageTypes: discount.packageTypes,
        startDate: discount.startDate ? discount.startDate.split('T')[0] : '',
        endDate: discount.endDate ? discount.endDate.split('T')[0] : '',
        status: discount.status
      });
    }
  }, [discount]);

  const handleInputChange = (field: keyof UpdateDiscountData, value: string | number | boolean | string[] | null | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const addDurationType = () => {
    if (newDurationType && !formData.durationTypes?.includes(newDurationType)) {
      handleInputChange('durationTypes', [...(formData.durationTypes || []), newDurationType]);
      setNewDurationType('');
    }
  };

  const removeDurationType = (type: string) => {
    handleInputChange('durationTypes', formData.durationTypes?.filter(t => t !== type) || []);
  };

  const addPackageType = () => {
    if (newPackageType && !formData.packageTypes?.includes(newPackageType)) {
      handleInputChange('packageTypes', [...(formData.packageTypes || []), newPackageType]);
      setNewPackageType('');
    }
  };

  const removePackageType = (type: string) => {
    handleInputChange('packageTypes', formData.packageTypes?.filter(t => t !== type) || []);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên ưu đãi là bắt buộc';
    }

    if (!formData.type) {
      newErrors.type = 'Loại ưu đãi là bắt buộc';
    }

    // Kiểm tra code: bắt buộc nếu type là Voucher
    const isVoucher = formData.type?.toUpperCase() === 'VOUCHER';
    const codeValue = formData.code?.trim() || '';

    if (isVoucher && !codeValue) {
      newErrors.code = 'Mã giảm giá là bắt buộc cho loại Voucher';
    }

    // Validate code format nếu có code
    if (codeValue) {
      const codeRegex = /^[A-Z0-9_]+$/;
      if (!codeRegex.test(codeValue)) {
        newErrors.code = 'Mã chỉ được chứa chữ hoa, số và dấu gạch dưới';
      } else if (codeValue.length < 3 || codeValue.length > 20) {
        newErrors.code = 'Mã phải có từ 3 đến 20 ký tự';
      }
    }

    if (!formData.discountPercentage && !formData.discountAmount) {
      newErrors.discountPercentage = 'Phải có ít nhất một loại giảm giá';
      newErrors.discountAmount = 'Phải có ít nhất một loại giảm giá';
    }

    if (!formData.conditions?.trim()) {
      newErrors.conditions = 'Điều kiện áp dụng là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    // Validate usageLimit nếu có
    if (formData.usageLimit !== null && formData.usageLimit !== undefined) {
      if (formData.usageLimit < 0) {
        newErrors.usageLimit = 'Giới hạn sử dụng không được âm';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discount || !validateForm()) {
      return;
    }

    try {
      // Chuẩn bị data để gửi
      const submitData: UpdateDiscountData = {
        ...formData,
        code: formData.code?.trim() || undefined, // Chỉ gửi nếu có giá trị
        usageLimit: formData.usageLimit === null || formData.usageLimit === undefined ? null : formData.usageLimit,
        minPurchaseAmount: formData.minPurchaseAmount || 0,
      };

      await updateDiscountMutation.mutateAsync({
        id: discount._id,
        data: submitData
      });
      onClose();
    } catch (error) {
      console.error('Error updating discount:', error);
    }
  };


  if (!isOpen || !discount) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Chỉnh Sửa Ưu Đãi
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

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên ưu đãi *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="VD: Ưu đãi HSSV - Giảm 15%"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Loại ưu đãi *</Label>
                  <Select 
                    key={`type-select-${formData.type || ''}`}
                    value={formData.type?.toUpperCase() || ''} 
                    onValueChange={(value) => handleInputChange('type', value.toUpperCase())}
                  >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn loại giảm giá" />
                    </SelectTrigger>
                    <SelectContent>
                      {discountTypes.length === 0 ? (
                        <SelectItem value="" disabled>Đang tải...</SelectItem>
                      ) : (
                        discountTypes.map((type) => (
                          <SelectItem key={type._id} value={type.name}>
                            {type.displayName} ({type.name})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>
              </div>

              {/* Code field - Required for Voucher */}
              <div>
                <Label htmlFor="code" className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Mã giảm giá
                  {formData.type?.toUpperCase() === 'VOUCHER' && <span className="text-red-500">*</span>}
                  {!formData.type || formData.type.toUpperCase() !== 'VOUCHER' ? (
                    <span className="text-gray-500 text-sm">(tùy chọn)</span>
                  ) : null}
                  {errors.code && <span className="text-red-500 ml-1">({errors.code})</span>}
                </Label>
                <Input
                  id="code"
                  value={formData.code || ''}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase().trim())}
                  placeholder="VD: HSSV2024, VIP50"
                  className={errors.code ? 'border-red-500' : ''}
                  required={formData.type?.toUpperCase() === 'VOUCHER'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type?.toUpperCase() === 'VOUCHER' 
                    ? 'Mã giảm giá là bắt buộc cho loại Voucher. ' 
                    : ''}
                  Mã sẽ tự động chuyển thành chữ hoa. Chỉ chứa chữ cái, số và dấu gạch dưới (3-20 ký tự)
                </p>
              </div>

              <div>
                <Label htmlFor="conditions">Điều kiện áp dụng *</Label>
                <textarea
                  id="conditions"
                  className={`w-full p-3 border rounded-md resize-none ${errors.conditions ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  placeholder="Mô tả điều kiện áp dụng ưu đãi..."
                  value={formData.conditions || ''}
                  onChange={(e) => handleInputChange('conditions', e.target.value)}
                />
                {errors.conditions && <p className="text-red-500 text-sm mt-1">{errors.conditions}</p>}
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Cấu hình giảm giá
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountPercentage">Giảm giá %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage || ''}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value ? Number(e.target.value) : undefined)}
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
                    value={formData.discountAmount || ''}
                    onChange={(e) => handleInputChange('discountAmount', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="100000"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="maxDiscount">Giảm tối đa (VNĐ)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => handleInputChange('maxDiscount', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="500000"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minPurchaseAmount" className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Số tiền tối thiểu (VNĐ)
                  </Label>
                  <Input
                    id="minPurchaseAmount"
                    type="number"
                    value={formData.minPurchaseAmount || ''}
                    onChange={(e) => handleInputChange('minPurchaseAmount', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số tiền tối thiểu để áp dụng giảm giá
                  </p>
                </div>

                <div>
                  <Label htmlFor="bonusDays">Ngày tặng thêm</Label>
                  <Input
                    id="bonusDays"
                    type="number"
                    value={formData.bonusDays || ''}
                    onChange={(e) => handleInputChange('bonusDays', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="7"
                    min="0"
                    max="60"
                  />
                </div>

                <div>
                  <Label htmlFor="usageLimit" className="flex items-center gap-2">
                    <Users2 className="w-4 h-4" />
                    Giới hạn sử dụng
                    {errors.usageLimit && <span className="text-red-500">({errors.usageLimit})</span>}
                  </Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit === null ? '' : formData.usageLimit || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('usageLimit', value === '' ? null : Number(value));
                    }}
                    placeholder="Để trống = không giới hạn"
                    min="0"
                    className={errors.usageLimit ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số lần tối đa có thể sử dụng. Để trống = không giới hạn
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={formData.status || ''} 
                    onValueChange={(value) => handleInputChange('status', value)}
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
            </div>

            {/* Package and Duration Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-4 h-4" />
                Loại gói và thời hạn áp dụng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Loại thời hạn</Label>
                  <div className="flex gap-2 mb-2">
                    <Select
                      value={newDurationType}
                      onValueChange={setNewDurationType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thời hạn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ShortTerm">ShortTerm</SelectItem>
                        <SelectItem value="MediumTerm">MediumTerm</SelectItem>
                        <SelectItem value="LongTerm">LongTerm</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addDurationType} size="sm">
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.durationTypes?.map((type) => (
                      <Badge key={type} variant="outline" className="flex items-center gap-1">
                        {type}
                        <button
                          type="button"
                          onClick={() => removeDurationType(type)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Loại gói</Label>
                  <div className="flex gap-2 mb-2">
                    <Select
                      value={newPackageType}
                      onValueChange={setNewPackageType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại gói" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membership">Membership</SelectItem>
                        <SelectItem value="Combo">Combo</SelectItem>
                        <SelectItem value="PT">PT</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addPackageType} size="sm">
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.packageTypes?.map((type) => (
                      <Badge key={type} variant="outline" className="flex items-center gap-1">
                        {type}
                        <button
                          type="button"
                          onClick={() => removePackageType(type)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thời gian áp dụng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                    required
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">Ngày kết thúc *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                    required
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateDiscountMutation.isPending}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={updateDiscountMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateDiscountMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật ưu đãi
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
