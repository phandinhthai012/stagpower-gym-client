import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface GymStats {
  branchesCount: number;
  membersCount: number;
  exercisesCount: number;
  operatingHours: string;
}

export const statsApi = {
  // Get gym statistics
  getGymStats: async (): Promise<GymStats> => {
    try {
      // Fetch all data in parallel
      const [branchesRes, membersRes, exercisesRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.BRANCH.GET_ALL_BRANCHES_PUBLIC),
        apiClient.get(API_ENDPOINTS.USER.GET_ALL_MEMBERS),
        apiClient.get(API_ENDPOINTS.EXERCISE.GET_ALL_EXERCISES)
      ]);

      const branches = branchesRes.data.data || [];
      const members = membersRes.data.data || [];
      const exercises = exercisesRes.data.data || [];

      return {
        branchesCount: branches.length,
        membersCount: members.length,
        exercisesCount: exercises.length,
        operatingHours: '16 Giờ/ngày' // Fixed value
      };
    } catch (error) {
      console.error('Error fetching gym stats:', error);
      // Return default values on error
      return {
        branchesCount: 8,
        membersCount: 5000,
        exercisesCount: 200,
        operatingHours: '16 Giờ/ngày'
      };
    }
  }
};

