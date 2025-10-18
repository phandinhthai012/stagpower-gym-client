// Schedule types for member
export interface Schedule {
  _id: string;
  memberId: string;
  trainerId: string;
  subscriptionId?: string;
  branchId: string;
  dateTime: string;
  durationMinutes: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';
  notes?: string;
  assignedExercises?: Array<{
    exerciseId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleWithDetails extends Omit<Schedule, 'trainerId' | 'branchId'> {
  trainerId: string | {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    trainerInfo?: {
      specialty: string;
      experience_years: number;
    };
  };
  branchId: string | {
    _id: string;
    name: string;
    address: string;
  };
  trainer?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    trainerInfo?: {
      specialty: string;
      experience_years: number;
    };
  };
  branch?: {
    _id: string;
    name: string;
    address: string;
  };
}

export interface CreateScheduleRequest {
  memberId?: string; // Auto-filled from logged-in user
  trainerId: string;
  branchId: string;
  dateTime: string;
  durationMinutes: number;
  notes?: string;
}

export interface ScheduleFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

