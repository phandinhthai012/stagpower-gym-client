import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useCreateSubscription } from '../../hooks/useSubscriptions';
import { useBranches } from '../../hooks/useBranches';
import { usePackages } from '../../hooks/usePackages';
import { Branch, Package } from '../../types';
import { 
  X, 
  Package as PackageIcon, 
  CreditCard,
  MapPin,
  Clock,
  Users,
  Crown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../../../lib/date-utils';

interface ModalRegisPackageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedPackage?: Package;
}

export function ModalRegisPackage({ isOpen, onClose, onSuccess, selectedPackage }: ModalRegisPackageProps) {
  const { user } = useAuth();
  const createSubscriptionMutation = useCreateSubscription();
  const { data: branchesResponse, isLoading: branchesLoading } = useBranches();
  const { data: packagesResponse, isLoading: packagesLoading } = usePackages();
  
  const [formData, setFormData] = useState({
    packageId: selectedPackage?._id || '',
    branchId: '',
    startDate: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'momo' | 'bank_transfer',
    notes: ''
  });

  const [selectedPackageInModal, setSelectedPackageInModal] = useState<Package | undefined>(selectedPackage);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Get data from API responses
  const branches: Branch[] = branchesResponse?.data || [];
  const packages: Package[] = packagesResponse || [];

  // Update form data when selectedPackage changes
  useEffect(() => {
    if (selectedPackage) {
      setSelectedPackageInModal(selectedPackage);
      setFormData(prev => ({
        ...prev,
        packageId: selectedPackage._id
      }));
    }
  }, [selectedPackage]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePackageSelect = (packageId: string) => {
    const pkg = packages.find(p => p._id === packageId);
    setSelectedPackageInModal(pkg);
    setFormData(prev => ({ ...prev, packageId }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.packageId) {
      newErrors.packageId = 'Vui lòng chọn gói tập';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.startDate = 'Ngày bắt đầu không thể là ngày trong quá khứ';
      }
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
      // Calculate end date based on package duration
      const packageInfo = selectedPackageInModal;
      if (!packageInfo) {
        throw new Error('Không tìm thấy thông tin gói tập');
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + packageInfo.durationMonths);

      const subscriptionData = {
        memberId: user?._id || user?.id,
        packageId: formData.packageId,
        branchId: formData.branchId,
        type: packageInfo.type,
        membershipType: packageInfo.membershipType || 'Basic',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        durationDays: packageInfo.durationMonths * 30,
        ptsessionsRemaining: packageInfo.ptSessions || 0,
        ptsessionsUsed: 0,
        status: 'Active' as const,
        isSuspended: false
      };

      await createSubscriptionMutation.mutateAsync(subscriptionData);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Đăng ký gói tập</h2>
              <p className="text-sm text-gray-500">Chọn gói tập và chi nhánh để bắt đầu</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package Selection */}
            {!selectedPackage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PackageIcon className="h-5 w-5" />
                    <span>Chọn gói tập</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="packageSelect">Gói tập *</Label>
                      <Select
                        value={formData.packageId}
                        onValueChange={handlePackageSelect}
                      >
                        <SelectTrigger className={errors.packageId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn gói tập" />
                        </SelectTrigger>
                        <SelectContent>
                          {packagesLoading ? (
                            <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                          ) : (
                            packages
                              .filter(pkg => pkg.status === 'Active')
                              .map((pkg) => (
                                <SelectItem key={pkg._id} value={pkg._id}>
                                  {pkg.name} - {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(pkg.price)}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.packageId && (
                        <p className="text-sm text-red-500 mt-1">{errors.packageId}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Package Selection */}
            {selectedPackageInModal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PackageIcon className="h-5 w-5" />
                    <span>Gói tập đã chọn</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPackageInModal.name}</h3>
                        <p className="text-sm text-gray-600">{selectedPackageInModal.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(selectedPackageInModal.price)}
                        </div>
                        <Badge className="mt-1 bg-blue-100 text-blue-800">
                          {selectedPackageInModal.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{selectedPackageInModal.durationMonths} tháng</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedPackageInModal.branchAccess === 'All' ? 'Tất cả chi nhánh' : '1 chi nhánh'}</span>
                      </div>
                      {selectedPackageInModal.ptSessions && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{selectedPackageInModal.ptSessions} buổi PT</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Thông tin đăng ký</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchId">Chi nhánh *</Label>
                    <Select
                      value={formData.branchId}
                      onValueChange={(value) => handleInputChange('branchId', value)}
                    >
                      <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        {branchesLoading ? (
                          <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                        ) : (
                          branches.map((branch) => (
                            <SelectItem key={branch._id} value={branch._id}>
                              {branch.name} - {branch.address}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.branchId && (
                      <p className="text-sm text-red-500 mt-1">{errors.branchId}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="card">Thẻ</SelectItem>
                      <SelectItem value="momo">MoMo</SelectItem>
                      <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ghi chú thêm (tùy chọn)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedPackageInModal && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Tóm tắt đăng ký</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gói tập:</span>
                      <span className="font-medium">{selectedPackageInModal.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời hạn:</span>
                      <span className="font-medium">{selectedPackageInModal.durationMonths} tháng</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loại:</span>
                      <span className="font-medium">{selectedPackageInModal.membershipType || 'Basic'}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatPrice(selectedPackageInModal.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPackageInModal}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Đăng ký ngay</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
