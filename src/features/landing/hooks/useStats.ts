import { useQuery } from '@tanstack/react-query';
import { statsApi, GymStats } from '../api/stats.api';

export const useGymStats = () => {
  return useQuery<GymStats>({
    queryKey: ['landing', 'gym-stats'],
    queryFn: () => statsApi.getGymStats(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on error
  });
};

