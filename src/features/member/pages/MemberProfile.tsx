import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Heart,
  Target,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useMe, useUpdateProfile } from '../hooks/useMembers';
import { useAllHealthInfoByMemberId, useCreateHealthInfo, useUpdateHealthInfo } from '../hooks/useHealthInfo';
import { formatDate } from '../../../lib/date-utils';
import { toast } from 'sonner';
import { healthInfoUtils } from '../utils/healthInfo.utils';
import { HealthInfoDisplay } from '../components/HealthInfoDisplay';

export function MemberProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<{ fullName: string, email: string } | null>(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [editedHealth, setEditedHealth] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'health' | 'personal'>('health');

  // API hooks
  const { data: userData, isLoading: userLoading, error: userError } = useMe();
  const { data: healthInfoList, isLoading: healthLoading, error: healthError } = useAllHealthInfoByMemberId(userData?._id);
  // Get latest healthInfo for editing (first item in sorted list)
  const healthInfo = healthInfoList && healthInfoList.length > 0 ? healthInfoList[0] : null;
  const updateProfileMutation = useUpdateProfile();
  const createHealthInfoMutation = useCreateHealthInfo();

  // Debug: Log health info data
  useEffect(() => {
    if (healthInfo) {
      console.log('Health Info loaded:', healthInfo);
    } else if (!healthLoading && !healthError) {
      console.log('No health info found (member needs to create it)');
    }
  }, [healthInfo, healthLoading, healthError]);

  const initEditedHealth = () => {
    if (!healthInfo) return null;
    return {
      height: healthInfo?.height ?? '',
      weight: healthInfo?.weight ?? '',
      gender: healthInfo?.gender ?? userData?.gender ?? 'male',
      age: healthInfo?.age ?? '',
      bodyFatPercent: healthInfo?.bodyFatPercent ?? '',
      muscleMass: healthInfo?.muscleMass ?? '',
      visceralFatLevel: healthInfo?.visceralFatLevel ?? '',
      waterPercent: healthInfo?.waterPercent ?? '',
      boneMass: healthInfo?.boneMass ?? '',
      goal: healthInfo?.goal ?? '',
      experience: healthInfo?.experience ?? '',
      fitnessLevel: healthInfo?.fitnessLevel ?? '',
      preferredTime: healthInfo?.preferredTime ?? '',
      weeklySessions: healthInfo?.weeklySessions ?? '1-2',
      dietType: healthInfo?.dietType ?? 'balanced',
      dailyCalories: healthInfo?.dailyCalories ?? '',
      sleepHours: healthInfo?.sleepHours ?? '',
      stressLevel: healthInfo?.stressLevel ?? 'medium',
      alcohol: healthInfo?.alcohol ?? 'none',
      smoking: healthInfo?.smoking ?? false,
      medicalHistory: healthInfo?.medicalHistory ?? '',
      allergies: healthInfo?.allergies ?? ''
    };
  };

  const bmiValue = useMemo(() => {
    if (healthInfo?.bmi) return healthInfo.bmi.toFixed(1);
    if (!healthInfo?.height || !healthInfo?.weight) return null;
    const h = healthInfo?.height / 100;
    return (healthInfo?.weight / (h * h)).toFixed(1);
  }, [healthInfo]);

  const handleInputChange = (field: string, value: string) => {
    if (!editedUser) return;

    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!editedUser || !userData) return;

    try {
      await updateProfileMutation.mutateAsync({
        data: {
          fullName: editedUser.fullName,
          email: editedUser.email,
        },
        userId: userData._id
      });
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setEditedUser(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      console.error('Update profile error:', error);
    }
  };

  const handleCancel = () => {
    setEditedUser(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (userData) {
      setEditedUser({
        fullName: userData.fullName,
        email: userData.email
      });
    }
    setIsEditing(true);
  };

  const handleHealthEdit = () => {
    setEditedHealth(initEditedHealth());
    setIsEditingHealth(true);
  };

  const handleHealthCancel = () => {
    setEditedHealth(null);
    setIsEditingHealth(false);
  };

  const handleHealthChange = (field: string, value: string | number | boolean) => {
    if (!editedHealth) {
      // Initialize editedHealth if it doesn't exist
      const initialHealth = {
        height: healthInfo?.height ?? '',
        weight: healthInfo?.weight ?? '',
        gender: healthInfo?.gender ?? userData?.gender ?? 'male',
        age: healthInfo?.age ?? '',
        bodyFatPercent: healthInfo?.bodyFatPercent ?? '',
        muscleMass: healthInfo?.muscleMass ?? '',
        visceralFatLevel: healthInfo?.visceralFatLevel ?? '',
        waterPercent: healthInfo?.waterPercent ?? '',
        boneMass: healthInfo?.boneMass ?? '',
        goal: healthInfo?.goal ?? '',
        experience: healthInfo?.experience ?? '',
        fitnessLevel: healthInfo?.fitnessLevel ?? '',
        preferredTime: healthInfo?.preferredTime ?? '',
        weeklySessions: healthInfo?.weeklySessions ?? '1-2',
        dietType: healthInfo?.dietType ?? 'balanced',
        dailyCalories: healthInfo?.dailyCalories ?? '',
        sleepHours: healthInfo?.sleepHours ?? '',
        stressLevel: healthInfo?.stressLevel ?? 'medium',
        alcohol: healthInfo?.alcohol ?? 'none',
        smoking: healthInfo?.smoking ?? false,
        medicalHistory: healthInfo?.medicalHistory ?? '',
        allergies: healthInfo?.allergies ?? ''
      };
      setEditedHealth({ ...initialHealth, [field]: value });
    } else {
      setEditedHealth({ ...editedHealth, [field]: value });
    }
  };

  const handleHealthSave = async () => {
    if (!editedHealth || !userData) return;

    try {
      // Start with latest healthInfo as base (if exists)
      const baseData: any = healthInfo ? { ...healthInfo } : {};
      
      // Remove MongoDB-specific fields
      delete baseData._id;
      delete baseData.memberId;
      delete baseData.createdAt;
      delete baseData.updatedAt;
      delete baseData.__v;
      delete baseData.lastUpdated;
      
      // Merge editedHealth values (prioritize edited values)
      const mergedData: any = { ...baseData };
      
      Object.keys(editedHealth).forEach(key => {
        const editedValue = editedHealth[key];
        
        // If edited value is not empty, use it; otherwise keep base value
        if (editedValue !== null && editedValue !== undefined && editedValue !== '') {
          mergedData[key] = editedValue;
        } else if (baseData[key] !== undefined && baseData[key] !== null && baseData[key] !== '') {
          // Keep base value if edited value is empty
          mergedData[key] = baseData[key];
        }
      });

      // Clean data: remove empty strings, null, undefined values, and ensure proper types
      const cleanedData: any = {};
      
      Object.keys(mergedData).forEach(key => {
        const value = mergedData[key];
        
        // Skip null, undefined, empty string
        if (value === null || value === undefined || value === '') {
          return;
        }
        
        // Handle boolean values (smoking can be false, so check explicitly)
        if (key === 'smoking' && typeof value === 'boolean') {
          cleanedData[key] = value;
          return;
        }
        
        // Handle number fields - convert string to number and validate > 0
        const numberFields = ['height', 'weight', 'age', 'bodyFatPercent', 'muscleMass', 
          'visceralFatLevel', 'waterPercent', 'boneMass', 'bodyFatMass', 
          'basalMetabolicRate', 'waistHipRatio', 'inBodyScore', 'dailyCalories', 'sleepHours'];
        
        if (numberFields.includes(key)) {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          if (!isNaN(numValue) && numValue > 0) {
            cleanedData[key] = numValue;
          }
          return;
        }
        
        // Handle string values
        if (typeof value === 'string' && value.trim() !== '') {
          const trimmed = value.trim();
          // For enum fields, convert to lowercase
          if (['experience', 'fitnessLevel', 'preferredTime'].includes(key)) {
            cleanedData[key] = trimmed.toLowerCase();
          } else {
            cleanedData[key] = trimmed;
          }
          return;
        }
        
        // Handle arrays
        if (Array.isArray(value) && value.length > 0) {
          cleanedData[key] = value;
          return;
        }
        
        // Handle objects (segmental analysis)
        if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
          cleanedData[key] = value;
          return;
        }
      });

      // Ensure at least some data is provided
      if (Object.keys(cleanedData).length === 0) {
        toast.error('Vui lòng nhập ít nhất một thông tin sức khỏe');
        return;
      }

      console.log('Sending health info data:', cleanedData);

      // Always create new health info record to track changes over time
      await createHealthInfoMutation.mutateAsync({
        memberId: userData._id,
        data: cleanedData
      });
      toast.success('Tạo thông tin sức khỏe thành công!', {
        description: 'Bản ghi mới đã được tạo để theo dõi lịch sử thay đổi'
      });
      setIsEditingHealth(false);
      setEditedHealth(null);
    } catch (error: any) {
      console.error('Health info save error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.data?.message ||
                          error?.message || 
                          'Có lỗi xảy ra khi lưu thông tin sức khỏe';
      toast.error('Lỗi', {
        description: errorMessage
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Log health error if it's not a 404 (404 means user hasn't created health info yet, which is ok)
  if (healthError && (healthError as any)?.response?.status !== 404) {
    console.error('Health info error:', healthError);
  }

  // Loading state - only block on user loading, not health (health can be null)
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-base sm:text-sm">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  // Error state - only show error for user data (health info 404 is ok - user might not have it yet)
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-base sm:text-sm text-red-600 mb-4">Có lỗi xảy ra khi tải thông tin</p>
          <Button onClick={() => {
            // Reload page safely
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }
          }}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Guard: Don't render if no user data
  if (!userData && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-8">Thông Tin Cá Nhân</h1>

      {/* Profile + Summary Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-3 items-start">
          {/* Left: Avatar + basic info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-blue-900">{userData?.fullName || user?.fullName}</h2>
              <p className="text-base sm:text-sm text-gray-600">
                {userData?.memberInfo?.membership_level === 'vip' ? 'Hội viên VIP' : 'Hội viên Basic'} - Chi nhánh Gò Vấp
              </p>
              <Badge className={`mt-1 ${userData?.status === 'active'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                }`}>
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm">{userData?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</span>
              </Badge>
            </div>
          </div>

          {/* Right: Summary */}
          {healthInfo && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl md:ml-[-175px] mt-4 md:mt-0">
              <h4 className="text-base sm:text-sm font-semibold text-gray-900 mb-3">Thông Tin Tóm Tắt</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-base sm:text-sm font-semibold">BMI</span>
                  <span className="text-gray-700 text-base sm:text-sm truncate">
                    {bmiValue ? `${bmiValue} (${healthInfoUtils.getBMICategory(Number(bmiValue))})` : 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-base sm:text-sm font-semibold">Mục tiêu</span>
                  <span className="text-gray-700 text-base sm:text-sm truncate">{healthInfoUtils.getGoalText(healthInfo?.goal)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-base sm:text-sm font-semibold">Trình độ</span>
                  <span className="text-gray-700 text-base sm:text-sm truncate">{healthInfoUtils.getExperienceText(healthInfo?.experience)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-900 flex items-center justify-between gap-3">
                  <span className="text-blue-900 text-base sm:text-sm font-semibold">Điểm sức khỏe</span>
                  <span className="text-gray-700 text-base sm:text-sm truncate">
                    {healthInfo?.healthScore !== undefined 
                      ? `${healthInfo.healthScore}/100 (${healthInfoUtils.getHealthStatusText(healthInfo.healthStatus)})`
                      : 'Chưa đánh giá'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 flex">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 px-3 sm:px-5 py-3 sm:py-4 text-base sm:text-sm font-medium transition-all duration-300 border-b-3 ${activeTab === 'health'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
            }`}
        >
          Thông tin sức khỏe
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 px-3 sm:px-5 py-3 sm:py-4 text-base sm:text-sm font-medium transition-all duration-300 border-b-3 ${activeTab === 'personal'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
            }`}
        >
          Thông tin cá nhân
        </button>
      </div>

      {/* Personal Information (tab) */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm mb-6 sm:mb-8 border-l-4 border-blue-900">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900">Thông Tin Cá Nhân</h3>
            {!isEditing ? (
              <Button onClick={handleEdit} size="sm" variant="outline" className="w-full sm:w-auto">
                <Edit3 className="w-4 h-4" />
                <span className="text-base sm:text-sm">Chỉnh sửa</span>
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 sm:flex-initial"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="text-base sm:text-sm">Lưu</span>
                </Button>
                <Button onClick={handleCancel} size="sm" variant="ghost" className="flex-1 sm:flex-initial">
                  <X className="w-4 h-4" />
                  <span className="text-base sm:text-sm">Hủy</span>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base sm:text-sm">Họ và tên</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editedUser?.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="text-base sm:text-sm"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-base sm:text-sm">{userData?.fullName || user?.fullName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base sm:text-sm">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedUser?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-base sm:text-sm"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-base sm:text-sm truncate">{userData?.email || user?.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base sm:text-sm">Số điện thoại</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-base sm:text-sm">{userData?.phone || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-base sm:text-sm">Ngày sinh</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-base sm:text-sm">{userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-base sm:text-sm">Giới tính</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-base sm:text-sm">
                  {userData?.gender === 'male' ? 'Nam' :
                    userData?.gender === 'female' ? 'Nữ' :
                      userData?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cccd" className="text-base sm:text-sm">CCCD/CMND</Label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-base sm:text-sm">{userData?.cccd || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-4 sm:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-base sm:text-sm">Ngày tham gia</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-base sm:text-sm">{userData?.createdAt ? formatDate(userData.createdAt) : 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base sm:text-sm">QR Code</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-mono text-base sm:text-sm truncate">
                    {userData?.memberInfo?.qr_code ?
                      `${userData.memberInfo.qr_code.substring(0, 20)}...${userData.memberInfo.qr_code.substring(userData.memberInfo.qr_code.length - 10)}` :
                      'Chưa có QR code'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Information (tab) */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border-l-4 border-blue-900">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900">Thông Tin Sức Khỏe</h3>
            {!isEditingHealth ? (
              <Button onClick={handleHealthEdit} size="sm" variant="outline" className="w-full sm:w-auto">
                <Edit3 className="w-4 h-4" />
                <span className="text-base sm:text-sm">Cập Nhật Thông Tin Sức Khỏe</span>
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleHealthSave}
                  size="sm"
                  disabled={createHealthInfoMutation.isPending}
                  className="flex-1 sm:flex-initial"
                >
                  {createHealthInfoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="text-base sm:text-sm">Lưu</span>
                </Button>
                <Button onClick={handleHealthCancel} size="sm" variant="ghost" className="flex-1 sm:flex-initial">
                  <X className="w-4 h-4" />
                  <span className="text-base sm:text-sm">Hủy</span>
                </Button>
              </div>
            )}
          </div>

          {!isEditingHealth ? (
            <HealthInfoDisplay 
              healthInfoList={healthInfoList || []}
              isLoading={healthLoading}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Chiều cao (cm)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.height : healthInfo?.height) ?? ''}
                onChange={(e) => handleHealthChange('height', Number(e.target.value))}
                readOnly={!isEditingHealth}
                className="text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Cân nặng (kg)</Label>
              <Input
                value={(isEditingHealth ? editedHealth?.weight : healthInfo?.weight) ?? ''}
                onChange={(e) => handleHealthChange('weight', Number(e.target.value))}
                readOnly={!isEditingHealth}
                className="text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Giới tính</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.gender : healthInfo?.gender) as string}
                onChange={(e) => handleHealthChange('gender', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Tuổi</Label>
              <Input
                type="number"
                value={(isEditingHealth ? editedHealth?.age : healthInfo?.age) ?? ''}
                onChange={(e) => handleHealthChange('age', Number(e.target.value))}
                readOnly={!isEditingHealth}
                className="text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Mục tiêu tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.goal : healthInfo?.goal) as string}
                onChange={(e) => handleHealthChange('goal', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="weightLoss">Giảm cân</option>
                <option value="muscleGain">Tăng cơ</option>
                <option value="health">Sức khỏe</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Trình độ tập luyện</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.experience : healthInfo?.experience)?.toLowerCase() || 'beginner'}
                onChange={(e) => handleHealthChange('experience', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="beginner">Người mới</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Mức độ thể lực</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.fitnessLevel : healthInfo?.fitnessLevel)?.toLowerCase() || 'low'}
                onChange={(e) => handleHealthChange('fitnessLevel', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Thời gian tập ưa thích</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.preferredTime : healthInfo?.preferredTime)?.toLowerCase() || 'morning'}
                onChange={(e) => handleHealthChange('preferredTime', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="morning">Sáng</option>
                <option value="afternoon">Chiều</option>
                <option value="evening">Tối</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-sm">Số buổi tập/tuần</Label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                value={(isEditingHealth ? editedHealth?.weeklySessions : healthInfo?.weeklySessions) as string}
                onChange={(e) => handleHealthChange('weeklySessions', e.target.value)}
                disabled={!isEditingHealth}
              >
                <option value="1-2">1-2 buổi</option>
                <option value="3-4">3-4 buổi</option>
                <option value="5+">5+ buổi</option>
              </select>
            </div>

            {/* Body Composition Section */}
            <div className="md:col-span-2">
              <h4 className="text-base sm:text-sm font-semibold text-gray-700 mb-3 mt-4">Thành phần cơ thể</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">% Mỡ cơ thể</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={(isEditingHealth ? editedHealth?.bodyFatPercent : healthInfo?.bodyFatPercent) ?? ''}
                    onChange={(e) => handleHealthChange('bodyFatPercent', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Khối lượng cơ (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={(isEditingHealth ? editedHealth?.muscleMass : healthInfo?.muscleMass) ?? ''}
                    onChange={(e) => handleHealthChange('muscleMass', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Mỡ nội tạng (cấp độ)</Label>
                  <Input
                    type="number"
                    value={(isEditingHealth ? editedHealth?.visceralFatLevel : healthInfo?.visceralFatLevel) ?? ''}
                    onChange={(e) => handleHealthChange('visceralFatLevel', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">% Nước</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={(isEditingHealth ? editedHealth?.waterPercent : healthInfo?.waterPercent) ?? ''}
                    onChange={(e) => handleHealthChange('waterPercent', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Khối lượng xương (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={(isEditingHealth ? editedHealth?.boneMass : healthInfo?.boneMass) ?? ''}
                    onChange={(e) => handleHealthChange('boneMass', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Section */}
            <div className="md:col-span-2">
              <h4 className="text-base sm:text-sm font-semibold text-gray-700 mb-3 mt-4">Lối sống & Dinh dưỡng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Chế độ dinh dưỡng</Label>
                  <select
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                    value={(isEditingHealth ? editedHealth?.dietType : healthInfo?.dietType) as string || 'balanced'}
                    onChange={(e) => handleHealthChange('dietType', e.target.value)}
                    disabled={!isEditingHealth}
                  >
                    <option value="balanced">Cân bằng</option>
                    <option value="high_protein">Nhiều đạm</option>
                    <option value="low_carb">Ít tinh bột</option>
                    <option value="vegetarian">Ăn chay</option>
                    <option value="vegan">Thuần chay</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Calo/ngày</Label>
                  <Input
                    type="number"
                    value={(isEditingHealth ? editedHealth?.dailyCalories : healthInfo?.dailyCalories) ?? ''}
                    onChange={(e) => handleHealthChange('dailyCalories', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Số giờ ngủ/ngày</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={(isEditingHealth ? editedHealth?.sleepHours : healthInfo?.sleepHours) ?? ''}
                    onChange={(e) => handleHealthChange('sleepHours', Number(e.target.value))}
                    readOnly={!isEditingHealth}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Mức độ stress</Label>
                  <select
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                    value={(isEditingHealth ? editedHealth?.stressLevel : healthInfo?.stressLevel) as string || 'medium'}
                    onChange={(e) => handleHealthChange('stressLevel', e.target.value)}
                    disabled={!isEditingHealth}
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Uống rượu</Label>
                  <select
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                    value={(isEditingHealth ? editedHealth?.alcohol : healthInfo?.alcohol) as string || 'none'}
                    onChange={(e) => handleHealthChange('alcohol', e.target.value)}
                    disabled={!isEditingHealth}
                  >
                    <option value="none">Không</option>
                    <option value="occasional">Thỉnh thoảng</option>
                    <option value="frequent">Thường xuyên</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base sm:text-sm">Hút thuốc lá</Label>
                  <select
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                    value={(isEditingHealth ? (editedHealth?.smoking ? 'yes' : 'no') : (healthInfo?.smoking ? 'yes' : 'no'))}
                    onChange={(e) => handleHealthChange('smoking', e.target.value === 'yes')}
                    disabled={!isEditingHealth}
                  >
                    <option value="no">Không</option>
                    <option value="yes">Có</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-base sm:text-sm">Tiền sử bệnh lý</Label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                rows={3}
                value={(isEditingHealth ? editedHealth?.medicalHistory : healthInfo?.medicalHistory) ?? ''}
                onChange={(e) => handleHealthChange('medicalHistory', e.target.value)}
                readOnly={!isEditingHealth}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-base sm:text-sm">Dị ứng</Label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-sm"
                rows={3}
                value={(isEditingHealth ? editedHealth?.allergies : healthInfo?.allergies) ?? ''}
                onChange={(e) => handleHealthChange('allergies', e.target.value)}
                readOnly={!isEditingHealth}
              />
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}