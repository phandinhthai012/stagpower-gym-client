import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discountTypeApi } from '../api/discountType.api';
import { CreateDiscountTypeData, UpdateDiscountTypeData } from '../types/discountType.types';
import { toast } from 'sonner';

// Query Keys
export const discountTypeQueryKeys = {
  all: ['discountTypes'] as const,
  lists: () => [...discountTypeQueryKeys.all, 'list'] as const,
  details: () => [...discountTypeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...discountTypeQueryKeys.details(), id] as const,
};

// Get all discount types
export const useDiscountTypes = () => {
  return useQuery({
    queryKey: discountTypeQueryKeys.lists(),
    queryFn: discountTypeApi.getAllDiscountTypes,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

// Get discount type by ID
export const useDiscountTypeById = (discountTypeId: string) => {
  return useQuery({
    queryKey: discountTypeQueryKeys.detail(discountTypeId),
    queryFn: () => discountTypeApi.getDiscountTypeById(discountTypeId),
    enabled: !!discountTypeId,
  });
};

// Create discount type mutation
export const useCreateDiscountType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountTypeData: CreateDiscountTypeData) => 
      discountTypeApi.createDiscountType(discountTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountTypeQueryKeys.lists() });
      toast.success('Tạo loại giảm giá thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo loại giảm giá');
    },
  });
};

// Update discount type mutation
export const useUpdateDiscountType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiscountTypeData }) =>
      discountTypeApi.updateDiscountType(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: discountTypeQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: discountTypeQueryKeys.detail(variables.id) });
      toast.success('Cập nhật loại giảm giá thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật loại giảm giá');
    },
  });
};

// Delete discount type mutation
export const useDeleteDiscountType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountTypeId: string) => discountTypeApi.deleteDiscountType(discountTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountTypeQueryKeys.lists() });
      toast.success('Xóa loại giảm giá thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa loại giảm giá');
    },
  });
};