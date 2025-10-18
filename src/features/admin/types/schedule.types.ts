// Schedule Types for Admin Management

export interface Schedule {
  _id: string;
  memberId: string;
  trainerId: string;
  subscriptionId: string;
  branchId: string;
  dateTime: string;
  durationMinutes: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
  assignedExercises?: Array<{
    exerciseId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleWithDetails extends Omit<Schedule, 'memberId' | 'trainerId' | 'branchId' | 'subscriptionId'> {
  memberId: string | {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    memberInfo?: {
      membership_level: 'vip' | 'basic';
    };
  };
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
  subscriptionId: string | {
    _id: string;
    type: string;
    membershipType: string;
    ptsessionsRemaining: number;
  };
  member?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    memberInfo?: {
      membership_level: 'vip' | 'basic';
    };
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
  subscription?: {
    _id: string;
    type: string;
    membershipType: string;
    ptsessionsRemaining: number;
  };
}

export interface CreateScheduleRequest {
  memberId: string;
  trainerId: string;
  subscriptionId?: string;
  branchId: string;
  dateTime: string;
  durationMinutes: number;
  status?: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
  assignedExercises?: Array<{
    exerciseId: string;
  }>;
}

export interface UpdateScheduleRequest {
  memberId?: string;
  trainerId?: string;
  subscriptionId?: string;
  branchId?: string;
  dateTime?: string;
  durationMinutes?: number;
  status?: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  notes?: string;
  assignedExercises?: Array<{
    exerciseId: string;
  }>;
}

export interface ScheduleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending' | '';
}

export interface PaginatedScheduleResponse {
  data: ScheduleWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    filteredRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

// Form data cho UI
export interface DirectScheduleFormData {
  staffId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'afternoon' | 'full' | 'custom';
  notes: string;
}

export interface CoachingScheduleFormData {
  trainerId: string;
  memberId: string;
  subscriptionId: string;
  branchId: string;
  sessionDateTime: string;
  sessionDuration: number;
  notes: string;
}

