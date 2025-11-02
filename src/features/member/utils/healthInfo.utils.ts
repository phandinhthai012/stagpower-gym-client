import { HealthInfo } from '../api/healthInfo.api';

export const healthInfoUtils = {
  // Calculate BMI
  calculateBMI: (height: number, weight: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  },

  // Get BMI category
  getBMICategory: (bmi: number): string => {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường';
    if (bmi < 30) return 'Thừa cân';
    return 'Béo phì';
  },

  // Get BMI color
  getBMIColor: (bmi: number): string => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Get goal text (handle both PascalCase and lowercase)
  getGoalText: (goal?: string): string => {
    if (!goal) return 'Chưa xác định';
    const goalMap: Record<string, string> = {
      WeightLoss: 'Giảm cân',
      MuscleGain: 'Tăng cơ',
      Health: 'Sức khỏe',
      weightloss: 'Giảm cân',
      musclegain: 'Tăng cơ',
      health: 'Sức khỏe'
    };
    const lower = goal.toLowerCase();
    return goalMap[goal] || goalMap[lower] || goal;
  },

  // Get experience text (handle both PascalCase and lowercase)
  getExperienceText: (experience?: string): string => {
    if (!experience) return 'Chưa xác định';
    const experienceMap: Record<string, string> = {
      Beginner: 'Người mới',
      Intermediate: 'Trung bình',
      Advanced: 'Nâng cao',
      beginner: 'Người mới',
      intermediate: 'Trung bình',
      advanced: 'Nâng cao'
    };
    const lower = experience.toLowerCase();
    return experienceMap[experience] || experienceMap[lower] || experience;
  },

  // Get fitness level text (handle both PascalCase and lowercase)
  getFitnessLevelText: (fitnessLevel?: string): string => {
    if (!fitnessLevel) return 'Chưa xác định';
    const fitnessMap: Record<string, string> = {
      Low: 'Thấp',
      Medium: 'Trung bình',
      High: 'Cao',
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    };
    const lower = fitnessLevel.toLowerCase();
    return fitnessMap[fitnessLevel] || fitnessMap[lower] || fitnessLevel;
  },

  // Get preferred time text (handle both PascalCase and lowercase)
  getPreferredTimeText: (preferredTime?: string): string => {
    if (!preferredTime) return 'Chưa xác định';
    const timeMap: Record<string, string> = {
      Morning: 'Sáng',
      Afternoon: 'Chiều',
      Evening: 'Tối',
      morning: 'Sáng',
      afternoon: 'Chiều',
      evening: 'Tối'
    };
    const lower = preferredTime.toLowerCase();
    return timeMap[preferredTime] || timeMap[lower] || preferredTime;
  },

  // Get weekly sessions text
  getWeeklySessionsText: (weeklySessions: string): string => {
    const sessionsMap: Record<string, string> = {
      '1-2': '1-2 buổi',
      '3-4': '3-4 buổi',
      '5+': '5+ buổi'
    };
    return sessionsMap[weeklySessions] || 'Chưa xác định';
  },

  // Validate health info
  validateHealthInfo: (healthInfo: Partial<HealthInfo>): string[] => {
    const errors: string[] = [];

    if (!healthInfo.height || healthInfo.height < 100 || healthInfo.height > 250) {
      errors.push('Chiều cao phải từ 100cm đến 250cm');
    }

    if (!healthInfo.weight || healthInfo.weight < 30 || healthInfo.weight > 200) {
      errors.push('Cân nặng phải từ 30kg đến 200kg');
    }

    if (!healthInfo.goal) {
      errors.push('Vui lòng chọn mục tiêu tập luyện');
    }

    if (!healthInfo.experience) {
      errors.push('Vui lòng chọn trình độ tập luyện');
    }

    if (!healthInfo.fitnessLevel) {
      errors.push('Vui lòng chọn mức độ thể lực');
    }

    return errors;
  },

  // Get health status text
  getHealthStatusText: (healthStatus?: string): string => {
    if (!healthStatus) return 'Chưa đánh giá';
    const statusMap: Record<string, string> = {
      excellent: 'Xuất sắc',
      good: 'Tốt',
      fair: 'Trung bình',
      poor: 'Yếu',
      critical: 'Nghiêm trọng'
    };
    return statusMap[healthStatus.toLowerCase()] || healthStatus;
  },

  // Get diet type text
  getDietTypeText: (dietType?: string): string => {
    if (!dietType) return 'Chưa xác định';
    const dietMap: Record<string, string> = {
      balanced: 'Cân bằng',
      high_protein: 'Nhiều đạm',
      low_carb: 'Ít tinh bột',
      vegetarian: 'Ăn chay',
      vegan: 'Thuần chay',
      other: 'Khác'
    };
    return dietMap[dietType.toLowerCase()] || dietType;
  },

  // Get stress level text
  getStressLevelText: (stressLevel?: string): string => {
    if (!stressLevel) return 'Chưa xác định';
    const stressMap: Record<string, string> = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    };
    return stressMap[stressLevel.toLowerCase()] || stressLevel;
  },

  // Get alcohol text
  getAlcoholText: (alcohol?: string): string => {
    if (!alcohol) return 'Chưa xác định';
    const alcoholMap: Record<string, string> = {
      none: 'Không',
      occasional: 'Thỉnh thoảng',
      frequent: 'Thường xuyên'
    };
    return alcoholMap[alcohol.toLowerCase()] || alcohol;
  },

  // Get health info summary
  getHealthInfoSummary: (healthInfo: HealthInfo) => {
    const bmi = healthInfo.bmi || healthInfoUtils.calculateBMI(healthInfo.height || 0, healthInfo.weight || 0);
    const bmiCategory = bmi ? healthInfoUtils.getBMICategory(bmi) : 'Chưa xác định';
    
    return {
      bmi,
      bmiCategory,
      bmiColor: bmi ? healthInfoUtils.getBMIColor(bmi) : 'text-gray-600',
      goalText: healthInfoUtils.getGoalText(healthInfo.goal),
      experienceText: healthInfoUtils.getExperienceText(healthInfo.experience),
      fitnessLevelText: healthInfoUtils.getFitnessLevelText(healthInfo.fitnessLevel),
      preferredTimeText: healthInfoUtils.getPreferredTimeText(healthInfo.preferredTime),
      weeklySessionsText: healthInfoUtils.getWeeklySessionsText(healthInfo.weeklySessions || '1-2'),
      healthStatusText: healthInfoUtils.getHealthStatusText(healthInfo.healthStatus),
      healthScore: healthInfo.healthScore,
    };
  },
};
