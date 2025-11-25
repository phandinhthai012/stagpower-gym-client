import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingApi } from '../api/rating.api';
import { CreateRatingRequest, UpdateRatingRequest } from '../types/rating.types';

// Query keys
export const ratingQueryKeys = {
  all: ['member-ratings'] as const,
  myRatings: () => [...ratingQueryKeys.all, 'my'] as const,
  rateableTrainers: () => [...ratingQueryKeys.all, 'rateable-trainers'] as const,
  detail: (id: string) => [...ratingQueryKeys.all, 'detail', id] as const,
  byTrainer: (trainerId: string) => [...ratingQueryKeys.all, 'trainer', trainerId] as const,
};

// Get my ratings
export const useMyRatings = () => {
  return useQuery({
    queryKey: ratingQueryKeys.myRatings(),
    queryFn: () => ratingApi.getMyRatings(),
  });
};

// Get rateable trainers
export const useRateableTrainers = () => {
  return useQuery({
    queryKey: ratingQueryKeys.rateableTrainers(),
    queryFn: () => ratingApi.getRateableTrainers(),
  });
};

// Create rating
export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRatingRequest) => ratingApi.createRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingQueryKeys.all });
    },
  });
};

// Update rating
export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratingId, data }: { ratingId: string; data: UpdateRatingRequest }) =>
      ratingApi.updateRating(ratingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingQueryKeys.all });
    },
  });
};

// Delete rating
export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingId: string) => ratingApi.deleteRating(ratingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingQueryKeys.all });
    },
  });
};

// Get rating detail
export const useRatingDetail = (ratingId: string) => {
  return useQuery({
    queryKey: ratingQueryKeys.detail(ratingId),
    queryFn: () => ratingApi.getRatingById(ratingId),
    enabled: !!ratingId,
  });
};

// Get ratings by trainer (public)
export const useRatingsByTrainer = (trainerId: string) => {
  return useQuery({
    queryKey: ratingQueryKeys.byTrainer(trainerId),
    queryFn: () => ratingApi.getRatingsByTrainer(trainerId),
    enabled: !!trainerId,
  });
};

// Get trainer average rating (public)
export const useTrainerAverageRating = (trainerId: string) => {
  return useQuery({
    queryKey: [...ratingQueryKeys.byTrainer(trainerId), 'average'],
    queryFn: () => ratingApi.getTrainerAverageRating(trainerId),
    enabled: !!trainerId,
  });
};

