import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useCreateDiscount } from '../../hooks/useDiscounts';
import { CreateDiscountData } from '../../types/discount.types';
import { 
  X, 
  Percent, 
  DollarSign, 
  Calendar, 
  Clock,
  Gift,
  Tag,
  Users,
  Package
} from 'lucide-react';

interface ModalCreateDiscountProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCreateDiscount({ isOpen, onClose }: ModalCreateDiscountProps) {
  const [formData, setFormData] = useState<CreateDiscountData>({
    name: '',
    type: '',
    discountPercentage: undefined,
    discountAmount: undefined,
    maxDiscount: undefined,
    bonusDays: undefined,
    conditions: '',
    durationTypes: [],
    packageTypes: [],
    startDate: '',
    endDate: '',
    status: 'Active'
  });

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

  const createDiscountMutation = useCreateDiscount();

  const handleInputChange = (field: keyof CreateDiscountData, value: string | number | boolean | string[]) => {
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
    if (newDurationType && !formData.durationTypes.includes(newDurationType)) {
      handleInputChange('durationTypes', [...formData.durationTypes, newDurationType]);
      setNewDurationType('');
    }
  };

  const removeDurationType = (type: string) => {
    handleInputChange('durationTypes', formData.durationTypes.filter(t => t !== type));
  };

  const addPackageType = () => {
    if (newPackageType && !formData.packageTypes.includes(newPackageType)) {
      handleInputChange('packageTypes', [...formData.packageTypes, newPackageType]);
      setNewPackageType('');
    }
  };

  const removePackageType = (type: string) => {
    handleInputChange('packageTypes', formData.packageTypes.filter(t => t !== type));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên ưu đãi là bắt buộc';
    }

    if (!formData.type) {
      newErrors.type = 'Loại ưu đãi là bắt buộc';
    }

    if (!formData.discountPercentage && !formData.discountAmount) {
      newErrors.discountPercentage = 'Phải có ít nhất một loại giảm giá';
      newErrors.discountAmount = 'Phải có ít nhất một loại giảm giá';
    }

    if (!formData.conditions.trim()) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createDiscountMutation.mutateAsync(formData);
      onClose();
      setFormData({
        name: '',
        type: '',
        discountPercentage: undefined,
        discountAmount: undefined,
        maxDiscount: undefined,
        bonusDays: undefined,
        conditions: '',
        durationTypes: [],
        packageTypes: [],
        startDate: '',
        endDate: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error creating discount:', error);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              Thêm Ưu Đãi Mới
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
                  <Label htmlFor="name">
                    Tên ưu đãi <span className="text-red-500">*</span>
                    {errors.name && <span className="text-red-500 ml-1">({errors.name})</span>}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="VD: Ưu đãi HSSV - Giảm 15%"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="type">
                    Loại ưu đãi <span className="text-red-500">*</span>
                    {errors.type && <span className="text-red-500 ml-1">({errors.type})</span>}
                  </Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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

              <div>
                <Label htmlFor="conditions">
                  Điều kiện áp dụng <span className="text-red-500">*</span>
                  {errors.conditions && <span className="text-red-500 ml-1">({errors.conditions})</span>}
                </Label>
                <textarea
                  id="conditions"
                  className={`w-full p-3 border rounded-md resize-none ${errors.conditions ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  placeholder="Mô tả điều kiện áp dụng ưu đãi..."
                  value={formData.conditions}
                  onChange={(e) => handleInputChange('conditions', e.target.value)}
                />
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
                  <Label htmlFor="discountPercentage">
                    Giảm giá %
                    {errors.discountPercentage && <span className="text-red-500 ml-1">({errors.discountPercentage})</span>}
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage || ''}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="15"
                    min="1"
                    max="100"
                    className={errors.discountPercentage ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <Label htmlFor="discountAmount">
                    Giảm giá cố định (VNĐ)
                    {errors.discountAmount && <span className="text-red-500 ml-1">({errors.discountAmount})</span>}
                  </Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={formData.discountAmount || ''}
                    onChange={(e) => handleInputChange('discountAmount', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="100000"
                    min="0"
                    className={errors.discountAmount ? 'border-red-500' : ''}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={formData.status} 
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
                    <Input
                      value={newDurationType}
                      onChange={(e) => setNewDurationType(e.target.value)}
                      placeholder="Nhập loại thời hạn"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.durationTypes.map((type) => (
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
                  <Button type="button" onClick={addDurationType} size="sm" className="mt-2">
                    Thêm
                  </Button>
                </div>

                <div>
                  <Label>Loại gói</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newPackageType}
                      onChange={(e) => setNewPackageType(e.target.value)}
                      placeholder="Nhập loại gói"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.packageTypes.map((type) => (
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
                  <Button type="button" onClick={addPackageType} size="sm" className="mt-2">
                    Thêm
                  </Button>
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
                  <Label htmlFor="startDate">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                    {errors.startDate && <span className="text-red-500 ml-1">({errors.startDate})</span>}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">
                    Ngày kết thúc <span className="text-red-500">*</span>
                    {errors.endDate && <span className="text-red-500 ml-1">({errors.endDate})</span>}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createDiscountMutation.isPending}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={createDiscountMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {createDiscountMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Tạo ưu đãi
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
