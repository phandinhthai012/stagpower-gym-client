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
  
    // Helper function to parse DD/MM/YYYY to Date
    const parseDate = (dateStr: string): Date => {
      // Check if already in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
      }
      
      // Parse DD/MM/YYYY format
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      
      // Fallback to standard Date parsing
      return new Date(dateStr);
    };

    // Kiểm tra tuổi (tối thiểu 14 tuổi)
    const today = new Date();
    const birthDate = parseDate(data.dateOfBirth);
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return {
        isValid: false,
        error: 'Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng DD/MM/YYYY'
      };
    }
    
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