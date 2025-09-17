import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockUsers } from '../mockdata';
import { Dumbbell, Eye, EyeOff, User, Lock } from 'lucide-react';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = mockUsers.find(u => 
        u.email === formData.email && 
        u.password === formData.password // In real app, this would be hashed
      );

      if (user) {
        // Simulate successful login
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        }));
        
        // Redirect based on role
        switch (user.role) {
          case 'Admin':
            navigate('/admin/dashboard');
            break;
          case 'Staff':
            navigate('/staff/dashboard');
            break;
          case 'Trainer':
            navigate('/trainer/dashboard');
            break;
          case 'Member':
            navigate('/member/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { role: 'Admin', email: 'admin@stagpower.com', password: 'admin123', name: 'Nguyễn Văn Admin' },
    { role: 'Staff', email: 'dangvangiang@gmail.com', password: 'staff123', name: 'Đặng Văn Giang' },
    { role: 'Trainer', email: 'hoangvanem@gmail.com', password: 'trainer123', name: 'Hoàng Văn Em' },
    { role: 'Member', email: 'nguyenvanan@gmail.com', password: 'member123', name: 'Nguyễn Văn An' }
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setFormData({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="tw-tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-100 tw-flex tw-items-center tw-justify-center tw-p-4">
      <div className="tw-tw-w-full tw-max-w-md">
        {/* Logo and Title */}
        <div className="tw-tw-text-center tw-mb-8">
          <div className="tw-tw-flex tw-items-center tw-justify-center tw-mb-4">
            <Dumbbell className="tw-tw-h-12 tw-w-12 tw-text-blue-600" />
            <span className="tw-tw-ml-2 tw-text-2xl tw-font-bold tw-text-gray-900">StagPower</span>
          </div>
          <h1 className="tw-tw-text-2xl tw-font-bold tw-text-gray-900">Đăng nhập</h1>
          <p className="tw-tw-text-gray-600 tw-mt-2">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập tài khoản</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="tw-space-y-4">
              {/* Email Input */}
              <div className="tw-tw-space-y-2">
                <Label htmlFor="email">Email hoặc số điện thoại</Label>
                <div className="tw-tw-relative">
                  <User className="tw-tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="tw-pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="tw-tw-space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="tw-tw-relative">
                  <Lock className="tw-tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="tw-pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="tw-tw-absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="tw-text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="tw-tw-w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="tw-mt-6 pt-6 border-t">
              <h3 className="tw-text-sm font-medium text-gray-700 mb-3">Tài khoản demo:</h3>
              <div className="tw-tw-space-y-2">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="tw-tw-flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <Badge variant={account.role === 'Admin' ? 'default' : 'secondary'}>
                        {account.role}
                      </Badge>
                      <span className="tw-ml-2 text-sm text-gray-600">{account.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoAccount(account)}
                    >
                      Sử dụng
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="tw-mt-6 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="tw-text-sm text-blue-600 hover:text-blue-800"
              >
                Quên mật khẩu?
              </Link>
              <div className="tw-text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="tw-text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="tw-tw-text-center mt-8 text-sm text-gray-500">
          <p>© 2024 StagPower Gym Management System</p>
          <p>Hệ thống quản lý phòng gym hiện đại</p>
        </div>
      </div>
    </div>
  );
}
