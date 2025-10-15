const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
}
const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';

// api endpoint

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_PREFIX}/auth/login`,
        LOGOUT: `${API_PREFIX}/auth/logout`,
        LOGOUT_ALL_DEVICES: `${API_PREFIX}/auth/logout-all-devices`,
        GET_ME: `${API_PREFIX}/auth/me`,
        REFRESH_TOKEN: `${API_PREFIX}/auth/refresh`,
        REGISTER: `${API_PREFIX}/auth/register`,
        CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
        FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
        RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
    },
    USER: {
       GET_ALL_USERS_WITH_PAGINATION: `${API_PREFIX}/user/paginated`,
       GET_ALL_MEMBERS: `${API_PREFIX}/user/members`,
       GET_ALL_STAFFS: `${API_PREFIX}/user/staffs`,
       UPDATE_MY_PROFILE: `${API_PREFIX}/user/me/profile`,
       CHANGE_USER_STATUS: (userId: string) => `${API_PREFIX}/user/${userId}/status`, // admin only
       GET_USER_BY_ID: (userId: string) => `${API_PREFIX}/user/${userId}`,
       CREATE_MEMBER: `${API_PREFIX}/user/createMember`,
       CREATE_TRAINER: `${API_PREFIX}/user/createTrainer`,
       CREATE_STAFF: `${API_PREFIX}/user/createStaff`,
       CREATE_ADMIN: `${API_PREFIX}/user/createAdmin`,
    },
    PACKAGE: {
        GET_ALL_PACKAGES: `${API_PREFIX}/packages`,
        GET_ALL_PACKAGES_WITH_PAGINATION: `${API_PREFIX}/packages/paginated`,
        GET_PACKAGE_BY_ID: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        CREATE_PACKAGE: `${API_PREFIX}/packages`,
        UPDATE_PACKAGE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        DELETE_PACKAGE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        CHANGE_PACKAGE_STATUS: (packageId: string) => `${API_PREFIX}/packages/${packageId}/status`,
    },
    SUBSCRIPTION: {
        GET_ALL_SUBSCRIPTIONS: `${API_PREFIX}/subscriptions`,
        GET_SUBSCRIPTION_BY_MEMBERID: (memberId: string) => `${API_PREFIX}/subscriptions/member/${memberId}`,
        GET_SUBSCRIPTION_BY_ID: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
        CREATE_SUBSCRIPTION: `${API_PREFIX}/subscriptions`,
        UPDATE_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
        SUSPEND_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/suspend`,
        UNSUSPEND_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/unsuspend`,
    },
    PAYMENT: {
        GET_ALL_PAYMENTS: `${API_PREFIX}/payments`,
        GET_PAYMENT_BY_ID: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}`,
        CREATE_PAYMENT: `${API_PREFIX}/payments`,
        UPDATE_PAYMENT: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}`,
    },
    BRANCH: {
        GET_ALL_BRANCHES: `${API_PREFIX}/branches`,
        GET_ALL_BRANCHES_PUBLIC: `${API_PREFIX}/branches/public`,
        GET_BRANCH_BY_ID: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
        CREATE_BRANCH: `${API_PREFIX}/branches`,
        UPDATE_BRANCH: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
        DELETE_BRANCH: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
    },
    SCHEDULE: {
        GET_ALL_SCHEDULES: `${API_PREFIX}/schedules`,
        GET_SCHEDULE_BY_ID: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
        CREATE_SCHEDULE: `${API_PREFIX}/schedules`,
        UPDATE_SCHEDULE: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
        DELETE_SCHEDULE: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
    },
    CHECK_IN: {
        GET_ALL_CHECK_INS: `${API_PREFIX}/checkins`,
        GET_CHECK_IN_BY_ID: (checkInId: string) => `${API_PREFIX}/checkins/${checkInId}`,
        CREATE_CHECK_IN: `${API_PREFIX}/checkins`,
        UPDATE_CHECK_IN: (checkInId: string) => `${API_PREFIX}/checkins/${checkInId}`,
    },
    BOOKING_REQUEST: {
        GET_ALL_BOOKING_REQUESTS: `${API_PREFIX}/booking-requests`,
        GET_BOOKING_REQUEST_BY_ID: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
        CREATE_BOOKING_REQUEST: `${API_PREFIX}/booking-requests`,
        UPDATE_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
        DELETE_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
    },
    EXERCISE: {
        GET_ALL_EXERCISES: `${API_PREFIX}/exercises`,
        GET_EXERCISE_BY_ID: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
        CREATE_EXERCISE: `${API_PREFIX}/exercises`,
        UPDATE_EXERCISE: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
        DELETE_EXERCISE: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
    },
    DISCOUNT: {
        GET_ALL_DISCOUNTS: `${API_PREFIX}/discounts`,
        GET_DISCOUNT_BY_ID: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
        CREATE_DISCOUNT: `${API_PREFIX}/discounts`,
        UPDATE_DISCOUNT: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
        DELETE_DISCOUNT: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
    },
    AI_SUGGESTION: {
        GET_WORKOUT_SUGGESTION: `${API_PREFIX}/ai-suggestions/workout`,
        GET_NUTRITION_SUGGESTION: `${API_PREFIX}/ai-suggestions/nutrition`,
    },
    HEALTH_INFO: {
        GET_ALL_HEALTH_INFOS: `${API_PREFIX}/health-info`,
        GET_HEALTH_INFO_BY_ID: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
        CREATE_HEALTH_INFO: `${API_PREFIX}/health-info`,
        UPDATE_HEALTH_INFO: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
        DELETE_HEALTH_INFO: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
    },
}

export default API_CONFIG;
