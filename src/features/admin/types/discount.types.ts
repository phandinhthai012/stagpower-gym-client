export interface Discount {
  _id: string;
  name: string;
  type: 'HSSV' | 'VIP' | 'Group' | 'Company' | 'Voucher';
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscount?: number;
  bonusDays?: number;
  conditions: string;
  durationTypes: ('ShortTerm' | 'MediumTerm' | 'LongTerm')[];
  packageTypes: ('Membership' | 'Combo' | 'PT')[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountData {
  name: string;
  type: string;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscount?: number;
  bonusDays?: number;
  conditions: string;
  durationTypes: string[];
  packageTypes: string[];
  startDate: string;
  endDate: string;
  status?: string;
}

export interface UpdateDiscountData extends Partial<CreateDiscountData> {}

export interface DiscountSearchParams {
  q?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
