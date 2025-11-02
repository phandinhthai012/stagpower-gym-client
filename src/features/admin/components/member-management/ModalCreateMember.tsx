import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import axiosInstance from '../../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../../configs/Api';
import { toast } from 'sonner';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard,
  GraduationCap,
  AlertCircle,
  Heart,
  FileText
} from 'lucide-react';

interface ModalCreateMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCreateMember({ isOpen, onClose, onSuccess }: ModalCreateMemberProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'health'>('basic');
  const [formData, setFormData] = useState({
    // Basic info
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    cccd: '',
    password: '',
    
    // Member specific info
    membership_level: 'Basic',
    is_hssv: false,
    current_branch_id: '',
    notes: '',
    
    // Health info
    height: '',
    weight: '',
    medical_history: '',
    allergies: '',
    goal: '',
    experience: '',
    fitness_level: '',
    preferred_time: '',
    weekly_sessions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Tab components
  const BasicInfoTab = useMemo(() => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Thông tin cơ bản
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên"
              className={errors.fullName ? 'border-red-500' : ''}
            />
              {errors.fullName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="0123456789"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính <span className="text-red-500">*</span></Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.gender}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Ngày sinh <span className="text-red-500">*</span></Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              className={errors.date_of_birth ? 'border-red-500' : ''}
            />
            {errors.date_of_birth && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cccd">CCCD </Label>
            <Input
              id="cccd"
              value={formData.cccd}
              onChange={(e) => handleInputChange('cccd', e.target.value)}
              placeholder="123456789012"
              className={errors.cccd ? 'border-red-500' : ''}
            />
            {errors.cccd && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cccd}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Mật khẩu tạm thời"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Member Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Thông tin hội viên
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="membership_level">Loại membership</Label>
            <Select value={formData.membership_level} onValueChange={(value) => handleInputChange('membership_level', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_hssv}
                onChange={(e) => handleInputChange('is_hssv', e.target.checked)}
                className="rounded"
              />
              <GraduationCap className="w-4 h-4" />
              Học sinh - Sinh viên
            </Label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về hội viên"
            />
          </div>
        </div>
      </div>
    </div>
  ), [formData, errors, handleInputChange]);

  const HealthInfoTab = useMemo(() => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Heart className="w-5 h-5" />
        Thông tin sức khỏe (Tùy chọn)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Chiều cao (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="170"
            className={errors.height ? 'border-red-500' : ''}
          />
          {errors.height && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.height}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Cân nặng (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="70"
            className={errors.weight ? 'border-red-500' : ''}
          />
          {errors.weight && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.weight}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Mục tiêu tập luyện</Label>
          <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mục tiêu" />
            </SelectTrigger>
            <SelectContent className="z-[10001]">
              <SelectItem value="WeightLoss">Giảm cân</SelectItem>
              <SelectItem value="MuscleGain">Tăng cơ</SelectItem>
              <SelectItem value="Health">Sức khỏe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Kinh nghiệm</Label>
          <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn kinh nghiệm" />
            </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
              <SelectItem value="Beginner">Mới bắt đầu</SelectItem>
              <SelectItem value="Intermediate">Trung bình</SelectItem>
              <SelectItem value="Advanced">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitness_level">Mức độ thể lực</Label>
          <Select value={formData.fitness_level} onValueChange={(value) => handleInputChange('fitness_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn mức độ" />
            </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
              <SelectItem value="Low">Thấp</SelectItem>
              <SelectItem value="Medium">Trung bình</SelectItem>
              <SelectItem value="High">Cao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_time">Thời gian ưa thích</Label>
          <Select value={formData.preferred_time} onValueChange={(value) => handleInputChange('preferred_time', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
              <SelectItem value="Morning">Sáng</SelectItem>
              <SelectItem value="Afternoon">Chiều</SelectItem>
              <SelectItem value="Evening">Tối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weekly_sessions">Số buổi/tuần</Label>
          <Select value={formData.weekly_sessions} onValueChange={(value) => handleInputChange('weekly_sessions', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn số buổi" />
            </SelectTrigger>
              <SelectContent className="z-[10001]" lockScroll={false}>
              <SelectItem value="1-2">1-2 buổi</SelectItem>
              <SelectItem value="3-4">3-4 buổi</SelectItem>
              <SelectItem value="5+">5+ buổi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="medical_history">Tiền sử bệnh lý</Label>
          <Input
            id="medical_history"
            value={formData.medical_history}
            onChange={(e) => handleInputChange('medical_history', e.target.value)}
            placeholder="Mô tả tiền sử bệnh lý (nếu có)"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="allergies">Dị ứng</Label>
          <Input
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="Mô tả các loại dị ứng (nếu có)"
          />
        </div>
      </div>
    </div>
  ), [formData, errors, handleInputChange]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    if (!formData.password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone format validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // CCCD validation
    const cccdRegex = /^[0-9]{12}$/;
    if (formData.cccd && !cccdRegex.test(formData.cccd.replace(/\D/g, ''))) {
      newErrors.cccd = 'CCCD phải có 12 số';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Height and weight validation
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250)) {
      newErrors.height = 'Chiều cao phải từ 100-250 cm';
    }
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 30 || Number(formData.weight) > 200)) {
      newErrors.weight = 'Cân nặng phải từ 30-200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate BMI if height and weight are provided
      let bmi = null;
      if (formData.height && formData.weight) {
        const heightInMeters = Number(formData.height) / 100;
        bmi = Number(formData.weight) / (heightInMeters * heightInMeters);
      }

      // Calculate age from date of birth
      const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear();

      const memberData = {
        // Basic user info
        role: 'member', // Backend expects lowercase
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.date_of_birth ? new Date(formData.date_of_birth) : undefined, // Backend expects camelCase
        password: formData.password, // Should be hashed on backend
        cccd: formData.cccd.trim() || undefined, // CCCD is optional - send undefined if not provided
        status: 'active', // Backend expects lowercase
        
        // Member specific info
        memberInfo: { // Backend expects camelCase
          membership_level: formData.membership_level.toLowerCase(), // Backend expects lowercase
          is_student: formData.is_hssv, // Backend expects is_student, not is_hssv
          current_brand_id: formData.current_branch_id || null, // Backend expects current_brand_id
          notes: formData.notes.trim(),
          total_spending: 0,
          membership_month: 0
        }
        // Health info (optional - will be created separately via health info API)
        // Note: Health info should be created after member is created via dedicated API
      };

      // Call API to create member
      const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE_USER, memberData);
      
      if (response.data.success) {
        toast.success('Tạo hội viên thành công!');
        
        // If health info was provided, create it after member is created
        if (formData.height || formData.weight || formData.goal) {
          try {
            const createdMember = response.data.data;
            const healthInfoData: any = {};
            
            if (formData.height) healthInfoData.height = Number(formData.height);
            if (formData.weight) healthInfoData.weight = Number(formData.weight);
            if (formData.goal) healthInfoData.goal = formData.goal;
            if (formData.experience) healthInfoData.experience = formData.experience.toLowerCase();
            if (formData.fitness_level) healthInfoData.fitnessLevel = formData.fitness_level.toLowerCase();
            if (formData.preferred_time) healthInfoData.preferredTime = formData.preferred_time.toLowerCase();
            if (formData.weekly_sessions) healthInfoData.weeklySessions = formData.weekly_sessions;
            if (formData.medical_history) healthInfoData.medicalHistory = formData.medical_history;
            if (formData.allergies) healthInfoData.allergies = formData.allergies;
            
            // Create health info if any data provided
            if (Object.keys(healthInfoData).length > 0) {
              await axiosInstance.post(
                API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(createdMember._id),
                healthInfoData
              );
            }
          } catch (healthError: any) {
            console.warn('Could not create health info:', healthError);
            // Don't fail the whole operation if health info creation fails
          }
        }
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          gender: '',
          date_of_birth: '',
          cccd: '',
          password: '',
          membership_level: 'Basic',
          is_hssv: false,
          current_branch_id: '',
          notes: '',
          height: '',
          weight: '',
          medical_history: '',
          allergies: '',
          goal: '',
          experience: '',
          fitness_level: '',
          preferred_time: '',
          weekly_sessions: ''
        });
        
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Tạo hội viên thất bại');
      }
      
    } catch (error: any) {
      console.error('Error creating member:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tạo hội viên';
      toast.error('Tạo hội viên thất bại', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40" 
        style={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
      />
      
      {/* Modal content */}
      <div className="relative flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white relative z-[10000]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thêm hội viên mới
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Thông tin cơ bản
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('health')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'health'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                Thông tin sức khỏe
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'basic' && BasicInfoTab}
            {activeTab === 'health' && HealthInfoTab}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo hội viên'}
              </Button>
            </div>
          </form>
         </CardContent>
       </Card>
      </div>
    </div>
  );
}
