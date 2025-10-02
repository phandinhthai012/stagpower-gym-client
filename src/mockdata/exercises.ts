export interface Exercise {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'Yoga';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscle_groups: string[];
  equipment: string;
  duration_minutes: number;
  calories_per_minute: number;
  video_url?: string;
  instructions: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const mockExercises: Exercise[] = [
  {
    id: '507f1f77bcf86cd799439101',
    name: 'Push-up',
    category: 'Strength',
    difficulty: 'Beginner',
    muscle_groups: ['Chest', 'Arms', 'Core'],
    equipment: 'Bodyweight',
    duration_minutes: 5,
    calories_per_minute: 8,
    video_url: 'https://youtube.com/watch?v=example1',
    instructions: 'Chống đẩy cơ bản cho ngực và tay. Bắt đầu ở tư thế plank, hạ thấp cơ thể xuống sàn và đẩy lên.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439102',
    name: 'Running',
    category: 'Cardio',
    difficulty: 'Beginner',
    muscle_groups: ['Legs', 'Full Body'],
    equipment: 'Bodyweight',
    duration_minutes: 30,
    calories_per_minute: 12,
    video_url: 'https://youtube.com/watch?v=example2',
    instructions: 'Chạy bộ tăng cường sức bền. Giữ tư thế thẳng, bước chân nhẹ nhàng và thở đều.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439103',
    name: 'Deadlift',
    category: 'Strength',
    difficulty: 'Advanced',
    muscle_groups: ['Back', 'Legs', 'Core'],
    equipment: 'Barbell',
    duration_minutes: 15,
    calories_per_minute: 10,
    video_url: 'https://youtube.com/watch?v=example3',
    instructions: 'Nâng tạ đòn cho lưng và chân. Giữ lưng thẳng, gập gối và nâng tạ từ sàn lên hông.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439104',
    name: 'Yoga Stretch',
    category: 'Yoga',
    difficulty: 'Intermediate',
    muscle_groups: ['Full Body', 'Flexibility'],
    equipment: 'Bodyweight',
    duration_minutes: 45,
    calories_per_minute: 4,
    video_url: 'https://youtube.com/watch?v=example4',
    instructions: 'Các động tác yoga cơ bản. Tập trung vào hơi thở và giữ tư thế ổn định.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439105',
    name: 'Bench Press',
    category: 'Strength',
    difficulty: 'Intermediate',
    muscle_groups: ['Chest', 'Arms', 'Shoulders'],
    equipment: 'Barbell',
    duration_minutes: 20,
    calories_per_minute: 9,
    video_url: 'https://youtube.com/watch?v=example5',
    instructions: 'Đẩy tạ đòn cho ngực. Nằm trên ghế, hạ tạ xuống ngực và đẩy lên mạnh mẽ.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439106',
    name: 'Squat',
    category: 'Strength',
    difficulty: 'Beginner',
    muscle_groups: ['Legs', 'Glutes', 'Core'],
    equipment: 'Bodyweight',
    duration_minutes: 10,
    calories_per_minute: 7,
    video_url: 'https://youtube.com/watch?v=example6',
    instructions: 'Squat cơ bản cho chân và mông. Đứng rộng bằng vai, hạ người xuống như ngồi xổm.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439107',
    name: 'Plank',
    category: 'Strength',
    difficulty: 'Beginner',
    muscle_groups: ['Core', 'Shoulders', 'Arms'],
    equipment: 'Bodyweight',
    duration_minutes: 3,
    calories_per_minute: 6,
    video_url: 'https://youtube.com/watch?v=example7',
    instructions: 'Giữ tư thế plank để tăng cường cơ bụng. Giữ cơ thể thẳng từ đầu đến chân.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439108',
    name: 'Jumping Jacks',
    category: 'Cardio',
    difficulty: 'Beginner',
    muscle_groups: ['Full Body', 'Legs'],
    equipment: 'Bodyweight',
    duration_minutes: 5,
    calories_per_minute: 10,
    video_url: 'https://youtube.com/watch?v=example8',
    instructions: 'Nhảy dang tay chân để tăng nhịp tim. Nhảy lên và dang tay chân ra ngoài đồng thời.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439109',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    muscle_groups: ['Full Body', 'Core'],
    equipment: 'Bodyweight',
    duration_minutes: 8,
    calories_per_minute: 15,
    video_url: 'https://youtube.com/watch?v=example9',
    instructions: 'Kết hợp squat, plank và nhảy. Động tác toàn thân đốt cháy nhiều calo.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439110',
    name: 'Mountain Climbers',
    category: 'Cardio',
    difficulty: 'Intermediate',
    muscle_groups: ['Core', 'Legs', 'Arms'],
    equipment: 'Bodyweight',
    duration_minutes: 6,
    calories_per_minute: 12,
    video_url: 'https://youtube.com/watch?v=example10',
    instructions: 'Chạy tại chỗ ở tư thế plank. Di chuyển chân nhanh như đang leo núi.',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Statistics helper functions
export const getExerciseStats = () => {
  const total = mockExercises.length;
  const byCategory = mockExercises.reduce((acc, exercise) => {
    acc[exercise.category] = (acc[exercise.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byDifficulty = mockExercises.reduce((acc, exercise) => {
    acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byCategory,
    byDifficulty,
    active: mockExercises.filter(e => e.status === 'Active').length,
    inactive: mockExercises.filter(e => e.status === 'Inactive').length
  };
};
