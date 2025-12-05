import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { X, Clock, Calendar, User, Loader2, AlertCircle } from 'lucide-react';
import { useSchedulesByTrainer, useUpdateSchedule, useTrainers, useAllStaffTrainers } from '../../hooks';
import { scheduleApi } from '../../api/schedule.api';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleQueryKeys } from '../../hooks/useSchedules';
import { Schedule, StaffTrainerUser } from '../../types';
import { formatDate } from '../../../../lib/date-utils';
import { toast } from 'sonner';
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalChangeScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: string;
  trainerName: string;
  trainerRole: 'trainer' | 'staff';
  onSuccess?: () => void;
}

export function ModalChangeSchedule({
  isOpen,
  onClose,
  trainerId,
  trainerName,
  trainerRole,
  onSuccess,
}: ModalChangeScheduleProps) {
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedulesByTrainer(trainerId);
  const { data: allStaffTrainersData, isLoading: isLoadingTrainers } = useAllStaffTrainers();
  const updateScheduleMutation = useUpdateSchedule();
  const queryClient = useQueryClient();
  
  // Extract trainers from response
  const allStaffTrainers = React.useMemo(() => {
    if (!allStaffTrainersData) return [];
    // Handle both direct array and response.data structure
    if (Array.isArray(allStaffTrainersData)) {
      return allStaffTrainersData;
    }
    if ((allStaffTrainersData as any)?.data && Array.isArray((allStaffTrainersData as any).data)) {
      return (allStaffTrainersData as any).data;
    }
    return [];
  }, [allStaffTrainersData]);

  // Filter only future schedules with Pending or Confirmed status
  const activeSchedules = React.useMemo(() => {
    if (!schedules) return [];
    const now = new Date();
    return schedules.filter((schedule: Schedule) => {
      const scheduleDate = new Date(schedule.dateTime);
      return (
        scheduleDate >= now &&
        (schedule.status === 'Pending' || schedule.status === 'Confirmed')
      );
    });
  }, [schedules]);

  // State to store schedules for each trainer (for availability check)
  const [trainerSchedulesMap, setTrainerSchedulesMap] = useState<Record<string, Schedule[]>>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Fetch schedules for all trainers to check availability
  useEffect(() => {
    if (!allStaffTrainers || allStaffTrainers.length === 0) return;

    const fetchTrainerSchedules = async () => {
      setIsLoadingAvailability(true);
      const schedulesMap: Record<string, Schedule[]> = {};
      
      // Fetch schedules for each trainer in parallel
      const schedulePromises = allStaffTrainers
        .filter((trainer: StaffTrainerUser) => 
          trainer._id !== trainerId &&
          trainer.status === 'active' &&
          (trainerRole === 'trainer' ? trainer.role === 'trainer' : trainer.role === 'trainer' || trainer.role === 'staff')
        )
        .map(async (trainer: StaffTrainerUser) => {
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
  }, [allStaffTrainers, trainerId, trainerRole]);

  // Function to check if trainer is available at a specific time
  const isTrainerAvailable = (trainerId: string, scheduleDateTime: Date, durationMinutes: number): boolean => {
    const trainerSchedules = trainerSchedulesMap[trainerId] || [];
    const scheduleStart = new Date(scheduleDateTime);
    const scheduleEnd = new Date(scheduleStart.getTime() + durationMinutes * 60000);
    const BUFFER_TIME_MINUTES = 15; // 15 minutes buffer between schedules
    const scheduleEndWithBuffer = new Date(scheduleEnd.getTime() + BUFFER_TIME_MINUTES * 60000);

    // Check for conflicts
    const hasConflict = trainerSchedules.some((schedule: Schedule) => {
      // Skip if schedule is completed, cancelled, or no-show
      if (['Completed', 'Cancelled', 'NoShow'].includes(schedule.status)) {
        return false;
      }

      const existingStart = new Date(schedule.dateTime);
      const existingEnd = new Date(existingStart.getTime() + schedule.durationMinutes * 60000);
      const existingEndWithBuffer = new Date(existingEnd.getTime() + BUFFER_TIME_MINUTES * 60000);

      // Check if schedules overlap
      return scheduleStart < existingEndWithBuffer && scheduleEndWithBuffer > existingStart;
    });

    return !hasConflict;
  };

  // Get available trainers for a specific schedule
  const getAvailableTrainersForSchedule = (schedule: Schedule) => {
    if (!allStaffTrainers) return [];
    
    const scheduleDate = new Date(schedule.dateTime);
    
    return allStaffTrainers.filter((trainer: StaffTrainerUser) => {
      // Basic filters
      if (trainer._id === trainerId) return false;
      if (trainer.status !== 'active') return false;
      if (trainerRole === 'trainer' && trainer.role !== 'trainer') return false;
      if (trainerRole === 'staff' && trainer.role !== 'trainer' && trainer.role !== 'staff') return false;
      
      // Check availability
      return isTrainerAvailable(trainer._id, scheduleDate, schedule.durationMinutes);
    });
  };

  // State for each schedule's new trainer
  const [scheduleTrainers, setScheduleTrainers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize schedule trainers state
  useEffect(() => {
    if (activeSchedules.length > 0) {
      const initial: Record<string, string> = {};
      activeSchedules.forEach((schedule: Schedule) => {
        initial[schedule._id] = '';
      });
      setScheduleTrainers(initial);
    }
  }, [activeSchedules]);

  const handleTrainerChange = (scheduleId: string, newTrainerId: string) => {
    setScheduleTrainers((prev) => ({
      ...prev,
      [scheduleId]: newTrainerId,
    }));
  };

  const handleSubmit = async () => {
    // Validate all schedules have a new trainer selected
    const missingTrainers = activeSchedules.filter(
      (schedule: Schedule) => !scheduleTrainers[schedule._id]
    );

    if (missingTrainers.length > 0) {
      toast.error('Vui lòng chọn PT/Nhân viên mới cho tất cả các lịch');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update all schedules - use API directly to avoid multiple toasts
      const updatePromises = activeSchedules.map((schedule: Schedule) =>
        scheduleApi.updateSchedule(schedule._id, {
          trainerId: scheduleTrainers[schedule._id],
        })
      );

      await Promise.all(updatePromises);
      
      // Invalidate queries manually to refresh data
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.byTrainer(trainerId) });
      activeSchedules.forEach((schedule: Schedule) => {
        queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.detail(schedule._id) });
      });
      
      // Show single success toast with clear message
      toast.success(`Đã thay đổi PT/Nhân viên cho ${activeSchedules.length} lịch thành công!`, {
        description: `Đã cập nhật ${activeSchedules.length} lịch làm việc`
      });
      
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

  const roleText = trainerRole === 'trainer' ? 'PT' : 'Nhân viên';

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  if (!isOpen) return null;

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
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white relative z-[10000]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6" />
                Thay đổi {roleText} cho các lịch làm việc
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Thay đổi {roleText} <strong>{trainerName}</strong> cho {activeSchedules.length} lịch làm việc trong tương lai
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
          {isLoadingSchedules ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải lịch làm việc...</span>
            </div>
          ) : activeSchedules.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Không có lịch làm việc nào cần thay đổi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSchedules.map((schedule: Schedule) => {
                const scheduleDate = new Date(schedule.dateTime);
                const scheduleEnd = new Date(
                  scheduleDate.getTime() + schedule.durationMinutes * 60000
                );
                const isDirectSchedule = schedule.notes?.includes('[LỊCH TRỰC]');

                return (
                  <Card key={schedule._id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
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
                        </div>
                        <div className="w-64">
                          <Label htmlFor={`trainer-${schedule._id}`} className="text-sm font-medium">
                            Chọn {roleText} mới
                          </Label>
                          <Select
                            value={scheduleTrainers[schedule._id] || ''}
                            onValueChange={(value) =>
                              handleTrainerChange(schedule._id, value)
                            }
                          >
                            <SelectTrigger id={`trainer-${schedule._id}`}>
                              <SelectValue placeholder="Chọn PT/Nhân viên" />
                            </SelectTrigger>
                            <SelectContent className="z-[10001]">
                              {getAvailableTrainersForSchedule(schedule).length > 0 ? (
                                getAvailableTrainersForSchedule(schedule).map((trainer: StaffTrainerUser) => (
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          </CardContent>

          <div className="flex justify-end gap-2 pt-4 pb-6 px-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                activeSchedules.length === 0 ||
                Object.values(scheduleTrainers).some((id) => !id)
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                `Xác nhận thay đổi ${activeSchedules.length} lịch`
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

