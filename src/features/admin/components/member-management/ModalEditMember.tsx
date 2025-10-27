import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save,
  Loader2,
  Heart,
  Activity,
  Target,
  Clock,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UniversalUser, normalizeUser } from '../../types/user.types';
import { toast } from 'sonner';
import axiosInstance from '../../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../../configs/Api';
import { useQueryClient } from '@tanstack/react-query';
import { useHealthInfoByMemberId } from '../../../member/hooks/useHealthInfo';

// Helper function to format name to Title Case
const formatNameToTitleCase = (name: string): string => {
  return name
    .trim()
    .split(/\s+/) // Split by spaces
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Validation schema
const editMemberSchema = z.object({
  fullName: z.string()
    .min(2, 'Phải có ít nhất 2 ký tự')
    .max(100, 'Không được quá 100 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Chỉ được chứa chữ cái và khoảng trắng'),
  email: z.string().email('Định dạng email không đúng'),
  phone: z.string().regex(/^(0|\+84|84)[0-9]{9}$/, 'Định dạng không đúng (VD: 0123456789)'),
  gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Vui lòng chọn giới tính' }) }),
  dateOfBirth: z.string().optional(),
  cccd: z.string().regex(/^\d{12}$/, 'Phải đúng 12 chữ số').optional().or(z.literal('')),
  
  // Health Info - All optional, allow null/undefined/empty
  height: z.number().min(100, 'Tối thiểu 100cm').max(250, 'Tối đa 250cm').nullable().optional(),
  weight: z.number().min(30, 'Tối thiểu 30kg').max(300, 'Tối đa 300kg').nullable().optional(),
  bodyFatPercent: z.number().min(0, 'Tối thiểu 0%').max(100, 'Tối đa 100%').nullable().optional(),
  medicalHistory: z.string().max(500, 'Tối đa 500 ký tự').nullable().optional(),
  allergies: z.string().max(500, 'Tối đa 500 ký tự').nullable().optional(),
  goal: z.enum(['weightLoss', 'muscleGain', 'maintenance', 'endurance', 'flexibility']).nullable().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).nullable().optional(),
  fitnessLevel: z.enum(['low', 'medium', 'high']).nullable().optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).nullable().optional(),
  weeklySessions: z.enum(['1-2', '3-4', '5-6', '7+']).nullable().optional(),
});

type EditMemberFormData = z.infer<typeof editMemberSchema>;

interface ModalEditMemberProps {
  isOpen: boolean;
  onClose: () => void;
  member: UniversalUser | null;
  onSuccess?: () => void;
}

