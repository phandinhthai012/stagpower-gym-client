import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import packageService from '../services/package.service';
import { toast } from 'sonner';

export const usePackages = () => {
    return useQuery({
        queryKey: queryKeys.packages,
        queryFn: () => packageService.getAllPackages(),
    });
}

export const usePackageById = (packageId: string, options?: any) => {
    return useQuery({
        queryKey: queryKeys.package(packageId),
        queryFn: () => packageService.getPackageById(packageId),
        ...options
    });
}

export const useCreatePackage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (packageData: any) => packageService.createPackage(packageData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
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
            packageService.updatePackageById(packageId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
            toast.success('Gói tập đã được cập nhật thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useDeletePackage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (packageId: string) => packageService.deletePackageById(packageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.packages });
            toast.success('Gói tập đã được xóa thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi xóa gói tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}
