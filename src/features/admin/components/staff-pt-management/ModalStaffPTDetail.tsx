import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Award, 
  Clock, 
  User, 
  Dumbbell, 
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle,
  Edit
} from 'lucide-react';
import { StaffTrainerUser } from '../../types/staff-trainer.types';
import { useBranches } from '../../hooks';

interface StaffPTDetailModalProps {
  user: StaffTrainerUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function StaffPTDetailModal({ user, isOpen, onClose, onEdit }: StaffPTDetailModalProps) {
  const { data: branchesData } = useBranches();
  const branches = branchesData || [];

  // Ẩn scrollbar của page khi modal mở
  useEffect(() => {
    if (isOpen) {
      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Khôi phục scroll khi modal đóng
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const trainerInfo = user.role === 'trainer' ? user.trainerInfo : undefined;
  const staffInfo = user.role === 'staff' ? user.staffInfo : undefined;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa xác định</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'trainer':
        return <Badge className="bg-orange-100 text-orange-800">PT</Badge>;
      case 'staff':
        return <Badge className="bg-blue-100 text-blue-800">Nhân viên</Badge>;
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b._id === branchId)?.name || 'Chưa chọn';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
            </div>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                {user.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div> 
                      <p className="text-sm text-gray-600">Ngày sinh</p>
                      <p className="font-medium">{formatDate(user.dateOfBirth)} ({calculateAge(user.dateOfBirth)} tuổi)</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Giới tính</p>
                    <p className="font-medium">
                      {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                    </p>
                  </div>
                </div>
                {user.cccd && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">CCCD</p>
                      <p className="font-medium">{user.cccd}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role-specific Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {user.role === 'trainer' ? (
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  )}
                  {user.role === 'trainer' ? 'Thông tin PT' : 'Thông tin nhân viên'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === 'trainer' && trainerInfo ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Kinh nghiệm</p>
                        <p className="font-medium">{trainerInfo.experience_years || 0} năm</p>
                      </div>
                    </div>
                    {trainerInfo.working_hour && trainerInfo.working_hour.length >= 2 && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Giờ làm việc</p>
                          <p className="font-medium">
                            {trainerInfo.working_hour[0]} - {trainerInfo.working_hour[1]}
                          </p>
                        </div>
                      </div>
                    )}
                    {trainerInfo.specialty && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Chuyên môn</p>
                        <Badge variant="outline" className="text-xs">
                          {trainerInfo.specialty}
                        </Badge>
                      </div>
                    )}
                    {trainerInfo.certificate && trainerInfo.certificate.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Chứng chỉ</p>
                        <div className="space-y-1">
                          {trainerInfo.certificate.map((cert: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : staffInfo ? (
                  <>
                    {staffInfo.brand_id && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Chi nhánh</p>
                          <p className="font-medium">{getBranchName(staffInfo.brand_id)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Vị trí</p>
                        <p className="font-medium">{staffInfo.position || 'Nhân viên'}</p>
                      </div>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Work Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Thống kê công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.role === 'trainer' ? '15' : '8'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.role === 'trainer' ? 'Hội viên phụ trách' : 'Năm kinh nghiệm'}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.role === 'trainer' ? '4.8' : '4.9'}
                  </div>
                  <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {user.role === 'trainer' ? '120' : '45'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.role === 'trainer' ? 'Buổi tập tháng này' : 'Giờ làm việc/tuần'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Hoàn thành buổi tập', time: '2 giờ trước', type: 'success' },
                  { action: 'Cập nhật thông tin hội viên', time: '1 ngày trước', type: 'info' },
                  { action: 'Tạo lịch tập mới', time: '2 ngày trước', type: 'info' },
                  { action: 'Đánh giá hội viên', time: '3 ngày trước', type: 'success' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            {onEdit && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleEditClick}
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa thông tin
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
