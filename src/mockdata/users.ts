export interface User {
  id: string;
  role: 'Member' | 'Trainer' | 'Staff' | 'Admin';
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  password: string; // bcrypt hashed
  cccd: string;
  photo: string;
  join_date: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  
  // Role-specific info
  member_info?: {
    membership_level: 'Basic' | 'VIP';
    qr_code: string;
    notes?: string;
    is_hssv: boolean;
    total_spending: number;
    membership_month: number;
    current_branch_id?: string;
  };
  
  trainer_info?: {
    specialty: string[];
    experience_years: number;
    certifications: string[];
    working_hours: {
      start: string;
      end: string;
    };
  };
  
  staff_info?: {
    branch_id: string;
    position: string;
  };
  
  admin_info?: {
    permissions: string[];
    managed_branches: string[];
  };
}

export const mockUsers: User[] = [
  // Members
  {
    id: '507f1f77bcf86cd799439011',
    role: 'Member',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    gender: 'male',
    date_of_birth: '1995-03-15',
    password: 'member123', // Demo password for testing
    cccd: '123456789012',
    photo: 'https://via.placeholder.com/150/007bff/ffffff?text=NA',
    join_date: '2024-01-15',
    status: 'active',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
    member_info: {
      membership_level: 'VIP',
      qr_code: 'QR_AN_20240115_001',
      notes: 'Khách hàng VIP, tập thường xuyên',
      is_hssv: false,
      total_spending: 15000000,
      membership_month: 12,
      current_branch_id: '507f1f77bcf86cd799439041'
    }
  },
  {
    id: '507f1f77bcf86cd799439012',
    role: 'Member',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    phone: '0901234568',
    gender: 'female',
    date_of_birth: '2000-07-22',
    password: 'member123', // Demo password for testing
    cccd: '123456789013',
    photo: 'https://via.placeholder.com/150/28a745/ffffff?text=TB',
    join_date: '2024-02-01',
    status: 'active',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z',
    member_info: {
      membership_level: 'Basic',
      qr_code: 'QR_BINH_20240201_002',
      notes: 'Học sinh sinh viên, ưu đãi HSSV',
      is_hssv: true,
      total_spending: 3000000,
      membership_month: 3,
      current_branch_id: '507f1f77bcf86cd799439041'
    }
  },
  {
    id: '507f1f77bcf86cd799439013',
    role: 'Member',
    fullName: 'Lê Văn Cường',
    email: 'levancuong@gmail.com',
    phone: '0901234569',
    gender: 'male',
    date_of_birth: '1988-11-10',
    password: 'member123', // Demo password for testing
    cccd: '123456789014',
    photo: 'https://via.placeholder.com/150/dc3545/ffffff?text=LC',
    join_date: '2024-01-20',
    status: 'active',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    member_info: {
      membership_level: 'VIP',
      qr_code: 'QR_CUONG_20240120_003',
      notes: 'Khách hàng thân thiết, tập PT',
      is_hssv: false,
      total_spending: 25000000,
      membership_month: 6,
      current_branch_id: '507f1f77bcf86cd799439042'
    }
  },
  {
    id: '507f1f77bcf86cd799439014',
    role: 'Member',
    fullName: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    phone: '0901234570',
    gender: 'female',
    date_of_birth: '1992-05-18',
    password: 'member123', // Demo password for testing
    cccd: '123456789015',
    photo: 'https://via.placeholder.com/150/6f42c1/ffffff?text=PD',
    join_date: '2024-03-01',
    status: 'inactive',
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-01T11:00:00Z',
    member_info: {
      membership_level: 'Basic',
      qr_code: 'QR_DUNG_20240301_004',
      notes: 'Gói thử 7 ngày',
      is_hssv: false,
      total_spending: 500000,
      membership_month: 1,
      current_branch_id: '507f1f77bcf86cd799439041'
    }
  },

  // Trainers
  {
    id: '507f1f77bcf86cd799439015',
    role: 'Trainer',
    fullName: 'Hoàng Văn Em',
    email: 'hoangvanem@gmail.com',
    phone: '0901234571',
    gender: 'male',
    date_of_birth: '1990-09-12',
    password: 'trainer123', // Demo password for testing
    cccd: '123456789016',
    photo: 'https://via.placeholder.com/150/17a2b8/ffffff?text=HE',
    join_date: '2023-06-01',
    status: 'active',
    created_at: '2023-06-01T12:00:00Z',
    updated_at: '2023-06-01T12:00:00Z',
    trainer_info: {
      specialty: ['Weight Training', 'Cardio', 'Yoga'],
      experience_years: 5,
      certifications: ['ACSM Certified Personal Trainer', 'Yoga Alliance RYT-200'],
      working_hours: {
        start: '06:00',
        end: '22:00'
      }
    }
  },
  {
    id: '507f1f77bcf86cd799439016',
    role: 'Trainer',
    fullName: 'Võ Thị Phương',
    email: 'vothiphuong@gmail.com',
    phone: '0901234572',
    gender: 'female',
    date_of_birth: '1985-12-03',
    password: 'trainer123', // Demo password for testing
    cccd: '123456789017',
    photo: 'https://via.placeholder.com/150/fd7e14/ffffff?text=VP',
    join_date: '2023-08-15',
    status: 'active',
    created_at: '2023-08-15T13:00:00Z',
    updated_at: '2023-08-15T13:00:00Z',
    trainer_info: {
      specialty: ['Pilates', 'Functional Training', 'Rehabilitation'],
      experience_years: 8,
      certifications: ['NASM Certified Personal Trainer', 'Pilates Method Alliance'],
      working_hours: {
        start: '07:00',
        end: '21:00'
      }
    }
  },

  // Staff
  {
    id: '507f1f77bcf86cd799439017',
    role: 'Staff',
    fullName: 'Đặng Văn Giang',
    email: 'dangvangiang@gmail.com',
    phone: '0901234573',
    gender: 'male',
    date_of_birth: '1993-04-25',
    password: 'staff123', // Demo password for testing
    cccd: '123456789018',
    photo: 'https://via.placeholder.com/150/20c997/ffffff?text=DG',
    join_date: '2023-10-01',
    status: 'active',
    created_at: '2023-10-01T14:00:00Z',
    updated_at: '2023-10-01T14:00:00Z',
    staff_info: {
      branch_id: '507f1f77bcf86cd799439041',
      position: 'Lễ tân'
    }
  },
  {
    id: '507f1f77bcf86cd799439018',
    role: 'Staff',
    fullName: 'Bùi Thị Hoa',
    email: 'buithihoa@gmail.com',
    phone: '0901234574',
    gender: 'female',
    date_of_birth: '1991-08-14',
    password: 'staff123', // Demo password for testing
    cccd: '123456789019',
    photo: 'https://via.placeholder.com/150/e83e8c/ffffff?text=BH',
    join_date: '2023-11-15',
    status: 'active',
    created_at: '2023-11-15T15:00:00Z',
    updated_at: '2023-11-15T15:00:00Z',
    staff_info: {
      branch_id: '507f1f77bcf86cd799439042',
      position: 'Quản lý chi nhánh'
    }
  },

  // Admin
  {
    id: '507f1f77bcf86cd799439019',
    role: 'Admin',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@stagpower.com',
    phone: '0901234575',
    gender: 'male',
    date_of_birth: '1980-01-01',
    password: 'admin123', // Demo password for testing
    cccd: '123456789020',
    photo: 'https://via.placeholder.com/150/6c757d/ffffff?text=AD',
    join_date: '2023-01-01',
    status: 'active',
    created_at: '2023-01-01T16:00:00Z',
    updated_at: '2023-01-01T16:00:00Z',
    admin_info: {
      permissions: ['user_management', 'package_management', 'report_view', 'system_config'],
      managed_branches: ['507f1f77bcf86cd799439041', '507f1f77bcf86cd799439042', '507f1f77bcf86cd799439043']
    }
  }
];
