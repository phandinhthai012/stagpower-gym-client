// Package Types
export interface Package {
  _id: string;
  name: string;
  type: 'Membership' | 'Combo' | 'PT';
  packageCategory: 'ShortTerm' | 'MediumTerm' | 'LongTerm' | 'Trial';
  durationMonths: number;
  membershipType?: 'Basic' | 'VIP';
  price: number;
  ptSessions?: number;
  ptSessionDuration?: number; // minutes
  branchAccess: 'Single' | 'All';
  isTrial: boolean;
  maxTrialDays?: number;
  description: string;
  status: 'Active' | 'Inactive';
  features?: string[]; // Optional features array
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageRequest {
  name: string;
  type: 'Membership' | 'Combo' | 'PT';
  packageCategory: 'ShortTerm' | 'MediumTerm' | 'LongTerm' | 'Trial';
  durationMonths: number;
  membershipType?: 'Basic' | 'VIP';
  price: number;
  ptSessions?: number;
  ptSessionDuration?: number; // minutes
  branchAccess: 'Single' | 'All';
  isTrial: boolean;
  maxTrialDays?: number;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {}

// Package Type Options
export const PACKAGE_TYPES = {
  MEMBERSHIP: 'Membership',
  COMBO: 'Combo',
  PT: 'PT'
} as const;

export const PACKAGE_CATEGORIES = {
  SHORT_TERM: 'ShortTerm',
  MEDIUM_TERM: 'MediumTerm', 
  LONG_TERM: 'LongTerm',
  TRIAL: 'Trial'
} as const;

export const MEMBERSHIP_TYPES = {
  BASIC: 'Basic',
  VIP: 'VIP'
} as const;

export const BRANCH_ACCESS = {
  SINGLE: 'Single',
  ALL: 'All'
} as const;

export const PACKAGE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
} as const;

// Type guards
export const isPackage = (obj: any): obj is Package => {
  return obj && 
    typeof obj._id === 'string' &&
    typeof obj.name === 'string' &&
    ['Membership', 'Combo', 'PT'].includes(obj.type);
};

export const isCreatePackageRequest = (obj: any): obj is CreatePackageRequest => {
  return obj &&
    typeof obj.name === 'string' &&
    ['Membership', 'Combo', 'PT'].includes(obj.type) &&
    typeof obj.price === 'number';
};
