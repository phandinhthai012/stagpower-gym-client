import React, { useMemo, useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { mockHealthInfo, getMockDataByMemberId } from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<{fullName: string, email: string} | null>(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [editedHealth, setEditedHealth] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'health' | 'personal'>('health');

  // Get health info for current user
  const healthInfo = getMockDataByMemberId('healthInfo', user?.id || '')[0];
  
  const initEditedHealth = () => {
    if (!healthInfo) return null;
    return {
      height: healthInfo.height ?? '',
      weight: healthInfo.weight ?? '',
      goal: healthInfo.goal ?? 'WeightLoss',
      experience: healthInfo.experience ?? 'Beginner',
      fitness_level: healthInfo.fitness_level ?? 'Low',
      preferred_time: healthInfo.preferred_time ?? 'Morning',
      weekly_sessions: healthInfo.weekly_sessions ?? '1-2',
      medical_history: healthInfo.medical_history ?? '',
      allergies: healthInfo.allergies ?? ''
    };
  };

  const bmiValue = useMemo(() => {
    if (!healthInfo?.height || !healthInfo?.weight) return null;
    const h = healthInfo.height / 100;
    return (healthInfo.weight / (h * h)).toFixed(1);
  }, [healthInfo]);

  const handleInputChange = (field: string, value: string) => {
    if (!editedUser) return;
    
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user
    console.log('Saving user data:', editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (user) {
      setEditedUser({
        fullName: user.fullName,
        email: user.email
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
    if (!editedHealth) return;
    setEditedHealth({ ...editedHealth, [field]: value });
  };

  const handleHealthSave = () => {
    // TODO: Integrate API; for now log edited data
    console.log('Saving health info:', editedHealth);
    setIsEditingHealth(false);
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
              <h2 className="text-xl font-bold text-blue-900">{user?.fullName}</h2>
              <p className="text-gray-600">Hội viên VIP - Chi nhánh Gò Vấp</p>
              <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle className="w-4 h-4 mr-1" />
                Đang hoạt động
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
                  <span className="text-gray-700 text-sm truncate">{healthInfo.goal === 'WeightLoss' ? 'Giảm cân' : healthInfo.goal === 'MuscleGain' ? 'Tăng cơ' : 'Sức khỏe'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">Trình độ</span>
                  <span className="text-gray-700 text-sm truncate">{healthInfo.experience === 'Beginner' ? 'Người mới' : healthInfo.experience === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-sm font-semibold">Thể lực</span>
                  <span className="text-gray-700 text-sm truncate">{healthInfo.fitness_level === 'Low' ? 'Thấp' : healthInfo.fitness_level === 'Medium' ? 'Trung bình' : 'Cao'}</span>
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
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${
            activeTab === 'health'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
          }`}
        >
          Thông tin sức khỏe
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${
            activeTab === 'personal'
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
              <Button onClick={handleSave} size="sm">
                <Save />
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
                <span>{user?.fullName}</span>
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
                <span>{user?.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>Chưa cập nhật</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Chưa cập nhật</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-500" />
              <span>Chưa cập nhật</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cccd">CCCD/CMND</Label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span>Chưa cập nhật</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Ngày tham gia</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Chưa cập nhật</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>QR Code</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-sm">
                  Chưa có QR code
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Health Information (tab) */}
      {activeTab === 'health' && healthInfo && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-blue-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-900">Thông Tin Sức Khỏe</h3>
            {!isEditingHealth ? (
              <Button onClick={handleHealthEdit} size="sm" variant="outline">
                <Edit3 />
                <span>Chỉnh sửa</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleHealthSave} size="sm">
                  <Save />
                  <span>Lưu</span>
                </Button>
                <Button onClick={handleHealthCancel} size="sm" variant="ghost">
                  <X />
                  <span>Hủy</span>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Chiều cao (cm)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.height : healthInfo.height) ?? ''}
                onChange={(e) => handleHealthChange('height', Number(e.target.value))}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2">
              <Label>Cân nặng (kg)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.weight : healthInfo.weight) ?? ''}
                onChange={(e) => handleHealthChange('weight', Number(e.target.value))}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2">
              <Label>Mục tiêu tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.goal : healthInfo.goal) as string}
                onChange={(e) => handleHealthChange('goal', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="WeightLoss">Giảm cân</option>
                <option value="MuscleGain">Tăng cơ</option>
                <option value="Health">Sức khỏe</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Trình độ tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.experience : healthInfo.experience) as string}
                onChange={(e) => handleHealthChange('experience', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="Beginner">Người mới</option>
                <option value="Intermediate">Trung bình</option>
                <option value="Advanced">Nâng cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Mức độ thể lực</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.fitness_level : healthInfo.fitness_level) as string}
                onChange={(e) => handleHealthChange('fitness_level', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="Low">Thấp</option>
                <option value="Medium">Trung bình</option>
                <option value="High">Cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Thời gian tập ưa thích</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.preferred_time : healthInfo.preferred_time) as string}
                onChange={(e) => handleHealthChange('preferred_time', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="Morning">Sáng</option>
                <option value="Afternoon">Chiều</option>
                <option value="Evening">Tối</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Số buổi tập/tuần</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                value={(isEditingHealth ? editedHealth?.weekly_sessions : healthInfo.weekly_sessions) as string}
                onChange={(e) => handleHealthChange('weekly_sessions', e.target.value)}
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
                value={(isEditingHealth ? editedHealth?.medical_history : healthInfo.medical_history) ?? ''}
                onChange={(e) => handleHealthChange('medical_history', e.target.value)}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dị ứng</Label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                rows={3}
                value={(isEditingHealth ? editedHealth?.allergies : healthInfo.allergies) ?? ''}
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