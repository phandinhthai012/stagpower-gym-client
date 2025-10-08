import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save, Key } from 'lucide-react';

export function AdminAccountSettings() {
  const { user } = useAuth();
  console.log('user', user);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    address: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // TODO: Implement save profile logic
    console.log('Saving profile:', formData);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    // TODO: Implement change password logic
    console.log('Changing password');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Tài Khoản</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Thông Tin Cá Nhân</h2>
              <p className="text-sm text-gray-600">Cập nhật thông tin profile của bạn</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa Chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Lưu Thông Tin
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bảo Mật</h2>
              <p className="text-sm text-gray-600">Thay đổi mật khẩu tài khoản</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>

            <Button onClick={handleChangePassword} variant="destructive" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Đổi Mật Khẩu
            </Button>
          </div>
        </Card>
      </div>

      {/* System Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tùy Chỉnh Hệ Thống</h2>
            <p className="text-sm text-gray-600">Cài đặt hiển thị và thông báo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Ngôn Ngữ</h3>
            <p className="text-sm text-gray-600">Tiếng Việt</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Múi Giờ</h3>
            <p className="text-sm text-gray-600">UTC+7 (Việt Nam)</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Thông Báo</h3>
            <p className="text-sm text-gray-600">Đã bật</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
