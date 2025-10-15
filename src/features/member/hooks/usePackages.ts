import { useQuery } from '@tanstack/react-query';
import { packageApi } from '../api/package.api';
import { Package } from '../types';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: () => packageApi.getAllPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePackageById = (packageId: string) => {
  return useQuery({
    queryKey: ['package', packageId],
    queryFn: () => packageApi.getPackageById(packageId),
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePackagesWithPagination = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['packages', 'paginated', page, limit],
    queryFn: () => packageApi.getPackagesWithPagination(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
