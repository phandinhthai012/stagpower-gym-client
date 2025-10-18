import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { SelectWithScrollLock, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { 
  Save, 
  X, 
  Loader2,
  Calendar
} from 'lucide-react';
import { useAllStaffTrainers, useBranches, useCreateSchedule } from '../../hooks';
import { CreateScheduleRequest } from '../../types/schedule.types';
import { toast } from 'sonner';

interface ModalDirectScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  staffId: string;
  branchId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'afternoon' | 'full' | 'custom' | '';
  notes: string;
}

export function ModalDirectSchedule({ isOpen, onClose }: ModalDirectScheduleProps) {
  const createMutation = useCreateSchedule();
  const { data: staffData } = useAllStaffTrainers();
  const { data: branchesData } = useBranches();

  const staffList = staffData || [];
  const branches = branchesData || [];

  const [formData, setFormData] = useState<FormData>({
    staffId: '',
    branchId: '',
    workDate: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '22:00',
    shiftType: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleShiftTypeChange = (value: 'morning' | 'afternoon' | 'full' | 'custom') => {
    setFormData(prev => ({ ...prev, shiftType: value }));
    
    switch (value) {
      case 'morning':
        setFormData(prev => ({ ...prev, startTime: '06:00', endTime: '14:00' }));
        break;
      case 'afternoon':
        setFormData(prev => ({ ...prev, startTime: '14:00', endTime: '22:00' }));
        break;
      case 'full':
        setFormData(prev => ({ ...prev, startTime: '06:00', endTime: '22:00' }));
        break;
      // custom: user tự chọn
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.staffId) {
      newErrors.staffId = 'Vui lòng chọn nhân viên/PT';
    }
    if (!formData.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }
    if (!formData.workDate) {
      newErrors.workDate = 'Vui lòng chọn ngày làm việc';
    }
    if (!formData.shiftType) {
      newErrors.shiftType = 'Vui lòng chọn loại ca';
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

    // Tạo datetime từ date + time
    const dateTimeString = `${formData.workDate}T${formData.startTime}:00`;
    const endDateTime = `${formData.workDate}T${formData.endTime}:00`;
    const duration = (new Date(endDateTime).getTime() - new Date(dateTimeString).getTime()) / 60000;

    if (duration <= 0) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu!');
      return;
    }

    try {
      // Backend Schedule cần memberId & subscriptionId
      // Với lịch trực, dùng staffId làm dummy value và đánh dấu bằng notes
      const shiftLabel = {
        morning: 'Ca sáng',
        afternoon: 'Ca chiều',
        full: 'Ca toàn ngày',
        custom: 'Ca tùy chỉnh'
      }[formData.shiftType] || 'Ca làm việc';

      const scheduleData: CreateScheduleRequest = {
        trainerId: formData.staffId,
        memberId: formData.staffId, // Dummy - Lịch trực không có member thật
        subscriptionId: formData.staffId, // Dummy - Lịch trực không có subscription
        branchId: formData.branchId,
        dateTime: new Date(dateTimeString).toISOString(),
        durationMinutes: Math.round(duration),
        status: 'Confirmed',
        notes: `[LỊCH TRỰC] ${shiftLabel} (${formData.startTime}-${formData.endTime})${formData.notes ? ' - ' + formData.notes : ''}`,
      };

      console.log('🚀 Creating direct schedule:', scheduleData);
      await createMutation.mutateAsync(scheduleData);
      handleClose();
    } catch (error: any) {
      console.error('❌ Error creating schedule:', error?.response?.data);
      // Error already handled by mutation hook
    }
  };

  const handleClose = () => {
    setFormData({
      staffId: '',
      branchId: '',
      workDate: new Date().toISOString().split('T')[0],
      startTime: '06:00',
      endTime: '22:00',
      shiftType: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Phân lịch trực cho PT / Nhân viên
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="staffId">
                Chọn PT/Nhân viên <span className="text-red-500">*</span>
              </Label>
              <SelectWithScrollLock
                value={formData.staffId}
                onValueChange={(value) => handleChange('staffId', value)}
                lockScroll={true}
              >
                <SelectTrigger className={errors.staffId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn PT/ nhân viên" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  {staffList.map((staff) => (
                    <SelectItem key={staff._id} value={staff._id}>
                      {staff.fullName} - {staff.role === 'trainer' ? 'PT' : 'Nhân viên'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectWithScrollLock>
              {errors.staffId && (
                <p className="text-red-500 text-xs mt-1">{errors.staffId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="branchId">
                Chi nhánh <span className="text-red-500">*</span>
              </Label>
              <SelectWithScrollLock
                value={formData.branchId}
                onValueChange={(value) => handleChange('branchId', value)}
                lockScroll={true}
              >
                <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectWithScrollLock>
              {errors.branchId && (
                <p className="text-red-500 text-xs mt-1">{errors.branchId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="workDate">
                Ngày làm việc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workDate"
                type="date"
                value={formData.workDate}
                onChange={(e) => handleChange('workDate', e.target.value)}
                className={errors.workDate ? 'border-red-500' : ''}
              />
              {errors.workDate && (
                <p className="text-red-500 text-xs mt-1">{errors.workDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shiftType">
                Loại ca làm việc <span className="text-red-500">*</span>
              </Label>
              <SelectWithScrollLock
                value={formData.shiftType}
                onValueChange={handleShiftTypeChange}
                lockScroll={true}
              >
                <SelectTrigger className={errors.shiftType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn loại ca" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  <SelectItem value="morning">Ca sáng (06:00 - 14:00)</SelectItem>
                  <SelectItem value="afternoon">Ca chiều (14:00 - 22:00)</SelectItem>
                  <SelectItem value="full">Ca toàn ngày (06:00 - 22:00)</SelectItem>
                  <SelectItem value="custom">Ca bán thời gian (tùy chỉnh)</SelectItem>
                </SelectContent>
              </SelectWithScrollLock>
              {errors.shiftType && (
                <p className="text-red-500 text-xs mt-1">{errors.shiftType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Giờ bắt đầu</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  disabled={formData.shiftType !== 'custom' && formData.shiftType !== ''}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Giờ kết thúc</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  disabled={formData.shiftType !== 'custom' && formData.shiftType !== ''}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="directNotes">Ghi chú</Label>
              <textarea
                id="directNotes"
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={2}
                placeholder="Ghi chú về ca làm việc..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo lịch trực
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

