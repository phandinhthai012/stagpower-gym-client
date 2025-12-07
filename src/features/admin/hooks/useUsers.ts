import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { userApi } from '../../member/api/user.api';
import { toast } from 'sonner';

// 1. GET - Lấy danh sách users với pagination
export const useUsers = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: queryKeys.usersPaginated(params),
    queryFn: () => userApi.getUsersWithPagination(params.page, params.limit),
    placeholderData: keepPreviousData,
  });
}

// 2. GET - Lấy danh sách members
export const useMembers = () => {
  return useQuery({
    queryKey: queryKeys.members,
    queryFn: () => userApi.getMembers(1, 100), // Get all members with high limit
  });
};

// 2.1 GET - Lấy danh sách members với pagination
export const useMembersWithPagination = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  membership_level?: string;
}) => {
  return useQuery({
    queryKey: ['members', 'paginated', params],
    queryFn: () => userApi.getMembersWithPagination(params),
    placeholderData: keepPreviousData,
  });
};

// 3. GET - Lấy danh sách staffs
export const useStaffs = () => {
  return useQuery({
    queryKey: queryKeys.staffs,
    queryFn: userApi.getStaffs,
  });
};

// 4. GET - Lấy thông tin người dùng
export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userById(userId),
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

// 5. MUTATION - Cập nhật trạng thái user
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) => 
      userApi.changeUserStatus(userId, status as 'active' | 'inactive' | 'pending' | 'Banned'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.members });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffs });
      toast.success('Trạng thái người dùng đã được cập nhật!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

// 6. MUTATION - Cập nhật thông tin user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) => 
      userApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.members });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffs });
      toast.success('Thông tin người dùng đã được cập nhật!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật thông tin: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};
