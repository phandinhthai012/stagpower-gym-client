import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import packageService from '../../services/package.service';



export const usePackages = () => {
    return useQuery({
        queryKey: queryKeys.packages,
        queryFn: () => packageService.getAllPackages(),
    });
}

export const usePackageById = (packageId: string) => {
    return useQuery({
        queryKey: queryKeys.package(packageId),
        queryFn: () => packageService.getPackageById(packageId),
    });
}