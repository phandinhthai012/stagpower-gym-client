// Staff & Trainer Types for Admin Management

export interface StaffTrainerBase {
  _id: string;
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  role: 'trainer' | 'staff' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'banned';
  createdAt: string;
  updatedAt: string;
}

export interface TrainerInfo {
  specialty: string;
  experience_years: number;
  certificate: string[];
  working_hour: string[];
}

export interface StaffInfo {
  brand_id?: string;
  position?: 'manager' | 'receptionist' | 'staff';
}

export interface AdminInfo {
  permissions: string[];
  managed_branches: string[];
}

export interface Trainer extends StaffTrainerBase {
  role: 'trainer';
  trainerInfo: TrainerInfo;
}

export interface Staff extends StaffTrainerBase {
  role: 'staff';
  staffInfo: StaffInfo;
}

export interface Admin extends StaffTrainerBase {
  role: 'admin';
  adminInfo: AdminInfo;
}

export type StaffTrainerUser = Trainer | Staff | Admin;

// Request/Response types
export interface CreateStaffTrainerRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  role: 'trainer' | 'staff' | 'admin';
  // Trainer specific
  trainerInfo?: {
    specialty?: string;
    experience_years?: number;
    certificate?: string[];
    working_hour?: string[];
  };
  // Staff specific
  staffInfo?: {
    brand_id?: string;
    position?: 'manager' | 'receptionist' | 'staff';
  };
  // Admin specific
  adminInfo?: {
    permissions?: string[];
    managed_branches?: string[];
  };
}

export interface UpdateStaffTrainerRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  // Trainer specific - using dot notation as per API
  'trainerInfo.specialty'?: string;
  'trainerInfo.experience_years'?: number;
  'trainerInfo.certificate'?: string[];
  'trainerInfo.working_hour'?: string[];
  // Staff specific
  'staffInfo.brand_id'?: string;
  'staffInfo.position'?: 'manager' | 'receptionist' | 'staff';
  // Admin specific
  'adminInfo.permissions'?: string[];
  'adminInfo.managed_branches'?: string[];
}

export interface StaffTrainerFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: 'trainer' | 'staff' | 'admin' | '';
  status?: 'active' | 'inactive' | 'pending' | 'banned' | '';
}

export interface PaginatedResponse<T> {
  data: T[];
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

// Form data for UI
export interface StaffTrainerFormData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  role: 'trainer' | 'staff' | 'admin';
  status?: 'active' | 'inactive' | 'pending' | 'banned';
  // Trainer specific
  specialty?: string;
  experience_years?: number;
  certifications?: string[];
  working_hours?: {
    start: string;
    end: string;
  };
  // Staff specific
  branch_id?: string;
  position?: string;
  // Admin specific
  permissions?: string[];
  managed_branches?: string[];
}

