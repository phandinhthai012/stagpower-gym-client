// Import all mock data
import { mockUsers, type User } from './users';
import { mockHealthInfo, type HealthInfo } from './healthInfo';
import { mockPackages } from './packages';
import { type Package } from '../types/package.types';
import { mockBranches, type Branch } from './branches';
import { mockSubscriptions, type Subscription } from './subscriptions';
import { mockPayments, type Payment } from './payments';
import { mockDiscounts, type Discount } from './discounts';
import { mockCheckIns, type CheckIn } from './checkIns';
import { mockSchedules, type Schedule } from './schedules';
import { mockBookingRequests, type BookingRequest } from './bookingRequests';
import { mockAISuggestions, type AISuggestion } from './aiSuggestions';
import { mockExercises, type Exercise } from './exercises';
import { mockComplaints, type Complaint } from './complaints';
import { mockActivityLogs, type ActivityLog } from './activityLogs';

// Re-export all mock data and types
export { mockUsers, type User };
export { mockHealthInfo, type HealthInfo };
export { mockPackages, type Package };
export { mockBranches, type Branch };
export { mockSubscriptions, type Subscription };
export { mockPayments, type Payment };
export { mockDiscounts, type Discount };
export { mockCheckIns, type CheckIn };
export { mockSchedules, type Schedule };
export { mockBookingRequests, type BookingRequest };
export { mockAISuggestions, type AISuggestion };
export { mockExercises, type Exercise };
export { mockComplaints, type Complaint };
export { mockActivityLogs, type ActivityLog };

// Combined mock data object for easy access
export const mockData = {
  users: mockUsers,
  healthInfo: mockHealthInfo,
  packages: mockPackages,
  branches: mockBranches,
  subscriptions: mockSubscriptions,
  payments: mockPayments,
  discounts: mockDiscounts,
  checkIns: mockCheckIns,
  schedules: mockSchedules,
  bookingRequests: mockBookingRequests,
  aiSuggestions: mockAISuggestions,
  exercises: mockExercises,
  complaints: mockComplaints,
  activityLogs: mockActivityLogs,
};

// Helper functions for mock data
export const getMockDataByType = (type: keyof typeof mockData) => {
  return mockData[type];
};

export const getMockDataById = (type: keyof typeof mockData, id: string) => {
  const data = mockData[type] as any[];
  return data.find(item => item.id === id);
};

export const getMockDataByMemberId = (type: keyof typeof mockData, memberId: string) => {
  const data = mockData[type] as any[];
  return data.filter(item => item.member_id === memberId);
};

export const getMockDataByTrainerId = (type: keyof typeof mockData, trainerId: string) => {
  const data = mockData[type] as any[];
  return data.filter(item => item.trainer_id === trainerId);
};

export const getMockDataByBranchId = (type: keyof typeof mockData, branchId: string) => {
  const data = mockData[type] as any[];
  return data.filter(item => item.branch_id === branchId);
};

// Statistics helper functions
export const getMockStats = () => {
  return {
    totalUsers: mockUsers.length,
    totalMembers: mockUsers.filter((u: User) => u.role === 'Member').length,
    totalTrainers: mockUsers.filter((u: User) => u.role === 'Trainer').length,
    totalStaff: mockUsers.filter((u: User) => u.role === 'Staff').length,
    totalAdmins: mockUsers.filter((u: User) => u.role === 'Admin').length,
    totalBranches: mockBranches.length,
    totalPackages: mockPackages.length,
    totalSubscriptions: mockSubscriptions.length,
    activeSubscriptions: mockSubscriptions.filter((s: Subscription) => s.status === 'Active').length,
    totalPayments: mockPayments.length,
    totalCheckIns: mockCheckIns.length,
    totalSchedules: mockSchedules.length,
    totalBookingRequests: mockBookingRequests.length,
    totalAISuggestions: mockAISuggestions.length,
    totalExercises: mockExercises.length,
    totalComplaints: mockComplaints.length,
    totalActivityLogs: mockActivityLogs.length,
  };
};
