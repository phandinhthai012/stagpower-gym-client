import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MemberSidebar } from './MemberSidebar';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Menu, MapPin, Bell, LogOut } from 'lucide-react';
import LogoStagPower from '../../../assets/Logo_StagPower_4x.png';

export function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <header className="bg-transparent lg:ml-64">
        <div className="mx-4 my-4 bg-white shadow-sm border border-gray-200 rounded-xl px-6 py-4 grid grid-cols-3 items-center">
          {/* Left: Logo and brand */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <img src={LogoStagPower} alt="StagPower" className="w-16 h-16 rounded-full object-cover" />
            <span className="text-xl md:text-2xl font-semibold text-blue-900">StagPower</span>
          </div>
          
          {/* Center: empty for minimal layout */}
          <div />

          {/* Right: subtle info text, bell, greeting */}
          <div className="flex items-center justify-end gap-4">
            <span className="hidden md:flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              {`Gò Vấp • ${formatVNTime(now)} • ${formatVNDate(now)}`}
            </span>
            {/* Notification */}
            <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">3</Badge>
            </Button>
            
            {/* Greeting and profile menu */}
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              // onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="text-sm md:text-base text-blue-900 hover:text-blue-700 font-medium"
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}