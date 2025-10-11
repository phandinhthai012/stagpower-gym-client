import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, UpdateUserProfileRequest } from './user.api';

export const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userApi.getMe(),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => userApi.updateMyProfile(data),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserProfileRequest }) =>
      userApi.updateUser(userId, data),
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['user', data._id] });
    },
  });
};

export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'pending' | 'Banned' }) =>
      userApi.changeUserStatus(userId, status),
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['user', data._id] });
    },
  });
};
