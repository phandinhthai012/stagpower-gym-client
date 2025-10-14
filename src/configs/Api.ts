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
       // update các field của user các field trong info thì không được
       UPDATE_MY_PROFILE: `${API_PREFIX}/user/me/profile`,
       CHANGE_USER_STATUS: (userId: string) => `${API_PREFIX}/user/${userId}/status`, // admin only
       GET_USER_BY_ID: (userId: string) => `${API_PREFIX}/user/${userId}`,
       UPDATE_USER: (userId: string) => `${API_PREFIX}/user/${userId}`,
       CREATE_MEMBER: `${API_PREFIX}/user/createMember`,
       CREATE_TRAINER: `${API_PREFIX}/user/createTrainer`,
       CREATE_STAFF: `${API_PREFIX}/user/createStaff`,
       CREATE_ADMIN: `${API_PREFIX}/user/createAdmin`,
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
    PACKAGES: {
        GET_ALL: `${API_PREFIX}/packages`,
        GET_BY_ID: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        CREATE: `${API_PREFIX}/packages`,
        UPDATE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
        DELETE: (packageId: string) => `${API_PREFIX}/packages/${packageId}`,
    },
    SUBSCRIPTIONS: {
        GET_ALL: `${API_PREFIX}/subscriptions`,
        GET_BY_ID: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
        GET_BY_MEMBER_ID: (memberId: string) => `${API_PREFIX}/subscriptions/member/${memberId}`,
        CREATE: `${API_PREFIX}/subscriptions`,
        UPDATE: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
        DELETE: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}`,
        SUSPEND: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/suspend`,
        UNSUSPEND: (subscriptionId: string) => `${API_PREFIX}/subscriptions/${subscriptionId}/unsuspend`,
    },
    BRANCHES: {
        GET_ALL: `${API_PREFIX}/branches`,
        GET_BY_ID: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
        CREATE: `${API_PREFIX}/branches`,
        UPDATE: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
        DELETE: (branchId: string) => `${API_PREFIX}/branches/${branchId}`,
        CHANGE_STATUS: (branchId: string) => `${API_PREFIX}/branches/${branchId}/status`,
    },
    HEALTH_INFO: {
        GET_ALL: `${API_PREFIX}/health-info`,
        GET_BY_ID: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
        GET_BY_ME: `${API_PREFIX}/health-info/me`,
        GET_BY_MEMBER_ID: (memberId: string) => `${API_PREFIX}/health-info/member/${memberId}`,
        CREATE: (memberId: string) => `${API_PREFIX}/health-info/${memberId}`,
        UPDATE: (healthInfoId: string) => `${API_PREFIX}/health-info/${healthInfoId}`,
    },
    // bookingrequest, package, payment, discount, payment, schedule, checkin, branch, 
   
}

export default API_CONFIG;
