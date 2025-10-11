import { z } from 'zod';

export const userProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không được quá 100 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  photo: z.string().url('URL ảnh không hợp lệ').optional(),
  cccd: z.string().regex(/^[0-9]{9,12}$/, 'CCCD/CMND phải có 9-12 chữ số').optional(),
});

export const memberInfoSchema = z.object({
  membership_level: z.enum(['vip', 'basic']).optional(),
  is_student: z.boolean().optional(),
  total_spending: z.number().min(0, 'Tổng chi tiêu không được âm').optional(),
  membership_month: z.number().min(0, 'Số tháng thành viên không được âm').optional(),
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

export const trainerInfoSchema = z.object({
  specialty: z.string().max(200, 'Chuyên môn không được quá 200 ký tự').optional(),
  experience_years: z.number().min(0, 'Số năm kinh nghiệm không được âm').optional(),
  certificate: z.array(z.string()).optional(),
  working_hour: z.array(z.string()).optional(),
});

export const staffInfoSchema = z.object({
  brand_id: z.string().optional(),
  position: z.enum(['manager', 'trainer', 'staff', 'receptionist']).optional(),
});

export const adminInfoSchema = z.object({
  permissions: z.array(z.string()).optional(),
  managed_branches: z.array(z.string()).optional(),
});

export const updateUserProfileSchema = userProfileSchema.extend({
  'memberInfo.membership_level': z.enum(['vip', 'basic']).optional(),
  'memberInfo.is_student': z.boolean().optional(),
  'memberInfo.total_spending': z.number().min(0).optional(),
  'memberInfo.membership_month': z.number().min(0).optional(),
  'memberInfo.notes': z.string().max(500).optional(),
  'trainerInfo.specialty': z.string().max(200).optional(),
  'trainerInfo.experience_years': z.number().min(0).optional(),
  'trainerInfo.certificate': z.array(z.string()).optional(),
  'trainerInfo.working_hour': z.array(z.string()).optional(),
  'staffInfo.brand_id': z.string().optional(),
  'staffInfo.position': z.enum(['manager', 'trainer', 'staff', 'receptionist']).optional(),
  'adminInfo.permissions': z.array(z.string()).optional(),
  'adminInfo.managed_branches': z.array(z.string()).optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type MemberInfoFormData = z.infer<typeof memberInfoSchema>;
export type TrainerInfoFormData = z.infer<typeof trainerInfoSchema>;
export type StaffInfoFormData = z.infer<typeof staffInfoSchema>;
export type AdminInfoFormData = z.infer<typeof adminInfoSchema>;
export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
