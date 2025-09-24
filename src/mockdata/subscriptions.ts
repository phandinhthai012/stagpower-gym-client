export interface Subscription {
  id: string;
  member_id: string;
  package_id: string;
  branch_id?: string;
  type: 'Membership' | 'Combo' | 'PT';
  membership_type?: 'Basic' | 'VIP';
  start_date: string;
  end_date: string;
  duration_days: number;
  pt_sessions_remaining?: number;
  pt_sessions_used?: number;
  status: 'Active' | 'Expired' | 'Suspended';
  
  // Suspension management
  is_suspended: boolean;
  suspension_start_date?: string;
  suspension_end_date?: string;
  suspension_reason?: string;
  suspension_history?: Array<{
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    created_by: string;
    created_at: string;
  }>;
  
  created_at: string;
  updated_at: string;
}

export const mockSubscriptions: Subscription[] = [
  // Active VIP Membership - Nguyễn Văn An
  {
    id: '507f1f77bcf86cd799439051',
    member_id: '507f1f77bcf86cd799439011',
    package_id: '507f1f77bcf86cd799439037', // VIP 12 tháng
    branch_id: '507f1f77bcf86cd799439041',
    type: 'Membership',
    membership_type: 'VIP',
    start_date: '2024-01-15',
    end_date: '2025-01-14',
    duration_days: 365,
    status: 'Expired',
    is_suspended: false,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z'
  },

  // Active Basic Membership - Trần Thị Bình
  {
    id: '507f1f77bcf86cd799439052',
    member_id: '507f1f77bcf86cd799439012',
    package_id: '507f1f77bcf86cd799439032', // Basic 3 tháng
    branch_id: '507f1f77bcf86cd799439041',
    type: 'Membership',
    membership_type: 'Basic',
    start_date: '2024-02-01',
    end_date: '2024-05-01',
    duration_days: 90,
    status: 'Active',
    is_suspended: false,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z'
  },

  // Active Combo VIP + PT - Lê Văn Cường
  {
    id: '507f1f77bcf86cd799439053',
    member_id: '507f1f77bcf86cd799439013',
    package_id: '507f1f77bcf86cd799439041', // Combo VIP 6 tháng + 10 buổi PT
    branch_id: '507f1f77bcf86cd799439042',
    type: 'Combo',
    membership_type: 'VIP',
    start_date: '2024-01-20',
    end_date: '2024-07-20',
    duration_days: 182,
    pt_sessions_remaining: 7,
    pt_sessions_used: 3,
    status: 'Active',
    is_suspended: false,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },

  // Expired Trial - Phạm Thị Dung
  {
    id: '507f1f77bcf86cd799439054',
    member_id: '507f1f77bcf86cd799439014',
    package_id: '507f1f77bcf86cd799439039', // Gói thử 7 ngày
    branch_id: '507f1f77bcf86cd799439041',
    type: 'Membership',
    membership_type: 'Basic',
    start_date: '2024-03-01',
    end_date: '2024-03-08',
    duration_days: 7,
    status: 'Expired',
    is_suspended: false,
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-08T23:59:59Z'
  },

  // Suspended Membership
  {
    id: '507f1f77bcf86cd799439055',
    member_id: '507f1f77bcf86cd799439020',
    package_id: '507f1f77bcf86cd799439034', // Basic 12 tháng
    branch_id: '507f1f77bcf86cd799439041',
    type: 'Membership',
    membership_type: 'Basic',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    duration_days: 365,
    status: 'Suspended',
    is_suspended: true,
    suspension_start_date: '2024-03-01',
    suspension_end_date: '2024-04-01',
    suspension_reason: 'Tạm ngưng do công tác',
    suspension_history: [
      {
        start_date: '2024-03-01',
        end_date: '2024-04-01',
        reason: 'Tạm ngưng do công tác',
        status: 'Active',
        created_by: '507f1f77bcf86cd799439020',
        created_at: '2024-03-01T12:00:00Z'
      }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-01T12:00:00Z'
  },

  // Active PT Only
  {
    id: '507f1f77bcf86cd799439056',
    member_id: '507f1f77bcf86cd799439021',
    package_id: '507f1f77bcf86cd799439043', // PT cá nhân 5 buổi
    branch_id: '507f1f77bcf86cd799439041',
    type: 'PT',
    membership_type: 'Basic',
    start_date: '2024-03-10',
    end_date: '2024-04-10',
    duration_days: 30,
    pt_sessions_remaining: 3,
    pt_sessions_used: 2,
    status: 'Active',
    is_suspended: false,
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T13:00:00Z'
  },

  // Expired Combo
  {
    id: '507f1f77bcf86cd799439057',
    member_id: '507f1f77bcf86cd799439022',
    package_id: '507f1f77bcf86cd799439040', // Combo Basic 3 tháng + 5 buổi PT
    branch_id: '507f1f77bcf86cd799439042',
    type: 'Combo',
    membership_type: 'Basic',
    start_date: '2023-12-01',
    end_date: '2024-03-01',
    duration_days: 90,
    pt_sessions_remaining: 0,
    pt_sessions_used: 5,
    status: 'Expired',
    is_suspended: false,
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2024-03-01T23:59:59Z'
  },

  // Active Basic Membership - Member mới
  {
    id: '507f1f77bcf86cd799439058',
    member_id: '507f1f77bcf86cd799439023',
    package_id: '507f1f77bcf86cd799439031', // Basic 1 tháng
    branch_id: '507f1f77bcf86cd799439043',
    type: 'Membership',
    membership_type: 'Basic',
    start_date: '2024-03-15',
    end_date: '2024-04-15',
    duration_days: 31,
    status: 'Active',
    is_suspended: false,
    created_at: '2024-03-15T12:00:00Z',
    updated_at: '2024-03-15T12:00:00Z'
  },

  // New Active VIP Combo 12m + 12 PT for Nguyễn Văn An (aligns screenshot)
  {
    id: '507f1f77bcf86cd799439059',
    member_id: '507f1f77bcf86cd799439011',
    package_id: '507f1f77bcf86cd799439046',
    branch_id: '507f1f77bcf86cd799439047',
    type: 'Combo',
    membership_type: 'VIP',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    duration_days: 365,
    pt_sessions_remaining: 12,
    pt_sessions_used: 0,
    status: 'Active',
    is_suspended: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];
