import { z } from 'zod';

export const healthInfoSchema = z.object({
  height: z.number().min(100, 'Chiều cao phải từ 100cm trở lên').max(250, 'Chiều cao không được quá 250cm'),
  weight: z.number().min(30, 'Cân nặng phải từ 30kg trở lên').max(200, 'Cân nặng không được quá 200kg'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  age: z.number().min(16, 'Tuổi phải từ 16 trở lên').max(100, 'Tuổi không được quá 100').optional(),
  bodyFatPercent: z.number().min(0, 'Tỷ lệ mỡ không được âm').max(50, 'Tỷ lệ mỡ không được quá 50%').optional(),
  medicalHistory: z.string().max(1000, 'Tiền sử bệnh lý không được quá 1000 ký tự').optional(),
  allergies: z.string().max(500, 'Thông tin dị ứng không được quá 500 ký tự').optional(),
  goal: z.enum(['WeightLoss', 'MuscleGain', 'Health'], {
    required_error: 'Vui lòng chọn mục tiêu tập luyện',
  }),
  experience: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Vui lòng chọn trình độ tập luyện',
  }),
  fitnessLevel: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Vui lòng chọn mức độ thể lực',
  }),
  preferredTime: z.enum(['Morning', 'Afternoon', 'Evening']).optional(),
  weeklySessions: z.enum(['1-2', '3-4', '5+']).optional(),
});

export const createHealthInfoSchema = healthInfoSchema;
export const updateHealthInfoSchema = healthInfoSchema.partial();

export type HealthInfoFormData = z.infer<typeof healthInfoSchema>;
export type CreateHealthInfoFormData = z.infer<typeof createHealthInfoSchema>;
export type UpdateHealthInfoFormData = z.infer<typeof updateHealthInfoSchema>;
