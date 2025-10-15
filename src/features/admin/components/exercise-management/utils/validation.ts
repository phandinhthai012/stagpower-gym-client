// utils/validation.ts - Tạo file mới
export interface ExerciseValidationErrors {
    name?: string;
    description?: string;
    instructions?: string;
    tips?: string;
    category?: string;
    difficultyLevel?: string;
    targetMuscles?: string;
    duration?: string;
    equipment?: string;
    sets?: string;
    reps?: string;
    weight?: string;
    restTime?: string;
  }
  
  export const validateExercise = (exercise: any): ExerciseValidationErrors => {
    const errors: ExerciseValidationErrors = {};
  
    // ✅ Name validation
    if (!exercise.name || exercise.name.trim().length === 0) {
      errors.name = 'Tên bài tập là bắt buộc';
    } else if (exercise.name.trim().length < 2) {
      errors.name = 'Tên bài tập phải có ít nhất 2 ký tự';
    } else if (exercise.name.trim().length > 100) {
      errors.name = 'Tên bài tập không được quá 100 ký tự';
    }
  
    // ✅ Description validation
    if (exercise.description && exercise.description.length > 500) {
      errors.description = 'Mô tả không được quá 500 ký tự';
    }
  
    // ✅ Instructions validation
    if (!exercise.instructions || exercise.instructions.trim().length === 0) {
      errors.instructions = 'Hướng dẫn thực hiện là bắt buộc';
    } else if (exercise.instructions.trim().length < 10) {
      errors.instructions = 'Hướng dẫn phải có ít nhất 10 ký tự';
    } else if (exercise.instructions.length > 2000) {
      errors.instructions = 'Hướng dẫn không được quá 2000 ký tự';
    }
  
    // ✅ Tips validation
    if (exercise.tips && exercise.tips.length > 1000) {
      errors.tips = 'Mẹo không được quá 1000 ký tự';
    }
  
    // ✅ Category validation
    const validCategories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'FullBody', 'Flexibility', 'Balance'];
    if (!exercise.category) {
      errors.category = 'Danh mục là bắt buộc';
    } else if (!validCategories.includes(exercise.category)) {
      errors.category = 'Danh mục không hợp lệ';
    }
  
    // ✅ Difficulty Level validation
    const validDifficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!exercise.difficultyLevel) {
      errors.difficultyLevel = 'Độ khó là bắt buộc';
    } else if (!validDifficultyLevels.includes(exercise.difficultyLevel)) {
      errors.difficultyLevel = 'Độ khó không hợp lệ';
    }
  
    // ✅ Target Muscles validation
    if (!exercise.targetMuscles || exercise.targetMuscles.length === 0) {
      errors.targetMuscles = 'Phải có ít nhất 1 nhóm cơ mục tiêu';
    }
  
    // ✅ Equipment validation
    if (!exercise.equipment || exercise.equipment.trim().length === 0) {
      errors.equipment = 'Thiết bị là bắt buộc';
    } else if (exercise.equipment.length > 50) {
      errors.equipment = 'Tên thiết bị không được quá 50 ký tự';
    }
  
    // ✅ Sets validation
    if (exercise.sets !== undefined && exercise.sets !== null) {
      if (exercise.sets < 1) {
        errors.sets = 'Sets phải ít nhất là 1';
      } else if (exercise.sets > 10) {
        errors.sets = 'Sets không được quá 10';
      }
    }
  
    // ✅ Reps validation
    if (exercise.reps !== undefined && exercise.reps !== null) {
      if (exercise.reps < 1) {
        errors.reps = 'Reps phải ít nhất là 1';
      } else if (exercise.reps > 100) {
        errors.reps = 'Reps không được quá 100';
      }
    }
  
    // ✅ Weight validation
    if (exercise.weight !== undefined && exercise.weight !== null) {
      if (exercise.weight < 0) {
        errors.weight = 'Trọng lượng không được âm';
      } else if (exercise.weight > 1000) {
        errors.weight = 'Trọng lượng không được quá 1000kg';
      }
    }
  
    // ✅ Duration validation
    if (exercise.duration !== undefined && exercise.duration !== null) {
      if (exercise.duration < 0) {
        errors.duration = 'Thời gian không được âm';
      } else if (exercise.duration > 120) {
        errors.duration = 'Thời gian không được quá 120 phút';
      }
    }
  
    // ✅ Rest Time validation
    if (exercise.restTime !== undefined && exercise.restTime !== null) {
      if (exercise.restTime < 0) {
        errors.restTime = 'Thời gian nghỉ không được âm';
      } else if (exercise.restTime > 100) {
        errors.restTime = 'Thời gian nghỉ không được quá 100 phút';
      }
    }
  
    return errors;
  };
  
  // ✅ Helper function để check form có valid không
  export const isExerciseValid = (exercise: any): boolean => {
    const errors = validateExercise(exercise);
    return Object.keys(errors).length === 0;
  };