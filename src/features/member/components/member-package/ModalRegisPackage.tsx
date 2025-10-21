import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useCreateSubscription, useSubscriptionsByMemberId } from '../../hooks/useSubscriptions';
import { useCreatePayment, useCreateMomoPayment } from '../../hooks/usePayments';
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
import { ModalMomoPayment } from '../momo/ModalMomoPayment';

interface ModalRegisPackageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedPackage?: Package;
}

export function ModalRegisPackage({ isOpen, onClose, onSuccess, selectedPackage }: ModalRegisPackageProps) {
  const { user } = useAuth();
  const createSubscriptionMutation = useCreateSubscription();
  const createPaymentMutation = useCreatePayment();
  const { data: branchesResponse, isLoading: branchesLoading } = useBranches();
  const { data: packagesResponse, isLoading: packagesLoading } = usePackages();
  const { data: subscriptionsResponse } = useSubscriptionsByMemberId(user?._id || user?.id || '');
  const createMomoPaymentMutation = useCreateMomoPayment();
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // momo
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [momoData, setMomoData] = useState<{
    qrCodeUrl: string;
    deeplink: string;
    paymentId: string;
  } | null>(null);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Get data from API responses
  const branches: Branch[] = branchesResponse || [];
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

      // Kiểm tra xem member có gói đang Active không
      const subscriptions = subscriptionsResponse?.data || [];
      const activeSubscription = subscriptions.find((sub: any) => sub.status === 'Active');

      // Step 1: Tạo subscription với status PendingPayment
      // KHÔNG gửi startDate và endDate - sẽ được set khi thanh toán
      const newSubscriptionData = {
        memberId: user?._id || user?.id,
        packageId: formData.packageId,
        branchId: formData.branchId,
        type: packageInfo.type,
        membershipType: packageInfo.membershipType || 'Basic',
        // KHÔNG gửi startDate và endDate - sẽ được tính khi thanh toán
        durationDays: packageInfo.durationMonths * 30,
        ptsessionsRemaining: packageInfo.ptSessions || 0,
        ptsessionsUsed: 0,
        status: 'PendingPayment' as const, // Tạo với status PendingPayment
        isSuspended: false
      };

      const subscription = await createSubscriptionMutation.mutateAsync(newSubscriptionData);

      // Step 2: Tạo payment record cho subscription vừa tạo
      const createdSubscription = subscription?.data;
      if (createdSubscription && createdSubscription._id) {
        const paymentData = {
          subscriptionId: createdSubscription._id,
          memberId: createdSubscription.memberId,
          originalAmount: packageInfo.price,
          amount: packageInfo.price, // Có thể áp dụng discount sau
          paymentMethod: formData.paymentMethod === 'cash' ? 'Cash' :
            formData.paymentMethod === 'card' ? 'Card' :
              formData.paymentMethod === 'momo' ? 'Momo' : 'BankTransfer',
          paymentStatus: 'Pending' as const,
          // KHÔNG set paymentDate khi chưa thanh toán
          notes: formData.notes || ''
        };

        // Gọi API tạo payment
        // try {
        //   await createPaymentMutation.mutateAsync(paymentData);
        //   console.log('Payment created successfully');

        // } catch (paymentError) {
        //   console.error('Error creating payment:', paymentError);
        //   // Vẫn hiển thị thành công vì subscription đã được tạo
        //   alert('Đăng ký gói tập thành công! Vui lòng liên hệ admin để thanh toán.');
        // }
        if (formData.paymentMethod === 'momo') {
          try {
            console.log('paymentData', paymentData);
            const response = await createMomoPaymentMutation.mutateAsync(paymentData);
            console.log('response', response);
            setMomoData({
              qrCodeUrl: response.data.qrCodeUrl,
              deeplink: response.data.deeplink,
              paymentId: response.data.orderId
            });
            console.log('MoMo payment created successfully');
          } catch (momoError) {
            console.error('Error creating MoMo payment:', momoError);
          }
          setShowMomoModal(true);

        } else {
          try {
            await createPaymentMutation.mutateAsync(paymentData);
            console.log('Payment created successfully');
          } catch (paymentError) {
            console.error('Error creating payment:', paymentError);
            alert('Đăng ký gói tập thành công! Vui lòng liên hệ admin để thanh toán.');
          }
          // Hiển thị modal xác nhận
          setShowSuccessModal(true);
        }
      }


    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Có lỗi xảy ra khi đăng ký gói tập. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleMomoCancel = () => {
    setShowMomoModal(false);
    setMomoData(null);
    // Có thể hủy payment hoặc để user tự xử lý
    alert('Bạn đã hủy thanh toán. Vui lòng liên hệ admin để hoàn tất.');
    onClose();
  };
  const handleMomoSuccess = () => {
    setShowMomoModal(false);
    setMomoData(null);
    setShowSuccessModal(true); // Hiển thị success modal
    onSuccess?.(); // Gọi callback
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
                    <div className="flex justify-between">
                      <span>Phương thức thanh toán:</span>
                      <span className="font-medium">
                        {formData.paymentMethod === 'cash' ? 'Tiền mặt' :
                          formData.paymentMethod === 'card' ? 'Thẻ' :
                            formData.paymentMethod === 'momo' ? 'MoMo' : 'Chuyển khoản'}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatPrice(selectedPackageInModal.price)}</span>
                    </div>
                  </div>

                  {/* Payment Status Info */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Gói tập sẽ được kích hoạt khi thanh toán thành công!
                    </p>
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
                <span>Đang đăng ký...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Đăng ký gói tập</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowSuccessModal(false);
              onSuccess?.();
              onClose();
            }}
          />
          <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🎉 Đăng ký thành công!
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có muốn chuyển đến trang thanh toán để hoàn tất thanh toán ngay không?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onSuccess?.();
                    onClose();
                  }}
                >
                  Không
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onSuccess?.();
                    onClose();
                    window.location.href = '/member/payments';
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ✅ THÊM MỚI: MoMo Payment Modal */}
      {showMomoModal && momoData && (
        <ModalMomoPayment
          open={showMomoModal}
          qrCodeUrl={momoData.qrCodeUrl}
          deeplink={momoData.deeplink}
          amount={selectedPackageInModal?.price || 0}
          paymentId={momoData.paymentId}
          onCancel={handleMomoCancel}
          onSuccess={handleMomoSuccess}
        />
      )}
    </div>
  );
}


