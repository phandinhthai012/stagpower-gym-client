export interface Exercise {
  _id: string;
  name: string;
  description: string;
  instructions: string;
  tips: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'FullBody' | 'Flexibility' | 'Balance';
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  duration?: number; // phút
  equipment: string;
  sets: number;
  reps: number;
  weight: number; // kg
  restTime: number; // phút
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockExercises: Exercise[] = [
  // CHEST EXERCISES
  {
    _id: 'ex_001',
    name: 'Push-ups',
    description: 'Bài tập cơ bản cho ngực, vai và tay',
    instructions: 'Nằm sấp, đặt tay rộng bằng vai, nâng người lên xuống bằng cách co duỗi tay',
    tips: 'Giữ lưng thẳng, hít vào khi hạ xuống, thở ra khi đẩy lên',
    category: 'Chest',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 15,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_002',
    name: 'Bench Press',
    description: 'Bài tập ngực với tạ đòn',
    instructions: 'Nằm trên ghế, nâng tạ từ ngực lên cao, sau đó hạ xuống',
    tips: 'Kiểm soát trọng lượng, không nâng quá nặng',
    category: 'Chest',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
    equipment: 'Barbell',
    sets: 4,
    reps: 8,
    weight: 60,
    restTime: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_003',
    name: 'Dumbbell Flyes',
    description: 'Bài tập ngực với tạ đơn',
    instructions: 'Nằm trên ghế, cầm tạ đơn, mở rộng tay ra hai bên rồi đưa lại',
    tips: 'Giữ khuỷu tay hơi cong, cảm nhận cơ ngực căng',
    category: 'Chest',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Pectoralis Major'],
    equipment: 'Dumbbell',
    sets: 3,
    reps: 12,
    weight: 15,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // BACK EXERCISES
  {
    _id: 'ex_004',
    name: 'Pull-ups',
    description: 'Bài tập lưng cơ bản',
    instructions: 'Treo người trên xà, kéo người lên cho đến khi cằm qua xà',
    tips: 'Giữ lưng thẳng, kéo bằng lưng chứ không phải tay',
    category: 'Back',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 8,
    weight: 0,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_005',
    name: 'Bent-over Row',
    description: 'Bài tập lưng với tạ đòn',
    instructions: 'Cúi người, cầm tạ đòn, kéo tạ lên ngực',
    tips: 'Giữ lưng thẳng, kéo bằng lưng',
    category: 'Back',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Posterior Deltoid'],
    equipment: 'Barbell',
    sets: 4,
    reps: 10,
    weight: 40,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_006',
    name: 'Lat Pulldown',
    description: 'Bài tập lưng với máy',
    instructions: 'Ngồi trên máy, kéo thanh xuống sau gáy',
    tips: 'Kiểm soát chuyển động, không dùng đà',
    category: 'Back',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids'],
    equipment: 'Machine',
    sets: 3,
    reps: 12,
    weight: 30,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // LEGS EXERCISES
  {
    _id: 'ex_007',
    name: 'Squats',
    description: 'Bài tập chân cơ bản',
    instructions: 'Đứng thẳng, hạ người xuống như ngồi ghế, sau đó đứng lên',
    tips: 'Giữ lưng thẳng, đầu gối không vượt quá mũi chân',
    category: 'Legs',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 20,
    weight: 0,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_008',
    name: 'Deadlift',
    description: 'Bài tập toàn thân với tạ đòn',
    instructions: 'Đứng cúi xuống cầm tạ, đứng thẳng lên',
    tips: 'Giữ lưng thẳng, không cong lưng',
    category: 'Legs',
    difficultyLevel: 'Advanced',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    equipment: 'Barbell',
    sets: 4,
    reps: 6,
    weight: 80,
    restTime: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_009',
    name: 'Lunges',
    description: 'Bài tập chân với bước dài',
    instructions: 'Bước một chân về phía trước, hạ người xuống, sau đó đẩy lên',
    tips: 'Giữ thăng bằng, đầu gối sau không chạm đất',
    category: 'Legs',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 12,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // SHOULDERS EXERCISES
  {
    _id: 'ex_010',
    name: 'Shoulder Press',
    description: 'Bài tập vai với tạ đơn',
    instructions: 'Ngồi hoặc đứng, nâng tạ từ vai lên cao',
    tips: 'Giữ lưng thẳng, kiểm soát chuyển động',
    category: 'Shoulders',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Anterior Deltoid', 'Medial Deltoid'],
    equipment: 'Dumbbell',
    sets: 3,
    reps: 10,
    weight: 12,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_011',
    name: 'Lateral Raises',
    description: 'Bài tập vai bên',
    instructions: 'Đứng, nâng tạ ra hai bên đến ngang vai',
    tips: 'Không nâng quá cao, kiểm soát chuyển động',
    category: 'Shoulders',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Medial Deltoid'],
    equipment: 'Dumbbell',
    sets: 3,
    reps: 15,
    weight: 5,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ARMS EXERCISES
  {
    _id: 'ex_012',
    name: 'Bicep Curls',
    description: 'Bài tập tay trước',
    instructions: 'Cầm tạ đơn, co tay lên xuống',
    tips: 'Giữ khuỷu tay cố định, kiểm soát chuyển động',
    category: 'Arms',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Biceps'],
    equipment: 'Dumbbell',
    sets: 3,
    reps: 12,
    weight: 8,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_013',
    name: 'Tricep Dips',
    description: 'Bài tập tay sau',
    instructions: 'Ngồi trên ghế, đặt tay cạnh hông, hạ người xuống',
    tips: 'Giữ lưng thẳng, không hạ quá thấp',
    category: 'Arms',
    difficultyLevel: 'Intermediate',
    targetMuscles: ['Triceps'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // CORE EXERCISES
  {
    _id: 'ex_014',
    name: 'Plank',
    description: 'Bài tập cơ bụng tĩnh',
    instructions: 'Nằm sấp, chống khuỷu tay, giữ người thẳng',
    tips: 'Giữ lưng thẳng, hít thở đều',
    category: 'Core',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    duration: 1,
    equipment: 'Bodyweight',
    sets: 3,
    reps: 1,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_015',
    name: 'Crunches',
    description: 'Bài tập cơ bụng động',
    instructions: 'Nằm ngửa, co đầu gối, nâng vai lên khỏi đất',
    tips: 'Không kéo cổ, dùng cơ bụng',
    category: 'Core',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Rectus Abdominis'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 20,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // CARDIO EXERCISES
  {
    _id: 'ex_016',
    name: 'Running',
    description: 'Chạy bộ cardio',
    instructions: 'Chạy với tốc độ ổn định',
    tips: 'Giữ nhịp tim trong vùng đốt cháy mỡ',
    category: 'Cardio',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves'],
    duration: 30,
    equipment: 'None',
    sets: 1,
    reps: 1,
    weight: 0,
    restTime: 0,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'ex_017',
    name: 'Jumping Jacks',
    description: 'Nhảy dang tay chân',
    instructions: 'Nhảy dang tay chân đồng thời',
    tips: 'Giữ nhịp độ ổn định',
    category: 'Cardio',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Full Body'],
    duration: 5,
    equipment: 'Bodyweight',
    sets: 3,
    reps: 1,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // FULL BODY EXERCISES
  {
    _id: 'ex_018',
    name: 'Burpees',
    description: 'Bài tập toàn thân',
    instructions: 'Squat xuống, chống tay, nhảy chân ra sau, hít đất, nhảy chân về, nhảy lên',
    tips: 'Thực hiện liên tục, giữ nhịp độ',
    category: 'FullBody',
    difficultyLevel: 'Advanced',
    targetMuscles: ['Full Body'],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 8,
    weight: 0,
    restTime: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // FLEXIBILITY EXERCISES
  {
    _id: 'ex_019',
    name: 'Yoga Stretches',
    description: 'Bài tập giãn cơ yoga',
    instructions: 'Thực hiện các tư thế yoga cơ bản',
    tips: 'Thở sâu, không ép cơ thể',
    category: 'Flexibility',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Full Body'],
    duration: 15,
    equipment: 'Yoga Mat',
    sets: 1,
    reps: 1,
    weight: 0,
    restTime: 0,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // BALANCE EXERCISES
  {
    _id: 'ex_020',
    name: 'Single Leg Stand',
    description: 'Đứng một chân',
    instructions: 'Đứng một chân, giữ thăng bằng',
    tips: 'Tập trung, thở đều',
    category: 'Balance',
    difficultyLevel: 'Beginner',
    targetMuscles: ['Core', 'Legs'],
    duration: 2,
    equipment: 'Bodyweight',
    sets: 3,
    reps: 1,
    weight: 0,
    restTime: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Helper functions
export const getExercisesByCategory = (category: string) => {
  return mockExercises.filter(exercise => exercise.category === category);
};

export const getExercisesByDifficulty = (difficulty: string) => {
  return mockExercises.filter(exercise => exercise.difficultyLevel === difficulty);
};

export const searchExercises = (searchTerm: string) => {
  return mockExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

export const getActiveExercises = () => {
  return mockExercises.filter(exercise => exercise.isActive);
};

export const getExerciseById = (id: string) => {
  return mockExercises.find(exercise => exercise._id === id);
};
