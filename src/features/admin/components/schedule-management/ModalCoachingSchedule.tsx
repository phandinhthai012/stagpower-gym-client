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
  Dumbbell
} from 'lucide-react';
import { useCreateSchedule, useTrainers, useBranches } from '../../hooks';
import { useMembers } from '../../hooks/useUsers';
import { CreateScheduleRequest } from '../../types/schedule.types';
import { toast } from 'sonner';

interface ModalCoachingScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  trainerId: string;
  memberId: string;
  subscriptionId: string;
  branchId: string;
  sessionDateTime: string;
  sessionDuration: number;
  notes: string;
}

export function ModalCoachingSchedule({ isOpen, onClose }: ModalCoachingScheduleProps) {
  const createMutation = useCreateSchedule();
  const { data: trainersData } = useTrainers();
  const { data: membersData } = useMembers();
  const { data: branchesData } = useBranches();

  const trainers = trainersData || [];
  const members = membersData?.data || [];
  const branches = branchesData || [];

  const [formData, setFormData] = useState<FormData>({
    trainerId: '',
    memberId: '',
    subscriptionId: '',
    branchId: '',
    sessionDateTime: new Date().toISOString().slice(0, 16),
    sessionDuration: 90,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.trainerId) {
      newErrors.trainerId = 'Vui lòng chọn PT';
    }
    if (!formData.memberId) {
      newErrors.memberId = 'Vui lòng chọn hội viên';
    }
    if (!formData.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }
    if (!formData.sessionDateTime) {
      newErrors.sessionDateTime = 'Vui lòng chọn ngày giờ';
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
      const createData: CreateScheduleRequest = {
        memberId: formData.memberId,
        trainerId: formData.trainerId,
        subscriptionId: formData.subscriptionId || formData.memberId, // Fallback
        branchId: formData.branchId,
        dateTime: new Date(formData.sessionDateTime).toISOString(),
        durationMinutes: formData.sessionDuration,
        status: 'Confirmed',
        notes: formData.notes,
      };

      console.log('🚀 Creating coaching schedule:', createData);
      await createMutation.mutateAsync(createData);
      handleClose();
    } catch (error: any) {
      console.error('❌ Error creating schedule:', error?.response?.data);
    }
  };

  const handleClose = () => {
    setFormData({
      trainerId: '',
      memberId: '',
      subscriptionId: '',
      branchId: '',
      sessionDateTime: new Date().toISOString().slice(0, 16),
      sessionDuration: 90,
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
            <Dumbbell className="w-5 h-5 text-orange-600" />
            Phân lịch hướng dẫn cho PT
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="trainerId">
                Chọn PT <span className="text-red-500">*</span>
              </Label>
              <SelectWithScrollLock
                value={formData.trainerId}
                onValueChange={(value) => handleChange('trainerId', value)}
                lockScroll={true}
              >
                <SelectTrigger className={errors.trainerId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn PT" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer._id} value={trainer._id}>
                      {trainer.fullName} - PT
                      {trainer.role === 'trainer' && trainer.trainerInfo && (
                        <span className="text-xs text-gray-500">
                          {' '}({trainer.trainerInfo.specialty})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectWithScrollLock>
              {errors.trainerId && (
                <p className="text-red-500 text-xs mt-1">{errors.trainerId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="memberId">
                Chọn hội viên <span className="text-red-500">*</span>
              </Label>
              <SelectWithScrollLock
                value={formData.memberId}
                onValueChange={(value) => handleChange('memberId', value)}
                lockScroll={true}
              >
                <SelectTrigger className={errors.memberId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn hội viên" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  {members.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.fullName}
                      {member.memberInfo && (
                        <span className="text-xs text-gray-500">
                          {' '}({member.memberInfo.membership_level.toUpperCase()})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectWithScrollLock>
              {errors.memberId && (
                <p className="text-red-500 text-xs mt-1">{errors.memberId}</p>
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
              <Label htmlFor="sessionDateTime">
                Ngày và giờ buổi tập <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sessionDateTime"
                type="datetime-local"
                value={formData.sessionDateTime}
                onChange={(e) => handleChange('sessionDateTime', e.target.value)}
                className={errors.sessionDateTime ? 'border-red-500' : ''}
              />
              {errors.sessionDateTime && (
                <p className="text-red-500 text-xs mt-1">{errors.sessionDateTime}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sessionDuration">Thời lượng buổi tập (phút)</Label>
              <SelectWithScrollLock
                value={formData.sessionDuration.toString()}
                onValueChange={(value) => handleChange('sessionDuration', parseInt(value))}
                lockScroll={true}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời lượng" />
                </SelectTrigger>
                <SelectContent lockScroll={true}>
                  <SelectItem value="60">60 phút</SelectItem>
                  <SelectItem value="90">90 phút</SelectItem>
                  <SelectItem value="120">120 phút</SelectItem>
                </SelectContent>
              </SelectWithScrollLock>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú về buổi tập</Label>
              <textarea
                id="notes"
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Nhập ghi chú về buổi tập..."
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
                disabled={createMutation.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
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
                    Tạo lịch hướng dẫn
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

