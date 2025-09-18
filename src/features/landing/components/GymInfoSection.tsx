import React from 'react';
import { MapPin, Users, Dumbbell, Clock } from 'lucide-react';

export const GymInfoSection: React.FC = () => {
  const stats = [
    {
      icon: MapPin,
      number: "8 Chi Nhánh",
      description: "Trải khắp các quận trung tâm TP.HCM, thuận tiện cho mọi hội viên"
    },
    {
      icon: Users,
      number: "5,000+ Hội Viên",
      description: "Cộng đồng hội viên đông đảo và năng động"
    },
    {
      icon: Dumbbell,
      number: "200+ Thiết Bị",
      description: "Hệ thống máy móc hiện đại, đa dạng cho mọi bài tập"
    },
    {
      icon: Clock,
      number: "16 Giờ/ngày",
      description: "Mở cửa từ 6:00 AM - 10:00 PM, phù hợp mọi lịch trình"
    }
  ];

  return (
    <section id="gym-info" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Thông Tin Phòng Gym
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Những con số ấn tượng về StagPower Gym
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {stat.number}
                </h3>
                <p className="opacity-90 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
