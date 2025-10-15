import { User } from '../api/user.api';

export const userTransformers = {
  // Transform user for display
  toDisplay: (user: User) => ({
    ...user,
    statusText: {
      active: 'Đang hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ duyệt',
      Banned: 'Bị cấm'
    }[user.status] || 'Không xác định',
    roleText: {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      trainer: 'Huấn luyện viên',
      member: 'Thành viên'
    }[user.role] || 'Không xác định',
    genderText: {
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác'
    }[user.gender || 'male'] || 'Chưa xác định',
    membershipLevelText: user.memberInfo?.membership_level === 'vip' ? 'VIP' : 'Cơ bản',
    isStudentText: user.memberInfo?.is_student ? 'Có' : 'Không',
  }),

  // Transform form data to API format
  toApi: (formData: any) => {
    const apiData: any = {};
    
    // Basic fields
    if (formData.fullName) apiData.fullName = formData.fullName;
    if (formData.email) apiData.email = formData.email;
    if (formData.phone) apiData.phone = formData.phone;
    if (formData.gender) apiData.gender = formData.gender;
    if (formData.dateOfBirth) apiData.dateOfBirth = formData.dateOfBirth;
    if (formData.photo) apiData.photo = formData.photo;
    if (formData.cccd) apiData.cccd = formData.cccd;

    // Member specific fields
    if (formData['memberInfo.membership_level']) {
      apiData['memberInfo.membership_level'] = formData['memberInfo.membership_level'];
    }
    if (formData['memberInfo.is_student'] !== undefined) {
      apiData['memberInfo.is_student'] = formData['memberInfo.is_student'];
    }
    if (formData['memberInfo.total_spending'] !== undefined) {
      apiData['memberInfo.total_spending'] = Number(formData['memberInfo.total_spending']);
    }
    if (formData['memberInfo.membership_month'] !== undefined) {
      apiData['memberInfo.membership_month'] = Number(formData['memberInfo.membership_month']);
    }
    if (formData['memberInfo.notes']) {
      apiData['memberInfo.notes'] = formData['memberInfo.notes'];
    }

    // Trainer specific fields
    if (formData['trainerInfo.specialty']) {
      apiData['trainerInfo.specialty'] = formData['trainerInfo.specialty'];
    }
    if (formData['trainerInfo.experience_years'] !== undefined) {
      apiData['trainerInfo.experience_years'] = Number(formData['trainerInfo.experience_years']);
    }
    if (formData['trainerInfo.certificate']) {
      apiData['trainerInfo.certificate'] = formData['trainerInfo.certificate'];
    }
    if (formData['trainerInfo.working_hour']) {
      apiData['trainerInfo.working_hour'] = formData['trainerInfo.working_hour'];
    }

    // Staff specific fields
    if (formData['staffInfo.brand_id']) {
      apiData['staffInfo.brand_id'] = formData['staffInfo.brand_id'];
    }
    if (formData['staffInfo.position']) {
      apiData['staffInfo.position'] = formData['staffInfo.position'];
    }

    // Admin specific fields
    if (formData['adminInfo.permissions']) {
      apiData['adminInfo.permissions'] = formData['adminInfo.permissions'];
    }
    if (formData['adminInfo.managed_branches']) {
      apiData['adminInfo.managed_branches'] = formData['adminInfo.managed_branches'];
    }

    return apiData;
  },

  // Transform API data to form format
  toForm: (user: User) => ({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender || 'male',
    dateOfBirth: user.dateOfBirth || '',
    photo: user.photo || '',
    cccd: user.cccd || '',
    'memberInfo.membership_level': user.memberInfo?.membership_level || 'basic',
    'memberInfo.is_student': user.memberInfo?.is_student || false,
    'memberInfo.total_spending': user.memberInfo?.total_spending?.toString() || '0',
    'memberInfo.membership_month': user.memberInfo?.membership_month?.toString() || '0',
    'memberInfo.notes': user.memberInfo?.notes || '',
    'trainerInfo.specialty': user.trainerInfo?.specialty || '',
    'trainerInfo.experience_years': user.trainerInfo?.experience_years?.toString() || '0',
    'trainerInfo.certificate': user.trainerInfo?.certificate || [],
    'trainerInfo.working_hour': user.trainerInfo?.working_hour || [],
    'staffInfo.brand_id': user.staffInfo?.brand_id || '',
    'staffInfo.position': user.staffInfo?.position || 'staff',
    'adminInfo.permissions': user.adminInfo?.permissions || [],
    'adminInfo.managed_branches': user.adminInfo?.managed_branches || [],
  }),
};
