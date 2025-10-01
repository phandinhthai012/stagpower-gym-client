// thư mục types để lưu các types cho project chứa TypeScript interfaces và type definitions
// ví dụ: interface User ,packages,..


export type Exercise = {
    _id: string;
    name: string;
    description?: string;
    instructions: string;
    tips?: string;
    category: string;
    difficultyLevel: 'Beginner'|'Intermediate'|'Advanced';
    targetMuscles: string[];
    duration?: number;
    equipment?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
};
