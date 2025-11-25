import React from 'react';
import { 
  Dumbbell, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Shield, 
  Users 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Trang Thiết Bị Hiện Đại",
      description: "Hệ thống máy móc nhập khẩu từ Mỹ và Châu Âu, đảm bảo an toàn và hiệu quả tối đa cho việc tập luyện."
    },
    {
      icon: GraduationCap,
      title: "Huấn Luyện Viên Chuyên Nghiệp",
      description: "Đội ngũ PT có chứng chỉ quốc tế, kinh nghiệm lâu năm và tận tâm với từng hội viên."
    },
    {
      icon: Clock,
      title: "Giờ Mở Cửa Linh Hoạt",
      description: "Mở cửa từ 6:00 AM - 10:00 PM, phù hợp với mọi lịch trình làm việc và học tập."
    },
    {
      icon: MapPin,
      title: "Nhiều Chi Nhánh Thuận Tiện",
      description: "Hệ thống phòng gym trải khắp TP.HCM, dễ dàng tiếp cận từ mọi nơi trong thành phố."
    },
    {
      icon: Shield,
      title: "An Toàn & Vệ Sinh",
      description: "Không gian tập luyện sạch sẽ, được khử khuẩn thường xuyên và tuân thủ nghiêm ngặt các quy định an toàn."
    },
    {
      icon: Users,
      title: "Cộng Đồng Năng Động",
      description: "Tham gia cộng đồng hội viên năng động, chia sẻ kinh nghiệm và động viên lẫn nhau trong hành trình fitness."
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Tại Sao Chọn StagPower?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất với những ưu điểm vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl text-center shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
