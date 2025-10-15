import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { X, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { useRecordPayment } from '../../hooks/useInvoices';
import { CreatePaymentData } from '../../types/invoice.types';
import { Invoice } from '../../types/invoice.types';

interface ModalRecordPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSuccess?: () => void;
}

export function ModalRecordPayment({ isOpen, onClose, invoice, onSuccess }: ModalRecordPaymentProps) {
  const [formData, setFormData] = useState<CreatePaymentData>({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    paymentGateway: '',
    reference: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recordPaymentMutation = useRecordPayment();

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

  // Initialize form data when invoice changes
  React.useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceId: invoice._id,
        amount: invoice.amount,
        paymentMethod: invoice.paymentMethod,
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: '',
        paymentGateway: '',
        reference: '',
        notes: ''
      });
    }
  }, [invoice]);

  const handleInputChange = (field: keyof CreatePaymentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Vui lòng chọn ngày thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await recordPaymentMutation.mutateAsync(formData);
      onSuccess?.();
      onClose();
      setFormData({
        invoiceId: '',
        amount: 0,
        paymentMethod: 'Cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: '',
        paymentGateway: '',
        reference: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  if (!isOpen || !invoice) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Ghi nhận thanh toán
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
          {/* Invoice Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Thông tin hóa đơn</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Mã hóa đơn:</span>
                <span className="ml-2 font-medium">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Hội viên:</span>
                <span className="ml-2 font-medium">{invoice.memberName}</span>
              </div>
              <div>
                <span className="text-gray-600">Số tiền:</span>
                <span className="ml-2 font-medium text-green-600">{formatPrice(invoice.amount)}</span>
              </div>
              <div>
                <span className="text-gray-600">Hạn thanh toán:</span>
                <span className="ml-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Số tiền thanh toán *
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="Nhập số tiền..."
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Payment Method and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Phương thức thanh toán *</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Tiền mặt</SelectItem>
                    <SelectItem value="Card">Thẻ tín dụng</SelectItem>
                    <SelectItem value="BankTransfer">Chuyển khoản</SelectItem>
                    <SelectItem value="Momo">Ví MoMo</SelectItem>
                    <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-600">{errors.paymentMethod}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày thanh toán *
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                />
                {errors.paymentDate && (
                  <p className="text-sm text-red-600">{errors.paymentDate}</p>
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">Mã giao dịch</Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Nhập mã giao dịch..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Cổng thanh toán</Label>
                <Input
                  id="paymentGateway"
                  value={formData.paymentGateway}
                  onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
                  placeholder="Nhập cổng thanh toán..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Mã tham chiếu</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                placeholder="Nhập mã tham chiếu..."
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú thanh toán</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Nhập ghi chú về thanh toán..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={recordPaymentMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={recordPaymentMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {recordPaymentMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang ghi nhận...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ghi nhận thanh toán
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
