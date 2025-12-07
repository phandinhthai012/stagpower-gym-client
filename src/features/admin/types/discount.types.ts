export interface Discount {
  _id: string;
  name: string;
  code?: string; // Thêm code
  type: string;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscount?: number;
  minPurchaseAmount?: number; // Thêm minPurchaseAmount
  bonusDays?: number;
  usageLimit?: number | null; // Thêm usageLimit
  usageCount?: number; // Thêm usageCount
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
  code?: string; // Thêm code
  type: string;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscount?: number;
  minPurchaseAmount?: number; // Thêm minPurchaseAmount
  bonusDays?: number;
  usageLimit?: number | null; // Thêm usageLimit
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

export interface GetAvailableDiscountsParams {
  packageType?: string;
  packageCategory?: string;
  memberId?: string;
}