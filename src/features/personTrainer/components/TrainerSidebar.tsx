import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  X,
  Menu
} from 'lucide-react';

interface TrainerSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TrainerSidebar({ sidebarOpen, setSidebarOpen }: TrainerSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/trainer/dashboard' },
    { id: 'schedule', label: 'Lịch dạy', icon: Calendar, path: '/trainer/schedule' },
    { id: 'members', label: 'Hội viên', icon: Users, path: '/trainer/member-management' },
    { id: 'progress', label: 'Theo dõi tiến độ', icon: TrendingUp, path: '/trainer/progress' },
    { id: 'profile', label: 'Thông tin cá nhân', icon: Settings, path: '/trainer/profile' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, path: '/trainer/notifications' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:fixed lg:translate-x-0 lg:flex-shrink-0`}>
        <div className="px-6 py-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-white">StagPower</h2>
                <p className="text-xs text-blue-200">Personal Trainer Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="px-4 py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.fullName?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">{user?.fullName || 'Personal Trainer'}</h3>
                <p className="text-xs text-blue-200">Huấn luyện viên</p>
              </div>
            </div>
          </div>

          <nav className="w-full">  
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-5 py-4 text-sm font-medium rounded-sm transition-colors ${isActive(item.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-blue-200 hover:bg-blue-700 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
