import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import userService from '../../services/user.service';

// 1. GET - Lấy danh sách users với pagination
export const useUsers = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: queryKeys.usersPaginated(params),
    queryFn: () => userService.getAllUsersWithPagination(params),
    placeholderData: keepPreviousData,
  });
}

// 2. GET - Lấy danh sách members
export const useMembers = () => {
  return useQuery({
    queryKey: queryKeys.members,
    queryFn: userService.getAllMembers
  });
};


// 3. GET - Lấy danh sách staffs
export const useStaffs = () => {
  return useQuery({
    queryKey: queryKeys.staffs,
    queryFn: userService.getAllStaffs,
  });
};


// 4. GET - Lấy thông tin người dùng
export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userById(userId),
    queryFn: () => userService.getUserById(userId),
  });
};

// mutation create member
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// mutation create trainer
export const useCreateTrainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// mutation create staff
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

