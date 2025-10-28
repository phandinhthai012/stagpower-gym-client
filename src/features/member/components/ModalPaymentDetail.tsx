import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  X, 
  Copy, 
  Download,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Receipt,
  Package,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import QRCode from 'qrcode';

interface PaymentDetail {
  id: string;
  invoice_number?: string;
  transaction_id?: string;
  payment_date: string;
  payment_status: string;
  payment_method: string;
  package_name?: string;
  amount: number;
  original_amount?: number;
  notes?: string;
}

interface ModalPaymentDetailProps {
  open: boolean;
  onClose: () => void;
  paymentId: string | null;
  paymentDetail?: PaymentDetail; // Fallback if API fails
}

export function ModalPaymentDetail({ open, onClose, paymentId, paymentDetail }: ModalPaymentDetailProps) {
  const queryClient = useQueryClient();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Fetch full payment details from API
  const { data: paymentResponse, isLoading } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentApi.getPaymentById(paymentId || ''),
    enabled: open && !!paymentId,
    staleTime: 30 * 1000, // 30 seconds - refresh more often for QR
  });

  const payment: any = paymentResponse?.data || paymentDetail;
  
  // Check if payment is pending and MoMo payment
  const isPendingPayment = (payment?.payment_status || payment?.paymentStatus || '').toLowerCase() === 'pending';
  const isMomoPayment = (payment?.payment_method || payment?.paymentMethod || '').toLowerCase() === 'momo';
  const qrCodeUrl = payment?.paymentQrCode || payment?.payment_qr_code;
  const shouldShowQR = isPendingPayment && isMomoPayment && !!qrCodeUrl;

  // Generate QR code from URL
  useEffect(() => {
    if (qrCodeUrl && shouldShowQR) {
      QRCode.toDataURL(qrCodeUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then(setQrCodeDataUrl)
        .catch((error) => {
          console.error('Error generating QR code:', error);
          toast.error('Không thể tạo QR code');
        });
    } else {
      setQrCodeDataUrl('');
    }
  }, [qrCodeUrl, shouldShowQR]);

  // Regenerate QR mutation
  const regenerateQRMutation = useMutation({
    mutationFn: () => paymentApi.regeneratePaymentQR(paymentId || ''),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
      toast.success('QR code đã được tạo lại thành công');
      setIsRegenerating(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lại QR code');
      setIsRegenerating(false);
    },
  });

  const handleRegenerateQR = () => {
    setIsRegenerating(true);
    regenerateQRMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed' || statusLower === 'success') {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower === 'pending' || statusLower === 'waiting') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower === 'failed' || statusLower === 'error') {
      return 'bg-red-100 text-red-800';
    }
    if (statusLower === 'refunded') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed' || statusLower === 'success') {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (statusLower === 'pending' || statusLower === 'waiting') {
      return <Clock className="h-4 w-4" />;
    }
    if (statusLower === 'failed' || statusLower === 'error') {
      return <XCircle className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getStatusText = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed') return 'Hoàn thành';
    if (statusLower === 'pending') return 'Đang chờ';
    if (statusLower === 'failed') return 'Thất bại';
    if (statusLower === 'refunded') return 'Đã hoàn tiền';
    return status || 'N/A';
  };

  const getPaymentMethodName = (method: string) => {
    const methodLower = method?.toLowerCase() || '';
    switch (methodLower) {
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'cash':
        return 'Tiền mặt';
      case 'card':
        return 'Thẻ';
      case 'banktransfer':
      case 'bank_transfer':
        return 'Chuyển khoản';
      default:
        return method || 'Khác';
    }
  };

  const getPaymentTypeLabel = (type?: string) => {
    switch (type) {
      case 'NEW_SUBSCRIPTION':
        return 'Đăng ký gói mới';
      case 'RENEWAL':
        return 'Gia hạn gói tập';
      case 'PT_PURCHASE':
        return 'Mua buổi tập';
      default:
        return 'Thanh toán';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          aria-label="Đóng"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <CardContent className="p-12">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span>Đang tải chi tiết thanh toán...</span>
            </div>
          </CardContent>
        ) : !payment ? (
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-600">Không tìm thấy thông tin thanh toán</p>
          </CardContent>
        ) : (
          <>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-6 w-6 text-blue-600" />
                <span>Chi tiết hóa đơn</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mã hóa đơn</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xl font-bold text-blue-900">
                      {payment.invoice_number || payment.invoiceNumber || payment.id || payment._id}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(
                        payment.invoice_number || payment.invoiceNumber || payment.id || payment._id || '',
                        'mã hóa đơn'
                      )}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Badge className={`${getStatusColor(payment.payment_status || payment.paymentStatus || 'pending')} px-4 py-2`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.payment_status || payment.paymentStatus || 'pending')}
                    {getStatusText(payment.payment_status || payment.paymentStatus || 'pending')}
                  </div>
                </Badge>
              </div>

              {/* Transaction ID */}
              {(payment.transaction_id || payment.transactionId) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Mã giao dịch</p>
                      <p className="text-sm font-medium mt-1">
                        {payment.transaction_id || payment.transactionId}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(
                        payment.transaction_id || payment.transactionId || '',
                        'mã giao dịch'
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Type */}
              {(payment.paymentType || (payment as any).payment_type) && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Loại thanh toán</p>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {getPaymentTypeLabel(payment.paymentType || (payment as any).payment_type)}
                  </Badge>
                </div>
              )}

              {/* QR Code for Pending Payment */}
              {shouldShowQR && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Quét mã QR để thanh toán</h4>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      {qrCodeDataUrl ? (
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code thanh toán" 
                          className="w-64 h-64 object-contain"
                        />
                      ) : (
                        <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                          <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Số tiền: <span className="font-bold text-blue-900">{formatPrice(payment.amount || 0)}</span></p>
                      <p className="text-xs text-gray-500">QR code có hiệu lực trong 5 phút</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateQR}
                      disabled={isRegenerating || !qrCodeDataUrl}
                      className="w-full"
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang tạo lại...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Tạo lại QR code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Show regenerate button if QR expired or missing */}
              {isPendingPayment && isMomoPayment && !qrCodeUrl && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-900 mb-1">QR code đã hết hạn hoặc chưa có</p>
                      <p className="text-xs text-yellow-700">Vui lòng tạo lại QR code để thanh toán</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateQR}
                      disabled={isRegenerating}
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          Tạo QR code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày thanh toán</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(payment.payment_date || payment.paymentDate || payment.createdAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Phương thức</span>
                  </div>
                  <p className="font-medium">
                    {getPaymentMethodName(payment.payment_method || payment.paymentMethod || 'cash')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Gói tập</span>
                  </div>
                  <p className="font-medium text-blue-900">
                    {(payment as any).package_name || 'Gói tập'}
                  </p>
                </div>
              </div>

              {/* Amount Details */}
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Chi tiết thanh toán</h4>
                
                {(payment.original_amount || payment.originalAmount) && 
                 payment.original_amount !== payment.amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="line-through text-gray-500">
                      {formatPrice(payment.original_amount || payment.originalAmount || 0)}
                    </span>
                  </div>
                )}

                {(payment.original_amount || payment.originalAmount) && 
                 payment.original_amount !== payment.amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-green-600 font-medium">
                      -{formatPrice((payment.original_amount || payment.originalAmount || 0) - (payment.amount || 0))}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold text-gray-900">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-blue-900">
                    {formatPrice(payment.amount || 0)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {(payment.notes || (payment as any).note) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-700">{payment.notes || (payment as any).note}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Tải hóa đơn PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Đóng
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

