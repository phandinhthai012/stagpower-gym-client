import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { 
  Heart,
  Activity,
  Target,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { HealthInfo } from '../../../member/api/healthInfo.api';
import { healthInfoUtils } from '../../../member/utils/healthInfo.utils';

interface HealthInfoSectionProps {
  healthInfo: HealthInfo | null;
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

  const bmi = healthInfo.bmi || (healthInfo.height && healthInfo.weight 
    ? parseFloat(healthInfoUtils.calculateBMI(healthInfo.height, healthInfo.weight).toFixed(1))
    : null);
  const getBMICategoryBadge = (bmi: number | null) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'bg-yellow-100 text-yellow-800' };
    if (bmi < 25) return { label: 'Bình thường', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { label: 'Thừa cân', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Béo phì', color: 'bg-red-100 text-red-800' };
  };
  const bmiCategory = bmi ? getBMICategoryBadge(bmi) : null;

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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            <div className="bg-pink-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Khối lượng cơ</label>
              <p className="text-lg font-semibold text-pink-600">
                {healthInfo.muscleMass || '-'} <span className="text-sm">kg</span>
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">% Nước</label>
              <p className="text-lg font-semibold text-indigo-600">
                {healthInfo.waterPercent || '-'} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
          
          {/* Additional Body Composition */}
          {(healthInfo.visceralFatLevel !== undefined || healthInfo.boneMass !== undefined) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {healthInfo.visceralFatLevel !== undefined && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <label className="text-xs text-gray-600">Mỡ nội tạng</label>
                  <p className="text-lg font-semibold text-yellow-600">
                    {healthInfo.visceralFatLevel} <span className="text-sm">cấp độ</span>
                  </p>
                </div>
              )}
              {healthInfo.boneMass !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs text-gray-600">Khối lượng xương</label>
                  <p className="text-lg font-semibold text-gray-600">
                    {healthInfo.boneMass} <span className="text-sm">kg</span>
                  </p>
                </div>
              )}
            </div>
          )}
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
                  {healthInfoUtils.getGoalText(healthInfo.goal)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Trình độ</label>
              <div className="mt-1">
                <Badge className="bg-purple-100 text-purple-800">
                  {healthInfoUtils.getExperienceText(healthInfo.experience)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Thể lực hiện tại</label>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800">
                  {healthInfoUtils.getFitnessLevelText(healthInfo.fitnessLevel)}
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
              {healthInfoUtils.getPreferredTimeText(healthInfo.preferredTime)}
            </Badge>
          </div>
        </div>

        {/* Health Score & Status */}
        {(healthInfo.healthScore !== undefined || healthInfo.healthStatus) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Đánh giá sức khỏe</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthInfo.healthScore !== undefined && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <label className="text-xs text-gray-600 mb-1 block">Điểm sức khỏe</label>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-blue-700">
                      {healthInfo.healthScore}
                    </p>
                    <span className="text-sm text-gray-600">/100</span>
                  </div>
                  {healthInfo.healthStatus && (
                    <Badge className={`mt-2 ${healthInfo.healthStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                      healthInfo.healthStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                      healthInfo.healthStatus === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      healthInfo.healthStatus === 'poor' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'}`}>
                      {healthInfoUtils.getHealthStatusText(healthInfo.healthStatus)}
                    </Badge>
                  )}
                </div>
              )}
              {healthInfo.healthScoreDescription && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs text-gray-600 mb-1 block">Nhận xét</label>
                  <p className="text-sm text-gray-700">{healthInfo.healthScoreDescription}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle & Nutrition */}
        {(healthInfo.dietType || healthInfo.dailyCalories !== undefined || healthInfo.sleepHours !== undefined || 
          healthInfo.stressLevel || healthInfo.alcohol || healthInfo.smoking !== undefined) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Lối sống & Dinh dưỡng</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthInfo.dietType && (
                <div>
                  <label className="text-xs text-gray-600">Chế độ dinh dưỡng</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {healthInfoUtils.getDietTypeText(healthInfo.dietType)}
                  </p>
                </div>
              )}
              {healthInfo.dailyCalories !== undefined && (
                <div>
                  <label className="text-xs text-gray-600">Calo/ngày</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {healthInfo.dailyCalories} kcal
                  </p>
                </div>
              )}
              {healthInfo.sleepHours !== undefined && (
                <div>
                  <label className="text-xs text-gray-600">Số giờ ngủ/ngày</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {healthInfo.sleepHours} giờ
                  </p>
                </div>
              )}
              {healthInfo.stressLevel && (
                <div>
                  <label className="text-xs text-gray-600">Mức độ stress</label>
                  <Badge className="bg-gray-100 text-gray-800 mt-1">
                    {healthInfoUtils.getStressLevelText(healthInfo.stressLevel)}
                  </Badge>
                </div>
              )}
              {healthInfo.alcohol && (
                <div>
                  <label className="text-xs text-gray-600">Uống rượu</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {healthInfoUtils.getAlcoholText(healthInfo.alcohol)}
                  </p>
                </div>
              )}
              {healthInfo.smoking !== undefined && (
                <div>
                  <label className="text-xs text-gray-600">Hút thuốc lá</label>
                  <Badge className={healthInfo.smoking ? 'bg-red-100 text-red-800 mt-1' : 'bg-green-100 text-green-800 mt-1'}>
                    {healthInfo.smoking ? 'Có' : 'Không'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

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

