export interface AISuggestion {
  id: string;
  member_id: string;
  recommendation_date: string;
  goal: 'WeightLoss' | 'MuscleGain' | 'Health';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: string;
  schedule: string;
  nutrition: string;
  estimated_time: number; // weeks
  workout_duration: number; // minutes
  note: string;
  created_at: string;
  updated_at: string;
}

export const mockAISuggestions: AISuggestion[] = [
  // AI Suggestions for Nguyễn Văn An (MuscleGain, Intermediate)
  {
    id: '507f1f77bcf86cd799439161',
    member_id: '507f1f77bcf86cd799439011',
    recommendation_date: '2024-03-20',
    goal: 'MuscleGain',
    level: 'Intermediate',
    exercises: '1. Bench Press 3x8-10 reps\n2. Squats 3x8-10 reps\n3. Deadlifts 3x5 reps\n4. Pull-ups 3x6-8 reps\n5. Overhead Press 3x8-10 reps\n6. Barbell Rows 3x8-10 reps\n7. Dips 3x8-10 reps\n8. Plank 3x60 seconds',
    schedule: 'Thứ 2,4,6: Tập thân trên (Chest, Shoulders, Triceps)\nThứ 3,5,7: Tập thân dưới (Legs, Back, Biceps)\nChủ nhật: Nghỉ ngơi hoặc cardio nhẹ',
    nutrition: 'Bữa sáng: Yến mạch + trứng + chuối\nBữa trưa: Cơm + thịt gà + rau xanh\nBữa tối: Cá hồi + khoai lang + salad\nSnack: Whey protein + sữa chua\nUống 3-4 lít nước/ngày',
    estimated_time: 12,
    workout_duration: 90,
    note: 'Tập trung vào progressive overload, tăng dần trọng lượng mỗi tuần. Nghỉ ngơi đầy đủ giữa các buổi tập.',
    created_at: '2024-03-20T08:00:00Z',
    updated_at: '2024-03-20T08:00:00Z'
  },

  // AI Suggestions for Trần Thị Bình (WeightLoss, Beginner)
  {
    id: '507f1f77bcf86cd799439162',
    member_id: '507f1f77bcf86cd799439012',
    recommendation_date: '2024-03-20',
    goal: 'WeightLoss',
    level: 'Beginner',
    exercises: '1. Walking/Jogging 20-30 phút\n2. Bodyweight Squats 3x10-15 reps\n3. Push-ups (knee) 3x8-12 reps\n4. Lunges 3x10 reps mỗi chân\n5. Plank 3x30-45 giây\n6. Mountain Climbers 3x20 reps\n7. Jumping Jacks 3x30 reps\n8. Stretching 10-15 phút',
    schedule: 'Thứ 2,4,6: Cardio + Bodyweight exercises\nThứ 3,5: Đi bộ hoặc yoga nhẹ\nThứ 7: Hoạt động ngoài trời\nChủ nhật: Nghỉ ngơi hoàn toàn',
    nutrition: 'Bữa sáng: Trái cây + sữa chua ít béo\nBữa trưa: Salad + protein nạc\nBữa tối: Rau xanh + cá nướng\nSnack: Hạt hạnh nhân + táo\nTránh đồ ngọt, đồ chiên, nước ngọt',
    estimated_time: 16,
    workout_duration: 45,
    note: 'Bắt đầu từ từ, không ép bản thân quá sức. Tập trung vào việc xây dựng thói quen tập luyện đều đặn.',
    created_at: '2024-03-20T09:00:00Z',
    updated_at: '2024-03-20T09:00:00Z'
  },

  // AI Suggestions for Lê Văn Cường (Health, Advanced)
  {
    id: '507f1f77bcf86cd799439163',
    member_id: '507f1f77bcf86cd799439013',
    recommendation_date: '2024-03-20',
    goal: 'Health',
    level: 'Advanced',
    exercises: '1. Deadlifts 4x5 reps\n2. Squats 4x6-8 reps\n3. Bench Press 4x6-8 reps\n4. Pull-ups 4x8-10 reps\n5. Overhead Press 4x6-8 reps\n6. Barbell Rows 4x8-10 reps\n7. Farmer\'s Walk 3x50m\n8. Turkish Get-ups 3x5 reps mỗi bên',
    schedule: 'Thứ 2: Lower Body Power\nThứ 3: Upper Body Power\nThứ 4: Nghỉ ngơi\nThứ 5: Lower Body Hypertrophy\nThứ 6: Upper Body Hypertrophy\nThứ 7: Conditioning + Mobility\nChủ nhật: Nghỉ ngơi',
    nutrition: 'Bữa sáng: Oatmeal + protein + berries\nBữa trưa: Quinoa + thịt bò + rau xanh\nBữa tối: Cá + gạo lứt + rau củ\nPre-workout: BCAA + caffeine\nPost-workout: Whey protein + carbs\nUống 4-5 lít nước/ngày',
    estimated_time: 8,
    workout_duration: 120,
    note: 'Tập trung vào sức mạnh và sức bền. Theo dõi huyết áp thường xuyên do tiền sử cao huyết áp.',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  },

  // AI Suggestions for Phạm Thị Dung (MuscleGain, Beginner)
  {
    id: '507f1f77bcf86cd799439164',
    member_id: '507f1f77bcf86cd799439014',
    recommendation_date: '2024-03-01',
    goal: 'MuscleGain',
    level: 'Beginner',
    exercises: '1. Goblet Squats 3x10-12 reps\n2. Push-ups (wall/incline) 3x8-10 reps\n3. Dumbbell Rows 3x10-12 reps\n4. Lunges 3x8-10 reps mỗi chân\n5. Plank 3x30-45 giây\n6. Glute Bridges 3x12-15 reps\n7. Bicep Curls 3x10-12 reps\n8. Tricep Dips 3x8-10 reps',
    schedule: 'Thứ 2,4,6: Full body workout\nThứ 3,5: Cardio nhẹ hoặc yoga\nThứ 7: Hoạt động ngoài trời\nChủ nhật: Nghỉ ngơi',
    nutrition: 'Bữa sáng: Trứng + bánh mì + sữa\nBữa trưa: Cơm + thịt gà + rau\nBữa tối: Cá + khoai tây + salad\nSnack: Hạt + trái cây\nĂn đủ protein (1.2-1.6g/kg thể trọng)',
    estimated_time: 20,
    workout_duration: 60,
    note: 'Bắt đầu với trọng lượng nhẹ, tập trung vào kỹ thuật đúng. Tăng dần độ khó theo thời gian.',
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-01T11:00:00Z'
  },

  // AI Suggestions for Member with PT package (WeightLoss, Intermediate)
  {
    id: '507f1f77bcf86cd799439165',
    member_id: '507f1f77bcf86cd799439021',
    recommendation_date: '2024-03-20',
    goal: 'WeightLoss',
    level: 'Intermediate',
    exercises: '1. HIIT Cardio 20 phút\n2. Squats 4x12-15 reps\n3. Push-ups 4x10-12 reps\n4. Lunges 4x12 reps mỗi chân\n5. Plank 4x45-60 giây\n6. Burpees 3x8-10 reps\n7. Russian Twists 3x20 reps\n8. Cool-down stretching 10 phút',
    schedule: 'Thứ 2,4,6: HIIT + Strength training\nThứ 3,5: Pilates + Yoga\nThứ 7: Cardio dài (chạy bộ/đạp xe)\nChủ nhật: Nghỉ ngơi hoặc đi bộ nhẹ',
    nutrition: 'Bữa sáng: Smoothie bowl + protein\nBữa trưa: Salad + grilled chicken\nBữa tối: Fish + vegetables + quinoa\nSnack: Greek yogurt + berries\nUống 3-4 lít nước/ngày',
    estimated_time: 14,
    workout_duration: 75,
    note: 'Kết hợp với PT sessions để có kết quả tối ưu. Theo dõi tiến độ hàng tuần.',
    created_at: '2024-03-20T13:00:00Z',
    updated_at: '2024-03-20T13:00:00Z'
  },

  // AI Suggestions for another member (Health, Beginner)
  {
    id: '507f1f77bcf86cd799439166',
    member_id: '507f1f77bcf86cd799439022',
    recommendation_date: '2024-03-15',
    goal: 'Health',
    level: 'Beginner',
    exercises: '1. Walking 30 phút\n2. Bodyweight Squats 3x10 reps\n3. Wall Push-ups 3x8 reps\n4. Standing Leg Raises 3x10 reps mỗi chân\n5. Seated Knee Lifts 3x12 reps\n6. Arm Circles 3x10 reps mỗi hướng\n7. Neck Rolls 3x5 reps mỗi hướng\n8. Deep Breathing 5 phút',
    schedule: 'Thứ 2,4,6: Light cardio + stretching\nThứ 3,5: Yoga hoặc tai chi\nThứ 7: Đi bộ ngoài trời\nChủ nhật: Nghỉ ngơi hoàn toàn',
    nutrition: 'Bữa sáng: Trái cây + sữa chua\nBữa trưa: Soup + bánh mì\nBữa tối: Cá + rau luộc\nSnack: Trái cây tươi\nĂn nhiều rau xanh, tránh đồ chiên',
    estimated_time: 12,
    workout_duration: 30,
    note: 'Tập trung vào sức khỏe tổng thể và linh hoạt. Bắt đầu từ từ và tăng dần cường độ.',
    created_at: '2024-03-15T12:00:00Z',
    updated_at: '2024-03-15T12:00:00Z'
  },

  // Historical AI Suggestions
  {
    id: '507f1f77bcf86cd799439167',
    member_id: '507f1f77bcf86cd799439011',
    recommendation_date: '2024-02-20',
    goal: 'MuscleGain',
    level: 'Intermediate',
    exercises: '1. Bench Press 3x8 reps\n2. Squats 3x8 reps\n3. Deadlifts 3x5 reps\n4. Pull-ups 3x6 reps\n5. Overhead Press 3x8 reps\n6. Barbell Rows 3x8 reps\n7. Dips 3x8 reps\n8. Plank 3x45 seconds',
    schedule: 'Thứ 2,4,6: Upper body\nThứ 3,5,7: Lower body\nChủ nhật: Nghỉ ngơi',
    nutrition: 'Bữa sáng: Oatmeal + eggs + banana\nBữa trưa: Rice + chicken + vegetables\nBữa tối: Salmon + sweet potato + salad\nSnack: Whey protein + yogurt',
    estimated_time: 12,
    workout_duration: 90,
    note: 'Gợi ý cũ - đã được cập nhật với chương trình mới',
    created_at: '2024-02-20T08:00:00Z',
    updated_at: '2024-02-20T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439168',
    member_id: '507f1f77bcf86cd799439012',
    recommendation_date: '2024-02-15',
    goal: 'WeightLoss',
    level: 'Beginner',
    exercises: '1. Walking 20 phút\n2. Bodyweight Squats 3x8 reps\n3. Push-ups (knee) 3x6 reps\n4. Lunges 3x8 reps mỗi chân\n5. Plank 3x20 giây\n6. Mountain Climbers 3x15 reps\n7. Jumping Jacks 3x20 reps',
    schedule: 'Thứ 2,4,6: Cardio + exercises\nThứ 3,5: Walking\nThứ 7: Outdoor activity\nChủ nhật: Rest',
    nutrition: 'Bữa sáng: Fruit + yogurt\nBữa trưa: Salad + lean protein\nBữa tối: Grilled fish + vegetables\nSnack: Nuts + apple',
    estimated_time: 16,
    workout_duration: 40,
    note: 'Gợi ý cũ - đã được cập nhật với chương trình mới',
    created_at: '2024-02-15T09:00:00Z',
    updated_at: '2024-02-15T09:00:00Z'
  }
];
