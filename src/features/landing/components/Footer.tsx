import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5">
              StagPower Gym
            </h3>
            <p className="text-gray-300 leading-relaxed mb-5">
              Nơi biến ước mơ thành hiện thực. Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất cho mọi hội viên.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5">
              Liên Hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">1900 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">info@stagpower.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5">
              Giờ Mở Cửa
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">Thứ 2 - Chủ nhật</span>
              </div>
              <p className="text-gray-300 ml-8">6:00 AM - 10:00 PM</p>
              <p className="text-gray-300 ml-8">Không nghỉ lễ</p>
            </div>
          </div>

          {/* Branches */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-5">
              Chi Nhánh
            </h3>
            <div className="space-y-2">
              <p className="text-gray-300">Quận 1 - Trung tâm</p>
              <p className="text-gray-300">Quận 3 - Phú Nhuận</p>
              <p className="text-gray-300">Quận 7 - Phú Mỹ Hưng</p>
              <p className="text-gray-300">Gò Vấp - Nguyễn Văn Lượng</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 StagPower Gym. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
