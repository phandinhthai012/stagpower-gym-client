import { z } from 'zod';

export const healthInfoSchema = z.object({
  // Basic info
  height: z.number().min(100, 'Chiều cao phải từ 100cm trở lên').max(250, 'Chiều cao không được quá 250cm').optional(),
  weight: z.number().min(30, 'Cân nặng phải từ 30kg trở lên').max(200, 'Cân nặng không được quá 200kg').optional(),
  gender: z.enum(['male', 'female']).optional(),
  age: z.number().min(1, 'Tuổi phải từ 1 trở lên').max(100, 'Tuổi không được quá 100').optional(),
  
  // Body composition
  bodyFatPercent: z.number().min(0, 'Tỷ lệ mỡ không được âm').max(100, 'Tỷ lệ mỡ không được quá 100%').optional(),
  muscleMass: z.number().min(0, 'Khối lượng cơ không được âm').optional(),
  visceralFatLevel: z.number().min(0, 'Mỡ nội tạng không được âm').optional(),
  waterPercent: z.number().min(0, 'Tỷ lệ nước không được âm').max(100, 'Tỷ lệ nước không được quá 100%').optional(),
  boneMass: z.number().min(0, 'Khối lượng xương không được âm').optional(),
  
  // Medical history
  medicalHistory: z.string().max(1000, 'Tiền sử bệnh lý không được quá 1000 ký tự').optional(),
  allergies: z.string().max(500, 'Thông tin dị ứng không được quá 500 ký tự').optional(),
  
  // Fitness goals and experience
  goal: z.string().optional(), // Allow any string value for goal
  experience: z.enum(['Beginner', 'Intermediate', 'Advanced', 'beginner', 'intermediate', 'advanced']).optional(),
  fitnessLevel: z.enum(['Low', 'Medium', 'High', 'low', 'medium', 'high']).optional(),
  preferredTime: z.enum(['Morning', 'Afternoon', 'Evening', 'morning', 'afternoon', 'evening']).optional(),
  weeklySessions: z.enum(['1-2', '3-4', '5+']).optional(),
  
  // Lifestyle
  dietType: z.enum(['balanced', 'high_protein', 'low_carb', 'vegetarian', 'vegan', 'other']).optional(),
  dailyCalories: z.number().min(800, 'Calo phải từ 800 trở lên').max(5000, 'Calo không được quá 5000').optional(),
  sleepHours: z.number().min(0, 'Số giờ ngủ không được âm').max(24, 'Số giờ ngủ không được quá 24').optional(),
  stressLevel: z.enum(['low', 'medium', 'high']).optional(),
  alcohol: z.enum(['none', 'occasional', 'frequent']).optional(),
  smoking: z.boolean().optional(),
});

export const createHealthInfoSchema = healthInfoSchema;
export const updateHealthInfoSchema = healthInfoSchema.partial();

export type HealthInfoFormData = z.infer<typeof healthInfoSchema>;
export type CreateHealthInfoFormData = z.infer<typeof createHealthInfoSchema>;
export type UpdateHealthInfoFormData = z.infer<typeof updateHealthInfoSchema>;
