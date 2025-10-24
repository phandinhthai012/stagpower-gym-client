import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Heart,
  Target,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useMe, useUpdateProfile } from '../hooks/useMembers';
import { useHealthInfo, useCreateHealthInfo, useUpdateHealthInfo } from '../hooks/useHealthInfo';
import { formatDate } from '../../../lib/date-utils';
import { toast } from 'sonner';

export function MemberProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<{ fullName: string, email: string } | null>(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [editedHealth, setEditedHealth] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'health' | 'personal'>('health');

  // API hooks
  const { data: userData, isLoading: userLoading, error: userError } = useMe();
  const { data: healthInfo, isLoading: healthLoading, error: healthError } = useHealthInfo();
  const updateProfileMutation = useUpdateProfile();
  const createHealthInfoMutation = useCreateHealthInfo();
  const updateHealthInfoMutation = useUpdateHealthInfo();

  const initEditedHealth = () => {
    if (!healthInfo) return null;
    return {
      height: healthInfo?.height ?? '',
      weight: healthInfo?.weight ?? '',
      goal: healthInfo?.goal ?? 'WeightLoss',
      experience: healthInfo?.experience ?? 'Beginner',
      fitnessLevel: healthInfo?.fitnessLevel ?? 'Low',
      preferredTime: healthInfo?.preferredTime ?? 'Morning',
      weeklySessions: healthInfo?.weeklySessions ?? '1-2',
      medicalHistory: healthInfo?.medicalHistory ?? '',
      allergies: healthInfo?.allergies ?? ''
    };
  };

  const bmiValue = useMemo(() => {
    if (!healthInfo?.height || !healthInfo?.weight) return null;
    const h = healthInfo?.height / 100;
    return (healthInfo?.weight / (h * h)).toFixed(1);
  }, [healthInfo]);

  const handleInputChange = (field: string, value: string) => {
    if (!editedUser) return;

    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      await updateProfileMutation.mutateAsync({
        fullName: editedUser.fullName,
        email: editedUser.email,
      });
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setEditedUser(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      console.error('Update profile error:', error);
    }
  };

  const handleCancel = () => {
    setEditedUser(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (userData) {
      setEditedUser({
        fullName: userData.fullName,
        email: userData.email
      });
    }
    setIsEditing(true);
  };

  const handleHealthEdit = () => {
    setEditedHealth(initEditedHealth());
    setIsEditingHealth(true);
  };

  const handleHealthCancel = () => {
    setEditedHealth(null);
    setIsEditingHealth(false);
  };

  const handleHealthChange = (field: string, value: string | number) => {
    if (!editedHealth) {
      // Initialize editedHealth if it doesn't exist
      const initialHealth = {
        height: healthInfo?.height ?? '',
        weight: healthInfo?.weight ?? '',
        gender: healthInfo?.gender ?? userData?.gender ?? 'male',
        goal: healthInfo?.goal ?? 'weightLoss',
        experience: healthInfo?.experience ?? 'beginner',
        fitnessLevel: healthInfo?.fitnessLevel ?? 'low',
        preferredTime: healthInfo?.preferredTime ?? 'morning',
        weeklySessions: healthInfo?.weeklySessions ?? '1-2',
        medicalHistory: healthInfo?.medicalHistory ?? '',
        allergies: healthInfo?.allergies ?? ''
      };
      setEditedHealth({ ...initialHealth, [field]: value });
    } else {
      setEditedHealth({ ...editedHealth, [field]: value });
    }
  };

  const handleHealthSave = async () => {
    if (!editedHealth || !userData) return;

    try {
      if (healthInfo) {
        // Update existing health info
        await updateHealthInfoMutation.mutateAsync({
          healthInfoId: healthInfo._id!,
          data: editedHealth
        });
        toast.success('Cập nhật thông tin sức khỏe thành công!');
      } else {
        // Create new health info
        await createHealthInfoMutation.mutateAsync({
          memberId: userData._id,
          data: editedHealth
        });
        toast.success('Tạo thông tin sức khỏe thành công!');
      }
      setIsEditingHealth(false);
      setEditedHealth(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin sức khỏe');
      console.error('Health info save error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Loading state
  if (userLoading || healthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  // Error state - only show error for non-404 errors
  if (userError || (healthError && healthError?.response?.status !== 404)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải thông tin</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Thông Tin Cá Nhân</h1>

      {/* Profile + Summary Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 items-start">
          {/* Left: Avatar + basic info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-blue-900">{userData?.fullName || user?.fullName}</h2>
              <p className="text-gray-600">
                {userData?.memberInfo?.membership_level === 'vip' ? 'Hội viên VIP' : 'Hội viên Basic'} - Chi nhánh Gò Vấp
              </p>
              <Badge className={`mt-1 ${userData?.status === 'active'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                }`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                {userData?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>
          </div>

          {/* Right: Summary */}
          {healthInfo && (
            <div className="bg-gray-50 p-3 rounded-xl md:ml-[-175px]">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Thông Tin Tóm Tắt</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">BMI</span>
                  <span className="text-gray-700 text-sm truncate">{bmiValue ? `${bmiValue} (Bình thường)` : 'Chưa cập nhật'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">Mục tiêu</span>
                  <span className="text-gray-700 text-sm truncate">{healthInfo?.goal === 'WeightLoss' ? 'Giảm cân' : healthInfo?.goal === 'MuscleGain' ? 'Tăng cơ' : 'Sức khỏe'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">Trình độ</span>
                  <span className="text-gray-700 text-sm truncate">{healthInfo?.experience === 'Beginner' ? 'Người mới' : healthInfo?.experience === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">Thể lực</span>
                  <span className="text-gray-700 text-sm truncate">{healthInfo?.fitnessLevel === 'low' ? 'Thấp' : healthInfo?.fitnessLevel === 'medium' ? 'Trung bình' : 'Cao'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 flex">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${activeTab === 'health'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
            }`}
        >
          Thông tin sức khỏe
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${activeTab === 'personal'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
            }`}
        >
          Thông tin cá nhân
        </button>
      </div>

      {/* Personal Information (tab) */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 border-l-4 border-blue-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-900">Thông Tin Cá Nhân</h3>
            {!isEditing ? (
              <Button onClick={handleEdit} size="sm" variant="outline">
                <Edit3 />
                <span>Chỉnh sửa</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save />
                  )}
                  <span>Lưu</span>
                </Button>
                <Button onClick={handleCancel} size="sm" variant="ghost">
                  <X />
                  <span>Hủy</span>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editedUser?.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{userData?.fullName || user?.fullName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedUser?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{userData?.email || user?.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userData?.phone || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>
                  {userData?.gender === 'male' ? 'Nam' :
                    userData?.gender === 'female' ? 'Nữ' :
                      userData?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cccd">CCCD/CMND</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span>{userData?.cccd || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Ngày tham gia</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{userData?.createdAt ? formatDate(userData.createdAt) : 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>QR Code</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-sm">
                    {userData?.memberInfo?.qr_code ?
                      `${userData.memberInfo.qr_code.substring(0, 20)}...${userData.memberInfo.qr_code.substring(userData.memberInfo.qr_code.length - 10)}` :
                      'Chưa có QR code'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Information (tab) */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-blue-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-900">Thông Tin Sức Khỏe</h3>
            {!isEditingHealth ? (
              <Button onClick={handleHealthEdit} size="sm" variant="outline">
                <Edit3 />
                <span>{healthInfo ? 'Chỉnh sửa' : 'Tạo mới'}</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleHealthSave}
                  size="sm"
                  disabled={updateHealthInfoMutation.isPending || createHealthInfoMutation.isPending}
                >
                  {(updateHealthInfoMutation.isPending || createHealthInfoMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save />
                  )}
                  <span>Lưu</span>
                </Button>
                <Button onClick={handleHealthCancel} size="sm" variant="ghost">
                  <X />
                  <span>Hủy</span>
                </Button>
              </div>
            )}
          </div>

          {!healthInfo && !isEditingHealth && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-medium">Chưa có thông tin sức khỏe</p>
                  <p className="text-blue-600 text-sm">Hãy tạo thông tin sức khỏe để được tư vấn tốt nhất</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Chiều cao (cm)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.height : healthInfo?.height) ?? ''}
                onChange={(e) => handleHealthChange('height', Number(e.target.value))}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2">
              <Label>Cân nặng (kg)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.weight : healthInfo?.weight) ?? ''}
                onChange={(e) => handleHealthChange('weight', Number(e.target.value))}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2">
              <Label>Giới tính</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.gender : healthInfo?.gender) as string}
                onChange={(e) => handleHealthChange('gender', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Mục tiêu tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.goal : healthInfo?.goal) as string}
                onChange={(e) => handleHealthChange('goal', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="weightLoss">Giảm cân</option>
                <option value="muscleGain">Tăng cơ</option>
                <option value="health">Sức khỏe</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Trình độ tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.experience : healthInfo?.experience) as string}
                onChange={(e) => handleHealthChange('experience', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="beginner">Người mới</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Mức độ thể lực</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.fitnessLevel : healthInfo?.fitnessLevel) as string}
                onChange={(e) => handleHealthChange('fitnessLevel', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Thời gian tập ưa thích</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.preferredTime : healthInfo?.preferredTime) as string}
                onChange={(e) => handleHealthChange('preferredTime', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="morning">Sáng</option>
                <option value="afternoon">Chiều</option>
                <option value="evening">Tối</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Số buổi tập/tuần</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.weeklySessions : healthInfo?.weeklySessions) as string}
                onChange={(e) => handleHealthChange('weeklySessions', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="1-2">1-2 buổi</option>
                <option value="3-4">3-4 buổi</option>
                <option value="5+">5+ buổi</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Tiền sử bệnh lý</Label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                rows={3}
                value={(isEditingHealth ? editedHealth?.medicalHistory : healthInfo?.medicalHistory) ?? ''}
                onChange={(e) => handleHealthChange('medicalHistory', e.target.value)}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dị ứng</Label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                rows={3}
                value={(isEditingHealth ? editedHealth?.allergies : healthInfo?.allergies) ?? ''}
                onChange={(e) => handleHealthChange('allergies', e.target.value)}
                readOnly={!isEditingHealth}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}