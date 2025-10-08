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
    // bookingrequest, package, payment, discount, payment, heathInfo, schedule, checkin, branch, 
   
}

export default API_CONFIG;
