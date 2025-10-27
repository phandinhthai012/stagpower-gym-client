export interface TrainerMember {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  photo?: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  joinDate: string;
  memberInfo?: {
    membership_level: 'basic' | 'vip';
    notes?: string;
  };
  // Calculated fields from schedules
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  progress: number;
  lastSessionDate?: string;
  nextSessionDate?: string;
  // Subscription info
  activeSubscriptions?: {
    _id: string;
    type: 'PT' | 'Combo' | 'Membership';
    membershipType: 'Basic' | 'VIP';
    ptsessionsRemaining?: number;
    ptsessionsUsed?: number;
    endDate: string;
  }[];
  // Health info
  healthInfo?: {
    goal: 'WeightLoss' | 'MuscleGain' | 'Health';
    fitnessLevel: 'Low' | 'Medium' | 'High';
    height?: number;
    weight?: number;
    bmi?: number;
  };
}

export interface MemberDetailModalData extends TrainerMember {
  schedules: {
    _id: string;
    dateTime: string;
    durationMinutes: number;
    status: string;
    notes?: string;
  }[];
}

