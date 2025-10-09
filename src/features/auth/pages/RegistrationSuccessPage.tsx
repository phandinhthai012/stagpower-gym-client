import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle, Dumbbell, QrCode, Calendar, MapPin, CreditCard, Download } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export function RegistrationSuccessPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('stagpower_user_register');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // If no user data, redirect to register
      navigate('/register');
    }
  }, [navigate]);

  const handleDownloadQR = () => {
    // In a real app, this would generate and download the actual QR code
    alert('Tính năng tải QR code sẽ được triển khai trong phiên bản thực tế');
  };

  const handleGoToDashboard = () => {
    // navigate('/member');
    alert('Tính năng này sẽ được triển khai trong phiên bản thực tế');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-12 w-12 text-green-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">StagPower</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h1>
          <p className="text-gray-600 text-lg">
            Chào mừng <strong>{user.fullName}</strong> đến với StagPower Gym
          </p>
        </div>

        {/* Success Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin thành viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giới tính:</span>
                <span className="font-medium">
                  {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày sinh:</span>
                <span className="font-medium">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="success">Hoạt động</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tham gia:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-green-600" />
                Mã QR Check-in
              </CardTitle>
              <CardDescription>
                Sử dụng mã QR này để check-in tại phòng gym
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-2">QR Code: {user.member_info?.qr_code}</p>
              </div>
              <Button onClick={handleDownloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Tải QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
            <CardDescription>
              Dưới đây là những việc bạn cần làm sau khi đăng ký thành công
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Đặt lịch tập</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Đặt lịch tập PT hoặc sử dụng phòng gym
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Đến chi nhánh</h3>
                <p className="text-sm text-green-700 mt-1">
                  Mang theo QR code để check-in tại phòng gym
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Thanh toán</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Hoàn tất thanh toán gói tập đã chọn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Thông tin quan trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>QR Code:</strong> Vui lòng lưu trữ QR code an toàn và mang theo mỗi khi đến phòng gym
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Giờ hoạt động:</strong> Phòng gym mở cửa từ 6:00 - 22:00 hàng ngày
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Hỗ trợ:</strong> Liên hệ hotline 1900-xxxx nếu cần hỗ trợ
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Ứng dụng:</strong> Tải ứng dụng StagPower để quản lý tài khoản dễ dàng hơn
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <Button onClick={handleGoToDashboard} size="lg">
            Vào Dashboard
          </Button> */}
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => {
              localStorage.removeItem('stagpower_user_register');
              navigate('/login');
            }}
          >
            Đăng nhập
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 StagPower Gym Management System</p>
          <p>Cảm ơn bạn đã tin tưởng và lựa chọn StagPower!</p>
        </div>
      </div>
    </div>
  );
}
