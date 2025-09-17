export interface Branch {
  id: string;
  name: string;
  address: string;
  open_time: string;
  close_time: string;
  status: 'Active' | 'Maintenance' | 'Closed';
  phone: string;
  email: string;
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
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];
