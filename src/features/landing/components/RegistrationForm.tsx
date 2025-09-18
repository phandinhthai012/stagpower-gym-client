import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { 
  User, 
  Heart, 
  Package, 
  Plus,
  Info
} from 'lucide-react';

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cccd: '',
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    experience: '',
    fitnessLevel: '',
    preferredTime: '',
    selectedPackage: '',
    membershipType: '',
    branchPreference: '',
    isHSSV: '',
    medicalHistory: '',
    allergies: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'gender', 'birthDate', 'selectedPackage', 'fitnessGoal', 'experience'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)!');
      return;
    }
    
    // Validate age
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 15) {
      alert('Bạn phải từ 15 tuổi trở lên để đăng ký!');
      return;
    }
    
    // Show success message
    alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.');
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      cccd: '',
      gender: '',
      birthDate: '',
      height: '',
      weight: '',
      fitnessGoal: '',
      experience: '',
      fitnessLevel: '',
      preferredTime: '',
      selectedPackage: '',
      membershipType: '',
      branchPreference: '',
      isHSSV: '',
      medicalHistory: '',
      allergies: '',
      notes: ''
    });
  };

  return (
    <section id="registration" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Đăng Ký Làm Hội Viên
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Điền thông tin bên dưới để bắt đầu hành trình fitness của bạn
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Thông Tin Cá Nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                    Họ và tên đầy đủ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cccd" className="text-sm font-semibold text-gray-700">
                    CCCD/CMND
                  </Label>
                  <Input
                    id="cccd"
                    name="cccd"
                    type="text"
                    value={formData.cccd}
                    onChange={handleInputChange}
                    placeholder="Nhập số CCCD/CMND"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                Thông Tin Sức Khỏe
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-700">
                  Có thể để trống. Bạn có thể đến chi nhánh để được kiểm tra trực tiếp miễn phí.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height" className="text-sm font-semibold text-gray-700">
                    Chiều cao (cm)
                  </Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="170"
                    min="100"
                    max="250"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">
                    Cân nặng (kg)
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="65"
                    min="30"
                    max="200"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fitnessGoal" className="text-sm font-semibold text-gray-700">
                    Mục tiêu tập luyện <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn mục tiêu</option>
                    <option value="WeightLoss">Giảm cân</option>
                    <option value="MuscleGain">Tăng cơ</option>
                    <option value="Health">Sức khỏe tổng thể</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                    Kinh nghiệm tập luyện <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="Beginner">Mới bắt đầu</option>
                    <option value="Intermediate">Có kinh nghiệm</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="fitnessLevel" className="text-sm font-semibold text-gray-700">
                    Mức độ thể lực
                  </Label>
                  <select
                    id="fitnessLevel"
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="Low">Thấp</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Cao</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="preferredTime" className="text-sm font-semibold text-gray-700">
                    Thời gian tập ưa thích
                  </Label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn thời gian</option>
                    <option value="Morning">Sáng (6:00 - 9:00)</option>
                    <option value="Afternoon">Trưa (12:00 - 15:00)</option>
                    <option value="Evening">Tối (18:00 - 21:00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Thông Tin Gói Tập
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="selectedPackage" className="text-sm font-semibold text-gray-700">
                    Gói tập mong muốn <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="selectedPackage"
                    name="selectedPackage"
                    value={formData.selectedPackage}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn gói tập</option>
                    <option value="trial">Gói Thử Nghiệm - 99.000 VNĐ</option>
                    <option value="3months">Gói 3 Tháng - 1.200.000 VNĐ</option>
                    <option value="12months">Gói 12 Tháng - 3.600.000 VNĐ</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="membershipType" className="text-sm font-semibold text-gray-700">
                    Loại membership
                  </Label>
                  <select
                    id="membershipType"
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại</option>
                    <option value="Basic">Basic (1 chi nhánh)</option>
                    <option value="VIP">VIP (Tất cả chi nhánh)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="branchPreference" className="text-sm font-semibold text-gray-700">
                    Chi nhánh ưa thích
                  </Label>
                  <select
                    id="branchPreference"
                    name="branchPreference"
                    value={formData.branchPreference}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn chi nhánh</option>
                    <option value="quan1">Quận 1 - Trung tâm</option>
                    <option value="quan3">Quận 3 - Phú Nhuận</option>
                    <option value="quan7">Quận 7 - Phú Mỹ Hưng</option>
                    <option value="govap">Gò Vấp - Nguyễn Văn Lượng</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="isHSSV" className="text-sm font-semibold text-gray-700">
                    Bạn có phải HSSV không?
                  </Label>
                  <select
                    id="isHSSV"
                    name="isHSSV"
                    value={formData.isHSSV}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn</option>
                    <option value="true">Có (Học sinh/Sinh viên)</option>
                    <option value="false">Không</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Thông Tin Bổ Sung
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicalHistory" className="text-sm font-semibold text-gray-700">
                    Tiền sử bệnh lý (nếu có)
                  </Label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Nhập thông tin bệnh lý nếu có..."
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">
                    Dị ứng (nếu có)
                  </Label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Nhập thông tin dị ứng nếu có..."
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                    Ghi chú thêm
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Nhập thông tin bổ sung khác..."
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full text-lg font-semibold transition-all hover:-translate-y-1"
            >
              Gửi Đăng Ký
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
