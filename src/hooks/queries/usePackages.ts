import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import packageService from '../../services/package.service';



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

export const usePackageById = (packageId: string | null) => {
    return useQuery({
        queryKey: queryKeys.package(packageId),
        queryFn: () => packageService.getPackageById(packageId),
        enabled: !!packageId,
        staleTime: 10 * 60 * 1000,   // 10 phút: dữ liệu ít thay đổi => tránh refetch liên tục
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
