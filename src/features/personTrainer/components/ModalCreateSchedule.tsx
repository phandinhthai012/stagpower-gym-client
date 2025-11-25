import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { X, Calendar, Clock, User, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSchedule, useMembers, useBranches, useSchedulesByTrainer } from '../hooks';
import { CreateScheduleRequest } from '../types/schedule.types';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useAuth } from '../../../contexts/AuthContext';

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
  const { user } = useAuth();
  const { data: members } = useMembers();
  const { data: branches } = useBranches();
  const createMutation = useCreateSchedule();
  
  // Fetch trainer's existing schedules
  const { data: trainerSchedules, isLoading: isLoadingSchedules } = useSchedulesByTrainer(
    user?.id || ''
  );

  // Filter members to only show those with PT sessions remaining > 0
  const availableMembers = React.useMemo(() => {
    if (!members) return [];
    return members.filter((member: any) => {
      // Check if member has at least one active subscription with PT sessions remaining > 0
      const hasAvailableSessions = member.activeSubscriptions?.some((sub: any) => {
        return (sub.type === 'PT' || sub.type === 'Combo') && 
               sub.ptsessionsRemaining > 0 &&
               sub.status === 'Active';
      });
      return hasAvailableSessions;
    });
  }, [members]);

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
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Create map of busy time slots
  const busySlots = useMemo(() => {
    if (!trainerSchedules || !user?.id) return new Set<string>();
    
    const slots = new Set<string>();
    trainerSchedules
      .filter(s => ['Pending', 'Confirmed'].includes(s.status))
      .forEach(schedule => {
        const start = new Date(schedule.dateTime);
        const end = new Date(start.getTime() + schedule.durationMinutes * 60000);
        for (let time = new Date(start); time < end; time = new Date(time.getTime() + 30 * 60000)) {
          slots.add(time.toISOString().slice(0, 16));
        }
      });
    return slots;
  }, [trainerSchedules, user?.id]);

  // Check for conflict when dateTime or duration changes
  useEffect(() => {
    if (!formData.dateTime || !formData.duration || !trainerSchedules) {
      setConflictWarning(null);
      return;
    }

    const newStart = new Date(formData.dateTime);
    const newEnd = new Date(newStart.getTime() + Number(formData.duration) * 60000);
    
    const conflict = trainerSchedules.find(schedule => {
      if (!['Pending', 'Confirmed'].includes(schedule.status)) return false;
      
      const existingStart = new Date(schedule.dateTime);
      const existingEnd = new Date(existingStart.getTime() + schedule.durationMinutes * 60000);
      
      return newStart < existingEnd && newEnd > existingStart;
    });
    
    if (conflict) {
      const conflictTime = new Date(conflict.dateTime).toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setConflictWarning(`⚠️ Bạn đã có lịch vào ${conflictTime}. Vui lòng chọn thời gian khác.`);
    } else {
      setConflictWarning(null);
    }
  }, [formData.dateTime, formData.duration, trainerSchedules]);

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

  // Reset memberId if selected member is no longer available
  useEffect(() => {
    if (formData.memberId && availableMembers.length > 0) {
      const isMemberAvailable = availableMembers.some((m: any) => m._id === formData.memberId);
      if (!isMemberAvailable) {
        setFormData(prev => ({ ...prev, memberId: '' }));
      }
    }
  }, [availableMembers, formData.memberId]);

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
      
      // Check conflict
      if (conflictWarning) {
        newErrors.dateTime = 'Thời gian này đã bị trùng với lịch khác';
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
      handleClose();
    } catch (error: any) {
      console.error('Error creating schedule:', error?.response?.data || error);
      // Error toast is handled by useCreateSchedule mutation hook
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
                <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[90vw] sm:max-w-none">
                  {availableMembers && availableMembers.length > 0 ? (
                    availableMembers.map((member: any) => {
                      // Get total PT sessions remaining across all subscriptions
                      const totalSessionsRemaining = member.activeSubscriptions
                        ?.filter((sub: any) => (sub.type === 'PT' || sub.type === 'Combo') && sub.status === 'Active')
                        .reduce((sum: number, sub: any) => sum + (sub.ptsessionsRemaining || 0), 0) || 0;
                      
                      return (
                        <SelectItem key={member._id} value={member._id} className="min-w-0">
                          <div className="flex flex-col min-w-0 w-full">
                            <span className="font-medium truncate text-sm sm:text-base">{member.fullName}</span>
                            <span className="text-xs text-gray-500 truncate">{member.email}</span>
                            <span className="text-xs text-blue-600 font-medium mt-0.5">
                              Còn {totalSessionsRemaining} buổi PT
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-members" disabled>
                      Không có hội viên nào còn buổi PT
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
                className={conflictWarning || errors.dateTime ? 'border-red-500 focus:ring-red-500' : ''}
                min={new Date().toISOString().slice(0, 16)}
              />
              {conflictWarning && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{conflictWarning}</span>
                </div>
              )}
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

            {/* Trainer's Existing Schedules */}
            {user?.id && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-semibold text-gray-700">
                    Lịch đã có của bạn
                  </Label>
                </div>
                {isLoadingSchedules ? (
                  <p className="text-xs text-gray-500">Đang tải lịch...</p>
                ) : trainerSchedules && trainerSchedules.filter(s => ['Pending', 'Confirmed'].includes(s.status)).length > 0 ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {trainerSchedules
                      .filter(s => ['Pending', 'Confirmed'].includes(s.status))
                      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                      .map(schedule => {
                        const scheduleDate = new Date(schedule.dateTime);
                        const scheduleEnd = new Date(scheduleDate.getTime() + schedule.durationMinutes * 60000);
                        return (
                          <div key={schedule._id} className="flex items-center gap-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="font-medium">
                              {scheduleDate.toLocaleDateString('vi-VN', { 
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </span>
                            <span>
                              {scheduleDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - 
                              {scheduleEnd.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-gray-400">({schedule.durationMinutes} phút)</span>
                            <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] ${
                              schedule.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {schedule.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Bạn chưa có lịch nào</p>
                )}
              </div>
            )}

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
