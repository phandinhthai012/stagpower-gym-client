import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import packageService from '../../services/package.service';
import { ApiResponse } from '../../types/api.types';


export const usePackages = () => {
    return useQuery({
        queryKey: queryKeys.packages,
        queryFn: () => packageService.getAllPackages(),
        placeholderData: keepPreviousData,
        staleTime: 10 * 60 * 1000,   // 10 phút: dữ liệu ít thay đổi => tránh refetch liên tục
        refetchOnWindowFocus: false, // Không refetch khi chuyển tab => ổn định UX
        refetchOnMount: false,       // Tránh refetch nếu dữ liệu đã có trong cache
        refetchOnReconnect: true,    // Tự refetch khi mạng reconnect
        retry: 1,                    // Thử lại 1 lần nếu lỗi tạm thời
        enabled: true,
    });
}

export const usePackageById = (packageId: string | null,options?: any) => {
    return useQuery<ApiResponse<any>>({
        queryKey: queryKeys.package(packageId),
        queryFn: () => packageService.getPackageById(packageId),
        staleTime: 10 * 60 * 1000,   // 10 phút: dữ liệu ít thay đổi => tránh refetch liên tục
        ...options
    });
}

export const useCreatePackage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => packageService.createPackage(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
        },
        onError: (error) => {
            console.log(error);
        }
    });
}


export const useUpdatePackage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ packageId, data }: { packageId: string; data: any }) => 
            packageService.updatePackageById(packageId, data),
        onSuccess: (_, { packageId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.package(packageId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
        },
        onError: (error) => {
            console.error('Error updating package:', error);
        }
    });
}

export const useDeletePackage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (packageId: string) => packageService.deletePackageById(packageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
            queryClient.invalidateQueries({ queryKey: queryKeys.package(null) });
        },
        onError: (error) => {
            console.error('Error deleting package:', error);
        }
    });
}