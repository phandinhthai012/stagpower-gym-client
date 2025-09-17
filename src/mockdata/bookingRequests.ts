export interface BookingRequest {
  id: string;
  member_id: string;
  trainer_id: string;
  subscription_id: string;
  requested_date_time: string;
  duration?: number; // minutes
  note: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const mockBookingRequests: BookingRequest[] = [
  // Pending booking requests
  {
    id: '507f1f77bcf86cd799439141',
    member_id: '507f1f77bcf86cd799439011', // Nguyễn Văn An
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439051',
    requested_date_time: '2024-03-23T18:00:00Z',
    duration: 90,
    note: 'Muốn đặt lịch PT để tập cơ bụng và cardio',
    status: 'Pending',
    created_at: '2024-03-20T15:00:00Z',
    updated_at: '2024-03-20T15:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439142',
    member_id: '507f1f77bcf86cd799439012', // Trần Thị Bình
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439052',
    requested_date_time: '2024-03-22T16:00:00Z',
    duration: 60,
    note: 'Lần đầu tập PT, muốn học các bài tập cơ bản',
    status: 'Pending',
    created_at: '2024-03-20T16:30:00Z',
    updated_at: '2024-03-20T16:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439143',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439056',
    requested_date_time: '2024-03-25T19:30:00Z',
    duration: 90,
    note: 'Muốn đặt thêm buổi PT để tập Pilates nâng cao',
    status: 'Pending',
    created_at: '2024-03-20T17:00:00Z',
    updated_at: '2024-03-20T17:00:00Z'
  },

  // Confirmed booking requests
  {
    id: '507f1f77bcf86cd799439144',
    member_id: '507f1f77bcf86cd799439013', // Lê Văn Cường
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439053',
    requested_date_time: '2024-03-22T06:30:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập cơ bụng và cardio',
    status: 'Confirmed',
    created_at: '2024-03-18T10:00:00Z',
    updated_at: '2024-03-18T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439145',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    requested_date_time: '2024-03-25T06:30:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập tay và vai',
    status: 'Confirmed',
    created_at: '2024-03-18T10:00:00Z',
    updated_at: '2024-03-18T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439146',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439056',
    requested_date_time: '2024-03-21T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Pilates và stretching',
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T15:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439147',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    requested_date_time: '2024-03-24T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Functional training',
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T15:00:00Z'
  },

  // Rejected booking requests
  {
    id: '507f1f77bcf86cd799439148',
    member_id: '507f1f77bcf86cd799439011', // Nguyễn Văn An
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439051',
    requested_date_time: '2024-03-21T06:00:00Z',
    duration: 90,
    note: 'Muốn đặt lịch PT sáng sớm',
    status: 'Rejected',
    rejection_reason: 'Trainer không có lịch trống vào giờ này',
    created_at: '2024-03-19T08:00:00Z',
    updated_at: '2024-03-19T10:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439149',
    member_id: '507f1f77bcf86cd799439012', // Trần Thị Bình
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439052',
    requested_date_time: '2024-03-20T22:00:00Z',
    duration: 60,
    note: 'Muốn đặt lịch PT buổi tối muộn',
    status: 'Rejected',
    rejection_reason: 'Ngoài giờ làm việc của trainer (22:00)',
    created_at: '2024-03-19T20:00:00Z',
    updated_at: '2024-03-19T21:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439150',
    member_id: '507f1f77bcf86cd799439014', // Phạm Thị Dung
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439054',
    requested_date_time: '2024-03-15T10:00:00Z',
    duration: 90,
    note: 'Muốn đặt lịch PT để thử nghiệm',
    status: 'Rejected',
    rejection_reason: 'Gói tập đã hết hạn',
    created_at: '2024-03-14T15:00:00Z',
    updated_at: '2024-03-14T16:00:00Z'
  },

  // Historical booking requests
  {
    id: '507f1f77bcf86cd799439151',
    member_id: '507f1f77bcf86cd799439013', // Lê Văn Cường
    trainer_id: '507f1f77bcf86cd799439015', // Hoàng Văn Em
    subscription_id: '507f1f77bcf86cd799439053',
    requested_date_time: '2024-03-20T06:30:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập toàn thân',
    status: 'Confirmed',
    created_at: '2024-03-17T10:00:00Z',
    updated_at: '2024-03-17T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439152',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    requested_date_time: '2024-03-19T06:30:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập cardio và sức bền',
    status: 'Confirmed',
    created_at: '2024-03-16T10:00:00Z',
    updated_at: '2024-03-16T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439153',
    member_id: '507f1f77bcf86cd799439013',
    trainer_id: '507f1f77bcf86cd799439015',
    subscription_id: '507f1f77bcf86cd799439053',
    requested_date_time: '2024-03-17T06:30:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập cơ bụng và lưng',
    status: 'Confirmed',
    created_at: '2024-03-14T10:00:00Z',
    updated_at: '2024-03-14T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439154',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439056',
    requested_date_time: '2024-03-18T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Pilates cơ bản',
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T15:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439155',
    member_id: '507f1f77bcf86cd799439021',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439056',
    requested_date_time: '2024-03-15T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Stretching và thư giãn',
    status: 'Confirmed',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T15:00:00Z'
  },

  // More historical data
  {
    id: '507f1f77bcf86cd799439156',
    member_id: '507f1f77bcf86cd799439022',
    trainer_id: '507f1f77bcf86cd799439016', // Võ Thị Phương
    subscription_id: '507f1f77bcf86cd799439057',
    requested_date_time: '2024-02-28T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Pilates',
    status: 'Confirmed',
    created_at: '2024-02-25T10:00:00Z',
    updated_at: '2024-02-25T14:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439157',
    member_id: '507f1f77bcf86cd799439022',
    trainer_id: '507f1f77bcf86cd799439016',
    subscription_id: '507f1f77bcf86cd799439057',
    requested_date_time: '2024-02-25T19:00:00Z',
    duration: 90,
    note: 'Đặt lịch PT để tập Functional training',
    status: 'Confirmed',
    created_at: '2024-02-22T10:00:00Z',
    updated_at: '2024-02-22T14:00:00Z'
  }
];
