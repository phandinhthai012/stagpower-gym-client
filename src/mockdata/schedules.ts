export interface Schedule {
  id: string;
  member_id: string;
  trainer_id: string;
  subscription_id: string;
  branch_id: string;
  note: string;
  date_time: string;
  duration_minutes: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export const mockSchedules: Schedule[] = [
  // Upcoming PT sessions - Lê Văn Cường with Hoàng Văn Em
  {
    id: '507f1f77bcf86cd799439121',
    member_id: '507f1f77bcf86cd799439013', // Lê Văn Cường
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập cơ bụng và cardio',
    date_time: '2024-03-22T06:30:00Z',
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439122',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập tay và vai',
    date_time: '2024-03-25T06:30:00Z',
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439123',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập chân và mông',
    date_time: '2024-03-28T06:30:00Z',
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  },

  // Upcoming PT sessions - Member with PT package
  {
    id: '507f1f77bcf86cd799439124',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439056',
    branch_id: '507f1f77bcf86cd799439041',
    note: 'Buổi tập PT cá nhân - Pilates và stretching',
    date_time: '2024-03-21T19:00:00Z',
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T13:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439125',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    branch_id: '507f1f77bcf86cd799439041',
    note: 'Buổi tập PT cá nhân - Functional training',
    date_time: '2024-03-24T19:00:00Z',
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T13:00:00Z'
  },

  // Completed PT sessions - Lê Văn Cường
  {
    id: '507f1f77bcf86cd799439126',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập toàn thân',
    date_time: '2024-03-20T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-20T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439127',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập cardio và sức bền',
    date_time: '2024-03-19T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-19T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439128',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập cơ bụng và lưng',
    date_time: '2024-03-17T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-17T08:00:00Z'
  },

  // Completed PT sessions - Member with PT package
  {
    id: '507f1f77bcf86cd799439129',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    branch_id: '507f1f77bcf86cd799439041',
    note: 'Buổi tập PT cá nhân - Pilates cơ bản',
    date_time: '2024-03-18T19:00:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-18T20:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439130',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    branch_id: '507f1f77bcf86cd799439041',
    note: 'Buổi tập PT cá nhân - Stretching và thư giãn',
    date_time: '2024-03-15T19:00:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-15T20:30:00Z'
  },

  // Cancelled PT sessions
  {
    id: '507f1f77bcf86cd799439131',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - bị hủy do lý do cá nhân',
    date_time: '2024-03-16T06:30:00Z',
    duration_minutes: 90,
    status: 'Cancelled',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-15T18:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439132',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    branch_id: '507f1f77bcf86cd799439041',
    note: 'Buổi tập PT cá nhân - bị hủy do trainer bận',
    date_time: '2024-03-12T19:00:00Z',
    duration_minutes: 90,
    status: 'Cancelled',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-11T10:00:00Z'
  },

  // Historical PT sessions for analytics
  {
    id: '507f1f77bcf86cd799439133',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập toàn thân',
    date_time: '2024-03-13T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-13T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439134',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập cardio',
    date_time: '2024-03-10T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-10T08:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439135',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - tập cơ bụng',
    date_time: '2024-03-08T06:30:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-03-08T08:00:00Z'
  },

  // More historical data for other members
  {
    id: '507f1f77bcf86cd799439136',
    member_id: '507f1f77bcf86cd799439022',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439057',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - Pilates',
    date_time: '2024-02-28T19:00:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2024-02-28T20:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439137',
    member_id: '507f1f77bcf86cd799439022',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439057',
    branch_id: '507f1f77bcf86cd799439042',
    note: 'Buổi tập PT cá nhân - Functional training',
    date_time: '2024-02-25T19:00:00Z',
    duration_minutes: 90,
    status: 'Completed',
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2024-02-25T20:30:00Z'
  },
  // --- Member Nguyễn Văn An (507f...011) demo data ---
  {
    id: '507f1f77bcf86cd799439201',
    member_id: '507f1f77bcf86cd799439011',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439059',
    branch_id: '507f1f77bcf86cd799439047',
    note: 'Buổi PT toàn thân – kỹ thuật compound',
    date_time: new Date().toISOString(),
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '507f1f77bcf86cd799439202',
    member_id: '507f1f77bcf86cd799439011',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439059',
    branch_id: '507f1f77bcf86cd799439047',
    note: 'Buổi PT chân và core',
    date_time: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
    duration_minutes: 90,
    status: 'Confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '507f1f77bcf86cd799439203',
    member_id: '507f1f77bcf86cd799439011',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439059',
    branch_id: '507f1f77bcf86cd799439047',
    note: 'Buổi PT lưng xô',
    date_time: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    duration_minutes: 90,
    status: 'Completed',
    created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    updated_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  }
];
