import React, { useEffect, useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MemberSidebar } from './MemberSidebar';
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
import { useMyNotifications } from '../hooks';
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = (user: any) => {
    return user?.fullName || user?.full_name || 'Hội viên';
  };

  const getUserRoleDisplayName = (user: any) => {
    return 'Hội viên';
  };

  const userDisplayName = getUserDisplayName(user);
  const userRole = getUserRoleDisplayName(user);
  const userInitials = userDisplayName
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get unread notifications count
  const { data: notificationsResponse } = useMyNotifications();
  const unreadCount = useMemo(() => {
    if (!notificationsResponse?.data) return 0;
    return notificationsResponse.data.filter((notification: any) => 
      notification.status?.toUpperCase() === 'UNREAD' || notification.status === 'unread'
    ).length;
  }, [notificationsResponse]);

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
                  <p className="text-xs text-gray-600">Member Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Center: Branch */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-base sm:text-sm text-gray-700 sm:text-gray-600">
                <MapPin className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="font-semibold sm:font-medium">Gò Vấp</span>
              </div>
            </div>

            {/* Right: Time + Notifications + Profile */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Time (Hidden on small screens) */}
              <span className="hidden xl:flex items-center gap-2 text-gray-600 text-xs whitespace-nowrap">
                {`${formatVNTime(now)} • ${formatVNDate(now)}`}
              </span>
              
              {/* Notification */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700"
                onClick={() => navigate('/member/notifications')}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 ? (
                  <Badge 
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs p-0 flex items-center justify-center bg-red-600 text-white border-red-600"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                ) : (
                  <Badge 
                    variant="outline"
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs p-0 flex items-center justify-center bg-white text-gray-600 border-gray-300"
                  >
                    0
                  </Badge>
                )}
              </Button>
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 sm:h-10 w-auto px-1.5 sm:px-3"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarFallback className="text-[10px] sm:text-xs bg-orange-500 text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex lg:flex-col lg:items-start lg:text-left max-w-[120px]">
                        <span className="text-xs sm:text-sm font-medium text-blue-900 truncate w-full">
                          {userDisplayName}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-600 truncate w-full">
                          {userRole}
                        </span>
                      </div>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 hidden sm:block" />
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
                  <DropdownMenuItem onClick={() => navigate('/member/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
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
        </div>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 p-3 sm:p-4 md:p-6 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Outlet />
      </main>
    </div>
  );
}