import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWithScrollLock } from '../../../../components/ui/select';
import { 
  Save, 
  X, 
  Loader2,
  Dumbbell,
  Briefcase,
  UserPlus
} from 'lucide-react';
import { useCreateStaffTrainer, useBranches } from '../../hooks';
import { CreateStaffTrainerRequest } from '../../types/staff-trainer.types';
import { toast } from 'sonner';

interface ModalCreateStaffPTProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  cccd: string;
  role: 'trainer' | 'staff' | 'admin';
  // Trainer specific
  specialty: string;
  experience_years: number;
  certifications: string;
  working_hours_start: string;
  working_hours_end: string;
  // Staff specific
  branch_id: string;
  position: string;
}

export function ModalCreateStaffPT({ isOpen, onClose }: ModalCreateStaffPTProps) {
  const createMutation = useCreateStaffTrainer();
  const { data: branchesData } = useBranches();
  const branches = branchesData || [];

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    cccd: '',
    role: 'trainer',
    // Trainer
    specialty: '',
    experience_years: 0,
    certifications: '',
    working_hours_start: '06:00',
    working_hours_end: '22:00',
    // Staff
    branch_id: '',
    position: 'staff',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.cccd.trim()) {
      newErrors.cccd = 'CCCD là bắt buộc';
    } else if (!/^[0-9]{12}$/.test(formData.cccd)) {
      newErrors.cccd = 'CCCD phải có đúng 12 số';
    }

    // Role-specific validation
    if (formData.role === 'staff' && !formData.branch_id) {
      newErrors.branch_id = 'Nhân viên phải chọn chi nhánh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const createData: CreateStaffTrainerRequest = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        cccd: formData.cccd,
        role: formData.role,
      };

      if (formData.role === 'trainer') {
        createData.trainerInfo = {
          specialty: formData.specialty || undefined,
          experience_years: formData.experience_years || 0,
          certificate: formData.certifications 
            ? formData.certifications.split(',').map(c => c.trim()).filter(c => c)
            : [],
          working_hour: [formData.working_hours_start, formData.working_hours_end]
        };
      } else if (formData.role === 'staff') {
        createData.staffInfo = {
          brand_id: formData.branch_id,
          position: formData.position as 'manager' | 'receptionist' | 'staff'
        };
      }

      console.log('🚀 Payload gửi lên API:', JSON.stringify(createData, null, 2));
      await createMutation.mutateAsync(createData);
      handleClose();
    } catch (error: any) {
      console.error('❌ Error response:', error?.response?.data);
      console.error('❌ Error message:', error?.message);
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      gender: 'male',
      dateOfBirth: '',
      cccd: '',
      role: 'trainer',
      specialty: '',
      experience_years: 0,
      certifications: '',
      working_hours_start: '06:00',
      working_hours_end: '22:00',
      branch_id: '',
      position: 'staff',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Thêm Nhân viên / PT mới
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Thông tin cơ bản
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0123456789"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <SelectWithScrollLock
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female' | 'other') => 
                    handleChange('gender', value)
                  }
                  lockScroll={true}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent lockScroll={true}>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </SelectWithScrollLock>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cccd">
                  CCCD <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cccd"
                  value={formData.cccd}
                  onChange={(e) => handleChange('cccd', e.target.value)}
                  placeholder="12 số"
                  maxLength={12}
                  className={errors.cccd ? 'border-red-500' : ''}
                />
                {errors.cccd && (
                  <p className="text-red-500 text-xs mt-1">{errors.cccd}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">
                  Vai trò <span className="text-red-500">*</span>
                </Label>
                <SelectWithScrollLock
                  value={formData.role}
                  onValueChange={(value: 'trainer' | 'staff' | 'admin') => 
                    handleChange('role', value)
                  }
                  lockScroll={true}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent lockScroll={true}>
                    <SelectItem value="trainer">PT (Personal Trainer)</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </SelectWithScrollLock>
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          {formData.role === 'trainer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-600" />
                Thông tin PT
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Chuyên môn</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    placeholder="Yoga, Cardio, Strength Training..."
                  />
                </div>

                <div>
                  <Label htmlFor="experience_years">Số năm kinh nghiệm</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => handleChange('experience_years', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="certifications">
                    Chứng chỉ (phân cách bằng dấu phẩy)
                  </Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleChange('certifications', e.target.value)}
                    placeholder="Yoga Instructor, Cardio Coach, ..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ví dụ: Yoga Instructor, Cardio Coach, Personal Trainer Certificate
                  </p>
                </div>

                <div>
                  <Label htmlFor="working_hours_start">Giờ làm việc bắt đầu</Label>
                  <Input
                    id="working_hours_start"
                    type="time"
                    value={formData.working_hours_start}
                    onChange={(e) => handleChange('working_hours_start', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="working_hours_end">Giờ làm việc kết thúc</Label>
                  <Input
                    id="working_hours_end"
                    type="time"
                    value={formData.working_hours_end}
                    onChange={(e) => handleChange('working_hours_end', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.role === 'staff' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Thông tin Nhân viên
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branch_id">
                    Chi nhánh <span className="text-red-500">*</span>
                  </Label>
                  <SelectWithScrollLock
                    value={formData.branch_id}
                    onValueChange={(value) => handleChange('branch_id', value)}
                    lockScroll={true}
                  >
                    <SelectTrigger className={errors.branch_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      {branches.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectWithScrollLock>
                  {errors.branch_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.branch_id}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="position">Vị trí</Label>
                  <SelectWithScrollLock
                    value={formData.position}
                    onValueChange={(value) => handleChange('position', value)}
                    lockScroll={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent lockScroll={true}>
                      <SelectItem value="manager">Quản lý</SelectItem>
                      <SelectItem value="receptionist">Lễ tân</SelectItem>
                      <SelectItem value="staff">Nhân viên</SelectItem>
                    </SelectContent>
                  </SelectWithScrollLock>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Tạo mới
                </>
              )}
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}

