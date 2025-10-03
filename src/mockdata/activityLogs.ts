export interface ActivityLog {
  id: string;
  user_id: string; // Người thực hiện
  target_user_id?: string; // Người bị tác động (nếu có)
  activity_type: 'MemberRegistration' | 'Payment' | 'CheckIn' | 'CheckOut' | 'PTBooking' | 'PackageRenewal' | 'PackagePurchase' | 'ScheduleCompleted' | 'BookingConfirmed' | 'BookingRejected' | 'ProfileUpdate' | 'HealthInfoUpdate';
  description: string;
  metadata: {
    amount?: number;
    package_name?: string;
    branch_name?: string;
    trainer_name?: string;
    payment_method?: string;
    duration?: number;
    rejection_reason?: string;
    [key: string]: any;
  };
  created_at: string;
}

export const mockActivityLogs: ActivityLog[] = [
  // Recent activities - Last 24 hours
  {
    id: '507f1f77bcf86cd799439201',
    user_id: '507f1f77bcf86cd799439011', // Nguyễn Văn An
    activity_type: 'MemberRegistration',
    description: 'Hội viên mới đăng ký',
    metadata: {
      package_name: 'Gói VIP 12 tháng',
      branch_name: 'Chi nhánh Quận 1'
    },
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 phút trước
  },
  {
    id: '507f1f77bcf86cd799439202',
    user_id: '507f1f77bcf86cd799439012', // Trần Thị Bình
    activity_type: 'Payment',
    description: 'Thanh toán thành công',
    metadata: {
      amount: 2500000,
      package_name: 'Gói Basic 3 tháng',
      payment_method: 'Momo'
    },
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 phút trước
  },
  {
    id: '507f1f77bcf86cd799439203',
    user_id: '507f1f77bcf86cd799439013', // Lê Văn Cường
    activity_type: 'CheckIn',
    description: 'Check-in tại chi nhánh',
    metadata: {
      branch_name: 'Chi nhánh Quận 3'
    },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 phút trước
  },
  {
    id: '507f1f77bcf86cd799439204',
    user_id: '507f1f77bcf86cd799439014', // Phạm Thị Dung
    activity_type: 'PTBooking',
    description: 'Đặt lịch PT mới',
    metadata: {
      trainer_name: 'Hoàng Văn Em',
      duration: 90,
      branch_name: 'Chi nhánh Quận 1'
    },
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439205',
    user_id: '507f1f77bcf86cd799439015', // Hoàng Văn E
    activity_type: 'PackageRenewal',
    description: 'Gia hạn gói tập',
    metadata: {
      package_name: 'Gói Combo 6 tháng',
      amount: 4500000,
      payment_method: 'BankTransfer'
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439206',
    user_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    activity_type: 'ScheduleCompleted',
    description: 'Hoàn thành buổi PT',
    metadata: {
      member_name: 'Nguyễn Thị F',
      duration: 60,
      branch_name: 'Chi nhánh Quận 2'
    },
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439207',
    user_id: '507f1f77bcf86cd799439017', // Nguyễn Văn G
    activity_type: 'CheckOut',
    description: 'Check-out khỏi phòng tập',
    metadata: {
      branch_name: 'Chi nhánh Quận 1',
      duration: 120
    },
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439208',
    user_id: '507f1f77bcf86cd799439018', // Trần Thị H
    activity_type: 'PackagePurchase',
    description: 'Mua gói tập mới',
    metadata: {
      package_name: 'Gói Trial 7 ngày',
      amount: 0,
      payment_method: 'Cash'
    },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439209',
    user_id: '507f1f77bcf86cd799439019', // Lê Văn I
    activity_type: 'BookingConfirmed',
    description: 'Xác nhận lịch PT',
    metadata: {
      trainer_name: 'Võ Thị Phương',
      scheduled_time: '2024-03-21T18:00:00Z',
      branch_name: 'Chi nhánh Quận 3'
    },
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439210',
    user_id: '507f1f77bcf86cd799439020', // Phạm Thị J
    activity_type: 'HealthInfoUpdate',
    description: 'Cập nhật thông tin sức khỏe',
    metadata: {
      weight: 55,
      height: 165,
      bmi: 20.2
    },
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString() // 7 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439211',
    user_id: '507f1f77bcf86cd799439021', // Hoàng Văn K
    activity_type: 'BookingRejected',
    description: 'Từ chối yêu cầu đặt lịch PT',
    metadata: {
      trainer_name: 'Hoàng Văn Em',
      rejection_reason: 'Lịch đã đầy',
      branch_name: 'Chi nhánh Quận 1'
    },
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439212',
    user_id: '507f1f77bcf86cd799439022', // Võ Thị L
    activity_type: 'ProfileUpdate',
    description: 'Cập nhật thông tin cá nhân',
    metadata: {
      updated_fields: ['phone', 'address']
    },
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString() // 9 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439213',
    user_id: '507f1f77bcf86cd799439023', // Nguyễn Văn M
    activity_type: 'CheckIn',
    description: 'Check-in tại chi nhánh',
    metadata: {
      branch_name: 'Chi nhánh Quận 2'
    },
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439214',
    user_id: '507f1f77bcf86cd799439024', // Trần Thị N
    activity_type: 'Payment',
    description: 'Thanh toán thành công',
    metadata: {
      amount: 1800000,
      package_name: 'Gói Basic 1 tháng',
      payment_method: 'ZaloPay'
    },
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 giờ trước
  },
  {
    id: '507f1f77bcf86cd799439215',
    user_id: '507f1f77bcf86cd799439025', // Lê Văn O
    activity_type: 'ScheduleCompleted',
    description: 'Hoàn thành buổi PT',
    metadata: {
      member_name: 'Phạm Thị P',
      duration: 90,
      branch_name: 'Chi nhánh Quận 1'
    },
    created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() // 15 giờ trước
  }
];

// Helper functions
export const getRecentActivities = (limit: number = 10) => {
  return mockActivityLogs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const getActivitiesByType = (activityType: ActivityLog['activity_type']) => {
  return mockActivityLogs.filter(activity => activity.activity_type === activityType);
};

export const getActivitiesByUserId = (userId: string) => {
  return mockActivityLogs.filter(activity => 
    activity.user_id === userId || activity.target_user_id === userId
  );
};

export const getActivitiesByTimeRange = (startDate: string, endDate: string) => {
  return mockActivityLogs.filter(activity => {
    const activityDate = new Date(activity.created_at);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return activityDate >= start && activityDate <= end;
  });
};

// Activity type display mapping
export const activityTypeDisplay = {
  'MemberRegistration': 'Hội viên mới đăng ký',
  'Payment': 'Thanh toán thành công',
  'CheckIn': 'Check-in tại chi nhánh',
  'CheckOut': 'Check-out khỏi phòng tập',
  'PTBooking': 'Đặt lịch PT mới',
  'PackageRenewal': 'Gia hạn gói tập',
  'PackagePurchase': 'Mua gói tập mới',
  'ScheduleCompleted': 'Hoàn thành buổi PT',
  'BookingConfirmed': 'Xác nhận lịch PT',
  'BookingRejected': 'Từ chối yêu cầu đặt lịch PT',
  'ProfileUpdate': 'Cập nhật thông tin cá nhân',
  'HealthInfoUpdate': 'Cập nhật thông tin sức khỏe'
};

// Activity type color mapping
export const activityTypeColor = {
  'MemberRegistration': 'success',
  'Payment': 'success',
  'CheckIn': 'info',
  'CheckOut': 'info',
  'PTBooking': 'info',
  'PackageRenewal': 'success',
  'PackagePurchase': 'success',
  'ScheduleCompleted': 'success',
  'BookingConfirmed': 'success',
  'BookingRejected': 'warning',
  'ProfileUpdate': 'info',
  'HealthInfoUpdate': 'info'
} as const;
