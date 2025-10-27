// API User type (camelCase - from MongoDB/Backend)
export interface ApiUser {
  _id: string;
  uid?: string;
  role: 'admin' | 'staff' | 'trainer' | 'member';
  fullName: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  joinDate?: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  
  // Member specific info
  memberInfo?: {
    membership_level?: 'basic' | 'vip';
    qr_code?: string;
    health_info_id?: string;
    notes?: string;
    is_hssv?: boolean;
    total_spending?: number;
    membership_month?: number;
  };
  
  // Trainer specific info
  trainerInfo?: {
    specialty?: string;
    experience_years?: number;
    certificate?: string[];
    working_hour?: string[];
  };
  
  // Staff specific info
  staffInfo?: {
    brand_id?: string;
    position?: string;
  };
  
  // Admin specific info
  adminInfo?: {
    permissions?: string[];
    managed_branches?: string[];
  };
  
  tokenVersion?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Mock User type (snake_case - from mockdata)
export interface MockUser {
  id: string;
  role: 'Admin' | 'Staff' | 'Trainer' | 'Member';
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  date_of_birth: string;
  photo?: string;
  cccd: string;
  join_date: string;
  status: 'active' | 'inactive' | 'suspended';
  
  member_info?: {
    membership_level: 'Basic' | 'VIP';
    qr_code?: string;
    health_info_id?: string;
    notes?: string;
    is_hssv?: boolean;
    total_spending?: number;
    membership_month?: number;
  };
  
  trainer_info?: {
    specialty?: string;
    experience_years?: number;
    certificate?: string[];
    working_hour?: string[];
  };
  
  staff_info?: {
    brand_id?: string;
    position?: string;
  };
  
  admin_info?: {
    permissions?: string[];
    managed_branches?: string[];
  };
  
  created_at: string;
  updated_at: string;
}

// Universal User type that supports both formats
export type UniversalUser = ApiUser | MockUser;

// Type guard to check if user is ApiUser
export function isApiUser(user: UniversalUser): user is ApiUser {
  return '_id' in user;
}

// Type guard to check if user is MockUser
export function isMockUser(user: UniversalUser): user is MockUser {
  return 'id' in user && !('_id' in user);
}

// Helper to normalize user data (convert to ApiUser format)
export function normalizeUser(user: UniversalUser): ApiUser {
  if (isApiUser(user)) {
    return user;
  }
  
  // Convert MockUser to ApiUser format
  const mockUser = user as MockUser;
  
  // Normalize status (suspended -> inactive for compatibility)
  const normalizeStatus = (status: MockUser['status']): ApiUser['status'] => {
    if (status === 'suspended') return 'inactive';
    return status as ApiUser['status'];
  };
  
  // Normalize memberInfo if exists
  const normalizeMemberInfo = (memberInfo?: MockUser['member_info']): ApiUser['memberInfo'] | undefined => {
    if (!memberInfo) return undefined;
    return {
      ...memberInfo,
      membership_level: memberInfo.membership_level?.toLowerCase() as 'basic' | 'vip'
    };
  };
  
  return {
    _id: mockUser.id,
    uid: mockUser.id,
    role: mockUser.role.toLowerCase() as any,
    fullName: mockUser.fullName,
    email: mockUser.email,
    phone: mockUser.phone,
    gender: mockUser.gender as any,
    dateOfBirth: mockUser.date_of_birth,
    photo: mockUser.photo,
    cccd: mockUser.cccd,
    joinDate: mockUser.join_date,
    status: normalizeStatus(mockUser.status),
    memberInfo: normalizeMemberInfo(mockUser.member_info),
    trainerInfo: mockUser.trainer_info,
    staffInfo: mockUser.staff_info,
    adminInfo: mockUser.admin_info,
    createdAt: mockUser.created_at,
    updatedAt: mockUser.updated_at,
  };
}

