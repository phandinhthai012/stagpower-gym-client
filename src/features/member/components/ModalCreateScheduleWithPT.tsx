import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSchedule, useTrainers } from '../hooks';
import { useBranches } from '../hooks/useBranches';
import { CreateScheduleRequest } from '../types/schedule.types';
import { useAuth } from '../../../contexts/AuthContext';

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onSuccess?: () => void;
};

interface FormData {
  trainerId: string;
  branchId: string;
  dateTime: string;
  duration: string;
  note: string;
}

interface FormErrors {
  trainerId?: string;
  branchId?: string;
  dateTime?: string;
  duration?: string;
}

export default function ModalCreateScheduleWithPT({ trigger, open, onOpenChange, onSuccess }: Props) {
  const { user } = useAuth();
  const { data: branches } = useBranches();
  const { data: trainers } = useTrainers();
  const createMutation = useCreateSchedule();

  const [formData, setFormData] = useState<FormData>({
    trainerId: '',
    branchId: '',
    dateTime: '',
    duration: '90',
    note: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.trainerId) newErrors.trainerId = 'Vui lòng chọn huấn luyện viên';
    if (!formData.branchId) newErrors.branchId = 'Vui lòng chọn chi nhánh';
    if (!formData.dateTime) {
      newErrors.dateTime = 'Vui lòng chọn thời gian';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dateTime = 'Thời gian phải trong tương lai';
      }
    }
    if (!formData.duration || Number(formData.duration) < 30) {
      newErrors.duration = 'Thời lượng tối thiểu 30 phút';
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

    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để đặt lịch!');
      return;
    }

    try {
      const scheduleData: CreateScheduleRequest = {
        trainerId: formData.trainerId,
        branchId: formData.branchId,
        dateTime: new Date(formData.dateTime).toISOString(),
        durationMinutes: Number(formData.duration),
        notes: formData.note || 'Buổi PT cá nhân',
      };

      console.log('🚀 Creating schedule with data:', scheduleData);
      
      await createMutation.mutateAsync(scheduleData);
      toast.success('Đặt lịch PT thành công! Lịch đang chờ xác nhận.');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('❌ Error creating schedule:', error?.response?.data || error);
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch!';
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
      trainerId: '',
      branchId: '',
      dateTime: '',
      duration: '90',
      note: '',
    });
    setErrors({});
    onOpenChange?.(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px]">
      <Card className="relative w-full max-w-xl bg-white mx-4">
        {/* Close button */}
        <button
          aria-label="Đóng"
          className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          onClick={() => {
            if (confirm('Bạn có chắc muốn hủy đặt lịch?')) handleClose();
          }}
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <CardTitle>Đặt lịch PT mới</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trainer */}
            <div className="space-y-2">
              <Label htmlFor="trainerId">
                Huấn luyện viên <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.trainerId} onValueChange={(value) => handleChange('trainerId', value)}>
                <SelectTrigger id="trainerId">
                  <SelectValue placeholder="Chọn PT" />
                </SelectTrigger>
                <SelectContent>
                  {(trainers || []).map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.fullName}{t.trainerInfo?.specialty ? ` - ${t.trainerInfo.specialty}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.trainerId && <p className="text-xs text-red-500">{errors.trainerId}</p>}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branchId">
                Chi nhánh <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.branchId} onValueChange={(value) => handleChange('branchId', value)}>
                <SelectTrigger id="branchId">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {(branches || []).map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name} - {b.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchId && <p className="text-xs text-red-500">{errors.branchId}</p>}
            </div>

            {/* Date & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateTime">
                  Thời gian <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleChange('dateTime', e.target.value)}
                />
                {errors.dateTime && <p className="text-xs text-red-500">{errors.dateTime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min={30}
                  step={15}
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                />
                {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Ví dụ: tập ngực - tay"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Xác nhận hủy đặt lịch?')) handleClose();
                }}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo lịch'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
