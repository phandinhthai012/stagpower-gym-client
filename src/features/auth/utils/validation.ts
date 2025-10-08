export interface RegisterData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    gender: string;
    dateOfBirth: string;
}
export interface ValidationResult {
    isValid: boolean;
    error: string;
}

export const validateRegisterData = (data: RegisterData): ValidationResult => {
    // Kiểm tra các trường bắt buộc
    if (!data.fullName || !data.email || !data.phone || 
        !data.password || !data.confirmPassword || 
        !data.gender || !data.dateOfBirth) {
      return {
        isValid: false,
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      };
    }
  
    // Kiểm tra mật khẩu xác nhận
    if (data.password !== data.confirmPassword) {
      return {
        isValid: false,
        error: 'Mật khẩu xác nhận không khớp'
      };
    }
  
    // Kiểm tra độ dài mật khẩu
    if (data.password.length < 6) {
      return {
        isValid: false,
        error: 'Mật khẩu phải có ít nhất 6 ký tự'
      };
    }
  
    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        isValid: false,
        error: 'Email không đúng định dạng'
      };
    }
  
    // Kiểm tra phone format (số điện thoại Việt Nam)
    const phoneRegex = /^(0|\+84|84)[0-9]{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        isValid: false,
        error: 'Số điện thoại không đúng định dạng'
      };
    }
  
    // Kiểm tra tuổi (tối thiểu 16 tuổi)
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    if (birthDate >= today) {
      return {
        isValid: false,
        error: 'Ngày sinh không được lớn hơn ngày hiện tại'
      };
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 14) {
      return {
        isValid: false,
        error: 'Bạn phải ít nhất 14 tuổi để đăng ký'
      };
    }
    return {
      isValid: true,
      error: ''
    };
  };