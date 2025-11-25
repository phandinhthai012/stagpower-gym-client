import React, { useMemo } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useBranches } from '../hooks/useBranches';

export const Footer: React.FC = () => {
  const { data: branches, isLoading } = useBranches();

  // Get first branch (by _id) for address
  const firstBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    // Sort by _id to get the first one
    const sorted = [...branches].sort((a, b) => a._id.localeCompare(b._id));
    return sorted[0];
  }, [branches]);

  // Display branches (limit to 4 for footer)
  const displayBranches = useMemo(() => {
    if (!branches || branches.length === 0) return [];
    return branches.slice(0, 4);
  }, [branches]);

  return (
    <footer id="contact" className="bg-gray-900 text-white py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-4 sm:mb-5">
              StagPower Gym
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-5">
              Nơi biến ước mơ thành hiện thực. Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất cho mọi hội viên.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-4 sm:mb-5">
              Liên Hệ
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <a href="tel:0888055742" className="text-sm sm:text-base text-gray-300 hover:text-orange-500 transition-colors">
                  0888.055.742
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300 break-all">info@stagpower.com</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-300">
                  {isLoading ? (
                    <span className="inline-block w-32 h-4 bg-gray-700 rounded animate-pulse"></span>
                  ) : firstBranch ? (
                    firstBranch.address
                  ) : (
                    '123 Đường ABC, Quận 1, TP.HCM'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-4 sm:mb-5">
              Giờ Mở Cửa
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300">Thứ 2 - Chủ nhật</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 ml-6 sm:ml-8">6:00 AM - 10:00 PM</p>
              <p className="text-sm sm:text-base text-gray-300 ml-6 sm:ml-8">Không nghỉ lễ</p>
            </div>
          </div>

          {/* Branches */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-4 sm:mb-5">
              Chi Nhánh
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : displayBranches.length > 0 ? (
              <div className="space-y-2">
                {displayBranches.map((branch) => (
                  <p key={branch._id} className="text-sm sm:text-base text-gray-300">
                    {branch.name}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-gray-300">Quận 1 - Trung tâm</p>
                <p className="text-sm sm:text-base text-gray-300">Quận 3 - Phú Nhuận</p>
                <p className="text-sm sm:text-base text-gray-300">Quận 7 - Phú Mỹ Hưng</p>
                <p className="text-sm sm:text-base text-gray-300">Gò Vấp - Nguyễn Văn Lượng</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; 2024 StagPower Gym. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
