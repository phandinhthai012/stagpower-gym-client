import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Button } from '../../../../components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react';
import { StaffTrainerUser } from '../../types/staff-trainer.types';
import { Badge } from '../../../../components/ui/badge';

interface UserWithSchedule {
  user: StaffTrainerUser;
  scheduleCount: number;
}

interface ModalDeactivateConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onConfirmWithScheduleChange?: () => void;
  
  // Bulk mode
  usersWithSchedules?: UserWithSchedule[];
  usersWithoutSchedules?: StaffTrainerUser[];
  
  // Simple confirm mode (no schedules)
  userCount?: number;
  userName?: string;
}

export function ModalDeactivateConfirm({
  isOpen,
  onClose,
  onConfirm,
  onConfirmWithScheduleChange,
  usersWithSchedules = [],
  usersWithoutSchedules = [],
  userCount = 1,
  userName,
}: ModalDeactivateConfirmProps) {
  // Determine mode
  const isBulkMode = usersWithSchedules.length > 0 || usersWithoutSchedules.length > 0;
  const isSimpleConfirmMode = !isBulkMode;
  
  const hasSchedules = usersWithSchedules.length > 0;
  const hasUsersWithoutSchedules = usersWithoutSchedules.length > 0;
  const totalUsers = usersWithSchedules.length + usersWithoutSchedules.length || userCount;

  const getRoleText = (role: string) => {
    return role === 'trainer' ? 'PT' : 'Nhân viên';
  };
  
  // Bulk mode with mixed users
  if (isBulkMode) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                Xác nhận vô hiệu hóa {totalUsers} nhân viên/PT
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base pt-2 space-y-4">
              {hasSchedules && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-red-700">
                      {usersWithSchedules.length} nhân viên/PT còn lịch làm việc:
                    </p>
                  </div>
                  <div className="space-y-2 ml-7">
                    {usersWithSchedules.map(({ user, scheduleCount }) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">
                            {getRoleText(user.role)} {user.fullName}
                          </span>
                        </div>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          {scheduleCount} lịch
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 ml-7 mt-2">
                    Bạn cần thay đổi PT/Nhân viên khác vào các lịch này trước khi vô hiệu hóa.
                  </p>
                </div>
              )}

              {hasUsersWithoutSchedules && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-700">
                      {usersWithoutSchedules.length} nhân viên/PT có thể vô hiệu hóa ngay:
                    </p>
                  </div>
                  <div className="space-y-2 ml-7">
                    {usersWithoutSchedules.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200"
                      >
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                          {getRoleText(user.role)} {user.fullName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSchedules && hasUsersWithoutSchedules && (
                <p className="text-sm text-gray-600 mt-2">
                  Bạn có thể vô hiệu hóa {usersWithoutSchedules.length} nhân viên/PT ngay bây giờ,
                  và cần thay đổi lịch cho {usersWithSchedules.length} nhân viên/PT còn lại.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            {hasUsersWithoutSchedules && (
              <Button
                onClick={onConfirm}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Vô hiệu hóa {usersWithoutSchedules.length} người (không có lịch)
              </Button>
            )}
            {hasSchedules && onConfirmWithScheduleChange && (
              <Button
                onClick={onConfirmWithScheduleChange}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {hasUsersWithoutSchedules
                  ? `Thay đổi lịch cho ${usersWithSchedules.length} người`
                  : `Thay đổi lịch cho ${usersWithSchedules.length} người`}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Simple confirm mode (no schedules, just confirmation)
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <AlertDialogTitle className="text-xl">
              Xác nhận vô hiệu hóa
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            {userCount > 1 ? (
              <p>
                Bạn có chắc chắn muốn vô hiệu hóa <strong>{userCount} nhân viên/PT</strong> đã chọn?
              </p>
            ) : (
              <p>
                Bạn có chắc chắn muốn vô hiệu hóa {userName ? (
                  <>
                    <strong>{userName}</strong>?
                  </>
                ) : (
                  'nhân viên/PT này?'
                )}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Xác nhận
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

