import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard,
  Clock,
  QrCode,
  Edit,
  Download,
  Eye,
  Activity
} from 'lucide-react';
import { User as UserType } from '../../../../mockdata/users';
import { useHealthInfoByMemberId } from '../../../member/hooks/useHealthInfo';
import { HealthInfoSection } from './HealthInfoSection';
import { UniversalUser, normalizeUser } from '../../types/user.types';

interface ModalDetailMemberProps {
  isOpen: boolean;
  onClose: () => void;
  member: UniversalUser | UserType | null;
  onEdit?: (member: any) => void;
  onDelete?: (memberId: string) => void;
}

export function ModalDetailMember({ 
  isOpen, 
  onClose, 
  member: rawMember, 
  onEdit, 
  onDelete 
}: ModalDetailMemberProps) {
  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  // Normalize member data to ApiUser format (camelCase)
  // Must do this before hooks to avoid conditional hook calls
  const member = rawMember ? normalizeUser(rawMember as UniversalUser) : null;

  // Fetch health info for this member
  // Hook must be called unconditionally
  const memberId = member?._id;
  const { data: healthInfoResponse, isLoading: isLoadingHealthInfo } = useHealthInfoByMemberId(memberId);
  
  // Extract health info from response
  // Response will be { success: true, data: {...} } or null (if 404)
  const healthInfo = healthInfoResponse?.data ?? null;

  // Early return after all hooks
  if (!isOpen || !rawMember || !member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[96vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-200 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-start sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {member.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={getStatusColor(member.status)}>
                  {member.status === 'active' ? 'Hoạt động' : 
                   member.status === 'inactive' ? 'Không hoạt động' : 
                   member.status === 'pending' ? 'Chờ xử lý' : 'Bị cấm'}
                </Badge>
                {member.memberInfo?.membership_level && (
                  <Badge className={getMembershipLevelColor(member.memberInfo.membership_level)}>
                    {member.memberInfo.membership_level.toUpperCase()}
                  </Badge>
                )}
                {member.memberInfo?.is_hssv && (
                  <Badge className="bg-blue-100 text-blue-800">HSSV</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/50 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Member Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Thông tin cơ bản</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                      <p className="text-sm text-gray-900 font-medium">{member.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{member.email}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{member.phone}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Giới tính</label>
                      <p className="text-sm text-gray-900">
                        {member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(member.dateOfBirth)}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CCCD</label>
                      <p className="text-sm text-gray-900">{member.cccd || 'Chưa có'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(member.joinDate)}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID thành viên</label>
                      <p className="text-sm text-gray-900 font-mono">
                        {member.uid || member._id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Information */}
              {member.memberInfo && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="bg-green-50/50">
                    <CardTitle className="flex items-center space-x-2 text-green-900">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span>Thông tin thành viên</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cấp độ thành viên</label>
                        <div className="mt-1">
                          <Badge className={getMembershipLevelColor(member.memberInfo.membership_level)}>
                            {member.memberInfo.membership_level}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tổng chi tiêu</label>
                        <p className="text-sm text-gray-900 font-medium">
                          {formatCurrency(member.memberInfo.total_spending || 0)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tháng thành viên</label>
                        <p className="text-sm text-gray-900">{member.memberInfo.membership_month || 0} tháng</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Học sinh/Sinh viên</label>
                        <div className="mt-1">
                          <Badge className={member.memberInfo.is_hssv ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                            {member.memberInfo.is_hssv ? 'Có' : 'Không'}
                          </Badge>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {member.memberInfo.notes || 'Không có ghi chú'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Health Information */}
              <HealthInfoSection 
                healthInfo={healthInfo}
                isLoading={isLoadingHealthInfo}
              />
            </div>

            {/* Right Column - Profile & Statistics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Photo */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="bg-orange-50/50">
                  <CardTitle className="flex items-center space-x-2 text-orange-900">
                    <User className="h-5 w-5 text-orange-600" />
                    <span>Ảnh đại diện</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.fullName}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-4xl font-bold">
                          {member.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50/50">
                  <CardTitle className="flex items-center space-x-2 text-green-900">
                    <QrCode className="h-5 w-5 text-green-600" />
                    <span>Mã QR Check-in</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-40 h-40 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-2">
                      {member.memberInfo?.qr_code ? (
                        <QrCode className="w-full h-full text-gray-800" />
                      ) : (
                        <div className="text-center">
                          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Chưa có mã QR</p>
                        </div>
                      )}
                    </div>
                    {member.memberInfo?.qr_code && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Member Statistics */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="bg-purple-50/50">
                  <CardTitle className="flex items-center space-x-2 text-purple-900">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Thống kê hoạt động</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Số buổi đã tập</span>
                      <span className="text-base font-semibold text-gray-900">24 buổi</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Tổng chi tiêu</span>
                      <span className="text-base font-semibold text-orange-600">
                        {formatCurrency(member.memberInfo?.total_spending || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Tháng thành viên</span>
                      <span className="text-base font-semibold text-blue-600">
                        {member.memberInfo?.membership_month || 0} tháng
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Tình trạng HSSV</span>
                      <Badge className={member.memberInfo?.is_hssv ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}>
                        {member.memberInfo?.is_hssv ? 'Có' : 'Không'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">Tạo: {formatDate(member.createdAt)}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="truncate">Cập nhật: {formatDate(member.updatedAt)}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 sm:flex-initial sm:min-w-[100px]"
                size="default"
              >
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Đóng</span>
              </Button>
              <Button 
                onClick={() => onEdit?.(rawMember)} 
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-initial sm:min-w-[120px]"
                size="default"
              >
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
