import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
} from '../../../components/ui';
import LogoStag from '../../../assets/Logo_StagPower_4x.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll lock when dropdown is open
  useEffect(() => {
    if (!isDropdownOpen) return;

    let rafId: number;
    let lastCheck = 0;
    const preventScrollLock = () => {
      const now = Date.now();
      // Throttle to prevent flickering - only check every 100ms
      if (now - lastCheck < 100) {
        if (isDropdownOpen) {
          rafId = requestAnimationFrame(preventScrollLock);
        }
        return;
      }
      lastCheck = now;

      // Check if body has fixed position (indicating scroll lock)
      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        // Remove data-scroll-locked attribute if present
        document.body.removeAttribute('data-scroll-locked');
        if (scrollY) {
          const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
          window.scrollTo(0, y);
        }
      }
      // Also check for data-scroll-locked attribute
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }

      // Continue checking only if dropdown is still open
      if (isDropdownOpen) {
        rafId = requestAnimationFrame(preventScrollLock);
      }
    };

    // Start checking
    rafId = requestAnimationFrame(preventScrollLock);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDropdownOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Reload page after logout
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = (user: any) => {
    return user?.fullName || user?.full_name || 'Người dùng';
  };

  const getUserRoleDisplayName = (user: any) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Quản trị viên',
      'staff': 'Nhân viên',
      'trainer': 'Huấn luyện viên',
      'member': 'Hội viên'
    };
    return roleMap[user?.role] || 'Người dùng';
  };

  const userDisplayName = getUserDisplayName(user);
  const userRole = getUserRoleDisplayName(user);
  const userInitials = userDisplayName
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff') return '/staff/dashboard';
    if (user?.role === 'trainer') return '/trainer';
    return '/member';
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
        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <DropdownMenu
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                // Prevent scroll lock when dropdown opens/closes
                // Use requestAnimationFrame to ensure this runs after Radix UI's scroll lock
                requestAnimationFrame(() => {
                  // Restore scroll styles to prevent lock
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    // Remove data-scroll-locked attribute if present
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1.5 text-white hover:text-orange-400 hover:bg-white/10"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-orange-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-sm font-medium text-white">
                        {userDisplayName}
                      </span>
                      <span className="text-xs text-gray-300">
                        {userRole}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white hidden sm:block" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {userDisplayName}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email || 'Không có email'}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {userRole}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
