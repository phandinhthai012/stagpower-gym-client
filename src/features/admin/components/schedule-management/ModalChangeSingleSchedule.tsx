import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { X, Clock, Calendar, User, Loader2, AlertCircle } from 'lucide-react';
import { useUpdateSchedule, useAllStaffTrainers } from '../../hooks';
import { scheduleApi } from '../../api/schedule.api';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleQueryKeys } from '../../hooks/useSchedules';
import { ScheduleWithDetails, Schedule } from '../../types';
import { formatDate } from '../../../../lib/date-utils';
import { toast } from 'sonner';
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalChangeSingleScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleWithDetails | null;
  onSuccess?: () => void;
}

export function ModalChangeSingleSchedule({
  isOpen,
  onClose,
  schedule,
  onSuccess,
}: ModalChangeSingleScheduleProps) {
  const { data: allStaffTrainersData, isLoading: isLoadingTrainers } = useAllStaffTrainers();
  const updateScheduleMutation = useUpdateSchedule();
  const queryClient = useQueryClient();

  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainerSchedulesMap, setTrainerSchedulesMap] = useState<Record<string, Schedule[]>>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Extract trainers from response
  const allStaffTrainers = React.useMemo(() => {
    if (!allStaffTrainersData) return [];
    if (Array.isArray(allStaffTrainersData)) {
      return allStaffTrainersData;
    }
    if ((allStaffTrainersData as any)?.data && Array.isArray((allStaffTrainersData as any).data)) {
      return (allStaffTrainersData as any).data;
    }
    return [];
  }, [allStaffTrainersData]);

  // Get current trainer info from schedule
  const getTrainerId = (schedule: ScheduleWithDetails | null): string => {
    if (!schedule) return '';
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?._id) {
      return schedule.trainerId._id;
    }
    if (schedule.trainer?._id) {
      return schedule.trainer._id;
    }
    if (typeof schedule.trainerId === 'string') {
      return schedule.trainerId;
    }
    return '';
  };

  const getTrainerName = (schedule: ScheduleWithDetails | null): string => {
    if (!schedule) return '';
    if (typeof schedule.trainerId === 'object' && schedule.trainerId?.fullName) {
      return schedule.trainerId.fullName;
    }
    if (schedule.trainer?.fullName) {
      return schedule.trainer.fullName;
    }
    return 'PT';
  };

  const getTrainerRole = (schedule: ScheduleWithDetails | null): 'trainer' | 'staff' => {
    if (!schedule) return 'trainer';
    const hasTrainerInfo = 
      (typeof schedule.trainerId === 'object' && schedule.trainerId?.trainerInfo) ||
      (schedule.trainer?.trainerInfo);
    return hasTrainerInfo ? 'trainer' : 'staff';
  };

  const currentTrainerId = schedule ? getTrainerId(schedule) : '';
  const currentTrainerName = schedule ? getTrainerName(schedule) : '';
  const currentTrainerRole = schedule ? getTrainerRole(schedule) : 'trainer';

  // Fetch schedules for all trainers to check availability
  useEffect(() => {
    if (!allStaffTrainers || allStaffTrainers.length === 0 || !schedule) return;

    const fetchTrainerSchedules = async () => {
      setIsLoadingAvailability(true);
      const schedulesMap: Record<string, Schedule[]> = {};
      
      const schedulePromises = allStaffTrainers
        .filter((trainer: any) => 
          trainer._id !== currentTrainerId &&
          trainer.status === 'active' &&
          (currentTrainerRole === 'trainer' ? trainer.role === 'trainer' : trainer.role === 'trainer' || trainer.role === 'staff')
        )
        .map(async (trainer: any) => {
          try {
            const schedules = await scheduleApi.getSchedulesByTrainerId(trainer._id);
            schedulesMap[trainer._id] = schedules || [];
          } catch (error) {
            console.error(`Error fetching schedules for trainer ${trainer._id}:`, error);
            schedulesMap[trainer._id] = [];
          }
        });

      await Promise.all(schedulePromises);
      setTrainerSchedulesMap(schedulesMap);
      setIsLoadingAvailability(false);
    };

    fetchTrainerSchedules();
  }, [allStaffTrainers, currentTrainerId, currentTrainerRole, schedule]);

  // Function to check if trainer is available at a specific time
  const isTrainerAvailable = (trainerId: string, scheduleDateTime: Date, durationMinutes: number): boolean => {
    const trainerSchedules = trainerSchedulesMap[trainerId] || [];
    const scheduleStart = new Date(scheduleDateTime);
    const scheduleEnd = new Date(scheduleStart.getTime() + durationMinutes * 60000);
    const BUFFER_TIME_MINUTES = 15;
    const scheduleEndWithBuffer = new Date(scheduleEnd.getTime() + BUFFER_TIME_MINUTES * 60000);

    const hasConflict = trainerSchedules.some((schedule: Schedule) => {
      if (['Completed', 'Cancelled', 'NoShow'].includes(schedule.status)) {
        return false;
      }

      const existingStart = new Date(schedule.dateTime);
      const existingEnd = new Date(existingStart.getTime() + schedule.durationMinutes * 60000);
      const existingEndWithBuffer = new Date(existingEnd.getTime() + BUFFER_TIME_MINUTES * 60000);

      return scheduleStart < existingEndWithBuffer && scheduleEndWithBuffer > existingStart;
    });

    return !hasConflict;
  };

  // Get available trainers for the schedule
  const getAvailableTrainers = () => {
    if (!allStaffTrainers || !schedule) return [];
    
    const scheduleDate = new Date(schedule.dateTime);
    
    return allStaffTrainers.filter((trainer: any) => {
      if (trainer._id === currentTrainerId) return false;
      if (trainer.status !== 'active') return false;
      if (currentTrainerRole === 'trainer' && trainer.role !== 'trainer') return false;
      if (currentTrainerRole === 'staff' && trainer.role !== 'trainer' && trainer.role !== 'staff') return false;
      
      return isTrainerAvailable(trainer._id, scheduleDate, schedule.durationMinutes);
    });
  };

  // Reset selected trainer when modal closes or schedule changes
  useEffect(() => {
    if (!isOpen || !schedule) {
      setSelectedTrainerId('');
    }
  }, [isOpen, schedule]);

  const handleSubmit = async () => {
    if (!schedule || !selectedTrainerId) {
      toast.error('Vui lòng chọn PT/Nhân viên mới');
      return;
    }

    if (selectedTrainerId === currentTrainerId) {
      toast.error('PT/Nhân viên mới phải khác với PT/Nhân viên hiện tại');
      return;
    }

    setIsSubmitting(true);

    try {
      await scheduleApi.updateSchedule(schedule._id, {
        trainerId: selectedTrainerId,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.detail(schedule._id) });
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.byTrainer(currentTrainerId) });
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.byTrainer(selectedTrainerId) });
      
      toast.success('Đã thay đổi PT/Nhân viên thành công!');
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi lịch'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleText = currentTrainerRole === 'trainer' ? 'PT' : 'Nhân viên';
  const availableTrainers = getAvailableTrainers();

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  if (!isOpen || !schedule) return null;

  const scheduleDate = new Date(schedule.dateTime);
  const scheduleEnd = new Date(scheduleDate.getTime() + schedule.durationMinutes * 60000);
  const isDirectSchedule = schedule.notes?.includes('[LỊCH TRỰC]');

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40" 
        style={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white relative z-[10000]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6" />
                Thay đổi {roleText} cho lịch làm việc
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Thay đổi {roleText} cho lịch này
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Schedule Info */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">
                      {formatDate(schedule.dateTime)}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        schedule.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {schedule.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </Badge>
                    {isDirectSchedule && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Lịch trực
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {scheduleDate.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {scheduleEnd.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-gray-400">
                      ({schedule.durationMinutes} phút)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">PT hiện tại:</span> {currentTrainerName}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trainer Selection */}
            <div className="space-y-2">
              <Label htmlFor="new-trainer" className="text-sm font-medium">
                Chọn {roleText} mới
              </Label>
              {isLoadingAvailability ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang kiểm tra lịch rảnh...</span>
                </div>
              ) : (
                <Select
                  value={selectedTrainerId}
                  onValueChange={setSelectedTrainerId}
                >
                  <SelectTrigger id="new-trainer">
                    <SelectValue placeholder={`Chọn ${roleText} mới`} />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]">
                    {availableTrainers.length > 0 ? (
                      availableTrainers.map((trainer: any) => (
                        <SelectItem key={trainer._id} value={trainer._id}>
                          {trainer.fullName} ({trainer.role === 'trainer' ? 'PT' : 'Nhân viên'}) - Rảnh
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        Không có {roleText} rảnh tại thời điểm này
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
              {selectedTrainerId && (
                <p className="text-xs text-gray-500">
                  {availableTrainers.find((t: any) => t._id === selectedTrainerId)?.fullName || ''} sẽ được phân công cho lịch này
                </p>
              )}
            </div>
          </CardContent>

          <div className="flex justify-end gap-2 pt-4 pb-6 px-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !selectedTrainerId ||
                selectedTrainerId === currentTrainerId
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận thay đổi'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

