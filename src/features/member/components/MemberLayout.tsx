import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MemberSidebar } from './MemberSidebar';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Menu, MapPin, Bell, LogOut } from 'lucide-react';
import LogoStagPower from '../../../assets/Logo_StagPower_4x.png';

export function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Always open on desktop
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Trang chủ';
    if (path.includes('/profile')) return 'Hồ sơ cá nhân';
    if (path.includes('/packages')) return 'Gói tập của tôi';
    if (path.includes('/checkin')) return 'Check-in';
    if (path.includes('/schedule')) return 'Đặt lịch PT';
    if (path.includes('/history')) return 'Lịch sử tập luyện';
    if (path.includes('/suggestions')) return 'Gợi ý tập luyện';
    if (path.includes('/payments')) return 'Lịch sử thanh toán';
    if (path.includes('/notifications')) return 'Thông báo';
    return 'Dashboard';
  };

  const [now, setNow] = useState<Date>(new Date());
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatVNTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const isAM = hours < 12;
    const suffix = isAM ? 'SA' : 'CH';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm} ${suffix}`;
  };

  const formatVNDate = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Header */}
      <header className={`bg-transparent transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="mx-2 sm:mx-4 my-2 sm:my-4 bg-white shadow-sm border border-gray-200 rounded-xl px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1.5"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Desktop sidebar toggle button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2"
                title={sidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2"/>
                  <line x1="9" y1="4" x2="9" y2="20" strokeWidth="2"/>
                </svg>
              </Button>
              
              <div className="hidden lg:flex items-center gap-2">
                <img 
                  src={LogoStagPower} 
                  alt="StagPower" 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" 
                />
                <div>
                  <span className="text-xl md:text-2xl font-semibold text-blue-900 block">
                    StagPower
                  </span>
                </div>
              </div>
            </div>
            
            {/* Center: Branch (hidden on mobile) */}
            <div className="hidden md:flex flex-1 text-center justify-center">
              <div className="flex items-center justify-center gap-1.5 text-base sm:text-sm text-gray-700 sm:text-gray-600">
                <MapPin className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="font-semibold sm:font-medium">Gò Vấp</span>
              </div>
            </div>

            {/* Right: Notifications + Greeting + Time */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
              {/* Notification */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700"
                onClick={() => navigate('/member/notifications')}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
              
              {/* Greeting and profile menu */}
              <div
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
              >
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="text-xs sm:text-sm md:text-base text-blue-900 hover:text-blue-700 font-medium truncate max-w-[120px] sm:max-w-none"
                >
                  Xin chào, {user?.fullName || 'Hội viên'}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* Time (Hidden on small screens) */}
              <span className="hidden xl:flex items-center gap-2 text-gray-600 text-xs whitespace-nowrap">
                {`${formatVNTime(now)} • ${formatVNDate(now)}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 p-3 sm:p-4 md:p-6 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Outlet />
      </main>
    </div>
  );
}