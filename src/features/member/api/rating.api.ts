import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { Rating, CreateRatingRequest, UpdateRatingRequest, RateableTrainer } from '../types/rating.types';

export const ratingApi = {
  // Get my ratings
  getMyRatings: async (): Promise<Rating[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_MY_RATINGS);
    return response.data.data || [];
  },

  // Get rateable trainers (trainers that member has completed sessions with)
  getRateableTrainers: async (): Promise<RateableTrainer[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_RATEABLE_TRAINERS);
    return response.data.data || [];
  },

  // Create rating
  createRating: async (data: CreateRatingRequest): Promise<Rating> => {
    const response = await apiClient.post(API_ENDPOINTS.RATING.CREATE_RATING, data);
    return response.data.data;
  },

  // Get rating by ID
  getRatingById: async (ratingId: string): Promise<Rating> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_RATING_BY_ID(ratingId));
    return response.data.data;
  },

  // Update rating
  updateRating: async (ratingId: string, data: UpdateRatingRequest): Promise<Rating> => {
    const response = await apiClient.put(API_ENDPOINTS.RATING.UPDATE_RATING(ratingId), data);
    return response.data.data;
  },

  // Delete rating
  deleteRating: async (ratingId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.RATING.DELETE_RATING(ratingId));
  },

  // Get ratings by trainer (public)
  getRatingsByTrainer: async (trainerId: string): Promise<Rating[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_RATINGS_BY_TRAINER(trainerId));
    return response.data.data || [];
  },

  // Get trainer average rating (public)
  getTrainerAverageRating: async (trainerId: string): Promise<{ averageRating: number; totalRatings: number }> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_TRAINER_AVERAGE_RATING(trainerId));
    return response.data.data;
  },
};

