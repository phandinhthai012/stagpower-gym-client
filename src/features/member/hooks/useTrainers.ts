import { useQuery } from '@tanstack/react-query';
import { trainerApi } from '../api/trainer.api';

// Query keys
export const trainerQueryKeys = {
  all: ['member-trainers'] as const,
  list: () => [...trainerQueryKeys.all, 'list'] as const,
};

// Get all trainers
export const useTrainers = () => {
  return useQuery({
    queryKey: trainerQueryKeys.list(),
    queryFn: trainerApi.getAllTrainers,
  });
};

