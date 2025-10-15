export const userFormFields = {
  fullName: {
    label: 'Họ và tên',
    type: 'text',
    placeholder: 'Nhập họ và tên',
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    label: 'Email',
    type: 'email',
    placeholder: 'Nhập email',
    required: true,
  },
  phone: {
    label: 'Số điện thoại',
    type: 'tel',
    placeholder: 'Nhập số điện thoại',
    pattern: '^[0-9]{10,11}$',
    required: false,
  },
  gender: {
    label: 'Giới tính',
    type: 'select',
    options: [
      { value: 'male', label: 'Nam' },
      { value: 'female', label: 'Nữ' },
      { value: 'other', label: 'Khác' },
    ],
    required: false,
  },
  dateOfBirth: {
    label: 'Ngày sinh',
    type: 'date',
    required: false,
  },
  photo: {
    label: 'Ảnh đại diện',
    type: 'url',
    placeholder: 'Nhập URL ảnh',
    required: false,
  },
  cccd: {
    label: 'CCCD/CMND',
    type: 'text',
    placeholder: 'Nhập số CCCD/CMND',
    pattern: '^[0-9]{9,12}$',
    required: false,
  },
};

export const memberInfoFormFields = {
  membership_level: {
    label: 'Cấp độ thành viên',
    type: 'select',
    options: [
      { value: 'basic', label: 'Cơ bản' },
      { value: 'vip', label: 'VIP' },
    ],
    required: false,
  },
  is_student: {
    label: 'Là học sinh/sinh viên',
    type: 'checkbox',
    required: false,
  },
  total_spending: {
    label: 'Tổng chi tiêu (VND)',
    type: 'number',
    placeholder: 'Nhập tổng chi tiêu',
    min: 0,
    required: false,
  },
  membership_month: {
    label: 'Số tháng thành viên',
    type: 'number',
    placeholder: 'Nhập số tháng',
    min: 0,
    required: false,
  },
  notes: {
    label: 'Ghi chú',
    type: 'textarea',
    placeholder: 'Nhập ghi chú',
    rows: 3,
    maxLength: 500,
    required: false,
  },
};

export const trainerInfoFormFields = {
  specialty: {
    label: 'Chuyên môn',
    type: 'text',
    placeholder: 'Nhập chuyên môn',
    maxLength: 200,
    required: false,
  },
  experience_years: {
    label: 'Số năm kinh nghiệm',
    type: 'number',
    placeholder: 'Nhập số năm kinh nghiệm',
    min: 0,
    required: false,
  },
  certificate: {
    label: 'Chứng chỉ',
    type: 'array',
    placeholder: 'Nhập chứng chỉ',
    required: false,
  },
  working_hour: {
    label: 'Giờ làm việc',
    type: 'array',
    placeholder: 'Nhập giờ làm việc',
    required: false,
  },
};

export const staffInfoFormFields = {
  brand_id: {
    label: 'ID thương hiệu',
    type: 'text',
    placeholder: 'Nhập ID thương hiệu',
    required: false,
  },
  position: {
    label: 'Vị trí',
    type: 'select',
    options: [
      { value: 'manager', label: 'Quản lý' },
      { value: 'trainer', label: 'Huấn luyện viên' },
      { value: 'staff', label: 'Nhân viên' },
      { value: 'receptionist', label: 'Lễ tân' },
    ],
    required: false,
  },
};

export const adminInfoFormFields = {
  permissions: {
    label: 'Quyền hạn',
    type: 'array',
    placeholder: 'Nhập quyền hạn',
    required: false,
  },
  managed_branches: {
    label: 'Chi nhánh quản lý',
    type: 'array',
    placeholder: 'Nhập chi nhánh quản lý',
    required: false,
  },
};
