import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  package: string;
  branch: string;
  trainerName: string;
}

export const ratingApi = {
  // Get top ratings for landing page
  getTopRatings: async (limit: number = 6): Promise<Testimonial[]> => {
    const response = await apiClient.get(API_ENDPOINTS.RATING.GET_TOP_RATINGS, {
      params: { limit }
    });
    return response.data.data || [];
  }
};

