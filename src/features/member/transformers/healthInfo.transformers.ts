import { HealthInfo } from '../api/healthInfo.api';

// Helper to handle case-insensitive enum matching
const normalizeEnum = (value: string | undefined, enumMap: Record<string, string>): string | undefined => {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  return Object.keys(enumMap).find(key => key.toLowerCase() === lower) || value;
};

export const healthInfoTransformers = {
  // Transform health info for display
  toDisplay: (healthInfo: HealthInfo) => {
    // Handle case-insensitive goal matching
    const goalMap: Record<string, string> = {
      'WeightLoss': 'Giảm cân',
      'MuscleGain': 'Tăng cơ',
      'Health': 'Sức khỏe',
      'weightloss': 'Giảm cân',
      'musclegain': 'Tăng cơ',
      'health': 'Sức khỏe'
    };
    
    const experienceMap: Record<string, string> = {
      'Beginner': 'Người mới',
      'Intermediate': 'Trung bình',
      'Advanced': 'Nâng cao',
      'beginner': 'Người mới',
      'intermediate': 'Trung bình',
      'advanced': 'Nâng cao'
    };
    
    const fitnessLevelMap: Record<string, string> = {
      'Low': 'Thấp',
      'Medium': 'Trung bình',
      'High': 'Cao',
      'low': 'Thấp',
      'medium': 'Trung bình',
      'high': 'Cao'
    };
    
    const preferredTimeMap: Record<string, string> = {
      'Morning': 'Sáng',
      'Afternoon': 'Chiều',
      'Evening': 'Tối',
      'morning': 'Sáng',
      'afternoon': 'Chiều',
      'evening': 'Tối'
    };
    
    return {
      ...healthInfo,
      bmi: healthInfo.bmi || (healthInfo.height && healthInfo.weight 
        ? Number((healthInfo.weight / ((healthInfo.height / 100) ** 2)).toFixed(1))
        : null),
      goalText: healthInfo.goal ? (goalMap[healthInfo.goal] || healthInfo.goal) : 'Chưa xác định',
      experienceText: healthInfo.experience ? (experienceMap[healthInfo.experience] || 'Chưa xác định') : 'Chưa xác định',
      fitnessLevelText: healthInfo.fitnessLevel ? (fitnessLevelMap[healthInfo.fitnessLevel] || 'Chưa xác định') : 'Chưa xác định',
      preferredTimeText: healthInfo.preferredTime ? (preferredTimeMap[healthInfo.preferredTime] || 'Chưa xác định') : 'Chưa xác định',
      weeklySessionsText: {
        '1-2': '1-2 buổi',
        '3-4': '3-4 buổi',
        '5+': '5+ buổi'
      }[healthInfo.weeklySessions || '1-2'] || 'Chưa xác định',
      healthStatusText: {
        'excellent': 'Xuất sắc',
        'good': 'Tốt',
        'fair': 'Trung bình',
        'poor': 'Yếu',
        'critical': 'Nghiêm trọng'
      }[healthInfo.healthStatus || ''] || 'Chưa đánh giá',
    };
  },

  // Transform form data to API format (lowercase enums for server)
  toApi: (formData: any) => {
    const toLowerCase = (str: string | undefined): string | undefined => {
      if (!str) return undefined;
      return str.toLowerCase();
    };
    
    return {
      height: formData.height ? Number(formData.height) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      gender: formData.gender,
      age: formData.age ? Number(formData.age) : undefined,
      bodyFatPercent: formData.bodyFatPercent ? Number(formData.bodyFatPercent) : undefined,
      muscleMass: formData.muscleMass ? Number(formData.muscleMass) : undefined,
      visceralFatLevel: formData.visceralFatLevel ? Number(formData.visceralFatLevel) : undefined,
      waterPercent: formData.waterPercent ? Number(formData.waterPercent) : undefined,
      boneMass: formData.boneMass ? Number(formData.boneMass) : undefined,
      medicalHistory: formData.medicalHistory || undefined,
      allergies: formData.allergies || undefined,
      goal: formData.goal,
      experience: toLowerCase(formData.experience),
      fitnessLevel: toLowerCase(formData.fitnessLevel),
      preferredTime: toLowerCase(formData.preferredTime),
      weeklySessions: formData.weeklySessions || undefined,
      dietType: formData.dietType,
      dailyCalories: formData.dailyCalories ? Number(formData.dailyCalories) : undefined,
      sleepHours: formData.sleepHours ? Number(formData.sleepHours) : undefined,
      stressLevel: formData.stressLevel,
      alcohol: formData.alcohol,
      smoking: formData.smoking,
    };
  },

  // Transform API data to form format
  toForm: (healthInfo: HealthInfo) => ({
    height: healthInfo.height?.toString() || '',
    weight: healthInfo.weight?.toString() || '',
    gender: healthInfo.gender || 'male',
    age: healthInfo.age?.toString() || '',
    bodyFatPercent: healthInfo.bodyFatPercent?.toString() || '',
    muscleMass: healthInfo.muscleMass?.toString() || '',
    visceralFatLevel: healthInfo.visceralFatLevel?.toString() || '',
    waterPercent: healthInfo.waterPercent?.toString() || '',
    boneMass: healthInfo.boneMass?.toString() || '',
    medicalHistory: healthInfo.medicalHistory || '',
    allergies: healthInfo.allergies || '',
    goal: healthInfo.goal || '',
    experience: healthInfo.experience || '',
    fitnessLevel: healthInfo.fitnessLevel || '',
    preferredTime: healthInfo.preferredTime || '',
    weeklySessions: healthInfo.weeklySessions || '1-2',
    dietType: healthInfo.dietType || 'balanced',
    dailyCalories: healthInfo.dailyCalories?.toString() || '',
    sleepHours: healthInfo.sleepHours?.toString() || '',
    stressLevel: healthInfo.stressLevel || 'medium',
    alcohol: healthInfo.alcohol || 'none',
    smoking: healthInfo.smoking || false,
  }),
};
