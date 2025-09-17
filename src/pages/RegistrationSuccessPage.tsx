import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Dumbbell, QrCode, Calendar, MapPin, CreditCard, Download } from 'lucide-react';

export function RegistrationSuccessPage() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user just completed registration
    const registrationSuccess = localStorage.getItem('registration_success');
    const userData = localStorage.getItem('user');
    
    if (!registrationSuccess || !userData) {
      navigate('/register');
      return;
    }

    setUser(JSON.parse(userData));
    
    // Clean up
    localStorage.removeItem('registration_success');
  }, [navigate]);

  const handleDownloadQR = () => {
    // In a real app, this would generate and download the actual QR code
    alert('Tính năng tải QR code sẽ được triển khai trong phiên bản thực tế');
  };

  const handleGoToDashboard = () => {
    navigate('/member/dashboard');
  };

  if (!user) {
    return (
      <div className="tw-min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="tw-text-center">
          <div className="tw-animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="tw-mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="tw-max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="tw-text-center mb-8">
          <div className="tw-flex items-center justify-center mb-4">
            <Dumbbell className="tw-h-12 w-12 text-green-600" />
            <span className="tw-ml-2 text-2xl font-bold text-gray-900">StagPower</span>
          </div>
          <div className="tw-flex items-center justify-center mb-4">
            <CheckCircle className="tw-h-16 w-16 text-green-500" />
          </div>
          <h1 className="tw-text-3xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h1>
          <p className="tw-text-gray-600 text-lg">
            Chào mừng <strong>{user.full_name}</strong> đến với StagPower Gym
          </p>
        </div>

        {/* Success Cards */}
        <div className="tw-grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle className="tw-flex items-center">
                <Dumbbell className="tw-h-5 w-5 mr-2 text-blue-600" />
                Thông tin thành viên
              </CardTitle>
            </CardHeader>
            <CardContent className="tw-space-y-3">
              <div className="tw-flex justify-between">
                <span className="tw-text-gray-600">Họ tên:</span>
                <span className="tw-font-medium">{user.full_name}</span>
              </div>
              <div className="tw-flex justify-between">
                <span className="tw-text-gray-600">Email:</span>
                <span className="tw-font-medium">{user.email}</span>
              </div>
              <div className="tw-flex justify-between">
                <span className="tw-text-gray-600">Số điện thoại:</span>
                <span className="tw-font-medium">{user.phone}</span>
              </div>
              <div className="tw-flex justify-between">
                <span className="tw-text-gray-600">Trạng thái:</span>
                <Badge variant="success">Hoạt động</Badge>
              </div>
              <div className="tw-flex justify-between">
                <span className="tw-text-gray-600">Ngày tham gia:</span>
                <span className="tw-font-medium">
                  {new Date(user.join_date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="tw-flex items-center">
                <QrCode className="tw-h-5 w-5 mr-2 text-green-600" />
                Mã QR Check-in
              </CardTitle>
              <CardDescription>
                Sử dụng mã QR này để check-in tại phòng gym
              </CardDescription>
            </CardHeader>
            <CardContent className="tw-text-center">
              <div className="tw-bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <div className="tw-w-32 h-32 mx-auto bg-gray-100 rounded flex items-center justify-center">
                  <QrCode className="tw-h-16 w-16 text-gray-400" />
                </div>
                <p className="tw-text-sm text-gray-500 mt-2">QR Code: {user.member_info?.qr_code}</p>
              </div>
              <Button onClick={handleDownloadQR} variant="outline" size="sm">
                <Download className="tw-h-4 w-4 mr-2" />
                Tải QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="tw-mb-8">
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
            <CardDescription>
              Dưới đây là những việc bạn cần làm sau khi đăng ký thành công
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="tw-grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="tw-text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="tw-h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="tw-font-semibold text-blue-900">Đặt lịch tập</h3>
                <p className="tw-text-sm text-blue-700 mt-1">
                  Đặt lịch tập PT hoặc sử dụng phòng gym
                </p>
              </div>
              
              <div className="tw-text-center p-4 bg-green-50 rounded-lg">
                <MapPin className="tw-h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="tw-font-semibold text-green-900">Đến chi nhánh</h3>
                <p className="tw-text-sm text-green-700 mt-1">
                  Mang theo QR code để check-in tại phòng gym
                </p>
              </div>
              
              <div className="tw-text-center p-4 bg-purple-50 rounded-lg">
                <CreditCard className="tw-h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="tw-font-semibold text-purple-900">Thanh toán</h3>
                <p className="tw-text-sm text-purple-700 mt-1">
                  Hoàn tất thanh toán gói tập đã chọn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="tw-mb-8">
          <CardHeader>
            <CardTitle>Thông tin quan trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="tw-space-y-3 text-sm">
              <div className="tw-flex items-start">
                <CheckCircle className="tw-h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>QR Code:</strong> Vui lòng lưu trữ QR code an toàn và mang theo mỗi khi đến phòng gym
                </span>
              </div>
              <div className="tw-flex items-start">
                <CheckCircle className="tw-h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Giờ hoạt động:</strong> Phòng gym mở cửa từ 6:00 - 22:00 hàng ngày
                </span>
              </div>
              <div className="tw-flex items-start">
                <CheckCircle className="tw-h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Hỗ trợ:</strong> Liên hệ hotline 1900-xxxx nếu cần hỗ trợ
                </span>
              </div>
              <div className="tw-flex items-start">
                <CheckCircle className="tw-h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  <strong>Ứng dụng:</strong> Tải ứng dụng StagPower để quản lý tài khoản dễ dàng hơn
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="tw-flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoToDashboard} size="lg">
            Vào Dashboard
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">
              Đăng nhập
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="tw-text-center mt-8 text-sm text-gray-500">
          <p>© 2024 StagPower Gym Management System</p>
          <p>Cảm ơn bạn đã tin tưởng và lựa chọn StagPower!</p>
        </div>
      </div>
    </div>
  );
}
