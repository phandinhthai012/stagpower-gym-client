import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
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
  FileText,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  Clock,
  Target,
  Activity
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
    
    // Health info - only manual input fields
    medical_history: '',
    allergies: '',
    goal: '',
    experience: '',
    fitness_level: '',
    preferred_time: '',
    weekly_sessions: '',
    dietType: '',
    dailyCalories: '',
    sleepHours: '',
    stressLevel: '',
    alcohol: '',
    smoking: ''
  });

  // Import file state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importedHealthData, setImportedHealthData] = useState<any>(null);

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
          toast.success('Đọc file thành công!', {
            description: 'Dữ liệu sẽ được import khi tạo hội viên.',
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

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
    // Don't clear parsedData here - it will be used to populate importedHealthData
  };

  const handleConfirmImport = () => {
    if (parsedData && parsedData.isValid && parsedData.data) {
      // Save imported data to state for editing
      setImportedHealthData(parsedData.data);
      // Also update form fields that match (goal, experience, etc.)
      const data = parsedData.data;
      if (data.goal) handleInputChange('goal', data.goal);
      if (data.experience) {
        const experience = typeof data.experience === 'string' 
          ? data.experience.charAt(0).toUpperCase() + data.experience.slice(1).toLowerCase()
          : data.experience;
        handleInputChange('experience', experience);
      }
      if (data.fitnessLevel) {
        const fitnessLevel = typeof data.fitnessLevel === 'string'
          ? data.fitnessLevel.charAt(0).toUpperCase() + data.fitnessLevel.slice(1).toLowerCase()
          : data.fitnessLevel;
        handleInputChange('fitness_level', fitnessLevel);
      }
      if (data.preferredTime) {
        const preferredTime = typeof data.preferredTime === 'string'
          ? data.preferredTime.charAt(0).toUpperCase() + data.preferredTime.slice(1).toLowerCase()
          : data.preferredTime;
        handleInputChange('preferred_time', preferredTime);
      }
      if (data.weeklySessions) handleInputChange('weekly_sessions', data.weeklySessions);
      if (data.dietType) handleInputChange('dietType', data.dietType);
      if (data.dailyCalories) handleInputChange('dailyCalories', String(data.dailyCalories));
      if (data.sleepHours) handleInputChange('sleepHours', String(data.sleepHours));
      if (data.stressLevel) handleInputChange('stressLevel', data.stressLevel);
      if (data.alcohol) handleInputChange('alcohol', data.alcohol);
      if (data.smoking !== undefined && data.smoking !== null) {
        handleInputChange('smoking', data.smoking ? 'yes' : 'no');
      }
      if (data.medicalHistory) handleInputChange('medical_history', data.medicalHistory);
      if (data.allergies) handleInputChange('allergies', data.allergies);
      
      // Close dialog
      setIsImportDialogOpen(false);
      toast.success('Đã import dữ liệu thành công!', {
        description: 'Bạn có thể chỉnh sửa thông tin trước khi tạo hội viên.',
      });
    }
  };

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
              autoComplete="123456"
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
    <div className="space-y-6">
      {/* Import File Section */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-purple-50/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-900">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              <span>Import Thông Tin Sức Khỏe</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Import button clicked, opening dialog');
                setIsImportDialogOpen(true);
              }}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import File
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {importedHealthData ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900 text-sm">Dữ liệu đã được import</h4>
                      <p className="text-xs text-green-700">
                        {importFile?.name} - Bạn có thể chỉnh sửa thông tin bên dưới
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImportFile(null);
                      setParsedData(null);
                      setImportedHealthData(null);
                    }}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Xóa
                  </Button>
                </div>
              </div>

              {/* Editable Imported Data */}
              <div className="space-y-4">
                {/* Body Metrics */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Chỉ số cơ thể
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {importedHealthData.height !== undefined && importedHealthData.height !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Chiều cao (cm)</Label>
                        <Input
                          type="number"
                          min="100"
                          max="250"
                          step="0.0001"
                          value={importedHealthData.height || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            height: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.weight !== undefined && importedHealthData.weight !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Cân nặng (kg)</Label>
                        <Input
                          type="number"
                          min="30"
                          max="300"
                          step="0.0001"
                          value={importedHealthData.weight || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            weight: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.age !== undefined && importedHealthData.age !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Tuổi</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={importedHealthData.age || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            age: e.target.value ? parseInt(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.bodyFatPercent !== undefined && importedHealthData.bodyFatPercent !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">% Mỡ cơ thể</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.0001"
                          value={importedHealthData.bodyFatPercent || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            bodyFatPercent: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.muscleMass !== undefined && importedHealthData.muscleMass !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Khối lượng cơ (kg)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          value={importedHealthData.muscleMass || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            muscleMass: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.waterPercent !== undefined && importedHealthData.waterPercent !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">% Nước</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.0001"
                          value={importedHealthData.waterPercent || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            waterPercent: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.visceralFatLevel !== undefined && importedHealthData.visceralFatLevel !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Mỡ nội tạng (cấp độ)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          value={importedHealthData.visceralFatLevel || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            visceralFatLevel: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.boneMass !== undefined && importedHealthData.boneMass !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Khối lượng xương (kg)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          value={importedHealthData.boneMass || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            boneMass: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {importedHealthData.bodyFatMass !== undefined && importedHealthData.bodyFatMass !== null && (
                      <div>
                        <Label className="text-xs text-gray-600">Khối lượng mỡ (kg)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          value={importedHealthData.bodyFatMass || ''}
                          onChange={(e) => setImportedHealthData({
                            ...importedHealthData,
                            bodyFatMass: e.target.value ? parseFloat(e.target.value) : null
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* InBody Analysis */}
                {(importedHealthData.basalMetabolicRate !== undefined || importedHealthData.waistHipRatio !== undefined || 
                  importedHealthData.inBodyScore !== undefined) && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Phân tích InBody
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {importedHealthData.basalMetabolicRate !== undefined && importedHealthData.basalMetabolicRate !== null && (
                        <div>
                          <Label className="text-xs text-gray-600">Tỷ lệ trao đổi chất (kcal)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.0001"
                            value={importedHealthData.basalMetabolicRate || ''}
                            onChange={(e) => setImportedHealthData({
                              ...importedHealthData,
                              basalMetabolicRate: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            className="mt-1"
                          />
                        </div>
                      )}
                      {importedHealthData.waistHipRatio !== undefined && importedHealthData.waistHipRatio !== null && (
                        <div>
                          <Label className="text-xs text-gray-600">Tỷ lệ vòng eo/hông</Label>
                          <Input
                            type="number"
                            min="0"
                            max="3"
                            step="0.0001"
                            value={importedHealthData.waistHipRatio || ''}
                            onChange={(e) => setImportedHealthData({
                              ...importedHealthData,
                              waistHipRatio: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            className="mt-1"
                          />
                        </div>
                      )}
                      {importedHealthData.inBodyScore !== undefined && importedHealthData.inBodyScore !== null && (
                        <div>
                          <Label className="text-xs text-gray-600">Điểm InBody</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.0001"
                            value={importedHealthData.inBodyScore || ''}
                            onChange={(e) => setImportedHealthData({
                              ...importedHealthData,
                              inBodyScore: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Segmental Lean Analysis */}
                {importedHealthData.segmentalLeanAnalysis && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Phân tích cơ theo vùng
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['leftArm', 'rightArm', 'leftLeg', 'rightLeg'].map((limb) => {
                        const limbData = importedHealthData.segmentalLeanAnalysis?.[limb];
                        if (!limbData) return null;
                        const labels: Record<string, string> = {
                          leftArm: 'Tay trái',
                          rightArm: 'Tay phải',
                          leftLeg: 'Chân trái',
                          rightLeg: 'Chân phải'
                        };
                        return (
                          <div key={limb} className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                            <Label className="text-xs font-medium text-gray-700 mb-2 block">{labels[limb]}</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-gray-600">Khối lượng (kg)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.0001"
                                  value={limbData.mass || ''}
                                  onChange={(e) => setImportedHealthData({
                                    ...importedHealthData,
                                    segmentalLeanAnalysis: {
                                      ...importedHealthData.segmentalLeanAnalysis,
                                      [limb]: {
                                        ...limbData,
                                        mass: e.target.value ? parseFloat(e.target.value) : null
                                      }
                                    }
                                  })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">%</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.0001"
                                  value={limbData.percent || ''}
                                  onChange={(e) => setImportedHealthData({
                                    ...importedHealthData,
                                    segmentalLeanAnalysis: {
                                      ...importedHealthData.segmentalLeanAnalysis,
                                      [limb]: {
                                        ...limbData,
                                        percent: e.target.value ? parseFloat(e.target.value) : null
                                      }
                                    }
                                  })}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Segmental Fat Analysis */}
                {importedHealthData.segmentalFatAnalysis && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Phân tích mỡ theo vùng
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['leftArm', 'rightArm', 'trunk', 'leftLeg', 'rightLeg'].map((limb) => {
                        const limbData = importedHealthData.segmentalFatAnalysis?.[limb];
                        if (!limbData) return null;
                        const labels: Record<string, string> = {
                          leftArm: 'Tay trái',
                          rightArm: 'Tay phải',
                          trunk: 'Thân',
                          leftLeg: 'Chân trái',
                          rightLeg: 'Chân phải'
                        };
                        return (
                          <div key={limb} className="border border-red-200 rounded-lg p-3 bg-red-50/30">
                            <Label className="text-xs font-medium text-gray-700 mb-2 block">{labels[limb]}</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-gray-600">Khối lượng (kg)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.0001"
                                  value={limbData.mass || ''}
                                  onChange={(e) => setImportedHealthData({
                                    ...importedHealthData,
                                    segmentalFatAnalysis: {
                                      ...importedHealthData.segmentalFatAnalysis,
                                      [limb]: {
                                        ...limbData,
                                        mass: e.target.value ? parseFloat(e.target.value) : null
                                      }
                                    }
                                  })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">%</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.0001"
                                  value={limbData.percent || ''}
                                  onChange={(e) => setImportedHealthData({
                                    ...importedHealthData,
                                    segmentalFatAnalysis: {
                                      ...importedHealthData.segmentalFatAnalysis,
                                      [limb]: {
                                        ...limbData,
                                        percent: e.target.value ? parseFloat(e.target.value) : null
                                      }
                                    }
                                  })}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : parsedData && parsedData.isValid ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">File đã được đọc thành công</h4>
                  <p className="text-sm text-green-700">
                    {importFile?.name} - Nhấn &quot;Xác nhận&quot; trong dialog để import dữ liệu
                  </p>
                </div>
              </div>
            </div>
          ) : parsedData && !parsedData.isValid ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">File có lỗi</h4>
                  <ul className="space-y-1">
                    {parsedData.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-800">• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">Chưa có file được import</p>
              <p className="text-xs mt-1">Nhấn &quot;Import File&quot; để tải lên file Excel hoặc PDF</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Input Fields */}
      <div className="space-y-6">
        {/* Fitness Goals */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Mục tiêu tập luyện
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* Lifestyle & Nutrition */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Lối sống & Dinh dưỡng
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dietType">Chế độ dinh dưỡng</Label>
              <Select value={formData.dietType} onValueChange={(value) => handleInputChange('dietType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectItem value="balanced">Cân bằng</SelectItem>
                  <SelectItem value="high_protein">Nhiều đạm</SelectItem>
                  <SelectItem value="low_carb">Ít tinh bột</SelectItem>
                  <SelectItem value="vegetarian">Ăn chay</SelectItem>
                  <SelectItem value="vegan">Thuần chay</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyCalories">Calo/ngày</Label>
              <Input
                id="dailyCalories"
                type="number"
                min="800"
                max="5000"
                step="0.0001"
                value={formData.dailyCalories}
                onChange={(e) => handleInputChange('dailyCalories', e.target.value)}
                placeholder="VD: 2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepHours">Số giờ ngủ/ngày</Label>
              <Input
                id="sleepHours"
                type="number"
                min="0"
                max="24"
                step="0.0001"
                value={formData.sleepHours}
                onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                placeholder="VD: 7.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stressLevel">Mức độ stress</Label>
              <Select value={formData.stressLevel} onValueChange={(value) => handleInputChange('stressLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcohol">Uống rượu</Label>
              <Select value={formData.alcohol} onValueChange={(value) => handleInputChange('alcohol', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tần suất" />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectItem value="none">Không</SelectItem>
                  <SelectItem value="occasional">Thỉnh thoảng</SelectItem>
                  <SelectItem value="frequent">Thường xuyên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoking">Hút thuốc lá</Label>
              <Select value={formData.smoking} onValueChange={(value) => handleInputChange('smoking', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectItem value="no">Không</SelectItem>
                  <SelectItem value="yes">Có</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Medical History & Allergies */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Lịch sử y tế
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medical_history">Tiền sử bệnh lý</Label>
              <Textarea
                id="medical_history"
                value={formData.medical_history}
                onChange={(e) => handleInputChange('medical_history', e.target.value)}
                placeholder="Mô tả tiền sử bệnh lý (nếu có)..."
                rows={2}
                maxLength={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Dị ứng</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="Mô tả các loại dị ứng (nếu có)..."
                rows={2}
                maxLength={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [formData, errors, handleInputChange, parsedData, importFile, isImportDialogOpen, importedHealthData]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const memberData = {
        // Basic user info
        role: 'member',
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.date_of_birth ? new Date(formData.date_of_birth) : undefined,
        password: formData.password,
        cccd: formData.cccd.trim() || undefined,
        status: 'active',
        
        // Member specific info
        memberInfo: {
          membership_level: formData.membership_level.toLowerCase(),
          is_student: formData.is_hssv,
          current_brand_id: formData.current_branch_id || null,
          notes: formData.notes.trim(),
          total_spending: 0,
          membership_month: 0
          // Note: qr_code is not set here - it will be null by default on backend
          // and can be generated later when needed
        }
      };

      // Call API to create member
      const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE_USER, memberData);
      
      if (response.data.success) {
        toast.success('Tạo hội viên thành công!');
        
        const createdMember = response.data.data;

        // Create health info if provided (from imported data, parsed file, or manual input)
        try {
          const healthInfoData: any = {};
          
          // Priority: importedHealthData (edited) > parsedData > formData
          if (importedHealthData) {
            // Use imported and edited data
            Object.assign(healthInfoData, importedHealthData);
            // Override with form data for fields that can be edited manually
            if (formData.goal) healthInfoData.goal = formData.goal;
            if (formData.experience) healthInfoData.experience = formData.experience.toLowerCase();
            if (formData.fitness_level) healthInfoData.fitnessLevel = formData.fitness_level.toLowerCase();
            if (formData.preferred_time) healthInfoData.preferredTime = formData.preferred_time.toLowerCase();
            if (formData.weekly_sessions) healthInfoData.weeklySessions = formData.weekly_sessions;
            if (formData.dietType) healthInfoData.dietType = formData.dietType;
            if (formData.dailyCalories) healthInfoData.dailyCalories = Number(formData.dailyCalories);
            if (formData.sleepHours) healthInfoData.sleepHours = Number(formData.sleepHours);
            if (formData.stressLevel) healthInfoData.stressLevel = formData.stressLevel;
            if (formData.alcohol) healthInfoData.alcohol = formData.alcohol;
            if (formData.smoking) healthInfoData.smoking = formData.smoking === 'yes';
          } else if (parsedData && parsedData.isValid && parsedData.data) {
            // Use parsed data from file (if not yet imported)
            Object.assign(healthInfoData, parsedData.data);
            // Add manual input fields
            if (formData.goal) healthInfoData.goal = formData.goal;
            if (formData.experience) healthInfoData.experience = formData.experience.toLowerCase();
            if (formData.fitness_level) healthInfoData.fitnessLevel = formData.fitness_level.toLowerCase();
            if (formData.preferred_time) healthInfoData.preferredTime = formData.preferred_time.toLowerCase();
            if (formData.weekly_sessions) healthInfoData.weeklySessions = formData.weekly_sessions;
            if (formData.dietType) healthInfoData.dietType = formData.dietType;
            if (formData.dailyCalories) healthInfoData.dailyCalories = Number(formData.dailyCalories);
            if (formData.sleepHours) healthInfoData.sleepHours = Number(formData.sleepHours);
            if (formData.stressLevel) healthInfoData.stressLevel = formData.stressLevel;
            if (formData.alcohol) healthInfoData.alcohol = formData.alcohol;
            if (formData.smoking) healthInfoData.smoking = formData.smoking === 'yes';
          } else {
            // Use manual input data only
            if (formData.goal) healthInfoData.goal = formData.goal;
            if (formData.experience) healthInfoData.experience = formData.experience.toLowerCase();
            if (formData.fitness_level) healthInfoData.fitnessLevel = formData.fitness_level.toLowerCase();
            if (formData.preferred_time) healthInfoData.preferredTime = formData.preferred_time.toLowerCase();
            if (formData.weekly_sessions) healthInfoData.weeklySessions = formData.weekly_sessions;
            if (formData.dietType) healthInfoData.dietType = formData.dietType;
            if (formData.dailyCalories) healthInfoData.dailyCalories = Number(formData.dailyCalories);
            if (formData.sleepHours) healthInfoData.sleepHours = Number(formData.sleepHours);
            if (formData.stressLevel) healthInfoData.stressLevel = formData.stressLevel;
            if (formData.alcohol) healthInfoData.alcohol = formData.alcohol;
            if (formData.smoking) healthInfoData.smoking = formData.smoking === 'yes';
          }
          
          // Always add medical history and allergies from form (can override imported data)
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
          medical_history: '',
          allergies: '',
          goal: '',
          experience: '',
          fitness_level: '',
          preferred_time: '',
          weekly_sessions: '',
          dietType: '',
          dailyCalories: '',
          sleepHours: '',
          stressLevel: '',
          alcohol: '',
          smoking: ''
        });
        setImportFile(null);
        setParsedData(null);
        setImportedHealthData(null);
        
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Tạo hội viên thất bại');
      }
      
    } catch (error: any) {
      console.error('Error creating member:', error);
      
      // Handle specific error cases
      let errorMessage = 'Có lỗi xảy ra khi tạo hội viên';
      if (error?.response?.status === 409) {
        const backendMsg = error?.response?.data?.message || '';
        if (backendMsg.includes('qr_code') || backendMsg.includes('QR')) {
          errorMessage = 'Đã xảy ra lỗi khi tạo mã QR. Vui lòng thử lại.';
        } else if (backendMsg.includes('Email') || backendMsg.includes('email')) {
          errorMessage = 'Email này đã tồn tại trong hệ thống';
        } else if (backendMsg.includes('Phone') || backendMsg.includes('phone')) {
          errorMessage = 'Số điện thoại này đã được sử dụng';
        } else if (backendMsg.includes('CCCD')) {
          errorMessage = 'CCCD này đã được sử dụng';
        } else {
          errorMessage = backendMsg || 'Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.';
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error('Tạo hội viên thất bại', {
        description: errorMessage,
        duration: 5000,
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

      {/* Import Dialog */}
      {isImportDialogOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40">
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
                      Import file thông tin sức khỏe
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
                        <p className="text-sm text-green-700">Sẵn sàng import</p>
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
                      onClick={handleConfirmImport}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Xác nhận
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
