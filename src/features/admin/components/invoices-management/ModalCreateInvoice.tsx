import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { X, Plus, DollarSign, Calendar, User, Package } from 'lucide-react';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { CreateInvoiceData } from '../../types/invoice.types';
import { useMembers } from '../../../member/hooks/useMembers';
import { usePackages } from '../../hooks/usePackages';

interface ModalCreateInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalCreateInvoice({ isOpen, onClose, onSuccess }: ModalCreateInvoiceProps) {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    memberId: '',
    packageId: '',
    amount: 0,
    originalAmount: 0,
    paymentMethod: 'Cash',
    dueDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createInvoiceMutation = useCreateInvoice();
  const { data: membersResponse } = useMembers();
  const { data: packagesResponse = [] } = usePackages();
  const packages = Array.isArray(packagesResponse?.data) ? packagesResponse.data : [];
  const members = membersResponse && 'success' in membersResponse && membersResponse.success 
    ? membersResponse.data || [] 
    : [];

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

  const handleInputChange = (field: keyof CreateInvoiceData, value: string | number) => {
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

    if (!formData.memberId) {
      newErrors.memberId = 'Vui lòng chọn hội viên';
    }
    if (!formData.packageId) {
      newErrors.packageId = 'Vui lòng chọn gói dịch vụ';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      console.log(formData);
      await createInvoiceMutation.mutateAsync({
        ...formData,
        dueDate: formData.dueDate || new Date().toISOString()
      });
      onSuccess?.();
      onClose();
      setFormData({
        memberId: '',
        packageId: '',
        amount: 0,
        originalAmount: 0,
        paymentMethod: 'Cash',
        dueDate: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg._id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId,
        amount: selectedPackage.price,
        originalAmount: selectedPackage.price
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Tạo hóa đơn mới
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Selection */}
            <div className="space-y-2">
              <Label htmlFor="memberId" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Chọn hội viên *
              </Label>
              <Select 
                value={formData.memberId} 
                onValueChange={(value) => handleInputChange('memberId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hội viên..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member: any) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.fullName} - {member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.memberId && (
                <p className="text-sm text-red-600">{errors.memberId}</p>
              )}
            </div>

            {/* Package Selection */}
            <div className="space-y-2">
              <Label htmlFor="packageId" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Chọn gói dịch vụ *
              </Label>
              <Select 
                value={formData.packageId} 
                onValueChange={handlePackageChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn gói dịch vụ..." />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>
                      {pkg.name} - {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(pkg.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.packageId && (
                <p className="text-sm text-red-600">{errors.packageId}</p>
              )}
            </div>

            {/* Amount Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalAmount" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Giá gốc
                </Label>
                <Input
                  id="originalAmount"
                  type="number"
                  value={formData.originalAmount}
                  onChange={(e) => handleInputChange('originalAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Nhập giá gốc..."
                />
              </div>

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
            </div>

            {/* Payment Method and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Hạn thanh toán *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Nhập ghi chú..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createInvoiceMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo hóa đơn
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
