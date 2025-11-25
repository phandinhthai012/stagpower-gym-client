import React, { useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Heart,
  Activity,
  Target,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HealthInfo } from '../api/healthInfo.api';
import { healthInfoUtils } from '../utils/healthInfo.utils';

interface HealthInfoDisplayProps {
  healthInfoList: HealthInfo[];
  isLoading?: boolean;
}

export function HealthInfoDisplay({ healthInfoList, isLoading }: HealthInfoDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!healthInfoList || healthInfoList.length === 0) {
    return (
      <div className="mb-4 sm:mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-base sm:text-sm text-blue-800 font-medium">Chưa có thông tin sức khỏe</p>
            <p className="text-base sm:text-sm text-blue-600">Hãy tạo thông tin sức khỏe để được tư vấn tốt nhất</p>
          </div>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    if (healthInfoList.length > 0) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : healthInfoList.length - 1));
    }
  };

  const goToNext = () => {
    if (healthInfoList.length > 0) {
      setSelectedIndex((prev) => (prev < healthInfoList.length - 1 ? prev + 1 : 0));
    }
  };

  const formatHealthInfoDate = (healthInfo: HealthInfo) => {
    if (healthInfo.updatedAt) {
      return new Date(healthInfo.updatedAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (healthInfo.createdAt) {
      return new Date(healthInfo.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Không có ngày';
  };

  // Ensure selectedIndex is valid
  const validIndex = Math.min(selectedIndex, healthInfoList.length - 1);
  const currentHealthInfo = healthInfoList[validIndex];
  
  if (!currentHealthInfo) {
    return (
      <div className="mb-4 sm:mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-base sm:text-sm text-blue-800 font-medium">Không có dữ liệu</p>
          </div>
        </div>
      </div>
    );
  }

  const bmi = currentHealthInfo.bmi || (currentHealthInfo.height && currentHealthInfo.weight 
    ? parseFloat(healthInfoUtils.calculateBMI(currentHealthInfo.height, currentHealthInfo.weight).toFixed(1))
    : null);
  
  const getBMICategoryBadge = (bmi: number | null) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'bg-yellow-100 text-yellow-800' };
    if (bmi < 25) return { label: 'Bình thường', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { label: 'Thừa cân', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Béo phì', color: 'bg-red-100 text-red-800' };
  };
  const bmiCategory = bmi ? getBMICategoryBadge(bmi) : null;
  const hasMultipleRecords = Array.isArray(healthInfoList) && healthInfoList.length > 1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Navigation Header - Always show if multiple records exist */}
      {hasMultipleRecords && (
        <div className="flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </Button>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center min-w-0 px-2">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {formatHealthInfoDate(currentHealthInfo)}
            </p>
            {validIndex === 0 && (
              <Badge className="bg-green-100 text-green-800 text-xs whitespace-nowrap">Mới nhất</Badge>
            )}
            <span className="text-xs text-gray-500 whitespace-nowrap">
              ({validIndex + 1} / {healthInfoList.length})
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation Dots - Always show if multiple records exist */}
      {hasMultipleRecords && (
        <div className="flex items-center justify-center gap-2">
          {healthInfoList.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === validIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Xem bản ghi ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Body Metrics */}
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>Chỉ số cơ thể</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <label className="text-xs text-gray-600">Chiều cao</label>
            <p className="text-base sm:text-lg font-semibold text-blue-600">
              {currentHealthInfo.height || '-'} <span className="text-xs sm:text-sm">cm</span>
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <label className="text-xs text-gray-600">Cân nặng</label>
            <p className="text-base sm:text-lg font-semibold text-green-600">
              {currentHealthInfo.weight || '-'} <span className="text-xs sm:text-sm">kg</span>
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <label className="text-xs text-gray-600">BMI</label>
            <p className="text-base sm:text-lg font-semibold text-purple-600">
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
            <p className="text-base sm:text-lg font-semibold text-orange-600">
              {currentHealthInfo.bodyFatPercent || '-'} <span className="text-xs sm:text-sm">%</span>
            </p>
          </div>
          {currentHealthInfo.muscleMass !== undefined && (
            <div className="bg-pink-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Khối lượng cơ</label>
              <p className="text-base sm:text-lg font-semibold text-pink-600">
                {currentHealthInfo.muscleMass} <span className="text-xs sm:text-sm">kg</span>
              </p>
            </div>
          )}
          {currentHealthInfo.waterPercent !== undefined && (
            <div className="bg-indigo-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">% Nước</label>
              <p className="text-base sm:text-lg font-semibold text-indigo-600">
                {currentHealthInfo.waterPercent} <span className="text-xs sm:text-sm">%</span>
              </p>
            </div>
          )}
          {currentHealthInfo.bodyFatMass !== undefined && (
            <div className="bg-red-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Khối lượng mỡ</label>
              <p className="text-base sm:text-lg font-semibold text-red-600">
                {currentHealthInfo.bodyFatMass} <span className="text-xs sm:text-sm">kg</span>
              </p>
            </div>
          )}
          {currentHealthInfo.basalMetabolicRate !== undefined && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <label className="text-xs text-gray-600">Tỷ lệ trao đổi chất</label>
              <p className="text-base sm:text-lg font-semibold text-orange-600">
                {currentHealthInfo.basalMetabolicRate} <span className="text-xs sm:text-sm">kcal</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fitness Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Mục tiêu tập luyện</span>
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? (
              <>
                <span className="hidden sm:inline">Thu gọn</span>
                <span className="sm:hidden">Thu gọn</span>
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Xem đầy đủ</span>
                <span className="sm:hidden">Xem thêm</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="text-xs text-gray-600">Mục tiêu chính</label>
            <div className="mt-1">
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                {healthInfoUtils.getGoalText(currentHealthInfo.goal)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600">Trình độ</label>
            <div className="mt-1">
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                {healthInfoUtils.getExperienceText(currentHealthInfo.experience)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600">Thể lực hiện tại</label>
            <div className="mt-1">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {healthInfoUtils.getFitnessLevelText(currentHealthInfo.fitnessLevel)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600">Số buổi/tuần</label>
            <p className="text-xs sm:text-sm text-gray-900 mt-1">
              {currentHealthInfo.weeklySessions || 'Chưa xác định'} buổi
            </p>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
            {/* Training Preferences */}
            {currentHealthInfo.preferredTime && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Thời gian ưa thích</span>
                </h5>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                    {healthInfoUtils.getPreferredTimeText(currentHealthInfo.preferredTime)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Additional Body Composition */}
            {(currentHealthInfo.visceralFatLevel !== undefined || currentHealthInfo.boneMass !== undefined || 
              currentHealthInfo.waistHipRatio !== undefined || currentHealthInfo.inBodyScore !== undefined) && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Thành phần cơ thể bổ sung</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentHealthInfo.visceralFatLevel !== undefined && (
                    <div className="bg-yellow-50 p-2 rounded-lg">
                      <label className="text-xs text-gray-600">Mỡ nội tạng</label>
                      <p className="text-sm font-semibold text-yellow-600">
                        {currentHealthInfo.visceralFatLevel} <span className="text-xs">cấp độ</span>
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.boneMass !== undefined && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <label className="text-xs text-gray-600">Khối lượng xương</label>
                      <p className="text-sm font-semibold text-gray-600">
                        {currentHealthInfo.boneMass} <span className="text-xs">kg</span>
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.waistHipRatio !== undefined && (
                    <div className="bg-teal-50 p-2 rounded-lg">
                      <label className="text-xs text-gray-600">Tỷ lệ vòng eo/hông</label>
                      <p className="text-sm font-semibold text-teal-600">
                        {currentHealthInfo.waistHipRatio}
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.inBodyScore !== undefined && (
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <label className="text-xs text-gray-600">Điểm InBody</label>
                      <p className="text-sm font-semibold text-purple-600">
                        {currentHealthInfo.inBodyScore} <span className="text-xs">/ 100</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Segmental Lean Analysis */}
            {currentHealthInfo.segmentalLeanAnalysis && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phân tích cơ theo vùng</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentHealthInfo.segmentalLeanAnalysis.leftArm && (
                    <div className="bg-blue-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Tay trái</label>
                      <p className="text-xs font-semibold text-blue-600">
                        {currentHealthInfo.segmentalLeanAnalysis.leftArm.mass} kg ({currentHealthInfo.segmentalLeanAnalysis.leftArm.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalLeanAnalysis.rightArm && (
                    <div className="bg-blue-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Tay phải</label>
                      <p className="text-xs font-semibold text-blue-600">
                        {currentHealthInfo.segmentalLeanAnalysis.rightArm.mass} kg ({currentHealthInfo.segmentalLeanAnalysis.rightArm.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalLeanAnalysis.leftLeg && (
                    <div className="bg-blue-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Chân trái</label>
                      <p className="text-xs font-semibold text-blue-600">
                        {currentHealthInfo.segmentalLeanAnalysis.leftLeg.mass} kg ({currentHealthInfo.segmentalLeanAnalysis.leftLeg.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalLeanAnalysis.rightLeg && (
                    <div className="bg-blue-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Chân phải</label>
                      <p className="text-xs font-semibold text-blue-600">
                        {currentHealthInfo.segmentalLeanAnalysis.rightLeg.mass} kg ({currentHealthInfo.segmentalLeanAnalysis.rightLeg.percent}%)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Segmental Fat Analysis */}
            {currentHealthInfo.segmentalFatAnalysis && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phân tích mỡ theo vùng</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentHealthInfo.segmentalFatAnalysis.leftArm && (
                    <div className="bg-red-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Tay trái</label>
                      <p className="text-xs font-semibold text-red-600">
                        {currentHealthInfo.segmentalFatAnalysis.leftArm.mass} kg ({currentHealthInfo.segmentalFatAnalysis.leftArm.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalFatAnalysis.rightArm && (
                    <div className="bg-red-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Tay phải</label>
                      <p className="text-xs font-semibold text-red-600">
                        {currentHealthInfo.segmentalFatAnalysis.rightArm.mass} kg ({currentHealthInfo.segmentalFatAnalysis.rightArm.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalFatAnalysis.trunk && (
                    <div className="bg-red-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Thân</label>
                      <p className="text-xs font-semibold text-red-600">
                        {currentHealthInfo.segmentalFatAnalysis.trunk.mass} kg ({currentHealthInfo.segmentalFatAnalysis.trunk.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalFatAnalysis.leftLeg && (
                    <div className="bg-red-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Chân trái</label>
                      <p className="text-xs font-semibold text-red-600">
                        {currentHealthInfo.segmentalFatAnalysis.leftLeg.mass} kg ({currentHealthInfo.segmentalFatAnalysis.leftLeg.percent}%)
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.segmentalFatAnalysis.rightLeg && (
                    <div className="bg-red-50 p-2 rounded">
                      <label className="text-xs text-gray-600">Chân phải</label>
                      <p className="text-xs font-semibold text-red-600">
                        {currentHealthInfo.segmentalFatAnalysis.rightLeg.mass} kg ({currentHealthInfo.segmentalFatAnalysis.rightLeg.percent}%)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle & Nutrition */}
            {(currentHealthInfo.dietType || currentHealthInfo.dailyCalories !== undefined || 
              currentHealthInfo.sleepHours !== undefined || currentHealthInfo.stressLevel || 
              currentHealthInfo.alcohol || currentHealthInfo.smoking !== undefined) && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Lối sống & Dinh dưỡng</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentHealthInfo.dietType && (
                    <div>
                      <label className="text-xs text-gray-600">Chế độ dinh dưỡng</label>
                      <p className="text-xs text-gray-900 mt-1">
                        {healthInfoUtils.getDietTypeText(currentHealthInfo.dietType)}
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.dailyCalories !== undefined && (
                    <div>
                      <label className="text-xs text-gray-600">Calo/ngày</label>
                      <p className="text-xs text-gray-900 mt-1">
                        {currentHealthInfo.dailyCalories} kcal
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.sleepHours !== undefined && (
                    <div>
                      <label className="text-xs text-gray-600">Số giờ ngủ/ngày</label>
                      <p className="text-xs text-gray-900 mt-1">
                        {currentHealthInfo.sleepHours} giờ
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.stressLevel && (
                    <div>
                      <label className="text-xs text-gray-600">Mức độ stress</label>
                      <Badge className="bg-gray-100 text-gray-800 text-xs mt-1">
                        {healthInfoUtils.getStressLevelText(currentHealthInfo.stressLevel)}
                      </Badge>
                    </div>
                  )}
                  {currentHealthInfo.alcohol && (
                    <div>
                      <label className="text-xs text-gray-600">Uống rượu</label>
                      <p className="text-xs text-gray-900 mt-1">
                        {healthInfoUtils.getAlcoholText(currentHealthInfo.alcohol)}
                      </p>
                    </div>
                  )}
                  {currentHealthInfo.smoking !== undefined && (
                    <div>
                      <label className="text-xs text-gray-600">Hút thuốc lá</label>
                      <Badge className={currentHealthInfo.smoking ? 'bg-red-100 text-red-800 text-xs mt-1' : 'bg-green-100 text-green-800 text-xs mt-1'}>
                        {currentHealthInfo.smoking ? 'Có' : 'Không'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical History */}
            {(currentHealthInfo.medicalHistory || currentHealthInfo.allergies) && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>Lịch sử y tế</span>
                </h5>
                <div className="space-y-2">
                  {currentHealthInfo.medicalHistory && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg">
                      <label className="text-xs font-medium text-yellow-800">Tiền sử bệnh</label>
                      <p className="text-xs text-gray-700 mt-1">{currentHealthInfo.medicalHistory}</p>
                    </div>
                  )}
                  {currentHealthInfo.allergies && (
                    <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                      <label className="text-xs font-medium text-red-800">Dị ứng</label>
                      <p className="text-xs text-gray-700 mt-1">{currentHealthInfo.allergies}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Age & Gender */}
            {(currentHealthInfo.age !== undefined || currentHealthInfo.gender) && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Thông tin cá nhân</h5>
                <div className="grid grid-cols-2 gap-3">
                  {currentHealthInfo.age !== undefined && (
                    <div>
                      <label className="text-xs text-gray-600">Tuổi</label>
                      <p className="text-xs text-gray-900 mt-1">{currentHealthInfo.age} tuổi</p>
                    </div>
                  )}
                  {currentHealthInfo.gender && (
                    <div>
                      <label className="text-xs text-gray-600">Giới tính</label>
                      <p className="text-xs text-gray-900 mt-1">
                        {currentHealthInfo.gender === 'male' ? 'Nam' : currentHealthInfo.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Health Score & Status */}
      {(currentHealthInfo.healthScore !== undefined || currentHealthInfo.healthStatus) && (
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Đánh giá sức khỏe</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentHealthInfo.healthScore !== undefined && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <label className="text-xs text-gray-600 mb-1 block">Điểm sức khỏe</label>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl sm:text-2xl font-bold text-blue-700">
                    {currentHealthInfo.healthScore}
                  </p>
                  <span className="text-xs sm:text-sm text-gray-600">/100</span>
                </div>
                {currentHealthInfo.healthStatus && (
                  <Badge className={`mt-2 text-xs ${
                    currentHealthInfo.healthStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    currentHealthInfo.healthStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                    currentHealthInfo.healthStatus === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    currentHealthInfo.healthStatus === 'poor' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {healthInfoUtils.getHealthStatusText(currentHealthInfo.healthStatus)}
                  </Badge>
                )}
              </div>
            )}
            {currentHealthInfo.healthScoreDescription && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                <label className="text-xs text-gray-600 mb-1 block">Nhận xét</label>
                <p className="text-xs sm:text-sm text-gray-700">{currentHealthInfo.healthScoreDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Updated */}
      {currentHealthInfo.updatedAt && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Cập nhật lần cuối: {new Date(currentHealthInfo.updatedAt).toLocaleDateString('vi-VN')}</span>
          </p>
        </div>
      )}
    </div>
  );
}

