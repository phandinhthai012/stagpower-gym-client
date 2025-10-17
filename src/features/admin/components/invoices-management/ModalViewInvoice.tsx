import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Label } from '../../../../components/ui/label';
import { X, Eye, Printer, CreditCard, Bell, Calendar, User, Package, DollarSign } from 'lucide-react';
import { Invoice } from '../../types/invoice.types';
import { Payment } from '../../../member/types';

interface ModalViewInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | Payment | null;
  onEdit?: (invoice: Invoice | Payment) => void;
  onRecordPayment?: (invoice: Invoice | Payment) => void;
  onSendReminder?: (invoice: Invoice | Payment) => void;
}

export function ModalViewInvoice({ 
  isOpen, 
  onClose, 
  invoice, 
  onEdit, 
  onRecordPayment, 
  onSendReminder 
}: ModalViewInvoiceProps) {
  if (!isOpen || !invoice) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
      case 'Refunded':
        return <Badge className="bg-gray-100 text-gray-800">Đã hoàn tiền</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Đã hủy</Badge>;
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-800">Đã hết hạn</Badge>;
      case 'Suspended':
        return <Badge className="bg-orange-100 text-orange-800">Tạm dừng</Badge>;
      case 'PendingPayment':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'NotStarted':
        return <Badge className="bg-blue-100 text-blue-800">Chờ bắt đầu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'Cash': return 'Tiền mặt';
      case 'Card': return 'Thẻ tín dụng';
      case 'BankTransfer': return 'Chuyển khoản';
      case 'Momo': return 'Ví MoMo';
      case 'ZaloPay': return 'ZaloPay';
      default: return method;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Chi tiết hóa đơn
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hóa đơn {invoice.invoiceNumber || `#${invoice._id?.slice(-8).toUpperCase()}`}
                </h3>
                <p className="text-sm text-gray-500">
                  Tạo ngày: {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge((invoice as any).paymentStatus || (invoice as any).status)}
                <p className="text-sm text-gray-500 mt-1">
                  Ngày thanh toán: {(invoice as any).paymentDate ? formatDate((invoice as any).paymentDate) : 'Chưa thanh toán'}
                </p>
              </div>
            </div>

            {/* Member Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Thông tin hội viên
                  </Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{(invoice as any).memberId?.fullName || (invoice as any).memberName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{(invoice as any).memberId?.email || (invoice as any).memberEmail || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{(invoice as any).memberId?.phone || (invoice as any).memberPhone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Package className="w-4 h-4" />
                    Gói dịch vụ
                  </Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{(invoice as any).subscriptionId?.packageId?.name || (invoice as any).packageName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{(invoice as any).subscriptionId?.packageId?.type || (invoice as any).packageType || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Loại: {(invoice as any).subscriptionId?.type || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Thành viên: {(invoice as any).subscriptionId?.membershipType || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4" />
                    Thông tin thanh toán
                  </Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phương thức:</span>
                      <span className="text-sm font-medium">{getPaymentMethodText(invoice.paymentMethod)}</span>
                    </div>
                    {invoice.originalAmount && invoice.originalAmount !== invoice.amount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Giá gốc:</span>
                        <span className="text-sm line-through text-gray-500">
                          {formatPrice(invoice.originalAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Số tiền:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatPrice(invoice.amount)}
                      </span>
                    </div>
                    {(invoice as any).transactionId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mã giao dịch:</span>
                        <span className="text-sm font-mono">{(invoice as any).transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Thời gian
                  </Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tạo ngày:</span>
                      <span className="text-sm">{formatDate(invoice.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ngày thanh toán:</span>
                      <span className="text-sm">{(invoice as any).paymentDate ? formatDate((invoice as any).paymentDate) : 'Chưa thanh toán'}</span>
                    </div>
                    {(invoice as any).subscriptionId?.startDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
                        <span className="text-sm">{formatDate((invoice as any).subscriptionId.startDate)}</span>
                      </div>
                    )}
                    {(invoice as any).subscriptionId?.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ngày kết thúc:</span>
                        <span className="text-sm">{formatDate((invoice as any).subscriptionId.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {(invoice as any).paymentDetails && (
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CreditCard className="w-4 h-4" />
                  Chi tiết giao dịch
                </Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
                  {(invoice as any).paymentDetails.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mã giao dịch:</span>
                      <span className="text-sm font-mono">{(invoice as any).paymentDetails.transactionId}</span>
                    </div>
                  )}
                  {(invoice as any).paymentDetails.paymentGateway && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cổng thanh toán:</span>
                      <span className="text-sm">{(invoice as any).paymentDetails.paymentGateway}</span>
                    </div>
                  )}
                  {(invoice as any).paymentDetails.reference && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mã tham chiếu:</span>
                      <span className="text-sm font-mono">{(invoice as any).paymentDetails.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Ghi chú</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Đóng
              </Button>
              {(invoice as any).paymentStatus === 'Pending' || (invoice as any).status === 'Pending' ? (
                <>
                  {onRecordPayment && (
                    <Button
                      onClick={() => onRecordPayment(invoice)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Ghi nhận thanh toán
                    </Button>
                  )}
                  {onSendReminder && (
                    <Button
                      variant="outline"
                      onClick={() => onSendReminder(invoice)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Gửi nhắc nhở
                    </Button>
                  )}
                </>
              ) : null}
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(invoice)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
