import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageApi } from '../api/package.api';
import { toast } from 'sonner';

export const usePackages = () => {
    return useQuery({
        queryKey: ['packages'],
        queryFn: packageApi.getAllPackages,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePackageById = (packageId: string) => {
    return useQuery({
        queryKey: ['package', packageId],
        queryFn: () => packageApi.getPackageById(packageId),
        enabled: !!packageId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePackagesWithPagination = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['packages', 'paginated', page, limit],
        queryFn: () => packageApi.getPackagesWithPagination(page, limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreatePackage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => packageApi.createPackage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            toast.success('Gói tập đã được tạo thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi tạo gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUpdatePackage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ packageId, data }: { packageId: string; data: any }) => 
            packageApi.updatePackage(packageId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            toast.success('Gói tập đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useDeletePackage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (packageId: string) => packageApi.deletePackage(packageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            toast.success('Gói tập đã được xóa!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi xóa gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}