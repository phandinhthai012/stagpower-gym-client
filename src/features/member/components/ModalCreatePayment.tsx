import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Smartphone,
  Clock,
  Tag,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreateSubscription } from '../hooks/useSubscriptions';
import { useCreatePayment, useCreateMomoPayment } from '../hooks/usePayments';
import { useBranches } from '../hooks/useBranches';
import { ModalMomoPayment } from './momo/ModalMomoPayment';
import { subscriptionApi } from '../api/subscription.api';
// ========== NEW: Import discount hook ==========
import { useValidateDiscountCode } from '../hooks/useDiscounts';
interface ModalCreatePaymentProps {
  open: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  amount: number;
  packageType?: 'Membership' | 'Combo' | 'PT';
  membershipType?: 'Basic' | 'VIP';
  durationMonths?: number;
  ptSessions?: number;
  isRenewal?: boolean; // Thêm flag để phân biệt gia hạn
  currentSubscriptionId?: string; // ID của subscription hiện tại (nếu là gia hạn)
  onSuccess?: () => void;
}

export function ModalCreatePayment({
  open,
  onClose,
  packageId,
  packageName,
  amount,
  packageType = 'Membership',
  membershipType = 'Basic',
  durationMonths = 1,
  ptSessions = 0,
  isRenewal = false,
  currentSubscriptionId,
  onSuccess
}: ModalCreatePaymentProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cash' | 'bank_transfer'>('momo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [momoData, setMomoData] = useState<{
    qrCodeUrl: string;
    deeplink: string;
    paymentId: string;
  } | null>(null);
  
  // ========== NEW: Discount states ==========
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState(amount);
  const [discountDetails, setDiscountDetails] = useState<any[]>([]);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  // Get originalAmount: nếu đã apply discount thì dùng từ result, nếu chưa thì dùng từ prop amount
  const originalAmount = appliedDiscount?.originalAmount || amount || 0;


  const { data: branches } = useBranches();
  const createSubscriptionMutation = useCreateSubscription();
  const createPaymentMutation = useCreatePayment();
  const createMomoPaymentMutation = useCreateMomoPayment();
  const validateDiscountMutation = useValidateDiscountCode();
  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setPaymentMethod('momo');
      setIsSubmitting(false);
      setShowMomoModal(false);
      setMomoData(null);
      // ========== NEW: Reset discount states ==========
      setDiscountCode('');
      setAppliedDiscount(null);
      setFinalAmount(amount);
      setDiscountDetails([]);
    } else {
      // ========== NEW: Reset finalAmount when modal opens or amount changes ==========
      if (!appliedDiscount) {
        setFinalAmount(amount);
      }
    }
  }, [open, amount]);
  // ========== NEW: Handle apply discount code ==========
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (!user?.id && !user?._id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    setIsValidatingDiscount(true);
    try {
      const memberId = user?._id || user?.id;
      
      // Đảm bảo originalAmount là số hợp lệ - luôn dùng amount prop vì đây là giá gốc từ package
      const currentOriginalAmount = Number(amount) || 0;
      if (!currentOriginalAmount || currentOriginalAmount <= 0) {
        toast.error('Giá gốc không hợp lệ');
        setIsValidatingDiscount(false);
        return;
      }

      console.log('Applying discount with:', {
        code: discountCode.trim().toUpperCase(),
        packageId,
        originalAmount: currentOriginalAmount,
      });

      // Backend sẽ tự lấy packageType và packageCategory từ packageId
      const result = await validateDiscountMutation.mutateAsync({
        code: discountCode.trim().toUpperCase(),
        memberId,
        packageId,
        originalAmount: currentOriginalAmount,
        // Không gửi packageType - backend sẽ tự lấy từ Package model
      });

      // Debug log
      console.log('Discount result:', result);
      console.log('Final amount:', result.finalAmount);
      console.log('Original amount from result:', result.originalAmount);
      console.log('Current amount prop:', amount);
      
      // Kiểm tra finalAmount hợp lệ
      if (result.finalAmount === undefined || result.finalAmount === null || isNaN(result.finalAmount)) {
        console.error('Invalid finalAmount from backend:', result);
        toast.error('Có lỗi xảy ra khi tính toán giảm giá');
        return;
      }

      // Đảm bảo originalAmount từ result được sử dụng
      if (!result.originalAmount || result.originalAmount <= 0) {
        console.error('Invalid originalAmount from backend:', result);
        toast.error('Có lỗi xảy ra: số tiền gốc không hợp lệ');
        return;
      }

      setAppliedDiscount(result);
      // Sử dụng finalAmount từ result (đã được validate)
      setFinalAmount(Number(result.finalAmount));
      setDiscountDetails(result.discountDetails ? [result.discountDetails] : []);
      toast.success(`Đã áp dụng mã giảm giá: ${result.discount.name}`);
    } catch (error: any) {
      console.error('Error validating discount:', error);
      // Error toast đã được xử lý trong hook
      setAppliedDiscount(null);
      setDiscountDetails([]);
      setFinalAmount(amount);
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  // ========== NEW: Handle remove discount ==========
  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountDetails([]);
    setFinalAmount(amount);
    toast.info('Đã xóa mã giảm giá');
  };

  const handleSubmit = async () => {
    if (!user?.id && !user?._id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    setIsSubmitting(true);

    try {
      const memberId = user?._id || user?.id;
      const branchId = branches && branches.length > 0 ? branches[0]._id : null;

      const paymentMethodMap = {
        'momo': 'Momo',
        'cash': 'Cash',
        'bank_transfer': 'BankTransfer'
      };

      let createdSubscription: any;
      let paymentData: any;

      if (isRenewal && currentSubscriptionId) {
        // GIA HẠN: Gọi API renewSubscription
        const renewResponse = await subscriptionApi.renewSubscription(currentSubscriptionId, {
          newPackageId: packageId,
          branchId: branchId || undefined,
          paymentDetails: {
            amount: finalAmount, // ========== NEW: Use finalAmount instead of amount ==========
            originalAmount: originalAmount, // ========== NEW: Include originalAmount ==========
            paymentMethod: paymentMethodMap[paymentMethod],
            discountDetails: discountDetails // ========== NEW: Include discountDetails ==========
          },
          isPaid: paymentMethod !== 'momo',
          paymentDate: paymentMethod !== 'momo' ? new Date().toISOString() : undefined
        });

        createdSubscription = renewResponse?.data?.subscription;
        paymentData = renewResponse?.data?.payment;

        if (!createdSubscription || !paymentData) {
          throw new Error('Không thể gia hạn subscription');
        }

        // Nếu đã thanh toán (cash/bank) thì đóng modal luôn
        if (paymentMethod !== 'momo') {
          toast.success('Đã gia hạn gói tập thành công!');
          if (onSuccess) onSuccess();
          onClose();
          setIsSubmitting(false);
          return;
        }

        // Nếu là Momo, kiểm tra QR code từ response hoặc payment
        if (paymentMethod === 'momo') {
          const momoPayment = renewResponse?.data?.momoPayment;
          const qrUrl = paymentData.paymentQrCode || momoPayment?.qrCodeUrl || momoPayment?.payUrl;
          
          if (qrUrl) {
            setMomoData({
              qrCodeUrl: qrUrl,
              deeplink: momoPayment?.deeplink || '',
              paymentId: paymentData._id || paymentData.invoiceNumber || ''
            });
            setShowMomoModal(true);
            setIsSubmitting(false);
            return;
          }
          // Nếu không có QR code từ backend, sẽ xử lý ở phần dưới
        }
      } else {
        // ĐĂNG KÝ MỚI: Tạo subscription mới
        const subscriptionData = {
          memberId,
          packageId,
          branchId,
          type: packageType,
          membershipType,
          durationDays: durationMonths * 30,
          ptsessionsRemaining: ptSessions || 0,
          ptsessionsUsed: 0,
          status: 'PendingPayment' as const,
        };

        const subscriptionResponse = await createSubscriptionMutation.mutateAsync(subscriptionData);
        createdSubscription = subscriptionResponse?.data;

        if (!createdSubscription?._id) {
          throw new Error('Không thể tạo subscription');
        }

        // Xác định paymentType
        let paymentType: 'NEW_SUBSCRIPTION' | 'RENEWAL' | 'PT_PURCHASE' = 'NEW_SUBSCRIPTION';
        if (packageType === 'PT') {
          paymentType = 'PT_PURCHASE';
        }

        paymentData = {
          subscriptionId: createdSubscription._id,
          memberId,
          originalAmount: originalAmount, // ========== NEW: Use originalAmount ==========
          amount: finalAmount, // ========== NEW: Use finalAmount instead of amount ==========
          paymentMethod: paymentMethodMap[paymentMethod],
          paymentStatus: 'Pending' as const,
          paymentType: paymentType,
          discountDetails: discountDetails, // ========== NEW: Include discountDetails ==========
        };
      }

      // Xử lý thanh toán cho cả renewal và new subscription
      if (paymentMethod === 'momo') {
        // Tạo Momo payment với QR code (chỉ khi chưa có payment từ renewal)
        if (!isRenewal || !paymentData) {
          try {
            const momoResponse = await createMomoPaymentMutation.mutateAsync(paymentData);
            
            // Momo API response structure
            const momoData_response = momoResponse?.data?.data || momoResponse?.data;
            
            // Lưu QR code info để hiển thị
            if (momoData_response?.qrCodeUrl || momoData_response?.payUrl) {
              setMomoData({
                qrCodeUrl: momoData_response.qrCodeUrl || momoData_response.payUrl || '',
                deeplink: momoData_response.deeplink || '',
                paymentId: momoData_response.orderId || createdSubscription._id
              });
              setShowMomoModal(true);
            } else {
              throw new Error('Không nhận được QR code từ Momo');
            }
          } catch (momoError: any) {
            console.error('Error creating Momo payment:', momoError);
            toast.error(momoError?.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán Momo');
          }
        } else {
          // Renewal đã tạo payment với paymentType = 'RENEWAL'
          // QR code đã được xử lý ở trên (dòng 128-144), không cần xử lý lại
        }
      }
      
      // Xử lý cash/bank transfer (chỉ khi không phải renewal)
      if (paymentMethod !== 'momo' && !isRenewal) {
        try {
          await createPaymentMutation.mutateAsync(paymentData);
          toast.success('Đã tạo thanh toán thành công! Vui lòng liên hệ admin để xác nhận.');
          if (onSuccess) onSuccess();
          onClose();
        } catch (paymentError: any) {
          console.error('Error creating payment:', paymentError);
          toast.error(paymentError?.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán');
        }
      }
    } catch (error: any) {
      console.error('Error creating subscription and payment:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký gói tập');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMomoCancel = () => {
    setShowMomoModal(false);
    setMomoData(null);
    toast.info('Bạn đã hủy thanh toán. Vui lòng liên hệ admin để hoàn tất.');
    onClose();
  };

  const handleMomoSuccess = () => {
    setShowMomoModal(false);
    setMomoData(null);
    if (onSuccess) onSuccess();
    toast.success('Thanh toán thành công!');
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <Card className="relative w-full max-w-4xl bg-white">
          <button
            aria-label="Đóng"
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 z-10"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold text-blue-900">
              Xác nhận thanh toán
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Package Info & Discount */}
              <div className="space-y-4">
                {/* Package Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gói tập:</span>
                      <span className="font-medium text-blue-900">{packageName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Loại:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {packageType === 'PT' ? 'Mua buổi tập' : 
                         packageType === 'Combo' ? 'Combo' : 
                         'Đăng ký gói mới'}
                      </Badge>
                    </div>

                    {/* ========== NEW: Discount Code Input Section ========== */}
                    <div className="pt-3 border-t space-y-2">
                      <Label htmlFor="discountCode" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Mã giảm giá (nếu có)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="discountCode"
                          type="text"
                          placeholder="Nhập mã giảm giá..."
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyDiscount();
                            }
                          }}
                          disabled={isValidatingDiscount || isSubmitting}
                          className="flex-1"
                        />
                        {appliedDiscount ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveDiscount}
                            disabled={isSubmitting}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Xóa
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleApplyDiscount}
                            disabled={isValidatingDiscount || isSubmitting || !discountCode.trim()}
                            className="flex items-center gap-1"
                          >
                            {isValidatingDiscount ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Áp dụng'
                            )}
                          </Button>
                        )}
                      </div>

                      {/* ========== NEW: Display discount info when applied ========== */}
                      {appliedDiscount && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-green-600">{appliedDiscount.discount.name}</Badge>
                                {appliedDiscount.discount.code && (
                                  <span className="text-sm text-gray-600">({appliedDiscount.discount.code})</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{appliedDiscount.discount.conditions}</p>
                              <div className="text-sm space-y-1 mt-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Giá gốc:</span>
                                  <span>{appliedDiscount.originalAmount.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-medium">
                                  <span>Giảm giá:</span>
                                  <span>-{appliedDiscount.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                {appliedDiscount.bonusDays > 0 && (
                                  <div className="flex justify-between text-purple-600 text-xs">
                                    <span>Tặng thêm:</span>
                                    <span>+{appliedDiscount.bonusDays} ngày tập</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-lg font-semibold text-gray-900">Thành tiền:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-900">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(finalAmount)}
                        </span>
                        {/* ========== NEW: Show original amount if discount applied ========== */}
                        {appliedDiscount && (
                          <div className="text-xs text-gray-500 line-through mt-1">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(originalAmount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Method Selection */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Chọn phương thức thanh toán</h4>
                  <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💜</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Ví MoMo</div>
                      <div className="text-sm text-gray-600">Thanh toán online qua QR code</div>
                    </div>
                    {paymentMethod === 'momo' && (
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💵</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Tiền mặt</div>
                      <div className="text-sm text-gray-600">Thanh toán tại phòng gym</div>
                    </div>
                    {paymentMethod === 'cash' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏦</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Chuyển khoản</div>
                      <div className="text-sm text-gray-600">Chuyển khoản qua ngân hàng</div>
                    </div>
                    {paymentMethod === 'bank_transfer' && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 bg-blue-900 hover:bg-blue-800" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận thanh toán'
                )}
              </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Momo Payment Modal */}
      {showMomoModal && momoData && (
        <ModalMomoPayment
          open={showMomoModal}
          qrCodeUrl={momoData.qrCodeUrl}
          deeplink={momoData.deeplink}
          amount={finalAmount} // ========== NEW: Use finalAmount instead of amount ==========
          paymentId={momoData.paymentId}
          onCancel={handleMomoCancel}
          onSuccess={handleMomoSuccess}
        />
      )}
    </>
  );
}

