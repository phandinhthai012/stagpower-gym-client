import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { CalendarIcon, Package, CreditCard, MapPin, Clock, X } from 'lucide-react';
import { usePackages } from '../hooks/usePackages';
import { useCreateSubscription } from '../hooks/useSubscriptions';
import { toast } from 'sonner';

interface ModalMemberCreatePackageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  packageId: string;
  branchId: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  membershipType: 'Basic' | 'VIP';
  type: 'Membership' | 'Combo' | 'PT';
  ptSessionsRemaining?: number;
}

export function ModalMemberCreatePackage({ isOpen, onClose }: ModalMemberCreatePackageProps) {
  const { user } = useAuth();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const createSubscriptionMutation = useCreateSubscription();
  
  const [formData, setFormData] = useState<FormData>({
    packageId: '',
    branchId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationDays: 30,
    membershipType: 'Basic',
    type: 'Membership',
    ptSessionsRemaining: 0,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Mock branches - in real app, this would come from API
  const branches = [
    { id: 'branch1', name: 'StagPower Gym Quận 1', address: '123 Nguyễn Huệ, Quận 1, TP.HCM' },
    { id: 'branch2', name: 'StagPower Gym Quận 2', address: '456 Thủ Thiêm, Quận 2, TP.HCM' },
    { id: 'branch3', name: 'StagPower Gym Quận 3', address: '789 Lê Văn Sỹ, Quận 3, TP.HCM' },
  ];

  // Filter packages based on type
  const filteredPackages = packages.filter(pkg => 
    pkg.status === 'Active'
  );

  // Calculate duration when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, durationDays: diffDays }));
    }
  }, [formData.startDate, formData.endDate]);

  // Update form data when package is selected
  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg._id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId,
        type: selectedPackage.type,
        membershipType: selectedPackage.membershipType,
        ptSessionsRemaining: selectedPackage.ptSessions || 0,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.packageId) {
      newErrors.packageId = 'Vui lòng chọn gói tập';
    }
    if (!formData.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) {
      return;
    }

    try {
      await createSubscriptionMutation.mutateAsync({
        memberId: user.id,
        packageId: formData.packageId,
        branchId: formData.branchId,
        type: formData.type,
        membershipType: formData.membershipType,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        durationDays: formData.durationDays,
        status: 'PendingPayment',
        ptSessionsRemaining: formData.ptSessionsRemaining,
        ptSessionsUsed: 0,
      });

      toast.success('Đăng ký gói tập thành công!');
      onClose();
      
      // Reset form
      setFormData({
        packageId: '',
        branchId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        durationDays: 30,
        membershipType: 'Basic',
        type: 'Membership',
        ptSessionsRemaining: 0,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Có lỗi xảy ra khi đăng ký gói tập');
    }
  };

  const selectedPackage = packages.find(pkg => pkg._id === formData.packageId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Đăng ký gói tập mới
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Selection */}
          <div className="space-y-2">
            <Label htmlFor="package">Chọn gói tập *</Label>
            <Select 
              value={formData.packageId} 
              onValueChange={handlePackageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn gói tập" />
              </SelectTrigger>
              <SelectContent>
                {packagesLoading ? (
                  <SelectItem value="" disabled>Đang tải...</SelectItem>
                ) : (
                  filteredPackages.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{pkg.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(pkg.price)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.packageId && (
              <p className="text-sm text-red-600">{errors.packageId}</p>
            )}
          </div>

          {/* Package Details */}
          {selectedPackage && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">{selectedPackage.name}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{selectedPackage.durationMonths} tháng</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{selectedPackage.branchAccess === 'All' ? 'Tất cả chi nhánh' : '1 chi nhánh'}</span>
                </div>
                {selectedPackage.ptSessions && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span>{selectedPackage.ptSessions} buổi PT</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedPackage.price)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-2">{selectedPackage.description}</p>
            </div>
          )}

          {/* Branch Selection */}
          <div className="space-y-2">
            <Label htmlFor="branch">Chọn chi nhánh *</Label>
            <Select 
              value={formData.branchId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div>
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-sm text-gray-500">{branch.address}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && (
              <p className="text-sm text-red-600">{errors.branchId}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu *</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Ngày kết thúc *</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Thời gian sử dụng:</span>
              <span className="text-sm text-gray-600">{formData.durationDays} ngày</span>
            </div>
          </div>

            </form>
          </div>
          
          {/* Fixed Footer with Action Buttons */}
          <div className="flex gap-3 justify-end p-6 pt-4 border-t border-gray-200 bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={createSubscriptionMutation.isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={handleSubmit}
            >
              {createSubscriptionMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Đăng ký gói tập
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}