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
  age: z.number().min(1, 'Tối thiểu 1 tuổi').max(100, 'Tối đa 100 tuổi').nullable().optional(),
  bodyFatPercent: z.number().min(0, 'Tối thiểu 0%').max(100, 'Tối đa 100%').nullable().optional(),
  bodyFatMass: z.number().min(0, 'Không được âm').nullable().optional(),
  muscleMass: z.number().min(0, 'Không được âm').nullable().optional(),
  visceralFatLevel: z.number().min(0, 'Không được âm').nullable().optional(),
  waterPercent: z.number().min(0, 'Tối thiểu 0%').max(100, 'Tối đa 100%').nullable().optional(),
  boneMass: z.number().min(0, 'Không được âm').nullable().optional(),
  // InBody fields
  basalMetabolicRate: z.number().min(0, 'Không được âm').nullable().optional(),
  waistHipRatio: z.number().min(0, 'Không được âm').max(3, 'Tối đa 3').nullable().optional(),
  inBodyScore: z.number().min(0, 'Tối thiểu 0').max(100, 'Tối đa 100').nullable().optional(),
  medicalHistory: z.string().max(1000, 'Tối đa 1000 ký tự').nullable().optional(),
  allergies: z.string().max(500, 'Tối đa 500 ký tự').nullable().optional(),
  goal: z.string().nullable().optional(), // Allow any string value for goal
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'Beginner', 'Intermediate', 'Advanced']).nullable().optional(),
  fitnessLevel: z.enum(['low', 'medium', 'high', 'Low', 'Medium', 'High']).nullable().optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'evening', 'Morning', 'Afternoon', 'Evening']).nullable().optional(),
  weeklySessions: z.enum(['1-2', '3-4', '5+']).nullable().optional(),
  // Lifestyle fields
  dietType: z.enum(['balanced', 'high_protein', 'low_carb', 'vegetarian', 'vegan', 'other']).nullable().optional(),
  dailyCalories: z.number().min(800, 'Tối thiểu 800').max(5000, 'Tối đa 5000').nullable().optional(),
  sleepHours: z.number().min(0, 'Tối thiểu 0').max(24, 'Tối đa 24').nullable().optional(),
  stressLevel: z.enum(['low', 'medium', 'high']).nullable().optional(),
  alcohol: z.enum(['none', 'occasional', 'frequent']).nullable().optional(),
  smoking: z.boolean().nullable().optional(),
  // Segmental Lean Analysis
  segmentalLeanAnalysis: z.object({
    leftArm: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    rightArm: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    leftLeg: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    rightLeg: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
  }).nullable().optional(),
  // Segmental Fat Analysis
  segmentalFatAnalysis: z.object({
    leftArm: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    rightArm: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    trunk: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    leftLeg: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
    rightLeg: z.object({
      mass: z.number().min(0).nullable().optional(),
      percent: z.number().min(0).nullable().optional(), // Allow > 100% for segmental analysis
    }).nullable().optional(),
  }).nullable().optional(),
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
  const { data: healthInfo, isLoading: isLoadingHealthInfo } = useHealthInfoByMemberId(memberId);

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
        age: healthInfo?.age || undefined,
        bodyFatPercent: healthInfo?.bodyFatPercent || undefined,
        bodyFatMass: healthInfo?.bodyFatMass || undefined,
        muscleMass: healthInfo?.muscleMass || undefined,
        visceralFatLevel: healthInfo?.visceralFatLevel || undefined,
        waterPercent: healthInfo?.waterPercent || undefined,
        boneMass: healthInfo?.boneMass || undefined,
        basalMetabolicRate: healthInfo?.basalMetabolicRate || undefined,
        waistHipRatio: healthInfo?.waistHipRatio || undefined,
        inBodyScore: healthInfo?.inBodyScore || undefined,
        medicalHistory: healthInfo?.medicalHistory || '',
        allergies: healthInfo?.allergies || '',
        goal: healthInfo?.goal || undefined,
        experience: healthInfo?.experience 
          ? (healthInfo.experience.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'Beginner' | 'Intermediate' | 'Advanced')
          : undefined,
        fitnessLevel: healthInfo?.fitnessLevel
          ? (healthInfo.fitnessLevel.toLowerCase() as 'low' | 'medium' | 'high' | 'Low' | 'Medium' | 'High')
          : undefined,
        preferredTime: healthInfo?.preferredTime
          ? (healthInfo.preferredTime.toLowerCase() as 'morning' | 'afternoon' | 'evening' | 'Morning' | 'Afternoon' | 'Evening')
          : undefined,
        weeklySessions: healthInfo?.weeklySessions || undefined,
        dietType: healthInfo?.dietType || undefined,
        dailyCalories: healthInfo?.dailyCalories || undefined,
        sleepHours: healthInfo?.sleepHours || undefined,
        stressLevel: healthInfo?.stressLevel || undefined,
        alcohol: healthInfo?.alcohol || undefined,
        smoking: healthInfo?.smoking ?? undefined,
        segmentalLeanAnalysis: healthInfo?.segmentalLeanAnalysis || undefined,
        segmentalFatAnalysis: healthInfo?.segmentalFatAnalysis || undefined,
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
    if (!member) {
      toast.error('Lỗi', { description: 'Không tìm thấy thông tin thành viên' });
      return;
    }
    
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
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
        age: age || data.age,
        bodyFatPercent: data.bodyFatPercent,
        bodyFatMass: data.bodyFatMass,
        muscleMass: data.muscleMass,
        visceralFatLevel: data.visceralFatLevel,
        waterPercent: data.waterPercent,
        boneMass: data.boneMass,
        basalMetabolicRate: data.basalMetabolicRate,
        waistHipRatio: data.waistHipRatio,
        inBodyScore: data.inBodyScore,
        medicalHistory: data.medicalHistory,
        allergies: data.allergies,
        goal: data.goal,
        experience: data.experience ? (typeof data.experience === 'string' ? data.experience.toLowerCase() : data.experience) : undefined,
        fitnessLevel: data.fitnessLevel ? (typeof data.fitnessLevel === 'string' ? data.fitnessLevel.toLowerCase() : data.fitnessLevel) : undefined,
        preferredTime: data.preferredTime ? (typeof data.preferredTime === 'string' ? data.preferredTime.toLowerCase() : data.preferredTime) : undefined,
        weeklySessions: data.weeklySessions,
        dietType: data.dietType,
        dailyCalories: data.dailyCalories,
        sleepHours: data.sleepHours,
        stressLevel: data.stressLevel,
        alcohol: data.alcohol,
        smoking: data.smoking,
        segmentalLeanAnalysis: data.segmentalLeanAnalysis,
        segmentalFatAnalysis: data.segmentalFatAnalysis,
      };

      // Clean nested objects (segmental analysis) - remove empty objects
      if (healthUpdateData.segmentalLeanAnalysis) {
        const lean = healthUpdateData.segmentalLeanAnalysis;
        Object.keys(lean).forEach(limb => {
          const limbData = lean[limb];
          if (limbData && (limbData.mass === undefined || limbData.mass === null) && 
              (limbData.percent === undefined || limbData.percent === null)) {
            delete lean[limb];
          } else if (limbData) {
            if (limbData.mass === undefined || limbData.mass === null) delete limbData.mass;
            if (limbData.percent === undefined || limbData.percent === null) delete limbData.percent;
            if (Object.keys(limbData).length === 0) delete lean[limb];
          }
        });
        if (Object.keys(lean).length === 0) {
          delete healthUpdateData.segmentalLeanAnalysis;
        }
      }

      if (healthUpdateData.segmentalFatAnalysis) {
        const fat = healthUpdateData.segmentalFatAnalysis;
        Object.keys(fat).forEach(limb => {
          const limbData = fat[limb];
          if (limbData && (limbData.mass === undefined || limbData.mass === null) && 
              (limbData.percent === undefined || limbData.percent === null)) {
            delete fat[limb];
          } else if (limbData) {
            if (limbData.mass === undefined || limbData.mass === null) delete limbData.mass;
            if (limbData.percent === undefined || limbData.percent === null) delete limbData.percent;
            if (Object.keys(limbData).length === 0) delete fat[limb];
          }
        });
        if (Object.keys(fat).length === 0) {
          delete healthUpdateData.segmentalFatAnalysis;
        }
      }

      // Remove undefined, null, and empty string fields
      Object.keys(healthUpdateData).forEach(key => {
        const value = healthUpdateData[key];
        if (value === undefined || value === null || value === '') {
          delete healthUpdateData[key];
        }
      });

      // Handle health info - Always create new record to track history
      // All fields are now optional - backend allows creating health info with any fields
      if (Object.keys(healthUpdateData).length > 0) {
        // Always create new health info record to track changes over time
        await axiosInstance.post(
          API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(member._id),
          healthUpdateData
        );
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
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('File không hợp lệ', {
          description: 'Vui lòng chọn file Excel (.xls, .xlsx) hoặc PDF (.pdf)',
        });
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File quá lớn', {
          description: 'Kích thước file không được vượt quá 10MB',
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
          // Auto-fill form with parsed data for preview
          const data = response.data.data.data;
          
          // Fill health info fields
          if (data.height !== undefined && data.height !== null) {
            setValue('height', data.height);
          }
          if (data.weight !== undefined && data.weight !== null) {
            setValue('weight', data.weight);
          }
          if (data.age !== undefined && data.age !== null) {
            setValue('age', data.age);
          }
          if (data.bodyFatPercent !== undefined && data.bodyFatPercent !== null) {
            setValue('bodyFatPercent', data.bodyFatPercent);
          }
          if (data.bodyFatMass !== undefined && data.bodyFatMass !== null) {
            setValue('bodyFatMass', data.bodyFatMass);
          }
          if (data.muscleMass !== undefined && data.muscleMass !== null) {
            setValue('muscleMass', data.muscleMass);
          }
          if (data.visceralFatLevel !== undefined && data.visceralFatLevel !== null) {
            setValue('visceralFatLevel', data.visceralFatLevel);
          }
          if (data.waterPercent !== undefined && data.waterPercent !== null) {
            setValue('waterPercent', data.waterPercent);
          }
          if (data.boneMass !== undefined && data.boneMass !== null) {
            setValue('boneMass', data.boneMass);
          }
          if (data.basalMetabolicRate !== undefined && data.basalMetabolicRate !== null) {
            setValue('basalMetabolicRate', data.basalMetabolicRate);
          }
          if (data.waistHipRatio !== undefined && data.waistHipRatio !== null) {
            setValue('waistHipRatio', data.waistHipRatio);
          }
          if (data.inBodyScore !== undefined && data.inBodyScore !== null) {
            setValue('inBodyScore', data.inBodyScore);
          }
          if (data.medicalHistory !== undefined && data.medicalHistory !== null) {
            setValue('medicalHistory', data.medicalHistory);
          }
          if (data.allergies !== undefined && data.allergies !== null) {
            setValue('allergies', data.allergies);
          }
          if (data.goal !== undefined && data.goal !== null) {
            setValue('goal', data.goal);
          }
          // Set Select values after a short delay to ensure they display correctly
          setTimeout(() => {
            if (data.experience !== undefined && data.experience !== null) {
              // Normalize enum value to match form schema
              const experience = typeof data.experience === 'string' 
                ? data.experience.toLowerCase() as 'beginner' | 'intermediate' | 'advanced'
                : data.experience;
              setValue('experience', experience as any);
            }
            if (data.fitnessLevel !== undefined && data.fitnessLevel !== null) {
              // Normalize enum value to match form schema
              const fitnessLevel = typeof data.fitnessLevel === 'string'
                ? data.fitnessLevel.toLowerCase() as 'low' | 'medium' | 'high'
                : data.fitnessLevel;
              setValue('fitnessLevel', fitnessLevel as any);
            }
            if (data.preferredTime !== undefined && data.preferredTime !== null) {
              // Normalize enum value to match form schema
              const preferredTime = typeof data.preferredTime === 'string'
                ? data.preferredTime.toLowerCase() as 'morning' | 'afternoon' | 'evening'
                : data.preferredTime;
              setValue('preferredTime', preferredTime as any);
            }
            if (data.weeklySessions !== undefined && data.weeklySessions !== null) {
              setValue('weeklySessions', data.weeklySessions as any);
            }
            if (data.goal !== undefined && data.goal !== null) {
              setValue('goal', data.goal as any);
            }
          }, 100);
          
          // Also update gender if provided
          if (data.gender !== undefined && data.gender !== null) {
            setValue('gender', data.gender);
          }
          
          // Set segmental analysis data
          if (data.segmentalLeanAnalysis) {
            if (data.segmentalLeanAnalysis.leftArm) {
              if (data.segmentalLeanAnalysis.leftArm.mass !== undefined) {
                setValue('segmentalLeanAnalysis.leftArm.mass', data.segmentalLeanAnalysis.leftArm.mass);
              }
              if (data.segmentalLeanAnalysis.leftArm.percent !== undefined) {
                setValue('segmentalLeanAnalysis.leftArm.percent', data.segmentalLeanAnalysis.leftArm.percent);
              }
            }
            if (data.segmentalLeanAnalysis.rightArm) {
              if (data.segmentalLeanAnalysis.rightArm.mass !== undefined) {
                setValue('segmentalLeanAnalysis.rightArm.mass', data.segmentalLeanAnalysis.rightArm.mass);
              }
              if (data.segmentalLeanAnalysis.rightArm.percent !== undefined) {
                setValue('segmentalLeanAnalysis.rightArm.percent', data.segmentalLeanAnalysis.rightArm.percent);
              }
            }
            if (data.segmentalLeanAnalysis.leftLeg) {
              if (data.segmentalLeanAnalysis.leftLeg.mass !== undefined) {
                setValue('segmentalLeanAnalysis.leftLeg.mass', data.segmentalLeanAnalysis.leftLeg.mass);
              }
              if (data.segmentalLeanAnalysis.leftLeg.percent !== undefined) {
                setValue('segmentalLeanAnalysis.leftLeg.percent', data.segmentalLeanAnalysis.leftLeg.percent);
              }
            }
            if (data.segmentalLeanAnalysis.rightLeg) {
              if (data.segmentalLeanAnalysis.rightLeg.mass !== undefined) {
                setValue('segmentalLeanAnalysis.rightLeg.mass', data.segmentalLeanAnalysis.rightLeg.mass);
              }
              if (data.segmentalLeanAnalysis.rightLeg.percent !== undefined) {
                setValue('segmentalLeanAnalysis.rightLeg.percent', data.segmentalLeanAnalysis.rightLeg.percent);
              }
            }
          }
          
          if (data.segmentalFatAnalysis) {
            if (data.segmentalFatAnalysis.leftArm) {
              if (data.segmentalFatAnalysis.leftArm.mass !== undefined) {
                setValue('segmentalFatAnalysis.leftArm.mass', data.segmentalFatAnalysis.leftArm.mass);
              }
              if (data.segmentalFatAnalysis.leftArm.percent !== undefined) {
                setValue('segmentalFatAnalysis.leftArm.percent', data.segmentalFatAnalysis.leftArm.percent);
              }
            }
            if (data.segmentalFatAnalysis.rightArm) {
              if (data.segmentalFatAnalysis.rightArm.mass !== undefined) {
                setValue('segmentalFatAnalysis.rightArm.mass', data.segmentalFatAnalysis.rightArm.mass);
              }
              if (data.segmentalFatAnalysis.rightArm.percent !== undefined) {
                setValue('segmentalFatAnalysis.rightArm.percent', data.segmentalFatAnalysis.rightArm.percent);
              }
            }
            if (data.segmentalFatAnalysis.trunk) {
              if (data.segmentalFatAnalysis.trunk.mass !== undefined) {
                setValue('segmentalFatAnalysis.trunk.mass', data.segmentalFatAnalysis.trunk.mass);
              }
              if (data.segmentalFatAnalysis.trunk.percent !== undefined) {
                setValue('segmentalFatAnalysis.trunk.percent', data.segmentalFatAnalysis.trunk.percent);
              }
            }
            if (data.segmentalFatAnalysis.leftLeg) {
              if (data.segmentalFatAnalysis.leftLeg.mass !== undefined) {
                setValue('segmentalFatAnalysis.leftLeg.mass', data.segmentalFatAnalysis.leftLeg.mass);
              }
              if (data.segmentalFatAnalysis.leftLeg.percent !== undefined) {
                setValue('segmentalFatAnalysis.leftLeg.percent', data.segmentalFatAnalysis.leftLeg.percent);
              }
            }
            if (data.segmentalFatAnalysis.rightLeg) {
              if (data.segmentalFatAnalysis.rightLeg.mass !== undefined) {
                setValue('segmentalFatAnalysis.rightLeg.mass', data.segmentalFatAnalysis.rightLeg.mass);
              }
              if (data.segmentalFatAnalysis.rightLeg.percent !== undefined) {
                setValue('segmentalFatAnalysis.rightLeg.percent', data.segmentalFatAnalysis.rightLeg.percent);
              }
            }
          }

          // Close import dialog to show the form with filled data
          setIsImportDialogOpen(false);
          
          toast.success('Đọc file thành công!', {
            description: 'Dữ liệu đã được tự động điền vào form. Vui lòng xem lại và chỉnh sửa nếu cần.',
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
      // Always create new health info record to track changes over time
      await axiosInstance.post(
        API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(member._id),
        parsedData.data
      );
      toast.success('Import thành công!', {
        description: `Đã tạo bản ghi sức khỏe mới cho ${member.fullName}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['health-info', 'member', member._id] });
      queryClient.invalidateQueries({ queryKey: ['health-info'] });
      
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
        <form 
          id="edit-member-form"
          onSubmit={handleSubmit(
            (data) => {
              console.log('Form validation passed, submitting...', data);
              onSubmit(data);
            },
            (errors) => {
              console.error('Form validation failed:', errors);
              toast.error('Vui lòng kiểm tra lại thông tin', {
                description: 'Có một số trường không hợp lệ. Vui lòng kiểm tra lại.',
              });
            }
          )} 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
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
                        step="0.0001"
                        {...register('height', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
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
                        step="0.0001"
                        {...register('weight', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 70"
                        className={errors.weight ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                        Tuổi {errors.age && (
                          <span className="text-red-500 text-xs">- {errors.age.message}</span>
                        )}
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="100"
                        {...register('age', { 
                          setValueAs: (v) => v === '' || v === null ? undefined : Number(v)
                        })}
                        placeholder="VD: 25"
                        className={errors.age ? 'border-red-500 focus:ring-red-500' : ''}
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
                        step="0.0001"
                        {...register('bodyFatPercent', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 15.5"
                        className={errors.bodyFatPercent ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Muscle Mass */}
                    <div>
                      <Label htmlFor="muscleMass" className="text-sm font-medium text-gray-700">
                        Khối lượng cơ (kg) {errors.muscleMass && (
                          <span className="text-red-500 text-xs">- {errors.muscleMass.message}</span>
                        )}
                      </Label>
                      <Input
                        id="muscleMass"
                        type="number"
                        min="0"
                        step="0.0001"
                        {...register('muscleMass', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 45.5"
                        className={errors.muscleMass ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Water Percent */}
                    <div>
                      <Label htmlFor="waterPercent" className="text-sm font-medium text-gray-700">
                        % Nước {errors.waterPercent && (
                          <span className="text-red-500 text-xs">- {errors.waterPercent.message}</span>
                        )}
                      </Label>
                      <Input
                        id="waterPercent"
                        type="number"
                        min="0"
                        max="100"
                        step="0.0001"
                        {...register('waterPercent', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 60.5"
                        className={errors.waterPercent ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>
                  </div>
                  
                  {/* Additional Body Composition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Visceral Fat Level */}
                    <div>
                      <Label htmlFor="visceralFatLevel" className="text-sm font-medium text-gray-700">
                        Mỡ nội tạng (cấp độ) {errors.visceralFatLevel && (
                          <span className="text-red-500 text-xs">- {errors.visceralFatLevel.message}</span>
                        )}
                      </Label>
                      <Input
                        id="visceralFatLevel"
                        type="number"
                        min="0"
                        step="0.0001"
                        {...register('visceralFatLevel', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 8"
                        className={errors.visceralFatLevel ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Bone Mass */}
                    <div>
                      <Label htmlFor="boneMass" className="text-sm font-medium text-gray-700">
                        Khối lượng xương (kg) {errors.boneMass && (
                          <span className="text-red-500 text-xs">- {errors.boneMass.message}</span>
                        )}
                      </Label>
                      <Input
                        id="boneMass"
                        type="number"
                        min="0"
                        step="0.0001"
                        {...register('boneMass', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 3.2"
                        className={errors.boneMass ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Body Fat Mass */}
                    <div>
                      <Label htmlFor="bodyFatMass" className="text-sm font-medium text-gray-700">
                        Khối lượng mỡ (kg) {errors.bodyFatMass && (
                          <span className="text-red-500 text-xs">- {errors.bodyFatMass.message}</span>
                        )}
                      </Label>
                      <Input
                        id="bodyFatMass"
                        type="number"
                        min="0"
                        step="0.0001"
                        {...register('bodyFatMass', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 22.1"
                        className={errors.bodyFatMass ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* InBody Analysis */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Phân tích InBody
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Basal Metabolic Rate */}
                    <div>
                      <Label htmlFor="basalMetabolicRate" className="text-sm font-medium text-gray-700">
                        Tỷ lệ trao đổi chất (kcal) {errors.basalMetabolicRate && (
                          <span className="text-red-500 text-xs">- {errors.basalMetabolicRate.message}</span>
                        )}
                      </Label>
                      <Input
                        id="basalMetabolicRate"
                        type="number"
                        min="0"
                        step="0.0001"
                        {...register('basalMetabolicRate', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 1168"
                        className={errors.basalMetabolicRate ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Waist Hip Ratio */}
                    <div>
                      <Label htmlFor="waistHipRatio" className="text-sm font-medium text-gray-700">
                        Tỷ lệ vòng eo/hông {errors.waistHipRatio && (
                          <span className="text-red-500 text-xs">- {errors.waistHipRatio.message}</span>
                        )}
                      </Label>
                      <Input
                        id="waistHipRatio"
                        type="number"
                        min="0"
                        max="3"
                        step="0.0001"
                        {...register('waistHipRatio', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 0.98"
                        className={errors.waistHipRatio ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* InBody Score */}
                    <div>
                      <Label htmlFor="inBodyScore" className="text-sm font-medium text-gray-700">
                        Điểm InBody {errors.inBodyScore && (
                          <span className="text-red-500 text-xs">- {errors.inBodyScore.message}</span>
                        )}
                      </Label>
                      <Input
                        id="inBodyScore"
                        type="number"
                        min="0"
                        max="100"
                        step="0.0001"
                        {...register('inBodyScore', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 66"
                        className={errors.inBodyScore ? 'border-red-500 focus:ring-red-500' : ''}
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
                          <SelectItem value="WeightLoss">Giảm cân</SelectItem>
                          <SelectItem value="MuscleGain">Tăng cơ</SelectItem>
                          <SelectItem value="Health">Sức khỏe</SelectItem>
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
                          <SelectItem value="5+">5+ buổi</SelectItem>
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

                {/* Segmental Lean Analysis */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Phân tích cơ theo vùng (Segmental Lean Analysis)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Arm */}
                    <div className="space-y-2 border border-blue-200 rounded-lg p-4 bg-blue-50/30">
                      <Label className="text-sm font-medium text-gray-700">Tay trái</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.leftArm.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalLeanAnalysis.leftArm.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.leftArm.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 2.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.leftArm.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalLeanAnalysis.leftArm.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.leftArm.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 15.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Arm */}
                    <div className="space-y-2 border border-blue-200 rounded-lg p-4 bg-blue-50/30">
                      <Label className="text-sm font-medium text-gray-700">Tay phải</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.rightArm.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalLeanAnalysis.rightArm.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.rightArm.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 2.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.rightArm.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalLeanAnalysis.rightArm.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.rightArm.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 15.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left Leg */}
                    <div className="space-y-2 border border-blue-200 rounded-lg p-4 bg-blue-50/30">
                      <Label className="text-sm font-medium text-gray-700">Chân trái</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.leftLeg.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalLeanAnalysis.leftLeg.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.leftLeg.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 7.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.leftLeg.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalLeanAnalysis.leftLeg.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.leftLeg.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 45.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Leg */}
                    <div className="space-y-2 border border-blue-200 rounded-lg p-4 bg-blue-50/30">
                      <Label className="text-sm font-medium text-gray-700">Chân phải</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.rightLeg.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalLeanAnalysis.rightLeg.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.rightLeg.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 7.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalLeanAnalysis.rightLeg.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalLeanAnalysis.rightLeg.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalLeanAnalysis.rightLeg.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 45.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segmental Fat Analysis */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Phân tích mỡ theo vùng (Segmental Fat Analysis)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Arm */}
                    <div className="space-y-2 border border-red-200 rounded-lg p-4 bg-red-50/30">
                      <Label className="text-sm font-medium text-gray-700">Tay trái</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.leftArm.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalFatAnalysis.leftArm.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.leftArm.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 0.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.leftArm.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalFatAnalysis.leftArm.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.leftArm.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 3.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Arm */}
                    <div className="space-y-2 border border-red-200 rounded-lg p-4 bg-red-50/30">
                      <Label className="text-sm font-medium text-gray-700">Tay phải</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.rightArm.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalFatAnalysis.rightArm.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.rightArm.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 0.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.rightArm.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalFatAnalysis.rightArm.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.rightArm.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 3.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trunk */}
                    <div className="space-y-2 border border-red-200 rounded-lg p-4 bg-red-50/30">
                      <Label className="text-sm font-medium text-gray-700">Thân</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.trunk.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalFatAnalysis.trunk.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.trunk.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 10.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.trunk.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalFatAnalysis.trunk.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.trunk.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 20.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left Leg */}
                    <div className="space-y-2 border border-red-200 rounded-lg p-4 bg-red-50/30">
                      <Label className="text-sm font-medium text-gray-700">Chân trái</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.leftLeg.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalFatAnalysis.leftLeg.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.leftLeg.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 3.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.leftLeg.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalFatAnalysis.leftLeg.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.leftLeg.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 8.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Leg */}
                    <div className="space-y-2 border border-red-200 rounded-lg p-4 bg-red-50/30">
                      <Label className="text-sm font-medium text-gray-700">Chân phải</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.rightLeg.mass" className="text-xs text-gray-600">Khối lượng (kg)</Label>
                          <Input
                            id="segmentalFatAnalysis.rightLeg.mass"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.rightLeg.mass', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 3.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="segmentalFatAnalysis.rightLeg.percent" className="text-xs text-gray-600">%</Label>
                          <Input
                            id="segmentalFatAnalysis.rightLeg.percent"
                            type="number"
                            min="0"
                            step="0.0001"
                            {...register('segmentalFatAnalysis.rightLeg.percent', { 
                              setValueAs: (v) => {
                                if (v === '' || v === null) return undefined;
                                const num = Number(v);
                                return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                              }
                            })}
                            placeholder="VD: 8.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History & Allergies */}
                <div className="space-y-4 mt-6">
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
                      maxLength={1000}
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

                {/* Lifestyle & Nutrition */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Lối sống & Dinh dưỡng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Diet Type */}
                    <div>
                      <Label htmlFor="dietType" className="text-sm font-medium text-gray-700">Chế độ dinh dưỡng</Label>
                      <Select
                        value={watch('dietType') ?? ''}
                        onValueChange={(value) => setValue('dietType', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chế độ (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Cân bằng</SelectItem>
                          <SelectItem value="high_protein">Nhiều đạm</SelectItem>
                          <SelectItem value="low_carb">Ít tinh bột</SelectItem>
                          <SelectItem value="vegetarian">Ăn chay</SelectItem>
                          <SelectItem value="vegan">Thuần chay</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Daily Calories */}
                    <div>
                      <Label htmlFor="dailyCalories" className="text-sm font-medium text-gray-700">
                        Calo/ngày {errors.dailyCalories && (
                          <span className="text-red-500 text-xs">- {errors.dailyCalories.message}</span>
                        )}
                      </Label>
                      <Input
                        id="dailyCalories"
                        type="number"
                        min="800"
                        max="5000"
                        step="0.0001"
                        {...register('dailyCalories', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 2000"
                        className={errors.dailyCalories ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Sleep Hours */}
                    <div>
                      <Label htmlFor="sleepHours" className="text-sm font-medium text-gray-700">
                        Số giờ ngủ/ngày {errors.sleepHours && (
                          <span className="text-red-500 text-xs">- {errors.sleepHours.message}</span>
                        )}
                      </Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        min="0"
                        max="24"
                        step="0.0001"
                        {...register('sleepHours', { 
                          setValueAs: (v) => {
                            if (v === '' || v === null) return undefined;
                            const num = Number(v);
                            return isNaN(num) ? undefined : parseFloat(num.toFixed(4));
                          }
                        })}
                        placeholder="VD: 7.5"
                        className={errors.sleepHours ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>

                    {/* Stress Level */}
                    <div>
                      <Label htmlFor="stressLevel" className="text-sm font-medium text-gray-700">Mức độ stress</Label>
                      <Select
                        value={watch('stressLevel') ?? ''}
                        onValueChange={(value) => setValue('stressLevel', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức độ (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Alcohol */}
                    <div>
                      <Label htmlFor="alcohol" className="text-sm font-medium text-gray-700">Uống rượu</Label>
                      <Select
                        value={watch('alcohol') ?? ''}
                        onValueChange={(value) => setValue('alcohol', value || undefined as any, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tần suất (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Không</SelectItem>
                          <SelectItem value="occasional">Thỉnh thoảng</SelectItem>
                          <SelectItem value="frequent">Thường xuyên</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Smoking */}
                    <div>
                      <Label htmlFor="smoking" className="text-sm font-medium text-gray-700">Hút thuốc lá</Label>
                      <Select
                        value={watch('smoking') === true ? 'yes' : watch('smoking') === false ? 'no' : ''}
                        onValueChange={(value) => setValue('smoking', value === 'yes' ? true : value === 'no' ? false : undefined, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">Không</SelectItem>
                          <SelectItem value="yes">Có</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
              type="submit"
              form="edit-member-form"
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
                      Hỗ trợ định dạng .xls, .xlsx, .pdf
                    </p>
                    <input
                      type="file"
                      accept=".xls,.xlsx,.pdf"
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
                      <li>Hỗ trợ file Excel (.xls, .xlsx) và PDF (.pdf)</li>
                      <li>File Excel: phải có các cột height, weight, gender, goal, experience, fitnessLevel</li>
                      <li>File PDF: hỗ trợ định dạng InBody, tự động trích xuất dữ liệu</li>
                      <li>Dữ liệu Excel nằm ở dòng đầu tiên (sau header)</li>
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

                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">Thông tin cơ bản</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm bg-white/50 p-3 rounded">
                          {parsedData.data.height !== undefined && parsedData.data.height !== null && (
                            <div><strong>Chiều cao:</strong> {parsedData.data.height} cm</div>
                          )}
                          {parsedData.data.weight !== undefined && parsedData.data.weight !== null && (
                            <div><strong>Cân nặng:</strong> {parsedData.data.weight} kg</div>
                          )}
                          {parsedData.data.bmi !== undefined && parsedData.data.bmi !== null && (
                            <div><strong>BMI:</strong> {parsedData.data.bmi}</div>
                          )}
                          {parsedData.data.age !== undefined && parsedData.data.age !== null && (
                            <div><strong>Tuổi:</strong> {parsedData.data.age}</div>
                          )}
                          {parsedData.data.gender && (
                            <div><strong>Giới tính:</strong> {parsedData.data.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                          )}
                        </div>
                      </div>

                      {/* Body Composition */}
                      {(parsedData.data.bodyFatPercent !== undefined || parsedData.data.bodyFatMass !== undefined || 
                        parsedData.data.muscleMass !== undefined || parsedData.data.waterPercent !== undefined ||
                        parsedData.data.visceralFatLevel !== undefined || parsedData.data.boneMass !== undefined) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Thành phần cơ thể</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-white/50 p-3 rounded">
                            {parsedData.data.bodyFatPercent !== undefined && parsedData.data.bodyFatPercent !== null && (
                              <div><strong>% Mỡ cơ thể:</strong> {parsedData.data.bodyFatPercent}%</div>
                            )}
                            {parsedData.data.bodyFatMass !== undefined && parsedData.data.bodyFatMass !== null && (
                              <div><strong>Khối lượng mỡ:</strong> {parsedData.data.bodyFatMass} kg</div>
                            )}
                            {parsedData.data.muscleMass !== undefined && parsedData.data.muscleMass !== null && (
                              <div><strong>Khối lượng cơ:</strong> {parsedData.data.muscleMass} kg</div>
                            )}
                            {parsedData.data.waterPercent !== undefined && parsedData.data.waterPercent !== null && (
                              <div><strong>% Nước:</strong> {parsedData.data.waterPercent}%</div>
                            )}
                            {parsedData.data.visceralFatLevel !== undefined && parsedData.data.visceralFatLevel !== null && (
                              <div><strong>Mỡ nội tạng:</strong> {parsedData.data.visceralFatLevel} cấp độ</div>
                            )}
                            {parsedData.data.boneMass !== undefined && parsedData.data.boneMass !== null && (
                              <div><strong>Khối lượng xương:</strong> {parsedData.data.boneMass} kg</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* InBody Analysis */}
                      {(parsedData.data.basalMetabolicRate !== undefined || parsedData.data.waistHipRatio !== undefined || 
                        parsedData.data.inBodyScore !== undefined) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Phân tích InBody</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-white/50 p-3 rounded">
                            {parsedData.data.basalMetabolicRate !== undefined && parsedData.data.basalMetabolicRate !== null && (
                              <div><strong>BMR:</strong> {parsedData.data.basalMetabolicRate} kcal</div>
                            )}
                            {parsedData.data.waistHipRatio !== undefined && parsedData.data.waistHipRatio !== null && (
                              <div><strong>Tỷ lệ eo/hông:</strong> {parsedData.data.waistHipRatio}</div>
                            )}
                            {parsedData.data.inBodyScore !== undefined && parsedData.data.inBodyScore !== null && (
                              <div><strong>Điểm InBody:</strong> {parsedData.data.inBodyScore} / 100</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Segmental Lean Analysis */}
                      {(parsedData.data.segmentalLeanAnalysis && (
                        parsedData.data.segmentalLeanAnalysis.leftArm ||
                        parsedData.data.segmentalLeanAnalysis.rightArm ||
                        parsedData.data.segmentalLeanAnalysis.leftLeg ||
                        parsedData.data.segmentalLeanAnalysis.rightLeg
                      )) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Phân tích cơ theo vùng</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-blue-50 p-3 rounded">
                            {parsedData.data.segmentalLeanAnalysis?.leftArm && (
                              <div><strong>Tay trái:</strong> {parsedData.data.segmentalLeanAnalysis.leftArm.mass} kg ({parsedData.data.segmentalLeanAnalysis.leftArm.percent}%)</div>
                            )}
                            {parsedData.data.segmentalLeanAnalysis?.rightArm && (
                              <div><strong>Tay phải:</strong> {parsedData.data.segmentalLeanAnalysis.rightArm.mass} kg ({parsedData.data.segmentalLeanAnalysis.rightArm.percent}%)</div>
                            )}
                            {parsedData.data.segmentalLeanAnalysis?.leftLeg && (
                              <div><strong>Chân trái:</strong> {parsedData.data.segmentalLeanAnalysis.leftLeg.mass} kg ({parsedData.data.segmentalLeanAnalysis.leftLeg.percent}%)</div>
                            )}
                            {parsedData.data.segmentalLeanAnalysis?.rightLeg && (
                              <div><strong>Chân phải:</strong> {parsedData.data.segmentalLeanAnalysis.rightLeg.mass} kg ({parsedData.data.segmentalLeanAnalysis.rightLeg.percent}%)</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Segmental Fat Analysis */}
                      {(parsedData.data.segmentalFatAnalysis && (
                        parsedData.data.segmentalFatAnalysis.leftArm ||
                        parsedData.data.segmentalFatAnalysis.rightArm ||
                        parsedData.data.segmentalFatAnalysis.trunk ||
                        parsedData.data.segmentalFatAnalysis.leftLeg ||
                        parsedData.data.segmentalFatAnalysis.rightLeg
                      )) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Phân tích mỡ theo vùng</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-red-50 p-3 rounded">
                            {parsedData.data.segmentalFatAnalysis?.leftArm && (
                              <div><strong>Tay trái:</strong> {parsedData.data.segmentalFatAnalysis.leftArm.mass} kg ({parsedData.data.segmentalFatAnalysis.leftArm.percent}%)</div>
                            )}
                            {parsedData.data.segmentalFatAnalysis?.rightArm && (
                              <div><strong>Tay phải:</strong> {parsedData.data.segmentalFatAnalysis.rightArm.mass} kg ({parsedData.data.segmentalFatAnalysis.rightArm.percent}%)</div>
                            )}
                            {parsedData.data.segmentalFatAnalysis?.trunk && (
                              <div><strong>Thân:</strong> {parsedData.data.segmentalFatAnalysis.trunk.mass} kg ({parsedData.data.segmentalFatAnalysis.trunk.percent}%)</div>
                            )}
                            {parsedData.data.segmentalFatAnalysis?.leftLeg && (
                              <div><strong>Chân trái:</strong> {parsedData.data.segmentalFatAnalysis.leftLeg.mass} kg ({parsedData.data.segmentalFatAnalysis.leftLeg.percent}%)</div>
                            )}
                            {parsedData.data.segmentalFatAnalysis?.rightLeg && (
                              <div><strong>Chân phải:</strong> {parsedData.data.segmentalFatAnalysis.rightLeg.mass} kg ({parsedData.data.segmentalFatAnalysis.rightLeg.percent}%)</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fitness Goals */}
                      {(parsedData.data.goal || parsedData.data.experience || parsedData.data.fitnessLevel || 
                        parsedData.data.preferredTime || parsedData.data.weeklySessions) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Mục tiêu tập luyện</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-white/50 p-3 rounded">
                            {parsedData.data.goal && <div><strong>Mục tiêu:</strong> {parsedData.data.goal}</div>}
                            {parsedData.data.experience && <div><strong>Trình độ:</strong> {parsedData.data.experience}</div>}
                            {parsedData.data.fitnessLevel && <div><strong>Thể lực:</strong> {parsedData.data.fitnessLevel}</div>}
                            {parsedData.data.preferredTime && <div><strong>Thời gian ưa thích:</strong> {parsedData.data.preferredTime}</div>}
                            {parsedData.data.weeklySessions && <div><strong>Số buổi/tuần:</strong> {parsedData.data.weeklySessions}</div>}
                          </div>
                        </div>
                      )}

                      {/* Medical History */}
                      {(parsedData.data.medicalHistory || parsedData.data.allergies) && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Lịch sử y tế</h5>
                          <div className="text-sm bg-white/50 p-3 rounded space-y-1">
                            {parsedData.data.medicalHistory && (
                              <div><strong>Tiền sử bệnh:</strong> {parsedData.data.medicalHistory}</div>
                            )}
                            {parsedData.data.allergies && (
                              <div><strong>Dị ứng:</strong> {parsedData.data.allergies}</div>
                            )}
                          </div>
                        </div>
                      )}
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