export function ModalEditMember({ 
  isOpen, 
  onClose, 
  member: rawMember,
  onSuccess
}: ModalEditMemberProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  
  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  // Normalize member data
  const member = rawMember ? normalizeUser(rawMember as UniversalUser) : null;

  // Fetch health info for this member
  const memberId = member?._id;
  const { data: healthInfoResponse, isLoading: isLoadingHealthInfo } = useHealthInfoByMemberId(memberId);
  
  // Extract health info from response
  // Response will be { success: true, data: {...} } or null (if 404)
  const healthInfo = healthInfoResponse?.data ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
  });

  // Initialize form with member and health data
  useEffect(() => {
    if (member && !isLoadingHealthInfo) {
      const formData = {
        fullName: member.fullName || '',
        email: member.email || '',
        phone: member.phone || '',
        gender: member.gender || 'male',
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
        cccd: member.cccd || '',
        // Health Info - ensure values are valid or undefined (not null)
        height: healthInfo?.height || undefined,
        weight: healthInfo?.weight || undefined,
        bodyFatPercent: healthInfo?.bodyFatPercent || undefined,
        medicalHistory: healthInfo?.medicalHistory || '',
        allergies: healthInfo?.allergies || '',
        goal: healthInfo?.goal || undefined,
        experience: healthInfo?.experience || undefined,
        fitnessLevel: healthInfo?.fitnessLevel || undefined,
        preferredTime: healthInfo?.preferredTime || undefined,
        weeklySessions: healthInfo?.weeklySessions || undefined,
      };
      
      reset(formData);
      
      // Manually set Select values after a short delay to ensure they display
      setTimeout(() => {
        if (healthInfo?.goal) setValue('goal', healthInfo.goal as any);
        if (healthInfo?.experience) setValue('experience', healthInfo.experience as any);
        if (healthInfo?.fitnessLevel) setValue('fitnessLevel', healthInfo.fitnessLevel as any);
        if (healthInfo?.preferredTime) setValue('preferredTime', healthInfo.preferredTime as any);
        if (healthInfo?.weeklySessions) setValue('weeklySessions', healthInfo.weeklySessions as any);
      }, 100);
    }
  }, [member, healthInfo, isLoadingHealthInfo, reset, setValue]);

  const onSubmit = async (data: EditMemberFormData) => {
    if (!member) return;
    
    try {
      setIsSubmitting(true);

      // 1. Update basic user info
      // Format fullName to Title Case and email to lowercase before saving
      const formattedFullName = formatNameToTitleCase(data.fullName);
      const formattedEmail = data.email.trim().toLowerCase();
      
      const userUpdateData = {
        fullName: formattedFullName,
        email: formattedEmail,
        phone: data.phone.trim(),
        gender: data.gender,
        dateOfBirth: data.dateOfBirth || undefined,
        cccd: data.cccd?.trim() || undefined,
      };

      const userResponse = await axiosInstance.put(
        API_ENDPOINTS.USER.UPDATE_USER(member._id),
        userUpdateData
      );

      if (!userResponse.data.success) {
        throw new Error(userResponse.data.message || 'Cập nhật thông tin cơ bản thất bại');
      }

      // 2. Update/Create health info
      // Calculate age from dateOfBirth
      let age = undefined;
      if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      const healthUpdateData: any = {
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        age: age,
        bodyFatPercent: data.bodyFatPercent,
        medicalHistory: data.medicalHistory,
        allergies: data.allergies,
        goal: data.goal,
        experience: data.experience,
        fitnessLevel: data.fitnessLevel,
        preferredTime: data.preferredTime,
        weeklySessions: data.weeklySessions,
      };

      // Remove undefined, null, and empty string fields
      Object.keys(healthUpdateData).forEach(key => {
        const value = healthUpdateData[key];
        if (value === undefined || value === null || value === '') {
          delete healthUpdateData[key];
        }
      });

      // Handle health info update/create
      // All fields are now optional - backend allows creating health info with any fields
      if (Object.keys(healthUpdateData).length > 0) {
        if (healthInfo?._id) {
          // Update existing health info
          await axiosInstance.put(
            API_ENDPOINTS.HEALTH_INFO.UPDATE_HEALTH_INFO(healthInfo._id),
            healthUpdateData
          );
        } else {
          // Create new health info with whatever fields are provided
          await axiosInstance.post(
            API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(member._id),
            healthUpdateData
          );
        }
      }

      // Show success message
      toast.success('Cập nhật thông tin thành công!', {
        description: `Đã cập nhật thông tin cho ${formattedFullName}`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['user', member._id] });
      queryClient.invalidateQueries({ queryKey: ['health-info', 'member', member._id] });
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error updating member:', error);
      
      // Get error message from backend
      let errorMessage = 'Vui lòng thử lại';
      if (error.response?.data?.message) {
        // Translate common backend errors to Vietnamese
        const backendMsg = error.response.data.message;
        if (backendMsg.includes('Email already exists') || backendMsg.includes('email')) {
          errorMessage = 'Email này đã tồn tại trong hệ thống';
        } else if (backendMsg.includes('Phone') || backendMsg.includes('phone')) {
          errorMessage = 'Số điện thoại này đã được sử dụng';
        } else if (backendMsg.includes('CCCD')) {
          errorMessage = 'CCCD này đã được sử dụng';
        } else {
          errorMessage = backendMsg;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('Cập nhật thất bại!', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import file handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('File không hợp lệ', {
          description: 'Vui lòng chọn file Excel (.xls hoặc .xlsx)',
        });
        return;
      }
      setImportFile(selectedFile);
      setParsedData(null);
      handleParseFile(selectedFile);
    }
  };

  const handleParseFile = async (fileToUpload: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('healthFile', fileToUpload);

      const response = await axiosInstance.post(
        API_ENDPOINTS.HEALTH_INFO.PARSE_PREVIEW_HEALTH_FILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setParsedData(response.data.data);
        if (response.data.data.isValid) {
          toast.success('Đọc file thành công!', {
            description: 'Dữ liệu hợp lệ, sẵn sàng import',
          });
        } else {
          toast.error('File có lỗi', {
            description: `Tìm thấy ${response.data.data.errors.length} lỗi`,
          });
        }
      }
    } catch (error: any) {
      toast.error('Lỗi đọc file', {
        description: error.response?.data?.message || 'Vui lòng thử lại',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveImport = async () => {
    if (!parsedData || !parsedData.isValid || !member) return;

    setIsSaving(true);
    try {
      // Check if member already has health info
      if (healthInfo?._id) {
        // Update existing health info
        await axiosInstance.put(
          API_ENDPOINTS.HEALTH_INFO.UPDATE_HEALTH_INFO(healthInfo._id),
          parsedData.data
        );
        toast.success('Cập nhật thành công!', {
          description: `Đã cập nhật thông tin sức khỏe cho ${member.fullName}`,
        });
      } else {
        // Create new health info
        await axiosInstance.post(
          API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(member._id),
          parsedData.data
        );
        toast.success('Import thành công!', {
          description: `Đã lưu thông tin sức khỏe cho ${member.fullName}`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['health-info', 'member', member._id] });
      
      setImportFile(null);
      setParsedData(null);
      setIsImportDialogOpen(false);
    } catch (error: any) {
      let errorMessage = 'Vui lòng thử lại';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error('Lỗi lưu dữ liệu', { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
    setImportFile(null);
    setParsedData(null);
  };

  if (!isOpen || !member) return null;

  // Show loading while fetching health info
  if (isLoadingHealthInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[96vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Chỉnh sửa thông tin
              </h2>
              <p className="text-sm text-gray-500">
                {member.fullName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Thông tin cơ bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Họ và tên {errors.fullName ? (
                        <span className="text-red-500 text-xs">- {errors.fullName.message}</span>
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Nhập họ và tên"
                      className={errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}
                      onBlur={(e) => {
                        // Auto-format name to Title Case when user leaves field
                        const formatted = formatNameToTitleCase(e.target.value);
                        setValue('fullName', formatted, { shouldValidate: true });
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      VD: Nguyễn Văn A, Trần Thị B
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email {errors.email ? (
                        <span className="text-red-500 text-xs">- {errors.email.message}</span>
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="example@gmail.com"
                        className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        onBlur={(e) => {
                          // Auto-format email: trim and lowercase
                          const formatted = e.target.value.trim().toLowerCase();
                          setValue('email', formatted, { shouldValidate: true });
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      VD: user@example.com
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Số điện thoại {errors.phone ? (
                        <span className="text-red-500 text-xs">- {errors.phone.message}</span>
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="0123456789"
                        className={`pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                        onBlur={(e) => {
                          // Auto-format phone: remove spaces
                          const formatted = e.target.value.trim().replace(/\s+/g, '');
                          setValue('phone', formatted, { shouldValidate: true });
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      VD: 0123456789 hoặc +84123456789
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Giới tính {errors.gender ? (
                        <span className="text-red-500 text-xs">- {errors.gender.message}</span>
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <Select
                      value={watch('gender')}
                      onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
                    >
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                      Ngày sinh
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth')}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* CCCD */}
                  <div>
                    <Label htmlFor="cccd" className="text-sm font-medium text-gray-700">
                      CCCD/CMND {errors.cccd && (
                        <span className="text-red-500 text-xs">- {errors.cccd.message}</span>
                      )}
                    </Label>
                    <Input
                      id="cccd"
                      {...register('cccd')}
                      placeholder="123456789012"
                      maxLength={12}
                      className={errors.cccd ? 'border-red-500 focus:ring-red-500' : ''}
                      onInput={(e) => {
                        // Only allow numbers
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Đúng 12 chữ số (có thể bỏ trống)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="bg-red-50/50">
                <CardTitle className="flex items-center justify-between text-red-900">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span>Thông tin sức khỏe</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsImportDialogOpen(true)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Import File
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Body Metrics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Chỉ số cơ thể
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Height */}
                    <div>
                      <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                        Chiều cao (cm) {errors.height && (
                          <span className="text-red-500 text-xs">- {errors.height.message}</span>
                        )}
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        min="100"
                        max="250"
                        {...register('height', { 
                          setValueAs: (v) => v === '' || v === null ? undefined : Number(v)
                        })}
                        placeholder="VD: 175"
                        className={errors.height ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                        Cân nặng (kg) {errors.weight && (
                          <span className="text-red-500 text-xs">- {errors.weight.message}</span>
                        )}
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        min="30"
                        max="300"
                        {...register('weight', { 
                          setValueAs: (v) => v === '' || v === null ? undefined : Number(v)
                        })}
                        placeholder="VD: 70"
                        className={errors.weight ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Body Fat % */}
                    <div>
                      <Label htmlFor="bodyFatPercent" className="text-sm font-medium text-gray-700">
                        % Mỡ cơ thể {errors.bodyFatPercent && (
                          <span className="text-red-500 text-xs">- {errors.bodyFatPercent.message}</span>
                        )}
                      </Label>
                      <Input
                        id="bodyFatPercent"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        {...register('bodyFatPercent', { 
                          setValueAs: (v) => v === '' || v === null ? undefined : Number(v)
                        })}
                        placeholder="VD: 15.5"
                        className={errors.bodyFatPercent ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Mục tiêu & Trình độ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Goal */}
                    <div>
                      <Label htmlFor="goal" className="text-sm font-medium text-gray-700">Mục tiêu</Label>
                      <Select
                        value={watch('goal') ?? ''}
                        onValueChange={(value) => setValue('goal', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mục tiêu (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weightLoss">Giảm cân</SelectItem>
                          <SelectItem value="muscleGain">Tăng cơ</SelectItem>
                          <SelectItem value="maintenance">Duy trì</SelectItem>
                          <SelectItem value="endurance">Tăng sức bền</SelectItem>
                          <SelectItem value="flexibility">Tăng độ dẻo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience */}
                    <div>
                      <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Trình độ</Label>
                      <Select
                        value={watch('experience') ?? ''}
                        onValueChange={(value) => setValue('experience', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trình độ (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                          <SelectItem value="intermediate">Trung bình</SelectItem>
                          <SelectItem value="advanced">Nâng cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fitness Level */}
                    <div>
                      <Label htmlFor="fitnessLevel" className="text-sm font-medium text-gray-700">Thể lực hiện tại</Label>
                      <Select
                        value={watch('fitnessLevel') ?? ''}
                        onValueChange={(value) => setValue('fitnessLevel', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức thể lực (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Weekly Sessions */}
                    <div>
                      <Label htmlFor="weeklySessions" className="text-sm font-medium text-gray-700">Số buổi/tuần</Label>
                      <Select
                        value={watch('weeklySessions') ?? ''}
                        onValueChange={(value) => setValue('weeklySessions', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số buổi (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 buổi</SelectItem>
                          <SelectItem value="3-4">3-4 buổi</SelectItem>
                          <SelectItem value="5-6">5-6 buổi</SelectItem>
                          <SelectItem value="7+">7+ buổi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Preferred Time */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Thời gian ưa thích
                  </h4>
                  <Select
                    value={watch('preferredTime') ?? ''}
                    onValueChange={(value) => setValue('preferredTime', value || undefined as any, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời gian (tùy chọn)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Sáng sớm (6:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Chiều (12:00 - 18:00)</SelectItem>
                      <SelectItem value="evening">Tối (18:00 - 22:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Medical History & Allergies */}
                <div className="space-y-4">
                  {/* Medical History */}
                  <div>
                    <Label htmlFor="medicalHistory" className="text-sm font-medium text-gray-700">
                      Tiền sử bệnh {errors.medicalHistory && (
                        <span className="text-red-500 text-xs">- {errors.medicalHistory.message}</span>
                      )}
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      {...register('medicalHistory')}
                      placeholder="Nhập tiền sử bệnh (nếu có)..."
                      rows={2}
                      maxLength={500}
                      className={errors.medicalHistory ? 'border-red-500 focus:ring-red-500' : ''}
                    />
                  </div>

                  {/* Allergies */}
                  <div>
                    <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
                      Dị ứng {errors.allergies && (
                        <span className="text-red-500 text-xs">- {errors.allergies.message}</span>
                      )}
                    </Label>
                    <Textarea
                      id="allergies"
                      {...register('allergies')}
                      placeholder="Nhập thông tin về dị ứng (nếu có)..."
                      rows={2}
                      maxLength={500}
                      className={errors.allergies ? 'border-red-500 focus:ring-red-500' : ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </form>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <div className="flex gap-3 justify-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      {isImportDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b bg-purple-50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Import Thông Tin Sức Khỏe</h3>
              </div>
              <button
                onClick={handleCloseImportDialog}
                className="p-1 hover:bg-purple-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!parsedData ? (
                <div>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors bg-purple-50/30">
                    <Upload className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Import cho: <strong>{member.fullName}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Hỗ trợ định dạng .xls, .xlsx
                    </p>
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="import-file-input"
                      disabled={isUploading}
                    />
                    <label htmlFor="import-file-input">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer border-purple-300 text-purple-700 hover:bg-purple-50"
                        asChild
                        disabled={isUploading}
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang đọc...
                            </>
                          ) : (
                            <>
                              <FileSpreadsheet className="w-4 h-4 mr-2" />
                              Chọn file
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">📝 Lưu ý:</p>
                    <ul className="text-xs text-gray-600 space-y-0.5 ml-3 list-disc">
                      <li>File phải có các cột: height, weight, gender, goal, experience, fitnessLevel</li>
                      <li>Dữ liệu nằm ở dòng đầu tiên (sau header)</li>
                    </ul>
                  </div>
                </div>
              ) : !parsedData.isValid ? (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Phát hiện lỗi</h4>
                        <ul className="space-y-1">
                          {parsedData.errors.map((error: string, index: number) => (
                            <li key={index} className="text-sm text-red-800">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setParsedData(null)} className="w-full">
                    Chọn lại file
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">Dữ liệu hợp lệ</h4>
                        <p className="text-sm text-green-700">Sẵn sàng import cho {member.fullName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-white/50 p-3 rounded">
                      <div><strong>Chiều cao:</strong> {parsedData.data.height} cm</div>
                      <div><strong>Cân nặng:</strong> {parsedData.data.weight} kg</div>
                      <div><strong>BMI:</strong> {parsedData.data.bmi}</div>
                      <div><strong>Giới tính:</strong> {parsedData.data.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                      <div className="col-span-2"><strong>Mục tiêu:</strong> {parsedData.data.goal}</div>
                      <div><strong>Trình độ:</strong> {parsedData.data.experience}</div>
                      <div><strong>Thể lực:</strong> {parsedData.data.fitnessLevel}</div>
                    </div>
                  </div>

                  {parsedData.warnings && parsedData.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-900 mb-1">Cảnh báo</p>
                          <ul className="space-y-0.5">
                            {parsedData.warnings.map((warning: string, index: number) => (
                              <li key={index} className="text-xs text-yellow-800">• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            {parsedData && (
              <div className="border-t p-4 flex gap-2 justify-end bg-gray-50">
                {parsedData.isValid ? (
                  <>
                    <Button variant="outline" onClick={() => setParsedData(null)}>
                      Chọn lại
                    </Button>
                    <Button
                      onClick={handleSaveImport}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Lưu ngay
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleCloseImportDialog}>
                    Đóng
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

