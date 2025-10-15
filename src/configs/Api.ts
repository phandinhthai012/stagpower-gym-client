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
        VERIFY_OTP: `${API_PREFIX}/auth/verify-otp`,
        RESEND_OTP: `${API_PREFIX}/auth/resend-otp`,
    },  
    USER: {
       GET_ALL_USERS: `${API_PREFIX}/user`,
       GET_ALL_MEMBERS: `${API_PREFIX}/user/members`,
       GET_ALL_STAFFS: `${API_PREFIX}/user/staffs`,
       CREATE_USER: `${API_PREFIX}/user/create`,
       UPDATE_USER: (userId: string) => `${API_PREFIX}/user/${userId}/profile`,
       UPDATE_MY_PROFILE: `${API_PREFIX}/user/profile`,
       CHANGE_USER_STATUS: (userId: string) => `${API_PREFIX}/user/${userId}/status`,
       GET_USER_BY_ID: (userId: string) => `${API_PREFIX}/user/${userId}`,
       // paginated
       GET_ALL_USERS_WITH_PAGINATION: `${API_PREFIX}/user/paginated`,
       GET_ALL_MEMBERS_WITH_PAGINATION: `${API_PREFIX}/user/members/paginated`,
       GET_ALL_STAFFS_WITH_PAGINATION: `${API_PREFIX}/user/staffs/paginated`,
    },
    HEALTH_INFO: {
        GET_ALL_HEALTH_INFOS: `${API_PREFIX}/health-info`,
        GET_MY_HEALTH_INFO: `${API_PREFIX}/health-info/me`,
        GET_HEALTH_INFO_BY_ID: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
        GET_HEALTH_INFO_BY_MEMBER_ID: (memberId: string) => `${API_PREFIX}/health-info/member/${memberId}`,
        CREATE_HEALTH_INFO: (memberId: string) => `${API_PREFIX}/health-info/${memberId}`,
        UPDATE_HEALTH_INFO: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
        DELETE_HEALTH_INFO: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
    },
    CHECK_IN: {
        CREATE_CHECK_IN: `${API_PREFIX}/check-ins`,
        GET_ALL_CHECK_INS: `${API_PREFIX}/check-ins`,
        GET_CHECK_IN_BY_ID: (checkInId: string) => `${API_PREFIX}/check-ins/${checkInId}`,
        UPDATE_CHECK_IN_BY_ID: (checkInId: string) => `${API_PREFIX}/check-ins/${checkInId}`,
        GET_CHECK_IN_BY_MEMBER_ID: (memberId: string) => `${API_PREFIX}/check-ins/member/${memberId}`,
        GET_CHECK_IN_BY_CHECK_IN_TIME: (checkInTime: string) => `${API_PREFIX}/check-ins/checkInTime/${checkInTime}`,
        CHECK_OUT_CHECK_IN: (checkInId: string) => `${API_PREFIX}/check-ins/${checkInId}/checkOut`,
    },
    PACKAGE: {
        GET_ALL_PACKAGES: `${API_PREFIX}/packages`,
        GET_PACKAGE_BY_ID: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        CREATE_PACKAGE: `${API_PREFIX}/packages`,
        UPDATE_PACKAGE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        DELETE_PACKAGE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        CHANGE_PACKAGE_STATUS: (packageId: string) => `${API_PREFIX}/packages/${packageId}/status`,
        //paginated
        GET_ALL_PACKAGES_WITH_PAGINATION: `${API_PREFIX}/packages/paginated`,
    },
    // Subscription
    SUBSCRIPTION: {
       GET_ALL_SUBSCRIPTIONS: `${API_PREFIX}/subscriptions`,
       CREATE_SUBSCRIPTION: `${API_PREFIX}/subscriptions`,
       GET_SUBSCRIPTION_BY_MEMBERID: (subscriptionId: string) => `${API_PREFIX}/subscriptions/member/${subscriptionId}`,
       GET_SUBSCRIPTION_BY_ID: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
       UPDATE_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
       DELETE_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
       SUSPEND_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/suspend`,
       UNSUSPEND_SUBSCRIPTION: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/unsuspend`,
       CHANGE_SUBSCRIPTION_STATUS: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/status`,
    },
    PAYMENT: {
       CREATE_PAYMENT: `${API_PREFIX}/payments`,
       GET_ALL_PAYMENTS: `${API_PREFIX}/payments`,
       GET_PAYMENT_BY_ID: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}`,
       UPDATE_PAYMENT: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}`,
       DELETE_PAYMENT: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}`,
       GET_PAYMENT_BY_MEMBERID: (paymentId: string) => `${API_PREFIX}/payments/member/${paymentId}`,
       CREATE_PAYMENT_MOMO: `${API_PREFIX}/payments/momo/create`,

       COMPLETE_PAYMENT: (paymentId: string) => `${API_PREFIX}/payments/${paymentId}/complete`, // thanh toán bằng tiền mặt hay chuyển khoản xác nhận bằng mắt
    },
    BRANCH: {
       GET_ALL_BRANCHES: `${API_PREFIX}/branches`,
       GET_ALL_BRANCHES_PUBLIC: `${API_PREFIX}/branches/public`,
       GET_BRANCH_BY_ID: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
       CREATE_BRANCH: `${API_PREFIX}/branches`,
       UPDATE_BRANCH: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
       DELETE_BRANCH: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
       CHANGE_BRANCH_STATUS: (branchId: string) => `${API_PREFIX}/branches/${branchId}/status`,
    },
    SCHEDULE: {
       GET_ALL_SCHEDULES: `${API_PREFIX}/schedules`,
       GET_SCHEDULE_BY_ID: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
       CREATE_SCHEDULE: `${API_PREFIX}/schedules`,
       UPDATE_SCHEDULE: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
       DELETE_SCHEDULE: (scheduleId: string) => `${API_PREFIX}/schedules/${scheduleId}`,
       GET_SCHEDULE_BY_MEMBERID: (memberId: string) => `${API_PREFIX}/schedules/member/${memberId}`,
       GET_SCHEDULE_BY_TRAINERID: (trainerId: string) => `${API_PREFIX}/schedules/trainer/${trainerId}`,
       //paginated thích thì dùng cái này option không thì cứ get all rồi filter hay làm gì đó
       GET_ALL_SCHEDULES_WITH_PAGINATION: `${API_PREFIX}/schedules/paginated`,
       GET_SCHEDULE_BY_MEMBERID_WITH_PAGINATION:(memberId: string) => `${API_PREFIX}/schedules/member/${memberId}/paginated`,
       GET_SCHEDULE_BY_TRAINERID_WITH_PAGINATION:(trainerId: string) => `${API_PREFIX}/schedules/trainer/${trainerId}/paginated`,
    },
    BOOKING_REQUEST: {
        CREATE_BOOKING_REQUEST: `${API_PREFIX}/booking-request`,
        GET_ALL_BOOKING_REQUESTS: `${API_PREFIX}/booking-requests`,
        GET_BOOKING_REQUEST_BY_ID: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
        UPDATE_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
        DELETE_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}`,
        CONFIRM_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}/confirm`,
        REJECT_BOOKING_REQUEST: (bookingRequestId: string) => `${API_PREFIX}/booking-requests/${bookingRequestId}/reject`,
        GET_BOOKING_REQUEST_BY_STATUS: (status: string) => `${API_PREFIX}/booking-requests/status/${status}`,
        GET_BOOKING_REQUEST_BY_MEMBERID: (memberId: string) => `${API_PREFIX}/booking-requests/member/${memberId}`,
        GET_BOOKING_REQUEST_BY_TRAINERID: (trainerId: string) => `${API_PREFIX}/booking-requests/trainer/${trainerId}`,
    },
    EXERCISE: {
        GET_ALL_EXERCISES: `${API_PREFIX}/exercises`,
        GET_EXERCISE_BY_ID: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
        CREATE_EXERCISE: `${API_PREFIX}/exercises`,
        UPDATE_EXERCISE: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
        DELETE_EXERCISE: (exerciseId: string) => `${API_PREFIX}/exercises/${exerciseId}`,
        GET_EXERCISES_BY_LEVEL: (level: string) => `${API_PREFIX}/exercises/level/${level}`,
        SEARCH_EXERCISES: `${API_PREFIX}/exercises/search`,
    },
    DISCOUNT: {
        GET_ALL_DISCOUNTS: `${API_PREFIX}/discounts`,
        GET_DISCOUNT_BY_ID: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
        CREATE_DISCOUNT: `${API_PREFIX}/discounts`,
        UPDATE_DISCOUNT: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
        DELETE_DISCOUNT: (discountId: string) => `${API_PREFIX}/discounts/${discountId}`,
        CHANGE_DISCOUNT_STATUS: (discountId: string) => `${API_PREFIX}/discounts/${discountId}/status`,
    },
    AI_SUGGESTION: {
        CREATE_AI_SUGGESTION: `${API_PREFIX}/ai-suggestions`,
        GET_AI_SUGGESTION_BY_MEMBERID: (memberId: string) => `${API_PREFIX}/ai-suggestions/member/${memberId}`,
        GET_AI_SUGGESTION_BY_ID: (aiSuggestionId: string) => `${API_PREFIX}/ai-suggestions/${aiSuggestionId}`,
        DELETE_AI_SUGGESTION: (aiSuggestionId: string) => `${API_PREFIX}/ai-suggestions/${aiSuggestionId}`,
        GENERATE_AI_SUGGESTION: `${API_PREFIX}/ai-suggestions/suggestion/generate`,
        GENERATE_NUTRITION_SUGGESTION: `${API_PREFIX}/ai-suggestions/suggestion/nutrition`,
    },
}

export default API_CONFIG;
