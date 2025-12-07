export interface DiscountType {
    _id: string;
    name: string;
    displayName: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateDiscountTypeData {
    name: string;
    displayName: string;
    description?: string;
    status?: 'Active' | 'Inactive';
  }
  
  export interface UpdateDiscountTypeData extends Partial<CreateDiscountTypeData> {}