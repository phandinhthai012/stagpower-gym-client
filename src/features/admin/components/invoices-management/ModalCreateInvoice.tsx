import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Badge } from '../../../../components/ui/badge';
import { X, Plus, DollarSign, Calendar, User, Package, Tag, XCircle } from 'lucide-react';
import { useCreateInvoice, useCreateSubscriptionWithPayment } from '../../hooks/useInvoices';
import { CreateInvoiceData } from '../../types/invoice.types';
import { useMembers } from '../../../member/hooks/useMembers';
import { usePackages } from '../../hooks/usePackages';
import ModelQRMomo from './ModelQRMomo';
import QRCode from 'qrcode';
import socketService from '../../../../services/socket';
import { toast } from 'sonner';

import { useGetAvailableDiscounts, useApplyDiscountManual } from '../../hooks/useDiscounts';

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

  // ========== NEW: Discount states ==========
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountDetails, setDiscountDetails] = useState<any[]>([]);

  const createInvoiceMutation = useCreateInvoice();
  const createSubscriptionWithPaymentMutation = useCreateSubscriptionWithPayment();
  const { data: membersResponse } = useMembers();
  const { data: packagesResponse = [] } = usePackages();
  const packages = Array.isArray(packagesResponse?.data) ? packagesResponse.data : [];
  const members = membersResponse && 'success' in membersResponse && membersResponse.success
    ? membersResponse.data || []
    : [];

  // ========== NEW: Get available discounts based on selected package ==========
  const selectedPackageForDiscount = packages.find(pkg => pkg._id === formData.packageId);
  const { data: availableDiscounts = [] } = useGetAvailableDiscounts({
    packageType: selectedPackageForDiscount?.type,
    packageCategory: selectedPackageForDiscount?.packageCategory,
  });
  const applyDiscountMutation = useApplyDiscountManual();


  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState<string>('');
  const [showMemberDropdown, setShowMemberDropdown] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const memberDropdownRef = useRef<HTMLDivElement>(null);

  // Update member search term when memberId changes externally
  useEffect(() => {
    if (formData.memberId && !selectedMember) {
      const member = members.find((m: any) => m._id === formData.memberId);
      if (member) {
        setSelectedMember(member);
        setMemberSearchTerm(`${member.fullName} - ${member.email}`);
      }
    } else if (!formData.memberId && selectedMember) {
      setSelectedMember(null);
      setMemberSearchTerm('');
    }
  }, [formData.memberId, members, selectedMember]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    };

    if (showMemberDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMemberDropdown]);

  const resetForm = () => {
    setFormData({
      memberId: '',
      packageId: '',
      amount: 0,
      originalAmount: 0,
      paymentMethod: 'Cash',
      dueDate: '',
      notes: ''
    });
    setSelectedPackage(null);
    setSelectedMember(null);
    setMemberSearchTerm('');
    setShowMemberDropdown(false);
    setErrors({});

    // ========== NEW: Reset discount states ==========
    setSelectedDiscountId('');
    setAppliedDiscount(null);
    setDiscountDetails([]);
  };

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

  // socket to close modal when completed invoice success momo
  useEffect(() => {
    if (!showQrModal || !qrData?.paymentId) return;

    const token = localStorage.getItem('accessToken') || undefined;
    const socket = socketService.connect(token);

    const handlePaymentCompleted = (payment: any) => {
      if (payment?._id === qrData.paymentId) {
        setShowQrModal(false);
        setQrData(null);
        onSuccess?.();
        onClose();
      }
    };

    socket.on('payment_completed', handlePaymentCompleted);

    return () => {
      socket.off('payment_completed', handlePaymentCompleted);
    };
  }, [showQrModal, qrData?.paymentId, onSuccess, onClose]);
  
  // Handle discount selection/change ==========
  const handleDiscountChange = async (discountId: string) => {
    // If "NONE" is selected, clear discount
    if (discountId === "NONE" || !discountId) {
      setSelectedDiscountId('');
      setAppliedDiscount(null);
      setDiscountDetails([]);
      setFormData(prev => ({
        ...prev,
        amount: prev.originalAmount || 0
      }));
      return;
    }

    setSelectedDiscountId(discountId);

    // Validate that package is selected first
    if (!formData.originalAmount || formData.originalAmount <= 0) {
      toast.error('Vui lòng chọn gói dịch vụ trước khi áp dụng mã giảm giá');
      setSelectedDiscountId('');
      return;
    }

    try {
      // Call API to apply discount
      const result = await applyDiscountMutation.mutateAsync({
        discountId,
        originalAmount: formData.originalAmount
      });

      // Update states with discount result
      setAppliedDiscount(result);
      setDiscountDetails(result.discountDetails ? [result.discountDetails] : []);
      
      // Update final amount after discount
      setFormData(prev => ({
        ...prev,
        amount: result.finalAmount
      }));

      toast.success(`Đã áp dụng mã giảm giá: ${result.discount.name}`);
    } catch (error: any) {
      console.error('Error applying discount:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá');
      setSelectedDiscountId('');
    }
  };

  // ========== NEW: Handle remove discount ==========
  const handleRemoveDiscount = () => {
    setSelectedDiscountId('');
    setSelectedDiscountId('NONE');
    setAppliedDiscount(null);
    setDiscountDetails([]);
    setFormData(prev => ({
      ...prev,
      amount: prev.originalAmount || 0
    }));
    toast.info('Đã xóa mã giảm giá');
  };
  
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
      if (formData.paymentMethod === 'Momo') {
        if (!selectedPackage) {
          setErrors(prev => ({
            ...prev,
            packageId: 'Vui lòng chọn gói dịch vụ'
          }));
          return;
        }

        const payload = {
          memberId: formData.memberId,
          packageId: formData.packageId,
          branchId: null,
          type: selectedPackage.type,
          membershipType: selectedPackage.membershipType || 'Basic',
          durationDays: (selectedPackage.durationMonths || 0) * 30,
          ptsessionsRemaining: selectedPackage.ptSessions || 0,
          ptsessionsUsed: 0,
          paymentMethod: 'Momo',
          originalAmount: formData.originalAmount || formData.amount,
          amount: formData.amount,
          // Include discount details in payload
          discountDetails: discountDetails || [],
          notes: formData.notes,
          dueDate: formData.dueDate || new Date().toISOString()
        };

        const res = await createSubscriptionWithPaymentMutation.mutateAsync(payload);
        const momoPayment = res?.momoPayment;

        if (!momoPayment) {
          throw new Error('Không nhận được thông tin thanh toán MoMo');
        }
        const qrCodeUrl = momoPayment.qrCodeUrl;
        setQrData({
          qrCodeUrl: await QRCode.toDataURL(qrCodeUrl),
          paymentId: res.payment?._id || momoPayment.orderId,
          deepLink: momoPayment.deeplink || momoPayment.deepLink || momoPayment.payUrl,
          amount: momoPayment.amount,
          invoiceId: momoPayment.requestId || res.payment?.invoiceNumber,
        });
        setShowQrModal(true);
        resetForm();
        return;
      }

      // ========== NEW: Include discount details for non-Momo payments ==========
      await createInvoiceMutation.mutateAsync({
        ...formData,
        discountDetails: discountDetails, // Include discount details
        dueDate: formData.dueDate || new Date().toISOString()
      });

      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg._id === packageId);
    setSelectedPackage(selectedPackage);
    if (selectedPackage) {
      const originalPrice = selectedPackage.price;
      setFormData(prev => ({
        ...prev,
        packageId,
        amount: appliedDiscount ? appliedDiscount.finalAmount : originalPrice,
        originalAmount: originalPrice
      }));

      // ========== NEW: Reset discount when package changes ==========
      if (selectedDiscountId) {
        setSelectedDiscountId('');
        setAppliedDiscount(null);
        setDiscountDetails([]);
        toast.info('Đã đặt lại mã giảm giá vì đã thay đổi gói dịch vụ');
      }
    }
  };

  // Filter members based on search term
  const filteredMembers = React.useMemo(() => {
    if (!memberSearchTerm.trim()) {
      return members;
    }
    const searchLower = memberSearchTerm.toLowerCase();
    return members.filter((member: any) =>
      member.fullName?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.phone?.toLowerCase().includes(searchLower)
    );
  }, [members, memberSearchTerm]);

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setFormData(prev => ({
      ...prev,
      memberId: member._id
    }));
    setMemberSearchTerm(`${member.fullName} - ${member.email}`);
    setShowMemberDropdown(false);
    if (errors.memberId) {
      setErrors(prev => ({
        ...prev,
        memberId: ''
      }));
    }
  };

  const handleMemberSearchChange = (value: string) => {
    setMemberSearchTerm(value);
    setShowMemberDropdown(true);
    if (selectedMember) {
      setSelectedMember(null);
      setFormData(prev => ({
        ...prev,
        memberId: ''
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
            {/* Member Selection - Autocomplete */}
            <div className="space-y-2">
              <Label htmlFor="memberId" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Chọn hội viên <span className="text-red-500">*</span>
                {errors.memberId && <span className="text-red-500 ml-1">({errors.memberId})</span>}
              </Label>
              <div className="relative" ref={memberDropdownRef}>
                <Input
                  id="memberId"
                  type="text"
                  placeholder="Tìm kiếm hội viên (tên, email, số điện thoại)..."
                  value={memberSearchTerm}
                  onChange={(e) => handleMemberSearchChange(e.target.value)}
                  onFocus={() => setShowMemberDropdown(true)}
                  className={errors.memberId ? 'border-red-500' : ''}
                />
                {showMemberDropdown && filteredMembers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredMembers.map((member: any) => (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() => handleMemberSelect(member)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{member.fullName}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                        {member.phone && (
                          <div className="text-xs text-gray-500">{member.phone}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {showMemberDropdown && memberSearchTerm && filteredMembers.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-500">
                    Không tìm thấy hội viên
                  </div>
                )}
              </div>
            </div>

            {/* Package Selection */}
            <div className="space-y-2">
              <Label htmlFor="packageId" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Chọn gói dịch vụ <span className="text-red-500">*</span>
                {errors.packageId && <span className="text-red-500 ml-1">({errors.packageId})</span>}
              </Label>
              <Select
                value={formData.packageId}
                onValueChange={handlePackageChange}
              >
                <SelectTrigger className={errors.packageId ? 'border-red-500' : ''}>
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
                  onChange={(e) => {
                    // ========== NEW: Re-apply discount when original amount changes ==========
                    const newOriginalAmount = parseFloat(e.target.value) || 0;
                    handleInputChange('originalAmount', newOriginalAmount);
                    // If discount is applied, reapply it with new original amount
                    if (selectedDiscountId && newOriginalAmount > 0) {
                      handleDiscountChange(selectedDiscountId);
                    } else {
                      handleInputChange('amount', newOriginalAmount);
                    }
                  }}
                  placeholder="Nhập giá gốc..."
                  readOnly={!!selectedPackage} // Read-only when package is selected
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Số tiền thanh toán <span className="text-red-500">*</span>
                  {errors.amount && <span className="text-red-500 ml-1">({errors.amount})</span>}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="Nhập số tiền..."
                  className={errors.amount ? 'border-red-500' : ''}
                />
              </div>
            </div>

            {/* ========== NEW: Discount Selection Section ========== */}
            {selectedPackage && formData.originalAmount > 0 && (
              <div className="space-y-2">
                <Label htmlFor="discountId" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Chọn mã giảm giá (tùy chọn)
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedDiscountId || undefined}
                    onValueChange={handleDiscountChange}
                    disabled={applyDiscountMutation.isPending}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Chọn mã giảm giá..." />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use "NONE" instead of empty string to clear selection */}
                      <SelectItem value="NONE">Không sử dụng mã</SelectItem>
                      {availableDiscounts.length > 0 ? (
                        availableDiscounts.map((discount: any) => (
                          <SelectItem key={discount._id} value={discount._id}>
                            {discount.name}
                            {discount.code && ` (${discount.code})`}
                            {discount.discountPercentage && ` - ${discount.discountPercentage}%`}
                            {discount.discountAmount && ` - ${discount.discountAmount.toLocaleString('vi-VN')} VNĐ`}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">Không có mã giảm giá khả dụng</div>
                      )}
                    </SelectContent>
                  </Select>
                  {appliedDiscount && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveDiscount}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Xóa
                    </Button>
                  )}
                </div>

                {/* Display discount info when applied */}
                {appliedDiscount && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">{appliedDiscount.discount.name}</Badge>
                          {appliedDiscount.discount.code && (
                            <span className="text-sm text-gray-600">({appliedDiscount.discount.code})</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{appliedDiscount.discount.conditions}</p>
                        <div className="text-sm space-y-1 mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giá gốc:</span>
                            <span>{appliedDiscount.originalAmount.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <div className="flex justify-between text-green-600 font-medium">
                            <span>Giảm giá:</span>
                            <span>-{appliedDiscount.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <div className="flex justify-between text-blue-600 font-bold border-t pt-1">
                            <span>Thành tiền:</span>
                            <span>{appliedDiscount.finalAmount.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          {appliedDiscount.bonusDays > 0 && (
                            <div className="flex justify-between text-purple-600">
                              <span>Tặng thêm:</span>
                              <span>+{appliedDiscount.bonusDays} ngày</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  Hạn thanh toán <span className="text-red-500">*</span>
                  {errors.dueDate && <span className="text-red-500 ml-1">({errors.dueDate})</span>}
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
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
                disabled={createInvoiceMutation.isPending || createSubscriptionWithPaymentMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createInvoiceMutation.isPending || createSubscriptionWithPaymentMutation.isPending}
              >
                {createInvoiceMutation.isPending || createSubscriptionWithPaymentMutation.isPending ? (
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
      <ModelQRMomo
        isOpen={showQrModal}
        onClose={() => {
          setShowQrModal(false);
          setQrData(null);
        }}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
        qrData={qrData}
      />

    </div>
  );
}
