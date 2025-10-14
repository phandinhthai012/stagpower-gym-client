import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { packageApi } from '../api/package.api';
import { toast } from 'sonner';

export const usePackages = () => {
    return useQuery({
        queryKey: queryKeys.packages,
        queryFn: packageApi.getAllPackages,
    });
}

export const usePackageById = (packageId: string) => {
    return useQuery({
        queryKey: queryKeys.package(packageId),
        queryFn: () => packageApi.getPackageById(packageId),
    });
}
