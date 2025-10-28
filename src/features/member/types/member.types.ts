// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  code?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  code: string;
  data: null;
  details?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

// Package Types
export interface Package {
  _id: string;
  name: string;
  type: 'Membership' | 'PT' | 'Combo';
  packageCategory: string;
  durationMonths: number;
  membershipType: 'Basic' | 'VIP';
  price: number;
  ptSessions?: number;
  ptSessionDuration?: number;
  branchAccess: 'All' | 'Single';
  isTrial?: boolean;
  maxTrialDays?: number;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

// Subscription Types
export interface Subscription {
  _id: string;
  memberId: string;
  packageId: string;
  branchId: string;
  type: 'Membership' | 'PT' | 'Combo';
  membershipType: 'Basic' | 'VIP';
  startDate: string;
  endDate: string;
  durationDays: number;
  ptsessionsRemaining: number;
  ptsessionsUsed: number;
  status: 'Active' | 'Expired' | 'Suspended' | 'Cancelled' | 'PendingPayment' | 'NotStarted';
  suspensionHistory?: Array<{
    startDate: string;
    endDate: string;
    reason: string;
  }>;
  isSuspended: boolean;
  suspensionStartDate?: string;
  suspensionEndDate?: string;
  suspensionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  _id: string;
  subscriptionId: string;
  memberId: string;
  originalAmount: number;
  amount: number;
  discountDetails?: {
    discountId: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  };
  paymentMethod: 'cash' | 'card' | 'momo' | 'bank_transfer';
  paymentDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentType?: 'NEW_SUBSCRIPTION' | 'RENEWAL' | 'PT_PURCHASE';
  invoiceNumber: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Branch Types
export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  _id: string;
  uid: string;
  role: 'member' | 'trainer' | 'staff' | 'admin';
  fullName: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  cccd?: string;
  photo?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  memberInfo?: {
    membershipLevel: string;
    qrCode: string;
    healthInfoId?: string;
    notes?: string;
    isStudent: boolean;
    totalSpending: number;
    membershipMonth: number;
    currentBranchId: string;
  };
  trainerInfo?: {
    specialty: string[];
    experienceYears: number;
    certificate: string[];
    workingHour: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  staffInfo?: {
    branchId: string;
    position: string;
  };
  adminInfo?: {
    permissions: string[];
    managedBranches: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Health Info Types
export interface HealthInfo {
  _id: string;
  memberId: string;
  height: number;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  fitnessGoals: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Old Schedule Types (deprecated - use schedule.types.ts instead)
export interface OldSchedule {
  _id: string;
  trainerId: string;
  memberId?: string;
  branchId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'personal_training' | 'group_class' | 'consultation';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Check-in Types
export interface CheckIn {
  _id: string;
  memberId: string;
  branchId: string;
  checkInTime: string;
  checkOutTime?: string;
  type: 'gym' | 'class' | 'pt_session';
  status: 'checked_in' | 'checked_out';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Exercise Types
export interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

// Discount Types
export interface Discount {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  applicablePackages: string[];
  status: 'Active' | 'Inactive' | 'Expired';
  createdAt: string;
  updatedAt: string;
}

// Booking Request Types
export interface BookingRequest {
  _id: string;
  memberId: string;
  trainerId: string;
  branchId: string;
  requestedDate: string;
  requestedTime: string;
  type: 'personal_training' | 'consultation';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  notes?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Suggestion Types
export interface WorkoutSuggestion {
  memberId: string;
  goals: string[];
  fitnessLevel: string;
  availableTime: number;
  equipment: string[];
  suggestions: Array<{
    exerciseId: string;
    name: string;
    sets: number;
    reps: number;
    duration?: number;
    restTime: number;
  }>;
  createdAt: string;
}

export interface NutritionSuggestion {
  memberId: string;
  goals: string[];
  dietaryRestrictions: string[];
  preferences: string[];
  suggestions: Array<{
    meal: string;
    foods: Array<{
      name: string;
      quantity: string;
      calories: number;
    }>;
  }>;
  createdAt: string;
}
