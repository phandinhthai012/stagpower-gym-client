import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Menu, MapPin, Bell, LogOut, Settings } from 'lucide-react';
import LogoStagPower from '../../../assets/Logo_StagPower_4x.png';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Bảng Điều Khiển';
    if (path.includes('/members')) return 'Quản Lý Hội Viên';
    if (path.includes('/packages')) return 'Quản Lý Gói Tập';
    if (path.includes('/access-control')) return 'Kiểm Soát Ra Vào';
    if (path.includes('/schedules')) return 'Quản Lý Lịch PT';
    if (path.includes('/reports')) return 'Báo Cáo & Thống Kê';
    if (path.includes('/payments')) return 'Quản Lý Thanh Toán';
    if (path.includes('/branches')) return 'Quản Lý Chi Nhánh';
    if (path.includes('/discounts')) return 'Quản Lý Ưu Đãi';
    if (path.includes('/exercises')) return 'Quản Lý Bài Tập';
    if (path.includes('/complaints')) return 'Quản Lý Khiếu Nại';
    if (path.includes('/settings')) return 'Cài Đặt Tài Khoản';
    return 'Admin Dashboard';
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
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
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
            <div>
              <span className="text-xl md:text-2xl font-semibold text-blue-900">StagPower</span>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          
          {/* Center: Page Title */}
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
          </div>

          {/* Right: Info, notifications, profile */}
          <div className="flex items-center justify-end gap-4">
            <span className="hidden md:flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              {`Gò Vấp • ${formatVNTime(now)} • ${formatVNDate(now)}`}
            </span>
            
            {/* Notification */}
            <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">5</Badge>
            </Button>
            
            {/* Profile menu */}
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
            >
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 text-sm md:text-base text-blue-900 hover:text-blue-700 font-medium"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="hidden md:block">{user?.fullName || 'Admin'}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                  <button
                    onClick={() => navigate('/admin/settings')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Cài đặt tài khoản
                  </button>
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
