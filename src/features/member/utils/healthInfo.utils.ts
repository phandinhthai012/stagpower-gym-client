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

  // Get goal text
  getGoalText: (goal: string): string => {
    const goalMap: Record<string, string> = {
      WeightLoss: 'Giảm cân',
      MuscleGain: 'Tăng cơ',
      Health: 'Sức khỏe'
    };
    return goalMap[goal] || 'Chưa xác định';
  },

  // Get experience text
  getExperienceText: (experience: string): string => {
    const experienceMap: Record<string, string> = {
      Beginner: 'Người mới',
      Intermediate: 'Trung bình',
      Advanced: 'Nâng cao'
    };
    return experienceMap[experience] || 'Chưa xác định';
  },

  // Get fitness level text
  getFitnessLevelText: (fitnessLevel: string): string => {
    const fitnessMap: Record<string, string> = {
      Low: 'Thấp',
      Medium: 'Trung bình',
      High: 'Cao'
    };
    return fitnessMap[fitnessLevel] || 'Chưa xác định';
  },

  // Get preferred time text
  getPreferredTimeText: (preferredTime: string): string => {
    const timeMap: Record<string, string> = {
      Morning: 'Sáng',
      Afternoon: 'Chiều',
      Evening: 'Tối'
    };
    return timeMap[preferredTime] || 'Chưa xác định';
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

  // Get health info summary
  getHealthInfoSummary: (healthInfo: HealthInfo) => {
    const bmi = healthInfoUtils.calculateBMI(healthInfo.height, healthInfo.weight);
    const bmiCategory = healthInfoUtils.getBMICategory(bmi);
    
    return {
      bmi,
      bmiCategory,
      bmiColor: healthInfoUtils.getBMIColor(bmi),
      goalText: healthInfoUtils.getGoalText(healthInfo.goal),
      experienceText: healthInfoUtils.getExperienceText(healthInfo.experience),
      fitnessLevelText: healthInfoUtils.getFitnessLevelText(healthInfo.fitnessLevel),
      preferredTimeText: healthInfoUtils.getPreferredTimeText(healthInfo.preferredTime || 'Morning'),
      weeklySessionsText: healthInfoUtils.getWeeklySessionsText(healthInfo.weeklySessions || '1-2'),
    };
  },
};
