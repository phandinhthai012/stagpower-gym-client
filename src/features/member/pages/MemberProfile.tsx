import React, { useState } from 'react';
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
  Target
} from 'lucide-react';
import { mockHealthInfo, getMockDataByMemberId } from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<{fullName: string, email: string} | null>(null);

  // Get health info for current user
  const healthInfo = getMockDataByMemberId('healthInfo', user?.id || '')[0];

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

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex items-center gap-5 mb-8 pb-5 border-b border-gray-200">
          <div className="relative">
            <div className="w-25 h-25 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
            <p className="text-gray-600">Hội viên VIP - Chi nhánh Gò Vấp</p>
            <Badge variant="default" className="mt-2">
              Đang hoạt động
            </Badge>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Thông Tin Cá Nhân</h3>
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Hủy
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

      {/* Health Information */}
      {healthInfo && (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông Tin Sức Khỏe</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Chiều cao (cm)</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>{healthInfo.height || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cân nặng (kg)</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>{healthInfo.weight || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mục tiêu tập luyện</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Target className="h-4 w-4 text-gray-500" />
                <span>{healthInfo.fitness_goal || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tình trạng sức khỏe</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Heart className="h-4 w-4 text-gray-500" />
                <span>{healthInfo.medical_conditions || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-gray-50 p-5 rounded-xl mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Tóm Tắt</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">BMI</h4>
                <p className="text-gray-600">
                  {healthInfo.height && healthInfo.weight 
                    ? `${calculateBMI(healthInfo.weight, healthInfo.height)} (Bình thường)`
                    : 'Chưa cập nhật'
                  }
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Mục tiêu</h4>
                <p className="text-gray-600">{healthInfo.fitness_goal || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}