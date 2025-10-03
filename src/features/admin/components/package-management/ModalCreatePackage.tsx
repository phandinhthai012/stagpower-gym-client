import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { 
  X, 
  Package, 
  DollarSign,
  Calendar,
  Users,
  Dumbbell,
  Building2,
  FileText,
  Plus
} from 'lucide-react';

interface ModalCreatePackageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalCreatePackage({ isOpen, onClose, onSuccess }: ModalCreatePackageProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    package_category: '',
    duration_months: '',
    membership_type: '',
    price: '',
    pt_sessions: '',
    pt_session_duration: '',
    branch_access: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  const handleInputChange = (field: string, value: string) => {
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

    if (!formData.package_category) {
      newErrors.package_category = 'Thời hạn là bắt buộc';
    }

    if (!formData.duration_months) {
      newErrors.duration_months = 'Số tháng là bắt buộc';
    }

    if (formData.type === 'Membership' && !formData.membership_type) {
      newErrors.membership_type = 'Loại membership là bắt buộc';
    }

    if (!formData.price) {
      newErrors.price = 'Giá gốc là bắt buộc';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Giá phải là số dương';
    }

    if (formData.pt_sessions && (isNaN(Number(formData.pt_sessions)) || Number(formData.pt_sessions) < 0)) {
      newErrors.pt_sessions = 'Số buổi PT phải là số không âm';
    }

    if (formData.pt_session_duration && (isNaN(Number(formData.pt_session_duration)) || Number(formData.pt_session_duration) <= 0)) {
      newErrors.pt_session_duration = 'Thời lượng buổi PT phải là số dương';
    }

    if (!formData.branch_access) {
      newErrors.branch_access = 'Quyền truy cập là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create package
      console.log('Creating package:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        package_category: '',
        duration_months: '',
        membership_type: '',
        price: '',
        pt_sessions: '',
        pt_session_duration: '',
        branch_access: '',
        description: ''
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
            disabled={isSubmitting}
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
                    <Label htmlFor="name">Tên gói *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="VD: Gói VIP 6 tháng"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Loại gói *</Label>
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
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package_category">Thời hạn *</Label>
                    <Select
                      value={formData.package_category}
                      onValueChange={(value) => handleInputChange('package_category', value)}
                    >
                      <SelectTrigger className={errors.package_category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn thời hạn" />
                      </SelectTrigger>
                      <SelectContent lockScroll={false}>
                        <SelectItem value="ShortTerm">Ngắn hạn (1 tháng)</SelectItem>
                        <SelectItem value="MediumTerm">Trung hạn (3-6 tháng)</SelectItem>
                        <SelectItem value="LongTerm">Dài hạn (12 tháng)</SelectItem>
                        <SelectItem value="Trial">Gói thử (1-7 ngày)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.package_category && (
                      <p className="text-sm text-red-500 mt-1">{errors.package_category}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="duration_months">Số tháng *</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => handleInputChange('duration_months', e.target.value)}
                      placeholder="1, 3, 6, 12"
                      className={errors.duration_months ? 'border-red-500' : ''}
                    />
                    {errors.duration_months && (
                      <p className="text-sm text-red-500 mt-1">{errors.duration_months}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả gói</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả chi tiết về gói tập..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Membership Information */}
            {formData.type === 'Membership' && (
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
                      <Label htmlFor="membership_type">Loại Membership *</Label>
                      <Select
                        value={formData.membership_type}
                        onValueChange={(value) => handleInputChange('membership_type', value)}
                      >
                        <SelectTrigger className={errors.membership_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent lockScroll={false}>
                          <SelectItem value="Basic">Basic (1 chi nhánh)</SelectItem>
                          <SelectItem value="VIP">VIP (Tất cả chi nhánh)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.membership_type && (
                        <p className="text-sm text-red-500 mt-1">{errors.membership_type}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="branch_access">Quyền truy cập *</Label>
                      <Select
                        value={formData.branch_access}
                        onValueChange={(value) => handleInputChange('branch_access', value)}
                      >
                        <SelectTrigger className={errors.branch_access ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn quyền" />
                        </SelectTrigger>
                        <SelectContent lockScroll={false}>
                          <SelectItem value="Single">1 chi nhánh</SelectItem>
                          <SelectItem value="All">Tất cả chi nhánh</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.branch_access && (
                        <p className="text-sm text-red-500 mt-1">{errors.branch_access}</p>
                      )}
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
                      <Label htmlFor="pt_sessions">Số buổi PT</Label>
                      <Input
                        id="pt_sessions"
                        type="number"
                        value={formData.pt_sessions}
                        onChange={(e) => handleInputChange('pt_sessions', e.target.value)}
                        placeholder="0 nếu không có PT"
                        className={errors.pt_sessions ? 'border-red-500' : ''}
                      />
                      {errors.pt_sessions && (
                        <p className="text-sm text-red-500 mt-1">{errors.pt_sessions}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="pt_session_duration">Thời lượng buổi PT (phút)</Label>
                      <Input
                        id="pt_session_duration"
                        type="number"
                        value={formData.pt_session_duration}
                        onChange={(e) => handleInputChange('pt_session_duration', e.target.value)}
                        placeholder="90"
                        className={errors.pt_session_duration ? 'border-red-500' : ''}
                      />
                      {errors.pt_session_duration && (
                        <p className="text-sm text-red-500 mt-1">{errors.pt_session_duration}</p>
                      )}
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
                  <Label htmlFor="price">Giá gốc (VNĐ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2000000"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
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
      </div>
    </div>
  );
}
