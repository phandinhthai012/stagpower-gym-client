import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { userApi } from '../../features/member/api/user.api';

// 1. GET - Lấy danh sách users với pagination
export const useUsers = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: queryKeys.usersPaginated(params),
    queryFn: () => userApi.getUsersWithPagination(params.page, params.limit),
    placeholderData: keepPreviousData,
  });
}

// // 2. GET - Lấy danh sách members
// export const useMembers = () => {
//   return useQuery({
//     queryKey: queryKeys.members,
//     queryFn: userApi.getAllMembers
//   });
// };


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
  });
};

// Note: Create mutations are not available in userApi
// These would need to be implemented in the backend API first

