import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSchedule, useMembers, useBranches } from '../hooks';
import { CreateScheduleRequest } from '../types/schedule.types';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  memberId: string;
  branchId: string;
  dateTime: string;
  duration: string;
  note: string;
}

interface FormErrors {
  memberId?: string;
  branchId?: string;
  dateTime?: string;
  duration?: string;
}

export function ModalCreateSchedule({ isOpen, onClose }: Props) {
  const { data: members } = useMembers();
  const { data: branches } = useBranches();
  const createMutation = useCreateSchedule();

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  const [formData, setFormData] = useState<FormData>({
    memberId: '',
    branchId: '',
    dateTime: '',
    duration: '60',
    note: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        memberId: '',
        branchId: '',
        dateTime: '',
        duration: '60',
        note: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.memberId.trim()) {
      newErrors.memberId = 'Vui lòng chọn hội viên';
    }

    if (!formData.branchId.trim()) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Vui lòng chọn ngày giờ';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dateTime = 'Ngày giờ phải trong tương lai';
      }
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      newErrors.duration = 'Thời lượng phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const scheduleData: CreateScheduleRequest = {
        memberId: formData.memberId,
        branchId: formData.branchId,
        dateTime: new Date(formData.dateTime).toISOString(),
        durationMinutes: Number(formData.duration),
        notes: formData.note || 'Buổi tập PT',
      };

      await createMutation.mutateAsync(scheduleData);
      toast.success('Tạo lịch PT thành công!');
      handleClose();
    } catch (error: any) {
      console.error('Error creating schedule:', error?.response?.data || error);
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch!';
      const errorDetails = error?.response?.data?.data?.errors || [];
      
      if (errorDetails.length > 0) {
        toast.error(`${errorMessage}: ${errorDetails.map((e: any) => e.message).join(', ')}`);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      memberId: '',
      branchId: '',
      dateTime: '',
      duration: '60',
      note: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Container with Flexbox Layout */}
      <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tạo lịch PT mới</h2>
              <p className="text-sm text-gray-500">Lên lịch buổi tập cho hội viên</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-white/50">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Member Selection */}
            <div className="space-y-2">
              <Label htmlFor="memberId" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Hội viên {errors.memberId ? (
                  <span className="text-red-500 text-xs">- {errors.memberId}</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Select
                value={formData.memberId || ''}
                onValueChange={(value) => handleChange('memberId', value)}
              >
                <SelectTrigger className={errors.memberId ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Chọn hội viên cần tạo lịch" />
                </SelectTrigger>
                <SelectContent>
                  {members && members.length > 0 ? (
                    members.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.fullName}</span>
                          <span className="text-xs text-gray-500">{member.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-members" disabled>
                      Không có hội viên nào
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor="branchId" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Chi nhánh {errors.branchId ? (
                  <span className="text-red-500 text-xs">- {errors.branchId}</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Select
                value={formData.branchId || ''}
                onValueChange={(value) => handleChange('branchId', value)}
              >
                <SelectTrigger className={errors.branchId ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Chọn chi nhánh tập luyện" />
                </SelectTrigger>
                <SelectContent>
                  {branches && branches.length > 0 ? (
                    branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{branch.name}</span>
                          <span className="text-xs text-gray-500">{branch.address}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-branches" disabled>
                      Không có chi nhánh nào
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="dateTime" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Ngày và giờ {errors.dateTime ? (
                  <span className="text-red-500 text-xs">- {errors.dateTime}</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                className={errors.dateTime ? 'border-red-500 focus:ring-red-500' : ''}
              />
              <p className="text-xs text-gray-500">
                Chọn thời gian bắt đầu buổi tập
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Thời lượng {errors.duration ? (
                  <span className="text-red-500 text-xs">- {errors.duration}</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Select
                value={formData.duration || '60'}
                onValueChange={(value) => handleChange('duration', value)}
              >
                <SelectTrigger className={errors.duration ? 'border-red-500 focus:ring-red-500' : ''}>
                  <SelectValue placeholder="Chọn thời lượng buổi tập" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 phút - Buổi ngắn</SelectItem>
                  <SelectItem value="45">45 phút - Buổi vừa</SelectItem>
                  <SelectItem value="60">60 phút - Buổi chuẩn (khuyến nghị)</SelectItem>
                  <SelectItem value="90">90 phút - Buổi dài</SelectItem>
                  <SelectItem value="120">120 phút - Buổi rất dài</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Thời lượng khuyến nghị: 60 phút
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                Ghi chú
              </Label>
              <Input
                id="note"
                placeholder="VD: Tập trung vào cơ ngực và vai..."
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Ghi chú về nội dung, mục tiêu hoặc lưu ý đặc biệt
              </p>
            </div>

          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Tạo lịch
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
