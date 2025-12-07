// Tạo file mới này
import { useMutation } from '@tanstack/react-query';
import { memberDiscountApi, ValidateDiscountCodeRequest, ValidateDiscountCodeResponse } from '../api/discount.api';
import { toast } from 'sonner';

export const useValidateDiscountCode = () => {
  return useMutation({
    mutationFn: (data: ValidateDiscountCodeRequest) => memberDiscountApi.validateDiscountCode(data),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra mã giảm giá');
    },
  });
};