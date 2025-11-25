import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center text-white pt-16 sm:pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
          Biến Ước Mơ Thành Hiện Thực
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed px-2">
          Tham gia StagPower Gym để có cơ thể khỏe mạnh, săn chắc và tự tin hơn bao giờ hết. 
          Với đội ngũ huấn luyện viên chuyên nghiệp và trang thiết bị hiện đại.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Button 
            onClick={() => navigate('/register')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 w-full sm:w-auto"
          >
            Đăng Ký Tập Ngay
          </Button>
          <Button 
            onClick={() => scrollToSection('packages')}
            variant="outline"
            className="bg-white border-2 border-black text-black hover:bg-white hover:text-red-500 hover:border-red-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 w-full sm:w-auto"
          >
            Xem Gói Tập
          </Button>
        </div>
      </div>
    </section>
  );
};
