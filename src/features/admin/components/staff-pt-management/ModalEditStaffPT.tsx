import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { SelectWithScrollLock, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { 
  Save, 
  X, 
  Loader2,
  Dumbbell,
  Briefcase,
  Edit
} from 'lucide-react';
import { useUpdateStaffTrainer, useBranches } from '../../hooks';
import { StaffTrainerUser, UpdateStaffTrainerRequest } from '../../types/staff-trainer.types';
import { toast } from 'sonner';

interface ModalEditStaffPTProps {
  isOpen: boolean;
  onClose: () => void;
  user: StaffTrainerUser | null;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  cccd: string;
  photo: string;
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

export function ModalEditStaffPT({ isOpen, onClose, user }: ModalEditStaffPTProps) {
  const updateMutation = useUpdateStaffTrainer();
  const { data: branchesData } = useBranches();
  const branches = branchesData || [];

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    cccd: '',
    photo: '',
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

  // Ẩn scrollbar của page khi modal mở
  useEffect(() => {
    if (isOpen) {
      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Khôi phục scroll khi modal đóng
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      const trainerInfo = user.role === 'trainer' ? user.trainerInfo : undefined;
      const staffInfo = user.role === 'staff' ? user.staffInfo : undefined;

      // Format date for input type="date" (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
        dateOfBirth: formatDateForInput(user.dateOfBirth),
        cccd: user.cccd || '',
        photo: user.photo || '',
        // Trainer
        specialty: trainerInfo?.specialty || '',
        experience_years: trainerInfo?.experience_years || 0,
        certifications: trainerInfo?.certificate?.join(', ') || '',
        working_hours_start: trainerInfo?.working_hour?.[0] || '06:00',
        working_hours_end: trainerInfo?.working_hour?.[1] || '22:00',
        // Staff
        branch_id: staffInfo?.brand_id || '',
        position: staffInfo?.position || 'staff',
      });

      console.log('📅 User dateOfBirth:', user.dateOfBirth);
      console.log('📅 Formatted:', formatDateForInput(user.dateOfBirth));
    }
  }, [user]);

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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Role-specific validation
    if (user?.role === 'staff' && !formData.branch_id) {
      newErrors.branch_id = 'Nhân viên phải chọn chi nhánh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      const updateData: UpdateStaffTrainerRequest = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        cccd: formData.cccd,
        photo: formData.photo,
      };

      if (user.role === 'trainer') {
        updateData['trainerInfo.specialty'] = formData.specialty;
        updateData['trainerInfo.experience_years'] = formData.experience_years;
        updateData['trainerInfo.certificate'] = formData.certifications 
          ? formData.certifications.split(',').map(c => c.trim()).filter(c => c)
          : [];
        updateData['trainerInfo.working_hour'] = [
          formData.working_hours_start,
          formData.working_hours_end
        ];
      } else if (user.role === 'staff') {
        updateData['staffInfo.brand_id'] = formData.branch_id;
        updateData['staffInfo.position'] = formData.position as 'manager' | 'receptionist' | 'staff';
      }

      console.log('🔄 Update payload:', updateData);
      await updateMutation.mutateAsync({
        userId: user._id,
        data: updateData
      });
      handleClose();
    } catch (error: any) {
      console.error('❌ Update error:', error?.response?.data);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Chỉnh sửa thông tin - {user.fullName}
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
                  <Label htmlFor="cccd">CCCD</Label>
                  <Input
                    id="cccd"
                    value={formData.cccd}
                    onChange={(e) => handleChange('cccd', e.target.value)}
                    placeholder="12 số"
                    maxLength={12}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">CCCD không thể thay đổi</p>
                </div>

                <div>
                  <Label htmlFor="photo">URL Ảnh đại diện</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => handleChange('photo', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label>Vai trò</Label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium text-gray-700">
                      {user.role === 'trainer' ? 'PT (Personal Trainer)' : 
                       user.role === 'staff' ? 'Nhân viên' : 
                       'Admin'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Vai trò không thể thay đổi</p>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {user.role === 'trainer' && (
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

            {user.role === 'staff' && (
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
                disabled={updateMutation.isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Cập nhật
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

