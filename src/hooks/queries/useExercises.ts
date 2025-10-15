import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import exerciseService from '../../services/exercise.service';
// import { ApiResponse } from '../../types/api.types';


// refetch sử dụng để lấy lại dữ liệu mới nhất
export const useExercises = () => {
    return useQuery({
        queryKey: queryKeys.exercises,
        queryFn: async () => await exerciseService.getAllExercises(),
        placeholderData: keepPreviousData,
        staleTime: 10 * 60 * 1000,   // 10 phút: dữ liệu ít thay đổi => tránh refetch liên tục
        refetchOnWindowFocus: false, // Không refetch khi chuyển tab => ổn định UX
        refetchOnMount: false,       // Tránh refetch nếu dữ liệu đã có trong cache
        refetchOnReconnect: true,    // Tự refetch khi mạng reconnect
        retry: 1,                    // Thử lại 1 lần nếu lỗi tạm thời
        enabled: true,
    });
}

export const useExerciseById = (id: string | null) => {
    return useQuery({
        queryKey: queryKeys.exercise(id),
        queryFn: async () => await exerciseService.getExerciseById(id),
        placeholderData: keepPreviousData,
        staleTime: 10 * 60 * 1000,   // 10 phút: dữ liệu ít thay đổi => tránh refetch liên tục
        refetchOnWindowFocus: false, // Không refetch khi chuyển tab => ổn định UX
        refetchOnMount: false,       // Tránh refetch nếu dữ liệu đã có trong cache
        refetchOnReconnect: true,    // Tự refetch khi mạng reconnect
        retry: 1,                    // Thử lại 1 lần nếu lỗi tạm thời
        enabled: !!id,
    });
}

export const useUpdateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, exercise }: { id: string; exercise: any }) => await exerciseService.updateExercise(id, exercise),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.exercise(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises });
        },
        onError: (error) => {
            console.error('Error updating exercise:', error);
        }
    });
}


export const useCreateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exercise: any) => await exerciseService.createExercise(exercise),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.exercise(null) });
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises });
        },
        onError: (error) => {
            console.error('Error creating exercise:', error);
        }
    });
}


export const useDeleteExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => await exerciseService.deleteExercise(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises });
        },
        onError: (error) => {
            console.error('Error deleting exercise:', error);
        }
    });
}