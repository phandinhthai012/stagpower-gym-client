import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
import LogoStag from '../../../assets/Logo_StagPower_4x.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          {isAuthenticated ? (
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <span className="text-white text-sm px-3 py-2 cursor-pointer hover:text-orange-400 transition-colors">
                Xin chào, {user?.fullName}
              </span>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      const dashboardPath = user?.role === 'admin' ? '/admin' :
                                          user?.role === 'staff' ? '/staff' :
                                          user?.role === 'trainer' ? '/trainer' :
                                          '/member';
                      navigate(dashboardPath);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="bg-white border-black text-black hover:bg-white hover:text-red-500 hover:border-red-500 px-4 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
              >
                Đăng Nhập
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5"
              >
                Đăng Ký Ngay
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
