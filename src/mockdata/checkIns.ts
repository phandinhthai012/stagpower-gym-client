export interface CheckIn {
  id: string;
  member_id: string;
  branch_id: string;
  check_in_time: string;
  check_out_time?: string;
  validation_error?: string;
  duration?: number; // minutes
  status: 'Active' | 'Completed' | 'Cancelled';
  // New fields for checkout control and audit
  checkout_method?: 'qr_exit' | 'manual_app' | 'staff' | 'auto';
  auto_checkout?: boolean;
  auto_checkout_reason?: 'CloseTime' | 'MaxSession';
  allow_reopen_until?: string; // ISO time until which member can reopen session
  created_at: string;
}

export const mockCheckIns: CheckIn[] = [
  // Recent check-ins - Nguyễn Văn An (VIP member)
  {
    id: '507f1f77bcf86cd799439091',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-20T18:30:00Z',
    check_out_time: '2024-03-20T20:15:00Z',
    duration: 105,
    status: 'Completed',
    checkout_method: 'qr_exit',
    created_at: '2024-03-20T18:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439092',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-19T19:00:00Z',
    check_out_time: '2024-03-19T21:00:00Z',
    duration: 120,
    status: 'Completed',
    created_at: '2024-03-19T19:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439093',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-18T17:45:00Z',
    check_out_time: '2024-03-18T19:30:00Z',
    duration: 105,
    status: 'Completed',
    created_at: '2024-03-18T17:45:00Z'
  },

  // Recent check-ins - Trần Thị Bình (Basic member)
  {
    id: '507f1f77bcf86cd799439094',
    member_id: '507f1f77bcf86cd799439012',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-20T16:00:00Z',
    check_out_time: '2024-03-20T17:30:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-20T16:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439095',
    member_id: '507f1f77bcf86cd799439012',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-18T15:30:00Z',
    check_out_time: '2024-03-18T17:00:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-18T15:30:00Z'
  },

  // Recent check-ins - Lê Văn Cường (Combo member)
  {
    id: '507f1f77bcf86cd799439096',
    member_id: '507f1f77bcf86cd799439013',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-20T06:30:00Z',
    check_out_time: '2024-03-20T08:00:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-20T06:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439097',
    member_id: '507f1f77bcf86cd799439013',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-19T06:00:00Z',
    check_out_time: '2024-03-19T07:30:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-19T06:00:00Z'
  },

  // Active check-in (currently in gym)
  {
    id: '507f1f77bcf86cd799439098',
    member_id: '507f1f77bcf86cd799439021',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-20T19:00:00Z',
    status: 'Active',
    created_at: '2024-03-20T19:00:00Z'
  },

  // Active check-in - Nguyễn Văn An (for demo: show as currently in gym)
  {
    id: '507f1f77bcf86cd799439200',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2025-09-24T10:00:00Z',
    status: 'Active',
    created_at: '2025-09-24T10:00:00Z'
  },

  // Failed check-ins with validation errors
  {
    id: '507f1f77bcf86cd799439099',
    member_id: '507f1f77bcf86cd799439014',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-15T10:00:00Z',
    validation_error: 'Gói tập đã hết hạn',
    status: 'Cancelled',
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439100',
    member_id: '507f1f77bcf86cd799439022',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-10T20:00:00Z',
    validation_error: 'Ngoài giờ mở cửa (22:00)',
    status: 'Cancelled',
    created_at: '2024-03-10T20:00:00Z'
  },

  // Historical check-ins for analytics
  {
    id: '507f1f77bcf86cd799439101',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-15T18:00:00Z',
    check_out_time: '2024-03-15T19:45:00Z',
    duration: 105,
    status: 'Completed',
    checkout_method: 'auto',
    auto_checkout: true,
    auto_checkout_reason: 'CloseTime',
    created_at: '2024-03-15T18:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439102',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-13T19:15:00Z',
    check_out_time: '2024-03-13T21:00:00Z',
    duration: 105,
    status: 'Completed',
    created_at: '2024-03-13T19:15:00Z'
  },
  {
    id: '507f1f77bcf86cd799439103',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-12T18:30:00Z',
    check_out_time: '2024-03-12T20:15:00Z',
    duration: 105,
    status: 'Completed',
    created_at: '2024-03-12T18:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439104',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-10T17:45:00Z',
    check_out_time: '2024-03-10T19:30:00Z',
    duration: 105,
    status: 'Completed',
    created_at: '2024-03-10T17:45:00Z'
  },
  {
    id: '507f1f77bcf86cd799439105',
    member_id: '507f1f77bcf86cd799439011',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-08T18:00:00Z',
    check_out_time: '2024-03-08T19:45:00Z',
    duration: 105,
    status: 'Completed',
    created_at: '2024-03-08T18:00:00Z'
  },

  // More historical data for other members
  {
    id: '507f1f77bcf86cd799439106',
    member_id: '507f1f77bcf86cd799439012',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-15T16:30:00Z',
    check_out_time: '2024-03-15T18:00:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-15T16:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439107',
    member_id: '507f1f77bcf86cd799439012',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-13T15:00:00Z',
    check_out_time: '2024-03-13T16:30:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-13T15:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439108',
    member_id: '507f1f77bcf86cd799439012',
    branch_id: '507f1f77bcf86cd799439041',
    check_in_time: '2024-03-11T16:00:00Z',
    check_out_time: '2024-03-11T17:30:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-11T16:00:00Z'
  },

  // Lê Văn Cường historical data
  {
    id: '507f1f77bcf86cd799439109',
    member_id: '507f1f77bcf86cd799439013',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-17T06:30:00Z',
    check_out_time: '2024-03-17T08:00:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-17T06:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439110',
    member_id: '507f1f77bcf86cd799439013',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-15T06:00:00Z',
    check_out_time: '2024-03-15T07:30:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-15T06:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439111',
    member_id: '507f1f77bcf86cd799439013',
    branch_id: '507f1f77bcf86cd799439042',
    check_in_time: '2024-03-13T06:30:00Z',
    check_out_time: '2024-03-13T08:00:00Z',
    duration: 90,
    status: 'Completed',
    created_at: '2024-03-13T06:30:00Z'
  }
];
