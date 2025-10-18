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
  subscriptionId?: string | {
    _id: string;
    type: string;
    membershipType: string;
    ptsessionsRemaining: number;
  };
  // Populated objects
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
  trainerId?: string; // Auto-filled from logged-in trainer
  branchId: string;
  dateTime: string;
  durationMinutes: number;
  notes?: string;
}

export interface UpdateScheduleRequest {
  memberId?: string;
  branchId?: string;
  dateTime?: string;
  durationMinutes?: number;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';
  notes?: string;
}

export interface ScheduleFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  memberId?: string;
}
