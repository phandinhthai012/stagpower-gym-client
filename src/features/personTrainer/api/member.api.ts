import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';
import { TrainerMember } from '../types/member.types';
import { ScheduleWithDetails } from '../types/schedule.types';

export interface TrainerMembersResponse {
  members: TrainerMember[];
  totalMembers: number;
}

export const memberApi = {
  // Get all members that trainer is currently training
  getTrainerMembers: async (trainerId: string): Promise<TrainerMembersResponse> => {
    try {
      // Get all schedules for the trainer
      const schedulesResponse = await apiClient.get(
        API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId)
      );
      const schedules: ScheduleWithDetails[] = schedulesResponse.data.data || [];

      // Extract unique member IDs
      const memberIds = Array.from(
        new Set(
          schedules.map((s) =>
            typeof s.memberId === 'object' ? s.memberId._id : s.memberId
          )
        )
      );

      // Get detailed info for each member
      const membersPromises = memberIds.map(async (memberId) => {
        // Get user info
        const userResponse = await apiClient.get(
          API_ENDPOINTS.USER.GET_USER_BY_ID(memberId)
        );
        const user = userResponse.data.data;

        // Get member's schedules with this trainer
        const memberSchedules = schedules.filter((s) => {
          const schedMemberId =
            typeof s.memberId === 'object' ? s.memberId._id : s.memberId;
          return schedMemberId === memberId;
        });

        // Calculate statistics
        const totalSessions = memberSchedules.length;
        const completedSessions = memberSchedules.filter(
          (s) => s.status === 'Completed'
        ).length;
        const upcomingSessions = memberSchedules.filter(
          (s) =>
            (s.status === 'Confirmed' || s.status === 'Pending') &&
            new Date(s.dateTime) > new Date()
        ).length;
        const progress =
          totalSessions > 0
            ? Math.round((completedSessions / totalSessions) * 100)
            : 0;

        // Find last and next session
        const sortedSchedules = [...memberSchedules].sort(
          (a, b) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        const pastSchedules = sortedSchedules.filter(
          (s) => new Date(s.dateTime) <= new Date()
        );
        const futureSchedules = sortedSchedules
          .filter((s) => new Date(s.dateTime) > new Date())
          .reverse();

        const lastSessionDate = pastSchedules[0]?.dateTime;
        const nextSessionDate = futureSchedules[0]?.dateTime;

        // Get subscriptions
        let activeSubscriptions = [];
        try {
          const subsResponse = await apiClient.get(
            API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId)
          );
          activeSubscriptions = subsResponse.data.data?.filter(
            (sub: any) => sub.status === 'Active' && (sub.type === 'PT' || sub.type === 'Combo')
          ) || [];
        } catch (error) {
          console.warn('Could not fetch subscriptions for member:', memberId);
        }

        // Get health info
        let healthInfo = undefined;
        try {
          const healthResponse = await apiClient.get(
            API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_MEMBER_ID(memberId)
          );
          healthInfo = healthResponse.data.data;
        } catch (error) {
          console.warn('Could not fetch health info for member:', memberId);
        }

        return {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          photo: user.photo,
          status: user.status,
          joinDate: user.joinDate || user.createdAt,
          memberInfo: user.memberInfo,
          totalSessions,
          completedSessions,
          upcomingSessions,
          progress,
          lastSessionDate,
          nextSessionDate,
          activeSubscriptions,
          healthInfo,
        } as TrainerMember;
      });

      const members = await Promise.all(membersPromises);

      return {
        members,
        totalMembers: members.length,
      };
    } catch (error) {
      console.error('Error fetching trainer members:', error);
      throw error;
    }
  },

  // Get member detail with full schedule history
  getMemberDetail: async (memberId: string, trainerId: string) => {
    try {
      // Get user info
      const userResponse = await apiClient.get(
        API_ENDPOINTS.USER.GET_USER_BY_ID(memberId)
      );
      const user = userResponse.data.data;

      // Get all schedules between this member and trainer
      const schedulesResponse = await apiClient.get(
        API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_TRAINERID(trainerId)
      );
      const allSchedules: ScheduleWithDetails[] = schedulesResponse.data.data || [];
      const memberSchedules = allSchedules.filter((s) => {
        const schedMemberId =
          typeof s.memberId === 'object' ? s.memberId._id : s.memberId;
        return schedMemberId === memberId;
      });

      // Get subscriptions
      let activeSubscriptions = [];
      try {
        const subsResponse = await apiClient.get(
          API_ENDPOINTS.SUBSCRIPTION.GET_SUBSCRIPTION_BY_MEMBERID(memberId)
        );
        activeSubscriptions = subsResponse.data.data || [];
      } catch (error) {
        console.warn('Could not fetch subscriptions');
      }

      // Get health info
      let healthInfo = undefined;
      try {
        const healthResponse = await apiClient.get(
          API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_MEMBER_ID(memberId)
        );
        healthInfo = healthResponse.data.data;
      } catch (error) {
        console.warn('Could not fetch health info');
      }

      return {
        ...user,
        schedules: memberSchedules,
        activeSubscriptions,
        healthInfo,
      };
    } catch (error) {
      console.error('Error fetching member detail:', error);
      throw error;
    }
  },
};
