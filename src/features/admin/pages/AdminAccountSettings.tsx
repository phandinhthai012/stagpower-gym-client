import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useAuth } from '../../../contexts/AuthContext';
import { useUpdateUser, useMe } from '../../member/api/user.queries';
import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Save, Key } from 'lucide-react';

export function AdminAccountSettings() {
  const { user } = useAuth();
  const { data: meData, refetch: refetchMe } = useMe();
  const updateProfileMutation = useUpdateUser();
  
  // ✅ GOOD: Memoize initial form data để tránh tạo lại object
  const initialFormData = useMemo(() => ({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    address: (user as any)?.address || '',
  }), [user]); // Chỉ tính toán lại khi user thay đổi
  
  const [formData, setFormData] = useState(initialFormData);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Update form data when user data changes
  useEffect(() => {
    if (meData) {
      setFormData(prev => ({
        ...prev,
        fullName: meData.fullName || prev.fullName,
        email: meData.email || prev.email,
        phone: meData.phone || prev.phone,
        gender: meData.gender || prev.gender,
        dateOfBirth: meData.dateOfBirth || prev.dateOfBirth,
        address: (meData as any)?.address || prev.address,
      }));
      // Update localStorage with fresh user data
      if (meData) {
        localStorage.setItem('stagpower_user', JSON.stringify(meData));
      }
    }
  }, [meData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!isFormValid) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Get user ID from meData or user
    const userId = meData?._id || user?._id;
    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      };
      
      if (formData.gender) {
        updateData.gender = formData.gender;
      }
      if (formData.dateOfBirth) {
        updateData.dateOfBirth = formData.dateOfBirth;
      }
      if (formData.address) {
        updateData.address = formData.address;
      }

      // Use userId to call the correct endpoint
      await updateProfileMutation.mutateAsync({ userId, data: updateData });
      await refetchMe();
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    
    if (!formData.newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      toast.success('Đổi mật khẩu thành công!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ✅ GOOD: Memoize validation rules để tránh tạo lại object
  const validationRules = useMemo(() => ({
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10,11}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  }), []); // Empty dependency array vì rules không thay đổi

  // ✅ GOOD: Memoize computed values
  const isFormValid = useMemo(() => {
    return formData.fullName.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.phone.trim() !== '';
  }, [formData.fullName, formData.email, formData.phone]);

  // ✅ GOOD: Memoize expensive calculations
  const formStats = useMemo(() => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    const completionPercentage = (filledFields / totalFields) * 100;
    
    return {
      filledFields,
      totalFields,
      completionPercentage: Math.round(completionPercentage)
    };
  }, [formData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Tài Khoản</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>
        {/* Demo useMemo: Form completion stats */}
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Hoàn thành: {formStats.completionPercentage}%
          </div>
          <div className="text-xs text-gray-500">
            {formStats.filledFields}/{formStats.totalFields} trường
          </div>
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

            <Button 
              onClick={handleSaveProfile} 
              className="w-full"
              disabled={!isFormValid || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Thông Tin
                </>
              )}
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

            <Button 
              onClick={handleChangePassword} 
              variant="destructive" 
              className="w-full"
              disabled={isChangingPassword || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang đổi...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Đổi Mật Khẩu
                </>
              )}
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
