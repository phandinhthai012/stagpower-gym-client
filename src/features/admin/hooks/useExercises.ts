import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { exerciseApi } from '../api/exercise.api';
import { CreateExerciseData, UpdateExerciseData } from '../types/exercise.types';
import { toast } from 'sonner';

// Query Keys
export const exerciseQueryKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...exerciseQueryKeys.lists(), { filters }] as const,
  details: () => [...exerciseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...exerciseQueryKeys.details(), id] as const,
  search: (searchTerm: string) => [...exerciseQueryKeys.all, 'search', searchTerm] as const,
  byLevel: (level: string) => [...exerciseQueryKeys.all, 'level', level] as const,
};

// 1. GET - get all exercises
export const useExercises = () => {
  return useQuery({
    queryKey: exerciseQueryKeys.lists(),
    queryFn: exerciseApi.getAllExercises,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 2. GET - get exercise by id
export const useExerciseById = (exerciseId: string) => {
  return useQuery({
    queryKey: exerciseQueryKeys.detail(exerciseId),
    queryFn: () => exerciseApi.getExerciseById(exerciseId),
    enabled: !!exerciseId,
  });
};

// 3. GET - find exercises by search term
export const useSearchExercises = (searchTerm: string) => {
  return useQuery({
    queryKey: exerciseQueryKeys.search(searchTerm),
    queryFn: () => exerciseApi.searchExercises(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};

// 4. GET - Lấy bài tập theo độ khó
export const useExercisesByLevel = (level: string) => {
  return useQuery({
    queryKey: exerciseQueryKeys.byLevel(level),
    queryFn: () => exerciseApi.getExercisesByLevel(level),
    enabled: !!level,
  });
};

// 5. MUTATION - create new exercise
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exerciseData: CreateExerciseData) => exerciseApi.createExercise(exerciseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
      toast.success('Bài tập đã được tạo thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tạo bài tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

// 6. MUTATION - update exercise
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ exerciseId, exerciseData }: { exerciseId: string; exerciseData: UpdateExerciseData }) => 
      exerciseApi.updateExercise(exerciseId, exerciseData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.detail(variables.exerciseId) });
      toast.success('Bài tập đã được cập nhật thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật bài tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};

// 7. MUTATION - delete exercise
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exerciseId: string) => exerciseApi.deleteExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
      toast.success('Bài tập đã được xóa thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi xóa bài tập: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
    },
  });
};
