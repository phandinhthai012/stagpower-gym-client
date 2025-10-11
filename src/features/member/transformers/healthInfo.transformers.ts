import { HealthInfo } from '../api/healthInfo.api';

export const healthInfoTransformers = {
  // Transform health info for display
  toDisplay: (healthInfo: HealthInfo) => ({
    ...healthInfo,
    bmi: healthInfo.height && healthInfo.weight 
      ? (healthInfo.weight / ((healthInfo.height / 100) ** 2)).toFixed(1)
      : null,
    goalText: {
      WeightLoss: 'Giảm cân',
      MuscleGain: 'Tăng cơ',
      Health: 'Sức khỏe'
    }[healthInfo.goal] || 'Chưa xác định',
    experienceText: {
      Beginner: 'Người mới',
      Intermediate: 'Trung bình',
      Advanced: 'Nâng cao'
    }[healthInfo.experience] || 'Chưa xác định',
    fitnessLevelText: {
      Low: 'Thấp',
      Medium: 'Trung bình',
      High: 'Cao'
    }[healthInfo.fitnessLevel] || 'Chưa xác định',
    preferredTimeText: {
      Morning: 'Sáng',
      Afternoon: 'Chiều',
      Evening: 'Tối'
    }[healthInfo.preferredTime || 'Morning'] || 'Chưa xác định',
    weeklySessionsText: {
      '1-2': '1-2 buổi',
      '3-4': '3-4 buổi',
      '5+': '5+ buổi'
    }[healthInfo.weeklySessions || '1-2'] || 'Chưa xác định',
  }),

  // Transform form data to API format
  toApi: (formData: any) => ({
    height: Number(formData.height),
    weight: Number(formData.weight),
    gender: formData.gender,
    age: formData.age ? Number(formData.age) : undefined,
    bodyFatPercent: formData.bodyFatPercent ? Number(formData.bodyFatPercent) : undefined,
    medicalHistory: formData.medicalHistory || undefined,
    allergies: formData.allergies || undefined,
    goal: formData.goal,
    experience: formData.experience,
    fitnessLevel: formData.fitnessLevel,
    preferredTime: formData.preferredTime || undefined,
    weeklySessions: formData.weeklySessions || undefined,
  }),

  // Transform API data to form format
  toForm: (healthInfo: HealthInfo) => ({
    height: healthInfo.height?.toString() || '',
    weight: healthInfo.weight?.toString() || '',
    gender: healthInfo.gender || 'male',
    age: healthInfo.age?.toString() || '',
    bodyFatPercent: healthInfo.bodyFatPercent?.toString() || '',
    medicalHistory: healthInfo.medicalHistory || '',
    allergies: healthInfo.allergies || '',
    goal: healthInfo.goal || 'WeightLoss',
    experience: healthInfo.experience || 'Beginner',
    fitnessLevel: healthInfo.fitnessLevel || 'Low',
    preferredTime: healthInfo.preferredTime || 'Morning',
    weeklySessions: healthInfo.weeklySessions || '1-2',
  }),
};
