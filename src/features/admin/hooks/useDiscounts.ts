import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { discountApi } from '../api/discount.api';
import { CreateDiscountData, UpdateDiscountData } from '../types/discount.types';
import { toast } from 'sonner';

// Query Keys
export const discountQueryKeys = {
  all: ['discounts'] as const,
  lists: () => [...discountQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...discountQueryKeys.lists(), { filters }] as const,
  details: () => [...discountQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...discountQueryKeys.details(), id] as const,
};

// Get all discounts
export const useDiscounts = () => {
  return useQuery({
    queryKey: discountQueryKeys.lists(),
    queryFn: discountApi.getAllDiscounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get discount by ID
export const useDiscountById = (discountId: string) => {
  return useQuery({
    queryKey: discountQueryKeys.detail(discountId),
    queryFn: () => discountApi.getDiscountById(discountId),
    enabled: !!discountId,
  });
};

// Search discounts
export const useSearchDiscounts = (searchParams: Record<string, any>) => {
  return useQuery({
    queryKey: discountQueryKeys.list(searchParams),
    queryFn: () => discountApi.searchDiscounts(searchParams),
    enabled: Object.keys(searchParams).length > 0,
  });
};

// Create discount mutation
export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountData: CreateDiscountData) => discountApi.createDiscount(discountData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.lists() });
      toast.success('Tạo ưu đãi thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo ưu đãi');
    },
  });
};

// Update discount mutation
export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiscountData }) =>
      discountApi.updateDiscount(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.detail(variables.id) });
      toast.success('Cập nhật ưu đãi thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ưu đãi');
    },
  });
};

// Change discount status mutation
export const useChangeDiscountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      discountApi.changeDiscountStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.detail(variables.id) });
      toast.success('Thay đổi trạng thái ưu đãi thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
    },
  });
};

// Delete discount mutation
export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountId: string) => discountApi.deleteDiscount(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountQueryKeys.lists() });
      toast.success('Xóa ưu đãi thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa ưu đãi');
    },
  });
};
