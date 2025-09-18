import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const PackagesSection: React.FC = () => {
  const packages = [
    {
      name: "Gói Thử Nghiệm",
      price: "99.000",
      duration: "7 ngày",
      features: [
        "Tập tại tất cả chi nhánh",
        "Sử dụng tất cả thiết bị",
        "Hỗ trợ cơ bản từ nhân viên",
        "Không giới hạn số lần tập"
      ],
      featured: false
    },
    {
      name: "Gói 3 Tháng",
      price: "1.200.000",
      duration: "3 tháng",
      features: [
        "Tập tại tất cả chi nhánh",
        "Sử dụng tất cả thiết bị",
        "5 buổi PT miễn phí",
        "Tư vấn dinh dưỡng cơ bản",
        "Không giới hạn số lần tập"
      ],
      featured: true
    },
    {
      name: "Gói 12 Tháng",
      price: "3.600.000",
      duration: "12 tháng",
      features: [
        "Tập tại tất cả chi nhánh",
        "Sử dụng tất cả thiết bị",
        "20 buổi PT miễn phí",
        "Tư vấn dinh dưỡng chi tiết",
        "Khám sức khỏe định kỳ",
        "Ưu đãi đặc biệt cho hội viên VIP"
      ],
      featured: false
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Gói Tập Phù Hợp Với Mọi Nhu Cầu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lựa chọn gói tập phù hợp với mục tiêu và ngân sách của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative bg-white border-2 rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                pkg.featured 
                  ? 'border-orange-500 scale-105 shadow-lg' 
                  : 'border-gray-200 hover:border-orange-500'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold transform rotate-12">
                  PHỔ BIẾN NHẤT
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {pkg.name}
              </h3>
              
              <div className="text-4xl font-bold text-orange-500 mb-2">
                {pkg.price}
                <span className="text-lg text-gray-600 font-normal">VNĐ</span>
              </div>
              
              <div className="text-gray-600 mb-6">
                {pkg.duration}
              </div>
              
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => scrollToSection('registration')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition-all hover:-translate-y-1"
              >
                Chọn Gói Này
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
