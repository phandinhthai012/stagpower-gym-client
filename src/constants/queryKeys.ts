// src/constants/queryKeys.ts
export const queryKeys = {
    // Users
    users: ['users'] as const,
    usersPaginated: (params: any) => ['users', 'paginated', params] as const,
    user: (id: string) => ['users', id] as const,
    members: ['users', 'members'] as const,
    staffs: ['users', 'staffs'] as const,
    userById: (userId: string) => ['users', 'userById', userId] as const,
    // Packages
    packages: ['packages'] as const,
    package: (id: string) => ['packages', id] as const,
    
    // Schedules
    schedules: ['schedules'] as const,
    schedulesPaginated: (params: any) => ['schedules', 'paginated', params] as const,
    memberSchedules: (memberId: string) => ['schedules', 'member', memberId] as const,
    trainerSchedules: (trainerId: string) => ['schedules', 'trainer', trainerId] as const,
    schedule: (id: string) => ['schedules', id] as const,
    
    // Payments
    payments: ['payments'] as const,
    payment: (id: string) => ['payments', id] as const,
    memberPayments: (memberId: string) => ['payments', 'member', memberId] as const,
    
    // Branches
    branches: ['branches'] as const,
    branch: (id: string) => ['branches', id] as const,
    
    // Subscriptions
    subscriptions: ['subscriptions'] as const,
    subscription: (id: string) => ['subscriptions', id] as const,
    memberSubscriptions: (memberId: string) => ['subscriptions', 'member', memberId] as const,
    
    // Check-ins
    checkIns: ['checkIns'] as const,
    checkIn: (id: string) => ['checkIns', id] as const,
    memberCheckIns: (memberId: string) => ['checkIns', 'member', memberId] as const,

    // Booking Requests
    bookingRequests: ['bookingRequests'] as const,
    bookingRequest: (id: string) => ['bookingRequests', id] as const,
    memberBookingRequests: (memberId: string) => ['bookingRequests', 'member', memberId] as const,
    trainerBookingRequests: (trainerId: string) => ['bookingRequests', 'trainer', trainerId] as const,

    // Exercises
    exercises: ['exercises'] as const,
    exercise: (id: string) => ['exercises', id] as const,

    // Discounts
    discounts: ['discounts'] as const,
    discount: (id: string) => ['discounts', id] as const,
    
  }