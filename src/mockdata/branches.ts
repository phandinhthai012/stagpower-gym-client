export interface Branch {
  id: string;
  name: string;
  address: string;
  open_time: string;
  close_time: string;
  status: 'Active' | 'Maintenance' | 'Closed';
  phone: string;
  email: string;
  description: string;
  opening_hours: string;
  staff_count: number;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export const mockBranches: Branch[] = [
  {
    id: '507f1f77bcf86cd799439041',
    name: 'StagPower Gym Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3822 1234',
    email: 'q1@stagpower.com',
    description: 'Chi nhánh trung tâm với đầy đủ trang thiết bị hiện đại',
    opening_hours: '06:00 - 22:00',
    staff_count: 12,
    member_count: 450,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439042',
    name: 'StagPower Gym Quận 3',
    address: '456 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3930 5678',
    email: 'q3@stagpower.com',
    description: 'Chi nhánh với không gian rộng rãi và môi trường tập luyện thoải mái',
    opening_hours: '06:00 - 22:00',
    staff_count: 10,
    member_count: 380,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439043',
    name: 'StagPower Gym Quận 7',
    address: '789 Nguyễn Thị Thập, Phường Tân Phong, Quận 7, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3775 9012',
    email: 'q7@stagpower.com',
    description: 'Chi nhánh mới với trang thiết bị cao cấp và dịch vụ chuyên nghiệp',
    opening_hours: '06:00 - 22:00',
    staff_count: 8,
    member_count: 320,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439044',
    name: 'StagPower Gym Quận 10',
    address: '321 Lý Thái Tổ, Phường 1, Quận 10, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3865 3456',
    email: 'q10@stagpower.com',
    description: 'Chi nhánh với nhiều lớp học và chương trình đa dạng',
    opening_hours: '06:00 - 22:00',
    staff_count: 15,
    member_count: 520,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439045',
    name: 'StagPower Gym Quận Bình Thạnh',
    address: '654 Xô Viết Nghệ Tĩnh, Phường 25, Quận Bình Thạnh, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3841 7890',
    email: 'bt@stagpower.com',
    description: 'Chi nhánh với khu vực cardio và weight training riêng biệt',
    opening_hours: '06:00 - 22:00',
    staff_count: 11,
    member_count: 410,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439046',
    name: 'StagPower Gym Quận Tân Bình',
    address: '987 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Maintenance',
    phone: '028 3812 2468',
    email: 'tb@stagpower.com',
    description: 'Chi nhánh đang được nâng cấp trang thiết bị và cơ sở vật chất',
    opening_hours: 'Tạm đóng để bảo trì',
    staff_count: 0,
    member_count: 0,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439047',
    name: 'StagPower Gym Quận Gò Vấp',
    address: '147 Quang Trung, Phường 10, Quận Gò Vấp, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3894 1357',
    email: 'gv@stagpower.com',
    description: 'Chi nhánh với studio yoga và pilates chuyên nghiệp',
    opening_hours: '06:00 - 22:00',
    staff_count: 9,
    member_count: 350,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439048',
    name: 'StagPower Gym Quận Phú Nhuận',
    address: '258 Phan Đình Phùng, Phường 2, Quận Phú Nhuận, TP.HCM',
    open_time: '06:00',
    close_time: '22:00',
    status: 'Active',
    phone: '028 3847 9753',
    email: 'pn@stagpower.com',
    description: 'Chi nhánh với khu vực functional training và group classes',
    opening_hours: '06:00 - 22:00',
    staff_count: 13,
    member_count: 480,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];
