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
  MapPin,
  Clock,
  Star,
  Award,
  Heart,
  FileText,
  QrCode,
  Edit,
  Trash2,
  Download,
  Eye,
  Shield,
  Activity
} from 'lucide-react';
import { User as UserType } from '../../../../mockdata/users';

interface ModalDetailMemberProps {
  isOpen: boolean;
  onClose: () => void;
  member: UserType | null;
  onEdit?: (member: UserType) => void;
  onDelete?: (memberId: string) => void;
}

export function ModalDetailMember({ 
  isOpen, 
  onClose, 
  member, 
  onEdit, 
  onDelete 
}: ModalDetailMemberProps) {
  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  if (!isOpen || !member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipLevelColor = (level: string) => {
    switch (level) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết thành viên
              </h2>
              <p className="text-sm text-gray-500">
                Thông tin chi tiết về {member.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(member)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
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
                        {member.gender === 'Male' ? 'Nam' : member.gender === 'Female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(member.date_of_birth)}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CCCD</label>
                      <p className="text-sm text-gray-900">{member.cccd}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                      <p className="text-sm text-gray-900 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(member.join_date)}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status === 'active' ? 'Hoạt động' : 
                           member.status === 'inactive' ? 'Không hoạt động' : 'Tạm ngưng'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Information */}
              {member.member_info && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span>Thông tin thành viên</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cấp độ thành viên</label>
                        <div className="mt-1">
                          <Badge className={getMembershipLevelColor(member.member_info.membership_level)}>
                            {member.member_info.membership_level}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tổng chi tiêu</label>
                        <p className="text-sm text-gray-900 font-medium">
                          {formatCurrency(member.member_info.total_spending)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tháng thành viên</label>
                        <p className="text-sm text-gray-900">{member.member_info.membership_month} tháng</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Học sinh/Sinh viên</label>
                        <div className="mt-1">
                          <Badge className={member.member_info.is_hssv ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                            {member.member_info.is_hssv ? 'Có' : 'Không'}
                          </Badge>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {member.member_info.notes || 'Không có ghi chú'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Health Information */}
              {member.member_info?.health_info_id && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <span>Thông tin sức khỏe</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">ID thông tin sức khỏe: {member.member_info.health_info_id}</p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Actions & QR */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Ảnh đại diện</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.fullName}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Thay đổi ảnh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              {member.member_info?.qr_code && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5 text-green-600" />
                      <span>Mã QR</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Thao tác nhanh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Xem lịch sử
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thanh toán
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Đặt lịch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Gửi email
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thành viên
                  </Button>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span>Thống kê</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Số buổi tập</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Điểm tích lũy</span>
                    <span className="text-sm font-medium">1,250</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lần check-in</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đánh giá</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Tạo lúc: {formatDate(member.created_at)} | 
            Cập nhật lần cuối: {formatDate(member.updated_at)}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={() => onEdit?.(member)}>
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
