export interface Invoice {
  _id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  packageId: string;
  packageName: string;
  packageType: string;
  amount: number;
  originalAmount: number;
  discountAmount?: number;
  discountId?: string;
  paymentMethod: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Cancelled';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    reference?: string;
  };
}

export interface CreateInvoiceData {
  memberId: string;
  packageId: string;
  amount: number;
  originalAmount?: number;
  discountId?: string;
  paymentMethod: string;
  dueDate: string;
  notes?: string;
}

export interface UpdateInvoiceData {
  amount?: number;
  originalAmount?: number;
  discountId?: string;
  paymentMethod?: string;
  dueDate?: string;
  notes?: string;
}

export interface PaymentRecord {
  _id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  paymentGateway?: string;
  reference?: string;
  notes?: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  paymentGateway?: string;
  reference?: string;
  notes?: string;
}

export interface InvoiceSearchParams {
  status?: string;
  packageType?: string;
  startDate?: string;
  endDate?: string;
  priceRange?: string;
  memberId?: string;
  search?: string;
}

export interface InvoiceStats {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  averageInvoiceValue: number;
}
