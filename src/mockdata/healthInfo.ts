export interface HealthInfo {
  id: string;
  member_id: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  medical_history: string;
  allergies: string;
  goal: 'WeightLoss' | 'MuscleGain' | 'Health';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  fitness_level: 'Low' | 'Medium' | 'High';
  preferred_time: 'Morning' | 'Afternoon' | 'Evening';
  weekly_sessions: '1-2' | '3-4' | '5+';
  last_updated: string;
}

export const mockHealthInfo: HealthInfo[] = [
  {
    id: '507f1f77bcf86cd799439021',
    member_id: '507f1f77bcf86cd799439011', // Nguyễn Văn An
    height: 175,
    weight: 75,
    bmi: 24.5,
    gender: 'Male',
    age: 29,
    medical_history: 'Không có tiền sử bệnh lý nghiêm trọng',
    allergies: 'Không có dị ứng',
    goal: 'MuscleGain',
    experience: 'Intermediate',
    fitness_level: 'Medium',
    preferred_time: 'Evening',
    weekly_sessions: '3-4',
    last_updated: '2024-01-15T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439022',
    member_id: '507f1f77bcf86cd799439012', // Trần Thị Bình
    height: 160,
    weight: 55,
    bmi: 21.5,
    gender: 'Female',
    age: 24,
    medical_history: 'Không có tiền sử bệnh lý',
    allergies: 'Dị ứng với một số loại thực phẩm',
    goal: 'WeightLoss',
    experience: 'Beginner',
    fitness_level: 'Low',
    preferred_time: 'Afternoon',
    weekly_sessions: '1-2',
    last_updated: '2024-02-01T09:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439023',
    member_id: '507f1f77bcf86cd799439013', // Lê Văn Cường
    height: 180,
    weight: 85,
    bmi: 26.2,
    gender: 'Male',
    age: 36,
    medical_history: 'Cao huyết áp nhẹ, đang điều trị',
    allergies: 'Không có dị ứng',
    goal: 'Health',
    experience: 'Advanced',
    fitness_level: 'High',
    preferred_time: 'Morning',
    weekly_sessions: '5+',
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439024',
    member_id: '507f1f77bcf86cd799439014', // Phạm Thị Dung
    height: 165,
    weight: 60,
    bmi: 22.0,
    gender: 'Female',
    age: 32,
    medical_history: 'Không có tiền sử bệnh lý',
    allergies: 'Dị ứng với bụi phấn hoa',
    goal: 'MuscleGain',
    experience: 'Beginner',
    fitness_level: 'Low',
    preferred_time: 'Evening',
    weekly_sessions: '1-2',
    last_updated: '2024-03-01T11:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439025',
    member_id: '507f1f77bcf86cd799439020', // Member mới
    height: 170,
    weight: 70,
    bmi: 24.2,
    gender: 'Male',
    age: 28,
    medical_history: 'Không có tiền sử bệnh lý',
    allergies: 'Không có dị ứng',
    goal: 'WeightLoss',
    experience: 'Intermediate',
    fitness_level: 'Medium',
    preferred_time: 'Morning',
    weekly_sessions: '3-4',
    last_updated: '2024-03-15T12:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439026',
    member_id: '507f1f77bcf86cd799439021', // Member khác
    height: 158,
    weight: 52,
    bmi: 20.8,
    gender: 'Female',
    age: 26,
    medical_history: 'Không có tiền sử bệnh lý',
    allergies: 'Không có dị ứng',
    goal: 'Health',
    experience: 'Beginner',
    fitness_level: 'Low',
    preferred_time: 'Afternoon',
    weekly_sessions: '1-2',
    last_updated: '2024-03-10T13:00:00Z'
  }
];
