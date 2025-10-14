import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageApi } from './package.api';
import { Package, CreatePackageRequest, UpdatePackageRequest } from '../../../types/package.types';

// Query keys
export const packageQueryKeys = {
  all: ['packages'] as const,
  lists: () => [...packageQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...packageQueryKeys.lists(), { filters }] as const,
  details: () => [...packageQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...packageQueryKeys.details(), id] as const,
};

// Queries
export const usePackages = () => {
  return useQuery({
    queryKey: packageQueryKeys.lists(),
    queryFn: packageApi.getAllPackages,
  });
};

export const usePackage = (packageId: string) => {
  return useQuery({
    queryKey: packageQueryKeys.detail(packageId),
    queryFn: () => packageApi.getPackageById(packageId),
    enabled: !!packageId,
  });
};

// Mutations
export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePackageRequest) => packageApi.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ packageId, data }: { packageId: string; data: UpdatePackageRequest }) => 
      packageApi.updatePackage(packageId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageQueryKeys.detail(variables.packageId) });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (packageId: string) => packageApi.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageQueryKeys.lists() });
    },
  });
};
