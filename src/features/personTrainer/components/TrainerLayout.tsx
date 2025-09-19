import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TrainerSidebar } from './TrainerSidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { Menu, Bell, LogOut } from 'lucide-react';

export function TrainerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Trang chủ';
    if (path.includes('/member-management')) return 'Quản Lý Hội Viên';
    if (path.includes('/schedule')) return 'Lịch Dạy';
    if (path.includes('/progress')) return 'Theo Dõi Tiến Độ';
    if (path.includes('/profile')) return 'Thông Tin Cá Nhân';
    if (path.includes('/notifications')) return 'Thông Báo';
    return 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-blue-900">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="hidden md:block">
                <h4 className="text-sm font-medium text-blue-900">{user?.fullName || 'Personal Trainer'}</h4>
                <p className="text-xs text-gray-500">Personal Trainer</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
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
