import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { mockUsers } from '../../../mockdata/index';
import { Eye, EyeOff } from 'lucide-react';
import LogoDumbbell from '../../../assets/Logo_dumbbell.png';
import LogoStagPower4x from '../../../assets/Logo_StagPower_4x.png';
import { useAuth } from '../../../contexts/AuthContext';

type AuthMode = 'login' | 'register';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set auth mode based on current route
  useEffect(() => {
    if (location.pathname === '/register') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const dashboardPath = user.role === 'Admin' ? '/admin' :
                           user.role === 'Staff' ? '/staff' :
                           user.role === 'Trainer' ? '/trainer' :
                           '/member';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateRegisterForm = (): boolean => {
    if (!registerData.full_name || !registerData.email || !registerData.phone || !registerData.password || !registerData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (registerData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = mockUsers.find(u => 
        u.email === loginData.email && 
        u.password === loginData.password
      );

      if (user) {
        const success = await login(loginData.email, loginData.password);
        
        if (success) {
          // Redirect based on user role
          switch (user.role) {
            case 'Admin':
              navigate('/admin');
              break;
            case 'Staff':
              navigate('/staff');
              break;
            case 'Trainer':
              navigate('/trainer');
              break;
            case 'Member':
              navigate('/member');
              break;
            default:
              navigate('/member');
          }
        } else {
          setError('Email hoặc mật khẩu không đúng');
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use AuthContext register function
      const success = await register(registerData);
      
      if (success) {
        // Navigate to success page
        navigate('/registration-success');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Ví dụ: example@gmail.com"
          value={loginData.email}
          onChange={handleLoginInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </Label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Quên?
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu . . ."
            value={loginData.password}
            onChange={handleLoginInputChange}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
      </Button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
            Họ Tên <span className="text-red-500">*</span>
          </Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Nhập họ và tên đầy đủ"
          value={registerData.full_name}
          onChange={handleRegisterInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="register_email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
        <Input
          id="register_email"
          name="email"
          type="email"
          placeholder="Ví dụ: example@gmail.com"
          value={registerData.email}
          onChange={handleRegisterInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Số Điện Thoại <span className="text-red-500">*</span>
          </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ví dụ: 0123456789"
          value={registerData.phone}
          onChange={handleRegisterInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="register_password" className="text-sm font-medium text-gray-700">
            Mật Khẩu <span className="text-red-500">*</span>
          </Label>
        <div className="relative">
          <Input
            id="register_password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu . . ."
            value={registerData.password}
            onChange={handleRegisterInputChange}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
          </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu . . ."
            value={registerData.confirmPassword}
            onChange={handleRegisterInputChange}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Register Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 flex-col items-center justify-center p-8 min-h-screen">
        {/* Top Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={LogoDumbbell} alt="Dumbbell Logo" className="w-72 h-24" />
          </div>
          <h1 className="text-blue-500 text-2xl font-bold uppercase tracking-wider text-center">
            STAG POWER
          </h1>
        </div>

        {/* Main Logo */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 flex items-center justify-center mb-4">
            <img src={LogoStagPower4x} alt="StagPower Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 relative min-h-screen">
        {/* Small Logo at top */}
        <div className="absolute top-8 left-8">
          <img src={LogoStagPower4x} alt="StagPower" className="w-24 h-24" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => navigate('/register')}
            className={`pb-2 font-medium transition-colors ${
              authMode === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Đăng Ký
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`pb-2 font-medium transition-colors ${
              authMode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Đăng Nhập
          </button>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md">
          {authMode === 'login' ? renderLoginForm() : renderRegisterForm()}

          {/* Switch Mode Link */}
          <div className="mt-6 text-center">
            {authMode === 'login' ? (
              <>
                <span className="text-gray-600">Bạn Chưa Có Tài Khoản? </span>
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đăng Ký
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-600">Bạn Đã Có Tài Khoản? </span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đăng Nhập
                </button>
              </>
            )}
          </div>

          {/* Home Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Trang Chủ
            </button>
          </div>

          {/* Debug Button */}
          <div className="mt-2 text-center">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
