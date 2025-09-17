export interface Package {
  id: string;
  name: string;
  type: 'Membership' | 'Combo' | 'PT';
  package_category: 'ShortTerm' | 'MediumTerm' | 'LongTerm' | 'Trial';
  duration_months: number;
  membership_type: 'Basic' | 'VIP';
  price: number; // VNĐ
  pt_sessions?: number;
  pt_session_duration?: number; // minutes
  branch_access: 'Single' | 'All';
  is_trial: boolean;
  max_trial_days?: number;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const mockPackages: Package[] = [
  // Membership Packages - Basic
  {
    id: '507f1f77bcf86cd799439031',
    name: 'Gói Basic 1 tháng',
    type: 'Membership',
    package_category: 'ShortTerm',
    duration_months: 1,
    membership_type: 'Basic',
    price: 800000,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói tập cơ bản 1 tháng, chỉ tập tại chi nhánh đăng ký',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439032',
    name: 'Gói Basic 3 tháng',
    type: 'Membership',
    package_category: 'MediumTerm',
    duration_months: 3,
    membership_type: 'Basic',
    price: 2100000,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói tập cơ bản 3 tháng, tiết kiệm 300.000 VNĐ so với mua lẻ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439033',
    name: 'Gói Basic 6 tháng',
    type: 'Membership',
    package_category: 'MediumTerm',
    duration_months: 6,
    membership_type: 'Basic',
    price: 3600000,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói tập cơ bản 6 tháng, tiết kiệm 1.200.000 VNĐ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439034',
    name: 'Gói Basic 12 tháng',
    type: 'Membership',
    package_category: 'LongTerm',
    duration_months: 12,
    membership_type: 'Basic',
    price: 6000000,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói tập cơ bản 12 tháng, tiết kiệm 3.600.000 VNĐ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Membership Packages - VIP
  {
    id: '507f1f77bcf86cd799439035',
    name: 'Gói VIP 1 tháng',
    type: 'Membership',
    package_category: 'ShortTerm',
    duration_months: 1,
    membership_type: 'VIP',
    price: 1200000,
    branch_access: 'All',
    is_trial: false,
    description: 'Gói VIP 1 tháng, tập tại tất cả chi nhánh',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439036',
    name: 'Gói VIP 3 tháng',
    type: 'Membership',
    package_category: 'MediumTerm',
    duration_months: 3,
    membership_type: 'VIP',
    price: 3150000,
    branch_access: 'All',
    is_trial: false,
    description: 'Gói VIP 3 tháng, tiết kiệm 450.000 VNĐ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439037',
    name: 'Gói VIP 12 tháng',
    type: 'Membership',
    package_category: 'LongTerm',
    duration_months: 12,
    membership_type: 'VIP',
    price: 10800000,
    branch_access: 'All',
    is_trial: false,
    description: 'Gói VIP 12 tháng, tiết kiệm 3.600.000 VNĐ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Trial Packages
  {
    id: '507f1f77bcf86cd799439038',
    name: 'Gói thử 3 ngày',
    type: 'Membership',
    package_category: 'Trial',
    duration_months: 0,
    membership_type: 'Basic',
    price: 100000,
    branch_access: 'Single',
    is_trial: true,
    max_trial_days: 3,
    description: 'Gói thử 3 ngày để trải nghiệm dịch vụ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439039',
    name: 'Gói thử 7 ngày',
    type: 'Membership',
    package_category: 'Trial',
    duration_months: 0,
    membership_type: 'Basic',
    price: 200000,
    branch_access: 'Single',
    is_trial: true,
    max_trial_days: 7,
    description: 'Gói thử 7 ngày để trải nghiệm đầy đủ dịch vụ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Combo Packages (Membership + PT)
  {
    id: '507f1f77bcf86cd799439040',
    name: 'Combo Basic 3 tháng + 5 buổi PT',
    type: 'Combo',
    package_category: 'MediumTerm',
    duration_months: 3,
    membership_type: 'Basic',
    price: 4100000,
    pt_sessions: 5,
    pt_session_duration: 90,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói combo 3 tháng membership Basic + 5 buổi PT cá nhân',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439041',
    name: 'Combo VIP 6 tháng + 10 buổi PT',
    type: 'Combo',
    package_category: 'MediumTerm',
    duration_months: 6,
    membership_type: 'VIP',
    price: 8600000,
    pt_sessions: 10,
    pt_session_duration: 90,
    branch_access: 'All',
    is_trial: false,
    description: 'Gói combo 6 tháng membership VIP + 10 buổi PT cá nhân',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439042',
    name: 'Combo Basic 12 tháng + 20 buổi PT',
    type: 'Combo',
    package_category: 'LongTerm',
    duration_months: 12,
    membership_type: 'Basic',
    price: 14000000,
    pt_sessions: 20,
    pt_session_duration: 90,
    branch_access: 'Single',
    is_trial: false,
    description: 'Gói combo 12 tháng membership Basic + 20 buổi PT cá nhân',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // PT Only Packages
  {
    id: '507f1f77bcf86cd799439043',
    name: 'PT cá nhân 5 buổi',
    type: 'PT',
    package_category: 'ShortTerm',
    duration_months: 1,
    membership_type: 'Basic',
    price: 2000000,
    pt_sessions: 5,
    pt_session_duration: 90,
    branch_access: 'Single',
    is_trial: false,
    description: '5 buổi PT cá nhân, yêu cầu có membership còn hiệu lực',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439044',
    name: 'PT cá nhân 10 buổi',
    type: 'PT',
    package_category: 'MediumTerm',
    duration_months: 2,
    membership_type: 'Basic',
    price: 3800000,
    pt_sessions: 10,
    pt_session_duration: 90,
    branch_access: 'Single',
    is_trial: false,
    description: '10 buổi PT cá nhân, tiết kiệm 200.000 VNĐ',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439045',
    name: 'PT nhóm 2-4 người 5 buổi',
    type: 'PT',
    package_category: 'ShortTerm',
    duration_months: 1,
    membership_type: 'Basic',
    price: 1500000,
    pt_sessions: 5,
    pt_session_duration: 90,
    branch_access: 'Single',
    is_trial: false,
    description: '5 buổi PT nhóm 2-4 người, giá 300.000 VNĐ/buổi/người',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];
