export interface Payment {
  id: string;
  subscription_id: string;
  member_id: string;
  original_amount: number; // VNĐ
  amount: number; // VNĐ after discount
  discount_details?: Array<{
    discount_id: string;
    type: string;
    discount_percentage?: number;
    discount_amount?: number;
    description: string;
    applied_at: string;
  }>;
  payment_method: 'Momo' | 'ZaloPay' | 'Cash' | 'Card' | 'BankTransfer';
  payment_date: string;
  payment_status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  transaction_id?: string;
  invoice_number: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const mockPayments: Payment[] = [
  // VIP Membership Payment - Nguyễn Văn An
  {
    id: '507f1f77bcf86cd799439061',
    subscription_id: '507f1f77bcf86cd799439051',
    member_id: '507f1f77bcf86cd799439011',
    original_amount: 10800000,
    amount: 9720000, // 10% VIP discount
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439071',
        type: 'VIP',
        discount_percentage: 10,
        discount_amount: 1080000,
        description: 'Giảm giá VIP 10%',
        applied_at: '2024-01-15T08:00:00Z'
      }
    ],
    payment_method: 'BankTransfer',
    payment_date: '2024-01-15T08:30:00Z',
    payment_status: 'Completed',
    transaction_id: 'TXN_20240115_001',
    invoice_number: 'INV-2024-001',
    notes: 'Thanh toán gói VIP 12 tháng',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:30:00Z'
  },

  // Basic Membership with HSSV Discount - Trần Thị Bình
  {
    id: '507f1f77bcf86cd799439062',
    subscription_id: '507f1f77bcf86cd799439052',
    member_id: '507f1f77bcf86cd799439012',
    original_amount: 2100000,
    amount: 1785000, // 15% HSSV discount
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439072',
        type: 'HSSV',
        discount_percentage: 15,
        discount_amount: 315000,
        description: 'Giảm giá HSSV 15%',
        applied_at: '2024-02-01T09:00:00Z'
      }
    ],
    payment_method: 'Momo',
    payment_date: '2024-02-01T09:15:00Z',
    payment_status: 'Completed',
    transaction_id: 'MOMO_20240201_002',
    invoice_number: 'INV-2024-002',
    notes: 'Thanh toán gói Basic 3 tháng với ưu đãi HSSV',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:15:00Z'
  },

  // Combo Payment - Lê Văn Cường
  {
    id: '507f1f77bcf86cd799439063',
    subscription_id: '507f1f77bcf86cd799439053',
    member_id: '507f1f77bcf86cd799439013',
    original_amount: 8600000,
    amount: 7740000, // 10% VIP discount
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439071',
        type: 'VIP',
        discount_percentage: 10,
        discount_amount: 860000,
        description: 'Giảm giá VIP 10%',
        applied_at: '2024-01-20T10:00:00Z'
      }
    ],
    payment_method: 'Card',
    payment_date: '2024-01-20T10:20:00Z',
    payment_status: 'Completed',
    transaction_id: 'CARD_20240120_003',
    invoice_number: 'INV-2024-003',
    notes: 'Thanh toán combo VIP 6 tháng + 10 buổi PT',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:20:00Z'
  },

  // Trial Payment - Phạm Thị Dung
  {
    id: '507f1f77bcf86cd799439064',
    subscription_id: '507f1f77bcf86cd799439054',
    member_id: '507f1f77bcf86cd799439014',
    original_amount: 200000,
    amount: 200000,
    payment_method: 'Cash',
    payment_date: '2024-03-01T11:30:00Z',
    payment_status: 'Completed',
    invoice_number: 'INV-2024-004',
    notes: 'Thanh toán gói thử 7 ngày',
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-01T11:30:00Z'
  },

  // Suspended Membership Payment
  {
    id: '507f1f77bcf86cd799439065',
    subscription_id: '507f1f77bcf86cd799439055',
    member_id: '507f1f77bcf86cd799439020',
    original_amount: 6000000,
    amount: 5400000, // 10% early renewal discount
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439073',
        type: 'EarlyRenewal',
        discount_percentage: 10,
        discount_amount: 600000,
        description: 'Giảm giá gia hạn sớm 10%',
        applied_at: '2024-01-01T00:00:00Z'
      }
    ],
    payment_method: 'ZaloPay',
    payment_date: '2024-01-01T00:30:00Z',
    payment_status: 'Completed',
    transaction_id: 'ZALO_20240101_005',
    invoice_number: 'INV-2024-005',
    notes: 'Thanh toán gói Basic 12 tháng',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:30:00Z'
  },

  // PT Only Payment
  {
    id: '507f1f77bcf86cd799439066',
    subscription_id: '507f1f77bcf86cd799439056',
    member_id: '507f1f77bcf86cd799439021',
    original_amount: 2000000,
    amount: 2000000,
    payment_method: 'Momo',
    payment_date: '2024-03-10T13:15:00Z',
    payment_status: 'Completed',
    transaction_id: 'MOMO_20240310_006',
    invoice_number: 'INV-2024-006',
    notes: 'Thanh toán 5 buổi PT cá nhân',
    created_at: '2024-03-10T13:00:00Z',
    updated_at: '2024-03-10T13:15:00Z'
  },

  // Expired Combo Payment
  {
    id: '507f1f77bcf86cd799439067',
    subscription_id: '507f1f77bcf86cd799439057',
    member_id: '507f1f77bcf86cd799439022',
    original_amount: 4100000,
    amount: 3485000, // 15% HSSV discount
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439072',
        type: 'HSSV',
        discount_percentage: 15,
        discount_amount: 615000,
        description: 'Giảm giá HSSV 15%',
        applied_at: '2023-12-01T00:00:00Z'
      }
    ],
    payment_method: 'BankTransfer',
    payment_date: '2023-12-01T00:45:00Z',
    payment_status: 'Completed',
    transaction_id: 'TXN_20231201_007',
    invoice_number: 'INV-2023-007',
    notes: 'Thanh toán combo Basic 3 tháng + 5 buổi PT',
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-01T00:45:00Z'
  },

  // Pending Payment
  {
    id: '507f1f77bcf86cd799439068',
    subscription_id: '507f1f77bcf86cd799439058',
    member_id: '507f1f77bcf86cd799439023',
    original_amount: 800000,
    amount: 800000,
    payment_method: 'Momo',
    payment_date: '2024-03-15T12:00:00Z',
    payment_status: 'Pending',
    transaction_id: 'MOMO_20240315_008',
    invoice_number: 'INV-2024-008',
    notes: 'Thanh toán gói Basic 1 tháng - đang chờ xử lý',
    created_at: '2024-03-15T12:00:00Z',
    updated_at: '2024-03-15T12:00:00Z'
  },

  // Failed Payment
  {
    id: '507f1f77bcf86cd799439069',
    subscription_id: '507f1f77bcf86cd799439059',
    member_id: '507f1f77bcf86cd799439024',
    original_amount: 1200000,
    amount: 1200000,
    payment_method: 'Card',
    payment_date: '2024-03-20T14:00:00Z',
    payment_status: 'Failed',
    transaction_id: 'CARD_20240320_009',
    invoice_number: 'INV-2024-009',
    notes: 'Thanh toán thất bại - thẻ hết hạn',
    created_at: '2024-03-20T14:00:00Z',
    updated_at: '2024-03-20T14:05:00Z'
  },

  // Refunded Payment
  {
    id: '507f1f77bcf86cd799439070',
    subscription_id: '507f1f77bcf86cd799439060',
    member_id: '507f1f77bcf86cd799439025',
    original_amount: 2100000,
    amount: 2100000,
    payment_method: 'BankTransfer',
    payment_date: '2024-02-15T10:00:00Z',
    payment_status: 'Refunded',
    transaction_id: 'TXN_20240215_010',
    invoice_number: 'INV-2024-010',
    notes: 'Hoàn tiền do hủy gói tập',
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-20T15:00:00Z'
  }
  ,
  // Payment for new VIP Combo 12m + 12 PT
  {
    id: '507f1f77bcf86cd799439071',
    subscription_id: '507f1f77bcf86cd799439059',
    member_id: '507f1f77bcf86cd799439011',
    original_amount: 16000000,
    amount: 14400000,
    discount_details: [
      {
        discount_id: '507f1f77bcf86cd799439074',
        type: 'VIP',
        discount_percentage: 10,
        discount_amount: 1600000,
        description: 'Giảm giá VIP 10%',
        applied_at: '2025-01-01T00:00:00Z'
      }
    ],
    payment_method: 'BankTransfer',
    payment_date: '2025-01-01T00:10:00Z',
    payment_status: 'Completed',
    transaction_id: 'TXN_20250101_011',
    invoice_number: 'INV-2025-011',
    notes: 'Thanh toán combo VIP 12m + 12 PT',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:10:00Z'
  }
];
