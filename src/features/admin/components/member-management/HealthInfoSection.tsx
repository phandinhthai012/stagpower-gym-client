import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { 
  Heart,
  Activity,
  Target,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface HealthInfoData {
  _id?: string;
  height?: number;
  weight?: number;
  gender?: string;
  age?: number;
  bodyFatPercent?: number;
  medicalHistory?: string;
  allergies?: string;
  goal?: string;
  experience?: string;
  fitnessLevel?: string;
  preferredTime?: string;
  weeklySessions?: string;
  bmi?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface HealthInfoSectionProps {
  healthInfo: HealthInfoData | null;
  isLoading?: boolean;
  onEdit?: () => void;
}

export function HealthInfoSection({ healthInfo, isLoading, onEdit }: HealthInfoSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Thông tin sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Thông tin sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-500">Chưa có thông tin sức khỏe</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculateBMI = (height?: number, weight?: number) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'bg-yellow-100 text-yellow-800' };
    if (bmi < 25) return { label: 'Bình thường', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { label: 'Thừa cân', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Béo phì', color: 'bg-red-100 text-red-800' };
  };

  const getGoalLabel = (goal?: string) => {
    const goalMap: Record<string, string> = {
      'weightLoss': 'Giảm cân',
      'muscleGain': 'Tăng cơ',
      'maintenance': 'Duy trì',
      'endurance': 'Tăng sức bền',
      'flexibility': 'Tăng độ dẻo'
    };
    return goal ? goalMap[goal] || goal : 'Chưa xác định';
  };

  const getExperienceLabel = (experience?: string) => {
    const expMap: Record<string, string> = {
      'beginner': 'Mới bắt đầu',
      'intermediate': 'Trung bình',
      'advanced': 'Nâng cao'
    };
    return experience ? expMap[experience] || experience : 'Chưa xác định';
  };

  const getFitnessLevelLabel = (level?: string) => {
    const levelMap: Record<string, string> = {
      'low': 'Thấp',
      'medium': 'Trung bình',
      'high': 'Cao'
    };
    return level ? levelMap[level] || level : 'Chưa xác định';
  };

  const getPreferredTimeLabel = (time?: string) => {
    const timeMap: Record<string, string> = {
      'morning': 'Sáng sớm',
      'afternoon': 'Chiều',
      'evening': 'Tối'
    };
    return time ? timeMap[time] || time : 'Chưa xác định';
  };

  const bmi = healthInfo.bmi || (healthInfo.height && healthInfo.weight ? parseFloat(calculateBMI(healthInfo.height, healthInfo.weight) || '0') : null);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="bg-red-50/50">
        <CardTitle className="flex items-center space-x-2 text-red-900">
          <Heart className="h-5 w-5 text-red-600" />
          <span>Thông tin sức khỏe</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Body Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Chỉ số cơ thể</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Chiều cao</label>
              <p className="text-lg font-semibold text-blue-600">
                {healthInfo.height || '-'} <span className="text-sm">cm</span>
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Cân nặng</label>
              <p className="text-lg font-semibold text-green-600">
                {healthInfo.weight || '-'} <span className="text-sm">kg</span>
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">BMI</label>
              <p className="text-lg font-semibold text-purple-600">
                {bmi || '-'}
              </p>
              {bmiCategory && (
                <Badge className={`${bmiCategory.color} text-xs mt-1`}>
                  {bmiCategory.label}
                </Badge>
              )}
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">% Mỡ cơ thể</label>
              <p className="text-lg font-semibold text-orange-600">
                {healthInfo.bodyFatPercent || '-'} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Mục tiêu tập luyện</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Mục tiêu chính</label>
              <div className="mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  {getGoalLabel(healthInfo.goal)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Trình độ</label>
              <div className="mt-1">
                <Badge className="bg-purple-100 text-purple-800">
                  {getExperienceLabel(healthInfo.experience)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Thể lực hiện tại</label>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800">
                  {getFitnessLevelLabel(healthInfo.fitnessLevel)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Số buổi/tuần</label>
              <p className="text-sm text-gray-900 mt-1">
                {healthInfo.weeklySessions || 'Chưa xác định'} buổi
              </p>
            </div>
          </div>
        </div>

        {/* Training Preferences */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Thời gian ưa thích</span>
          </h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Badge className="bg-indigo-100 text-indigo-800">
              {getPreferredTimeLabel(healthInfo.preferredTime)}
            </Badge>
          </div>
        </div>

        {/* Medical History */}
        {(healthInfo.medicalHistory || healthInfo.allergies) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Lịch sử y tế</span>
            </h4>
            <div className="space-y-3">
              {healthInfo.medicalHistory && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <label className="text-xs font-medium text-yellow-800">Tiền sử bệnh</label>
                  <p className="text-sm text-gray-700 mt-1">{healthInfo.medicalHistory}</p>
                </div>
              )}
              {healthInfo.allergies && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <label className="text-xs font-medium text-red-800">Dị ứng</label>
                  <p className="text-sm text-gray-700 mt-1">{healthInfo.allergies}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {healthInfo.updatedAt && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Cập nhật lần cuối: {new Date(healthInfo.updatedAt).toLocaleDateString('vi-VN')}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

