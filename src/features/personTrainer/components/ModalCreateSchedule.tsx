import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSchedule, useMembers, useBranches } from '../hooks';
import { CreateScheduleRequest } from '../types/schedule.types';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Tạo lịch PT mới</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Member Selection */}
            <div className="space-y-2">
              <Label htmlFor="memberId" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Hội viên *
              </Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => handleChange('memberId', value)}
              >
                <SelectTrigger className={errors.memberId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn hội viên" />
                </SelectTrigger>
                <SelectContent>
                  {members?.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.fullName} - {member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.memberId && (
                <p className="text-sm text-red-500">{errors.memberId}</p>
              )}
            </div>

            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor="branchId" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Chi nhánh *
              </Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) => handleChange('branchId', value)}
              >
                <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchId && (
                <p className="text-sm text-red-500">{errors.branchId}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="dateTime" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày và giờ *
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                className={errors.dateTime ? 'border-red-500' : ''}
              />
              {errors.dateTime && (
                <p className="text-sm text-red-500">{errors.dateTime}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Thời lượng (phút) *
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleChange('duration', value)}
              >
                <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn thời lượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="45">45 phút</SelectItem>
                  <SelectItem value="60">60 phút</SelectItem>
                  <SelectItem value="90">90 phút</SelectItem>
                  <SelectItem value="120">120 phút</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                placeholder="Ghi chú về buổi tập (tùy chọn)"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo lịch'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
