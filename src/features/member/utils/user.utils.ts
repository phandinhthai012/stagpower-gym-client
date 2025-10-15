import { User } from '../api/user.api';

export const userUtils = {
  // Get status text
  getStatusText: (status: string): string => {
    const statusMap: Record<string, string> = {
      active: 'Đang hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ duyệt',
      Banned: 'Bị cấm'
    };
    return statusMap[status] || 'Không xác định';
  },

  // Get status color
  getStatusColor: (status: string): string => {
    const colorMap: Record<string, string> = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      pending: 'text-yellow-600 bg-yellow-100',
      Banned: 'text-red-600 bg-red-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  },

  // Get role text
  getRoleText: (role: string): string => {
    const roleMap: Record<string, string> = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      trainer: 'Huấn luyện viên',
      member: 'Thành viên'
    };
    return roleMap[role] || 'Không xác định';
  },

  // Get role color
  getRoleColor: (role: string): string => {
    const colorMap: Record<string, string> = {
      admin: 'text-purple-600 bg-purple-100',
      staff: 'text-blue-600 bg-blue-100',
      trainer: 'text-orange-600 bg-orange-100',
      member: 'text-green-600 bg-green-100'
    };
    return colorMap[role] || 'text-gray-600 bg-gray-100';
  },

  // Get gender text
  getGenderText: (gender: string): string => {
    const genderMap: Record<string, string> = {
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác'
    };
    return genderMap[gender] || 'Chưa xác định';
  },

  // Get membership level text
  getMembershipLevelText: (level: string): string => {
    const levelMap: Record<string, string> = {
      vip: 'VIP',
      basic: 'Cơ bản'
    };
    return levelMap[level] || 'Chưa xác định';
  },

  // Get membership level color
  getMembershipLevelColor: (level: string): string => {
    const colorMap: Record<string, string> = {
      vip: 'text-yellow-600 bg-yellow-100',
      basic: 'text-gray-600 bg-gray-100'
    };
    return colorMap[level] || 'text-gray-600 bg-gray-100';
  },

  // Get position text
  getPositionText: (position: string): string => {
    const positionMap: Record<string, string> = {
      manager: 'Quản lý',
      trainer: 'Huấn luyện viên',
      staff: 'Nhân viên',
      receptionist: 'Lễ tân'
    };
    return positionMap[position] || 'Chưa xác định';
  },

  // Get user initials
  getInitials: (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Calculate age from date of birth
  calculateAge: (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Format date for display
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Validate user data
  validateUser: (user: Partial<User>): string[] => {
    const errors: string[] = [];

    if (!user.fullName || user.fullName.length < 2) {
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    }

    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push('Email không hợp lệ');
    }

    if (user.phone && !/^[0-9]{10,11}$/.test(user.phone)) {
      errors.push('Số điện thoại phải có 10-11 chữ số');
    }

    if (user.cccd && !/^[0-9]{9,12}$/.test(user.cccd)) {
      errors.push('CCCD/CMND phải có 9-12 chữ số');
    }

    return errors;
  },

  // Get user summary
  getUserSummary: (user: User) => {
    return {
      statusText: userUtils.getStatusText(user.status),
      statusColor: userUtils.getStatusColor(user.status),
      roleText: userUtils.getRoleText(user.role),
      roleColor: userUtils.getRoleColor(user.role),
      genderText: userUtils.getGenderText(user.gender || 'male'),
      membershipLevelText: userUtils.getMembershipLevelText(user.memberInfo?.membership_level || 'basic'),
      membershipLevelColor: userUtils.getMembershipLevelColor(user.memberInfo?.membership_level || 'basic'),
      positionText: userUtils.getPositionText(user.staffInfo?.position || 'staff'),
      initials: userUtils.getInitials(user.fullName),
      age: user.dateOfBirth ? userUtils.calculateAge(user.dateOfBirth) : null,
      joinDate: userUtils.formatDate(user.createdAt),
    };
  },
};
