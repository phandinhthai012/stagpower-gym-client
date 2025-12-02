import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useCreatePackage } from '../../hooks/usePackages';
import { useBranches } from '../../hooks/useBranches';
import { toast } from 'sonner';
import {
  X,
  Package,
  DollarSign,
  Calendar,
  Users,
  Plus,
  Dumbbell,
  Building2,
  FileText
} from 'lucide-react';

interface ModalCreatePackageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalCreatePackage({ isOpen, onClose, onSuccess }: ModalCreatePackageProps) {
  const createPackageMutation = useCreatePackage();
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    packageCategory: '',
    durationMonths: '',
    membershipType: '',
    price: '',
    ptSessions: '',
    ptSessionDuration: '',
    branchAccess: '',
    description: '',
    isTrial: false,
    maxTrialDays: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên gói là bắt buộc';
    }

    if (!formData.type) {
      newErrors.type = 'Loại gói là bắt buộc';
    }

    if (!formData.packageCategory) {
      newErrors.packageCategory = 'Thời hạn là bắt buộc';
    }

    if (!formData.durationMonths) {
      newErrors.durationMonths = 'Số tháng là bắt buộc';
    }

    if ((formData.type === 'Membership' || formData.type === 'Combo') && !formData.membershipType) {
      newErrors.membershipType = 'Loại membership là bắt buộc';
    }

    if (!formData.price) {
      newErrors.price = 'Giá gốc là bắt buộc';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Giá phải là số dương';
    }

    if (!formData.branchAccess) {
      newErrors.branchAccess = 'Quyền truy cập là bắt buộc';
    }

    // Validate PT sessions for PT and Combo types
    if ((formData.type === 'PT' || formData.type === 'Combo') && (!formData.ptSessions || isNaN(Number(formData.ptSessions)) || Number(formData.ptSessions) <= 0)) {
      newErrors.ptSessions = 'Số buổi PT là bắt buộc và phải lớn hơn 0';
    }

    // Validate PT session duration for PT and Combo types
    if ((formData.type === 'PT' || formData.type === 'Combo') && (!formData.ptSessionDuration || isNaN(Number(formData.ptSessionDuration)) || Number(formData.ptSessionDuration) <= 0)) {
      newErrors.ptSessionDuration = 'Thời lượng buổi PT là bắt buộc và phải lớn hơn 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (formData.isTrial && (!formData.maxTrialDays || isNaN(Number(formData.maxTrialDays)) || Number(formData.maxTrialDays) <= 0)) {
      newErrors.maxTrialDays = 'Số ngày thử nghiệm phải là số dương';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', formData);
    if (!validateForm()) {
      console.log('Form validation failed');
      console.log('Current errors:', errors);
      console.log('Form data:', formData);
      return;
    }

    // Prepare data for API
    const packageData = {
      name: formData.name,
      type: formData.type,
      packageCategory: formData.packageCategory,
      durationMonths: Number(formData.durationMonths),
      membershipType: formData.membershipType || undefined,
      price: Number(formData.price),
      ptSessions: formData.ptSessions ? Number(formData.ptSessions) : undefined,
      ptSessionDuration: formData.ptSessionDuration ? Number(formData.ptSessionDuration) : undefined,
      branchAccess: formData.branchAccess,
      description: formData.description,
      isTrial: formData.isTrial,
      maxTrialDays: formData.isTrial ? Number(formData.maxTrialDays) : undefined,
      status: formData.status
    };

    console.log('Package data to submit:', packageData);

    createPackageMutation.mutate(packageData, {
      onSuccess: (data) => {
        console.log('Package created successfully:', data);
        // toast.success('Gói tập đã được tạo thành công!');
        
        // Reset form
        setFormData({
          name: '',
          type: '',
          packageCategory: '',
          durationMonths: '',
          membershipType: '',
          price: '',
          ptSessions: '',
          ptSessionDuration: '',
          branchAccess: '',
          description: '',
          isTrial: false,
          maxTrialDays: '',
          status: 'Active'
        });
        
        // Clear errors
        setErrors({});
        
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        console.error('Error creating package:', error);
        toast.error(`Lỗi khi tạo gói tập: ${error?.message || 'Có lỗi xảy ra'}`);
      }
    });
  };

  const handleClose = () => {
    if (!createPackageMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Tạo gói tập mới
              </h2>
              <p className="text-sm text-gray-500">
                Thêm gói tập mới vào hệ thống
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={createPackageMutation.isPending}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Thông tin cơ bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Tên gói <span className="text-red-500">*</span>
                      {errors.name && <span className="text-red-500 ml-1">({errors.name})</span>}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="VD: Gói VIP 6 tháng"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">
                      Loại gói <span className="text-red-500">*</span>
                      {errors.type && <span className="text-red-500 ml-1">({errors.type})</span>}
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn loại gói" />
                      </SelectTrigger>
                      <SelectContent lockScroll={false}>
                        <SelectItem value="Membership">Membership</SelectItem>
                        <SelectItem value="Combo">Combo (Membership + PT)</SelectItem>
                        <SelectItem value="PT">PT riêng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="packageCategory">
                      Thời hạn <span className="text-red-500">*</span>
                      {errors.packageCategory && <span className="text-red-500 ml-1">({errors.packageCategory})</span>}
                    </Label>
                    <Select
                      value={formData.packageCategory}
                      onValueChange={(value) => handleInputChange('packageCategory', value)}
                    >
                      <SelectTrigger className={errors.packageCategory ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn thời hạn" />
                      </SelectTrigger>
                      <SelectContent lockScroll={false}>
                        <SelectItem value="ShortTerm">Ngắn hạn (1 tháng)</SelectItem>
                        <SelectItem value="MediumTerm">Trung hạn (3-6 tháng)</SelectItem>
                        <SelectItem value="LongTerm">Dài hạn (12 tháng)</SelectItem>
                        <SelectItem value="Trial">Gói thử (1-7 ngày)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="durationMonths">
                      Số tháng <span className="text-red-500">*</span>
                      {errors.durationMonths && <span className="text-red-500 ml-1">({errors.durationMonths})</span>}
                    </Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formData.durationMonths}
                      onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                      placeholder="1, 3, 6, 12"
                      className={errors.durationMonths ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    Mô tả gói <span className="text-red-500">*</span>
                    {errors.description && <span className="text-red-500 ml-1">({errors.description})</span>}
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full p-3 border rounded-md resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    rows={3}
                    placeholder="Mô tả chi tiết về gói tập..."
                  />
                </div>

                {/* Trial Package Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTrial"
                      checked={formData.isTrial}
                      onChange={(e) => handleInputChange('isTrial', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isTrial">Gói thử nghiệm</Label>
                  </div>
                  {formData.isTrial && (
                    <div>
                      <Label htmlFor="maxTrialDays">
                        Số ngày thử nghiệm <span className="text-red-500">*</span>
                        {errors.maxTrialDays && <span className="text-red-500 ml-1">({errors.maxTrialDays})</span>}
                      </Label>
                      <Input
                        id="maxTrialDays"
                        type="number"
                        value={formData.maxTrialDays}
                        onChange={(e) => handleInputChange('maxTrialDays', e.target.value)}
                        placeholder="3, 7, 14"
                        className={errors.maxTrialDays ? 'border-red-500' : ''}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Membership Information */}
            {(formData.type === 'Membership' || formData.type === 'Combo') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Thông tin Membership</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="membershipType">
                        Loại Membership <span className="text-red-500">*</span>
                        {errors.membershipType && <span className="text-red-500 ml-1">({errors.membershipType})</span>}
                      </Label>
                      <Select
                        value={formData.membershipType}
                        onValueChange={(value) => handleInputChange('membershipType', value)}
                      >
                        <SelectTrigger className={errors.membershipType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent lockScroll={false}>
                          <SelectItem value="Basic">Basic (1 chi nhánh)</SelectItem>
                          <SelectItem value="VIP">VIP (Tất cả chi nhánh)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branchAccess">
                        Quyền truy cập <span className="text-red-500">*</span>
                        {errors.branchAccess && <span className="text-red-500 ml-1">({errors.branchAccess})</span>}
                      </Label>
                      <Select
                        value={formData.branchAccess}
                        onValueChange={(value) => handleInputChange('branchAccess', value)}
                      >
                        <SelectTrigger className={errors.branchAccess ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn quyền" />
                        </SelectTrigger>
                        <SelectContent lockScroll={false}>
                          <SelectItem value="Single">1 chi nhánh</SelectItem>
                          <SelectItem value="All">Tất cả chi nhánh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PT Information */}
            {(formData.type === 'PT' || formData.type === 'Combo') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dumbbell className="h-5 w-5 text-purple-600" />
                    <span>Thông tin PT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ptSessions">
                        Số buổi PT <span className="text-red-500">*</span>
                        {errors.ptSessions && <span className="text-red-500 ml-1">({errors.ptSessions})</span>}
                      </Label>
                      <Input
                        id="ptSessions"
                        type="number"
                        value={formData.ptSessions}
                        onChange={(e) => handleInputChange('ptSessions', e.target.value)}
                        placeholder="0 nếu không có PT"
                        className={errors.ptSessions ? 'border-red-500' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ptSessionDuration">
                        Thời lượng buổi PT (phút) <span className="text-red-500">*</span>
                        {errors.ptSessionDuration && <span className="text-red-500 ml-1">({errors.ptSessionDuration})</span>}
                      </Label>
                      <Input
                        id="ptSessionDuration"
                        type="number"
                        value={formData.ptSessionDuration}
                        onChange={(e) => handleInputChange('ptSessionDuration', e.target.value)}
                        placeholder="90"
                        className={errors.ptSessionDuration ? 'border-red-500' : ''}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span>Thông tin giá</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                    {errors.price && <span className="text-red-500 ml-1">({errors.price})</span>}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2000000"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPackageMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createPackageMutation.isPending}
                className="flex items-center space-x-2"
              >
                {createPackageMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Tạo gói tập</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
