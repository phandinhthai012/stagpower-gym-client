import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockPackages, mockBranches } from '../mockdata';
import { Dumbbell, Eye, EyeOff, User, Lock, Mail, Phone, Calendar, MapPin, CreditCard } from 'lucide-react';

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    date_of_birth: '',
    cccd: '',
    
    // Health Information
    height: '',
    weight: '',
    medical_history: '',
    allergies: '',
    goal: '',
    experience: '',
    fitness_level: '',
    preferred_time: '',
    weekly_sessions: '',
    
    // Package Selection
    package_id: '',
    branch_id: '',
    is_hssv: false,
    
    // Payment
    payment_method: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Mật khẩu phải có ít nhất 6 ký tự');
          return false;
        }
        break;
      case 2:
        if (!formData.height || !formData.weight || !formData.goal) {
          setError('Vui lòng điền đầy đủ thông tin sức khỏe');
          return false;
        }
        break;
      case 3:
        if (!formData.package_id || !formData.branch_id) {
          setError('Vui lòng chọn gói tập và chi nhánh');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock user data
      const newUser = {
        id: `user_${Date.now()}`,
        role: 'Member' as const,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        date_of_birth: formData.date_of_birth,
        cccd: formData.cccd,
        join_date: new Date().toISOString(),
        status: 'Active' as const,
        member_info: {
          membership_level: 'Basic' as const,
          qr_code: `QR_${Date.now()}`,
          is_hssv: formData.is_hssv,
          total_spending: 0,
          membership_month: 0,
          current_branch_id: formData.branch_id
        }
      };

      // Simulate successful registration
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('registration_success', 'true');
      
      navigate('/registration-success');
    } catch (err) {
      setError('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPackage = mockPackages.find(p => p.id === formData.package_id);
  const selectedBranch = mockBranches.find(b => b.id === formData.branch_id);

  const renderStep1 = () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg font-semibold">Thông tin cá nhân</h3>
      
      <div className="tw-grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tw-space-y-2">
          <Label htmlFor="full_name">Họ và tên *</Label>
          <div className="tw-relative">
            <User className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="full_name"
              name="full_name"
              placeholder="Nhập họ và tên"
              value={formData.full_name}
              onChange={handleInputChange}
              className="tw-pl-10"
              required
            />
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="tw-relative">
            <Mail className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleInputChange}
              className="tw-pl-10"
              required
            />
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <div className="tw-relative">
            <Phone className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              className="tw-pl-10"
              required
            />
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Nam</SelectItem>
              <SelectItem value="Female">Nữ</SelectItem>
              <SelectItem value="Other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="date_of_birth">Ngày sinh</Label>
          <div className="tw-relative">
            <Calendar className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="tw-pl-10"
            />
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="cccd">Số CCCD</Label>
          <Input
            id="cccd"
            name="cccd"
            placeholder="Nhập số CCCD"
            value={formData.cccd}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="tw-grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tw-space-y-2">
          <Label htmlFor="password">Mật khẩu *</Label>
          <div className="tw-relative">
            <Lock className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
              className="tw-absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
          <div className="tw-relative">
            <Lock className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="tw-pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="tw-absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg font-semibold">Thông tin sức khỏe</h3>
      
      <div className="tw-grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tw-space-y-2">
          <Label htmlFor="height">Chiều cao (cm) *</Label>
          <Input
            id="height"
            name="height"
            type="number"
            placeholder="Nhập chiều cao"
            value={formData.height}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="weight">Cân nặng (kg) *</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            placeholder="Nhập cân nặng"
            value={formData.weight}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="goal">Mục tiêu tập luyện *</Label>
          <Select value={formData.goal} onValueChange={(value) => handleSelectChange('goal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mục tiêu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WeightLoss">Giảm cân</SelectItem>
              <SelectItem value="MuscleGain">Tăng cơ</SelectItem>
              <SelectItem value="Health">Sức khỏe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="experience">Kinh nghiệm tập luyện</Label>
          <Select value={formData.experience} onValueChange={(value) => handleSelectChange('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Mới bắt đầu</SelectItem>
              <SelectItem value="Intermediate">Trung bình</SelectItem>
              <SelectItem value="Advanced">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="fitness_level">Mức độ thể lực</Label>
          <Select value={formData.fitness_level} onValueChange={(value) => handleSelectChange('fitness_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Thấp</SelectItem>
              <SelectItem value="Medium">Trung bình</SelectItem>
              <SelectItem value="High">Cao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="preferred_time">Thời gian tập ưa thích</Label>
          <Select value={formData.preferred_time} onValueChange={(value) => handleSelectChange('preferred_time', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Sáng</SelectItem>
              <SelectItem value="Afternoon">Chiều</SelectItem>
              <SelectItem value="Evening">Tối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="tw-space-y-2">
        <Label htmlFor="medical_history">Tiền sử bệnh lý</Label>
        <textarea
          id="medical_history"
          name="medical_history"
          placeholder="Nhập tiền sử bệnh lý (nếu có)"
          value={formData.medical_history}
          onChange={handleInputChange}
          className="tw-w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="tw-space-y-2">
        <Label htmlFor="allergies">Dị ứng</Label>
        <textarea
          id="allergies"
          name="allergies"
          placeholder="Nhập thông tin dị ứng (nếu có)"
          value={formData.allergies}
          onChange={handleInputChange}
          className="tw-w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>

      <div className="tw-flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_hssv"
          name="is_hssv"
          checked={formData.is_hssv}
          onChange={handleInputChange}
          className="tw-rounded border-gray-300"
        />
        <Label htmlFor="is_hssv">Tôi là học sinh/sinh viên (được giảm giá 15%)</Label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg font-semibold">Chọn gói tập và chi nhánh</h3>
      
      <div className="tw-space-y-4">
        <div className="tw-space-y-2">
          <Label htmlFor="branch_id">Chi nhánh *</Label>
          <div className="tw-relative">
            <MapPin className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select value={formData.branch_id} onValueChange={(value) => handleSelectChange('branch_id', value)}>
              <SelectTrigger className="tw-pl-10">
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {mockBranches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} - {branch.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="package_id">Gói tập *</Label>
          <div className="tw-relative">
            <CreditCard className="tw-absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Select value={formData.package_id} onValueChange={(value) => handleSelectChange('package_id', value)}>
              <SelectTrigger className="tw-pl-10">
                <SelectValue placeholder="Chọn gói tập" />
              </SelectTrigger>
              <SelectContent>
                {mockPackages.filter(p => p.status === 'Active').map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.price.toLocaleString('vi-VN')} VNĐ
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Package Details */}
        {selectedPackage && (
          <div className="tw-p-4 bg-blue-50 rounded-lg">
            <h4 className="tw-font-semibold text-blue-900">{selectedPackage.name}</h4>
            <p className="tw-text-blue-700 text-sm mt-1">{selectedPackage.description}</p>
            <div className="tw-flex items-center justify-between mt-2">
              <span className="tw-text-lg font-bold text-blue-900">
                {selectedPackage.price.toLocaleString('vi-VN')} VNĐ
              </span>
              <Badge variant={selectedPackage.type === 'Membership' ? 'default' : 'secondary'}>
                {selectedPackage.type}
              </Badge>
            </div>
            {formData.is_hssv && (
              <div className="tw-mt-2 p-2 bg-green-100 rounded text-green-800 text-sm">
                <strong>Ưu đãi HSSV:</strong> Giảm 15% - Còn lại: {Math.round(selectedPackage.price * 0.85).toLocaleString('vi-VN')} VNĐ
              </div>
            )}
          </div>
        )}

        <div className="tw-space-y-2">
          <Label htmlFor="payment_method">Phương thức thanh toán</Label>
          <Select value={formData.payment_method} onValueChange={(value) => handleSelectChange('payment_method', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Tiền mặt</SelectItem>
              <SelectItem value="Momo">Momo</SelectItem>
              <SelectItem value="ZaloPay">ZaloPay</SelectItem>
              <SelectItem value="Card">Thẻ</SelectItem>
              <SelectItem value="BankTransfer">Chuyển khoản</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tw-min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="tw-max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="tw-text-center mb-8">
          <div className="tw-flex items-center justify-center mb-4">
            <Dumbbell className="tw-h-12 w-12 text-blue-600" />
            <span className="tw-ml-2 text-2xl font-bold text-gray-900">StagPower</span>
          </div>
          <h1 className="tw-text-2xl font-bold text-gray-900">Đăng ký thành viên</h1>
          <p className="tw-text-gray-600 mt-2">Tham gia StagPower để bắt đầu hành trình fitness của bạn</p>
        </div>

        {/* Progress Steps */}
        <div className="tw-flex items-center justify-center mb-8">
          <div className="tw-flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="tw-flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              Bước {currentStep}/3: {
                currentStep === 1 ? 'Thông tin cá nhân' :
                currentStep === 2 ? 'Thông tin sức khỏe' :
                'Chọn gói tập'
              }
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Nhập thông tin cá nhân cơ bản'}
              {currentStep === 2 && 'Cung cấp thông tin sức khỏe để được tư vấn tốt nhất'}
              {currentStep === 3 && 'Chọn gói tập phù hợp và chi nhánh gần nhất'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Error Message */}
              {error && (
                <div className="tw-mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="tw-flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Quay lại
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Hoàn thành đăng ký'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="tw-text-center mt-8 text-sm text-gray-500">
          <p>Đã có tài khoản?{' '}
            <Link to="/login" className="tw-text-blue-600 hover:text-blue-800 font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
