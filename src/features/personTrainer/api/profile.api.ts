import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { TrainerProfile, UpdateTrainerProfileRequest, TrainerStats } from '../types/profile.types';

export const profileApi = {
  // Get current trainer profile
  getMyProfile: async (): Promise<TrainerProfile> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_ME);
    return response.data.data;
  },

  // Get trainer stats
  getMyStats: async (trainerId: string): Promise<TrainerStats> => {
    try {
      // Get schedules to calculate stats
      const schedulesResponse = await apiClient.get(
        API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId)
      );
      const schedules = schedulesResponse.data.data || [];

      // Get unique members count
      const uniqueMemberIds = new Set(
        schedules.map((s: any) =>
          typeof s.memberId === 'object' ? s.memberId._id : s.memberId
        )
      );

      // Calculate completed sessions
      const completedSessions = schedules.filter(
        (s: any) => s.status === 'Completed'
      ).length;

      // Mock achievements based on performance
      const achievements = [];
      if (uniqueMemberIds.size >= 10) {
        achievements.push({
          id: '1',
          title: '10+ hội viên',
          description: 'Đã đào tạo',
          icon: 'users',
        });
      }
      if (uniqueMemberIds.size >= 25) {
        achievements.push({
          id: '2',
          title: '25+ hội viên',
          description: 'Đã đào tạo',
          icon: 'users',
        });
      }
      if (completedSessions >= 50) {
        achievements.push({
          id: '3',
          title: '50+ buổi tập',
          description: 'Đã hoàn thành',
          icon: 'calendar-check',
        });
      }
      if (completedSessions >= 100) {
        achievements.push({
          id: '4',
          title: '100+ buổi tập',
          description: 'Đã hoàn thành',
          icon: 'star',
        });
      }

      // Mock rating (TODO: implement real rating system)
      const averageRating = 4.5 + Math.random() * 0.5;

      return {
        totalMembers: uniqueMemberIds.size,
        averageRating: Number(averageRating.toFixed(1)),
        totalSessions: completedSessions,
        achievements,
      };
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      return {
        totalMembers: 0,
        averageRating: 0,
        totalSessions: 0,
        achievements: [],
      };
    }
  },

  // Update trainer profile
  updateMyProfile: async (
    userId: string,
    data: UpdateTrainerProfileRequest
  ): Promise<TrainerProfile> => {
    const response = await apiClient.put(
      API_ENDPOINTS.USER.UPDATE_USER(userId),
      data
    );
    return response.data.data;
  },
};

