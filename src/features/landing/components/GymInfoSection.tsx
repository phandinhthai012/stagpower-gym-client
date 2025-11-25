import React, { useMemo } from 'react';
import { MapPin, Users, Dumbbell, Clock } from 'lucide-react';
import { useGymStats } from '../hooks/useStats';

export const GymInfoSection: React.FC = () => {
  const { data: gymStats, isLoading } = useGymStats();

  const stats = useMemo(() => {
    const branchesCount = gymStats?.branchesCount || 8;
    const membersCount = gymStats?.membersCount || 5000;
    const exercisesCount = gymStats?.exercisesCount || 200;
    const operatingHours = gymStats?.operatingHours || '16 Giờ/ngày';

    return [
      {
        icon: MapPin,
        number: `${branchesCount} Chi Nhánh`,
        description: "Trải khắp các quận trung tâm TP.HCM, thuận tiện cho mọi hội viên"
      },
      {
        icon: Users,
        number: `${membersCount >= 1000 ? (membersCount / 1000).toFixed(1) + 'K+' : membersCount + '+'} Hội Viên`,
        description: "Cộng đồng hội viên đông đảo và năng động"
      },
      {
        icon: Dumbbell,
        number: `200+ Thiết Bị`,
        description: "Hệ thống máy móc hiện đại, đa dạng cho mọi bài tập"
      },
      {
        icon: Clock,
        number: operatingHours,
        description: "Mở cửa từ 6:00 AM - 10:00 PM, phù hợp mọi lịch trình"
      }
    ];
  }, [gymStats]);

  return (
    <section id="gym-info" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Thông Tin Phòng Gym
          </h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto px-2">
            Những con số ấn tượng về StagPower Gym
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-4 sm:p-6 animate-pulse">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full mx-auto mb-4 sm:mb-5"></div>
                <div className="h-6 sm:h-8 bg-white/10 rounded mx-auto mb-3 w-32 sm:w-40"></div>
                <div className="h-4 bg-white/10 rounded mx-auto w-full max-w-xs"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-4 sm:p-6 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                    {stat.number}
                  </h3>
                  <p className="text-sm sm:text-base opacity-90 leading-relaxed px-2">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
