import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Menu, MapPin, Bell, LogOut, Settings, ChevronDown } from 'lucide-react';
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
import LogoStagPower from '../../../assets/Logo_StagPower_4x.png';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Always open on desktop
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  React.useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      // navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = (user: any) => {
    return user?.fullName || user?.full_name || 'Admin';
  };

  const getUserRoleDisplayName = (user: any) => {
    return user?.role === 'Admin' ? 'Quản trị viên' : 'Người dùng';
  };

  const userDisplayName = getUserDisplayName(user);
  const userRole = getUserRoleDisplayName(user);
  const userInitials = userDisplayName
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

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


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Header */}
      <header className={`bg-transparent transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="mx-4 my-4 bg-white shadow-sm border border-gray-200 rounded-xl px-6 py-4 grid grid-cols-3 items-center">
          {/* Left: Logo and brand */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
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
            
            <img src={LogoStagPower} alt="StagPower" className="w-16 h-16 rounded-full object-cover hidden md:block" />
            <div>
              <span className="text-sm md:text-2xl font-semibold text-blue-900">StagPower</span>
              <p className="text-xs md:text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          
          {/* Center: Page Title */}
          <div className="text-center">
            <h1 className="text-sm md:text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
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
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-auto px-2 sm:px-3"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-orange-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex md:flex-col md:items-start md:text-left">
                      <span className="text-sm font-medium text-blue-900">
                        {userDisplayName}
                      </span>
                      <span className="text-xs text-gray-600">
                        {userRole}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
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
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt tài khoản</span>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 p-6 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Outlet />
      </main>
    </div>
  );
}
