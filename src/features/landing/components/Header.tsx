import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import LogoStag from '../../../assets/Logo_StagPower_4x.png';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md' 
          : 'bg-gradient-to-r from-gray-900 to-gray-800'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img 
            src={LogoStag} 
            alt="StagPower Logo" 
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-bold text-white">StagPower</span>
        </div>

        {/* Navigation Menu */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Trang Chủ
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Tính Năng
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('packages')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Gói Tập
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('gym-info')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Thông Tin
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Đánh Giá
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              FAQ
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-orange-400 font-medium transition-colors"
            >
              Liên Hệ
            </button>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => onNavigate?.('login')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-4 py-2 rounded-full font-semibold transition-all"
          >
            Đăng Nhập
          </Button>
          <Button 
            onClick={() => onNavigate?.('register')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5"
          >
            Đăng Ký Ngay
          </Button>
        </div>
      </nav>
    </header>
  );
};
