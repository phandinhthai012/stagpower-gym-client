export interface Exercise {
  _id: string;
  name: string;
  description: string;
  instructions: string;
  tips: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'FullBody' | 'Flexibility' | 'Balance';
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  duration?: number;
  equipment: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseData {
  name: string;
  description: string;
  instructions: string;
  tips?: string;
  category: string;
  difficultyLevel: string;
  targetMuscles: string[];
  duration?: number;
  equipment: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  isActive?: boolean;
}

export interface UpdateExerciseData extends Partial<CreateExerciseData> {}

export interface ExerciseSearchParams {
  q?: string;
  category?: string;
  difficultyLevel?: string;
  equipment?: string;
  isActive?: boolean;
}
