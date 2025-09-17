export interface Discount {
  id: string;
  name: string;
  type: 'HSSV' | 'VIP' | 'Group' | 'Company' | 'Voucher';
  discount_percentage?: number;
  discount_amount?: number; // VNĐ
  max_discount?: number; // VNĐ
  bonus_days?: number;
  conditions: string;
  package_types: string[];
  duration_types: string[];
  start_date: string;
  end_date: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const mockDiscounts: Discount[] = [
  // HSSV Discounts
  {
    id: '507f1f77bcf86cd799439071',
    name: 'Ưu đãi HSSV - Giảm 15%',
    type: 'HSSV',
    discount_percentage: 15,
    conditions: 'Dành cho học sinh sinh viên từ 15-25 tuổi, có thẻ HSSV hoặc CCCD hợp lệ',
    package_types: ['Membership', 'Combo', 'PT'],
    duration_types: ['ShortTerm', 'MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439072',
    name: 'Ưu đãi HSSV - Giảm 10%',
    type: 'HSSV',
    discount_percentage: 10,
    conditions: 'Dành cho học sinh sinh viên, áp dụng cho gói ngắn hạn',
    package_types: ['Membership'],
    duration_types: ['ShortTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // VIP Discounts
  {
    id: '507f1f77bcf86cd799439073',
    name: 'Ưu đãi VIP - Giảm 10%',
    type: 'VIP',
    discount_percentage: 10,
    conditions: 'Dành cho khách hàng VIP (sử dụng ≥12 tháng hoặc chi tiêu ≥20 triệu)',
    package_types: ['Membership', 'Combo', 'PT'],
    duration_types: ['ShortTerm', 'MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439074',
    name: 'Ưu đãi VIP - Giảm 20% + Tặng 10 ngày',
    type: 'VIP',
    discount_percentage: 20,
    bonus_days: 10,
    conditions: 'Dành cho khách hàng VIP gia hạn gói ≥6 tháng',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Group Discounts
  {
    id: '507f1f77bcf86cd799439075',
    name: 'Ưu đãi nhóm bạn - Giảm 5%',
    type: 'Group',
    discount_percentage: 5,
    conditions: 'Mua gói tập từ 3 người trở lên cùng lúc',
    package_types: ['Membership', 'Combo'],
    duration_types: ['ShortTerm', 'MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439076',
    name: 'Ưu đãi nhóm bạn - Giảm 10%',
    type: 'Group',
    discount_percentage: 10,
    conditions: 'Mua gói tập từ 5 người trở lên cùng lúc',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Company Discounts
  {
    id: '507f1f77bcf86cd799439077',
    name: 'Ưu đãi công ty - Giảm 15%',
    type: 'Company',
    discount_percentage: 15,
    conditions: 'Dành cho nhân viên công ty có hợp đồng, cần giấy xác nhận',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439078',
    name: 'Ưu đãi công ty - Giảm 25%',
    type: 'Company',
    discount_percentage: 25,
    conditions: 'Dành cho công ty đối tác, cần thẻ nhân viên',
    package_types: ['Membership', 'Combo', 'PT'],
    duration_types: ['LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Voucher Discounts
  {
    id: '507f1f77bcf86cd799439079',
    name: 'Voucher giảm 500.000 VNĐ',
    type: 'Voucher',
    discount_amount: 500000,
    max_discount: 500000,
    conditions: 'Áp dụng cho gói tập từ 3 tháng trở lên',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439080',
    name: 'Voucher giảm 1.000.000 VNĐ',
    type: 'Voucher',
    discount_amount: 1000000,
    max_discount: 1000000,
    conditions: 'Áp dụng cho gói tập từ 6 tháng trở lên',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Early Renewal Discounts
  {
    id: '507f1f77bcf86cd799439081',
    name: 'Gia hạn sớm - Giảm 5%',
    type: 'Voucher',
    discount_percentage: 5,
    conditions: 'Gia hạn gói tập trước 7 ngày hết hạn',
    package_types: ['Membership', 'Combo'],
    duration_types: ['ShortTerm', 'MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '507f1f77bcf86cd799439082',
    name: 'Gia hạn sớm - Tặng 7 ngày',
    type: 'Voucher',
    bonus_days: 7,
    conditions: 'Gia hạn gói tập trước 15 ngày hết hạn',
    package_types: ['Membership', 'Combo'],
    duration_types: ['MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Inactive Discounts
  {
    id: '507f1f77bcf86cd799439083',
    name: 'Khuyến mãi Tết - Giảm 20%',
    type: 'Voucher',
    discount_percentage: 20,
    conditions: 'Khuyến mãi đặc biệt dịp Tết Nguyên Đán',
    package_types: ['Membership', 'Combo', 'PT'],
    duration_types: ['ShortTerm', 'MediumTerm', 'LongTerm'],
    start_date: '2024-01-01',
    end_date: '2024-02-15',
    status: 'Inactive',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-15T23:59:59Z'
  },
  {
    id: '507f1f77bcf86cd799439084',
    name: 'Khuyến mãi khai trương - Giảm 30%',
    type: 'Voucher',
    discount_percentage: 30,
    conditions: 'Khuyến mãi khai trương chi nhánh mới',
    package_types: ['Membership', 'Combo'],
    duration_types: ['ShortTerm', 'MediumTerm'],
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    status: 'Inactive',
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-31T23:59:59Z'
  }
];
