import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MemberSidebar } from './MemberSidebar';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Menu, Bell, LogOut } from 'lucide-react';

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-blue-900">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'M'}
                </span>
              </div>
              <div className="hidden md:block">
                <h4 className="text-sm font-medium text-blue-900">{user?.fullName || 'Member'}</h4>
                <p className="text-xs text-gray-500">Hội viên</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </Button>
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