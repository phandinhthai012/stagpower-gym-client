import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import LogoStagPower4x from '../../../assets/Logo_StagPower_4x.png';
import authService from '../services/auth.service';
import { useToast } from '../../../hooks/useToast';

type Step = 'email' | 'otp' | 'reset';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success('OTP đã được gửi đến email của bạn');
        setStep('otp');
      } else {
        setError(response.message || 'Không tìm thấy email trong hệ thống');
        toast.error(response.message || 'Gửi OTP thất bại');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        toast.success('Xác thực OTP thành công');
        setStep('reset');
      } else {
        setError(response.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
        toast.error(response.message || 'Xác thực OTP thất bại');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.resendOtp(email);
      if (response.success) {
        toast.success('OTP mới đã được gửi đến email của bạn');
      } else {
        setError(response.message || 'Gửi lại OTP thất bại');
        toast.error(response.message || 'Gửi lại OTP thất bại');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      if (response.success) {
        toast.success('Đặt lại mật khẩu thành công');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Đặt lại mật khẩu thất bại');
        toast.error(response.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render email step
  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên Mật Khẩu</h2>
        <p className="text-gray-600">Nhập email của bạn để nhận mã OTP</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Ví dụ: example@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Đang gửi...' : 'Gửi Mã OTP'}
      </Button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại đăng nhập
      </button>
    </form>
  );

  // Render OTP step
  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nhập Mã OTP</h2>
        <p className="text-gray-600">
          Chúng tôi đã gửi mã OTP đến <span className="font-semibold">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
          Mã OTP <span className="text-red-500">*</span>
        </Label>
        <Input
          id="otp"
          name="otp"
          type="text"
          placeholder="Nhập mã 6 chữ số"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtp(value);
            setError('');
          }}
          className="w-full p-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          maxLength={6}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResendOtp}
          className="flex-1 border-gray-300"
          disabled={isLoading}
        >
          Gửi lại OTP
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xác thực...' : 'Xác Thực'}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => {
          setStep('email');
          setOtp('');
          setError('');
        }}
        className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </button>
    </form>
  );

  // Render reset password step
  const renderResetStep = () => (
    <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt Lại Mật Khẩu</h2>
        <p className="text-gray-600">Nhập mật khẩu mới của bạn</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
          Mật Khẩu Mới <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={6}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={6}
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

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
      </Button>

      <button
        type="button"
        onClick={() => {
          setStep('otp');
          setNewPassword('');
          setConfirmPassword('');
          setError('');
        }}
        className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 flex-col items-center justify-center p-8 min-h-screen">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={LogoStagPower4x} alt="StagPower Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-blue-500 text-2xl font-bold uppercase tracking-wider text-center">
            STAG POWER
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 flex items-center justify-center mb-4">
            <Lock className="w-32 h-32 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 relative min-h-screen">
        {/* Small Logo at top */}
        <div className="absolute top-8 left-8">
          <img src={LogoStagPower4x} alt="StagPower" className="w-24 h-24" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'reset' && renderResetStep()}
        </div>
      </div>
    </div>
  );
}

