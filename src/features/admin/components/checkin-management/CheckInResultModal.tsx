import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, User, MapPin, Clock, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { formatDateTime } from '../../../../lib/date-utils';

export interface CheckInResultData {
    success: boolean;
    message: string;
    member?: {
        _id: string;
        fullName: string;
        email?: string;
        phone?: string;
    };
    branch?: {
        _id: string;
        name: string;
        address?: string;
    };
    checkInTime?: string;
    error?: string;
}
interface CheckInResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: CheckInResultData | null;
}

export const CheckInResultModal: React.FC<CheckInResultModalProps> = ({
    isOpen,
    onClose,
    result
  }) => {
    if (!isOpen || !result) return null;
  
    const isSuccess = result.success;
    const Icon = isSuccess ? CheckCircle : XCircle;
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col ${borderColor} border-2`}>
        {/* Header */}
        <div className={`${bgColor} px-6 py-4 rounded-t-lg flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isSuccess ? 'Check-in Thành Công' : 'Check-in Thất Bại'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Message */}
          <div className={`p-3 rounded-lg ${bgColor} border ${borderColor}`}>
            <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
              {result.message || (isSuccess ? 'Check-in đã được xử lý thành công!' : 'Đã xảy ra lỗi khi check-in')}
            </p>
          </div>

          {/* Error Message (if any) */}
          {result.error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{result.error}</p>
              </div>
            </div>
          )}

          {/* Member Information */}
          {result.member && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                <span>Thông tin Hội viên</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Họ và tên</p>
                  <p className="text-sm font-medium text-gray-900">{result.member.fullName}</p>
                  <p className="text-xs text-gray-500">ID: {result.member._id}</p>
                </div>
                {result.member.email && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{result.member.email}</p>
                  </div>
                )}
                {result.member.phone && (
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm text-gray-900">{result.member.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Branch Information */}
          {result.branch && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4" />
                <span>Chi nhánh</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{result.branch.name}</p>
                {result.branch.address && (
                  <p className="text-xs text-gray-500 mt-1">{result.branch.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Check-in Time */}
          {result.checkInTime && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Thời gian Check-in</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{formatDateTime(result.checkInTime)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
          <Button
            onClick={onClose}
            className="w-full"
            variant={isSuccess ? 'default' : 'destructive'}
          >
            {isSuccess ? 'Đóng' : 'Thử lại'}
          </Button>
        </div>
      </div>
    </div>
  );
}