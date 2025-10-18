import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Bell
} from 'lucide-react';

interface TrainerSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

export function TrainerSidebar({ sidebarOpen, setSidebarOpen }: TrainerSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/trainer/dashboard' },
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
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'} 
        lg:fixed lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}
      `}>
        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b border-blue-700 transition-all duration-300">
          <div className="flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-3 relative group">
              <img 
                src="/Logo_StagPower_4x.png" 
                alt="StagPower Logo" 
                className={`w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 ${!sidebarOpen ? 'lg:w-8 lg:h-8' : 'lg:w-24 lg:h-24'}`}
              />
              <div className={`hidden md:block transition-all duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'lg:opacity-100 lg:w-auto'}`}>
                <h2 className="text-sm sm:text-lg font-semibold text-white">StagPower</h2>
                <p className="text-xs text-blue-200">PT Dashboard</p>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <div className="px-0 py-6 flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide transition-all duration-300">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    className={`
                      w-full flex items-center justify-center lg:justify-start px-5 py-3 text-sm font-medium transition-all duration-300 ease-in-out
                      border-l-3 border-transparent
                      ${item.path && isActive(item.path)
                        ? 'bg-blue-700 text-white border-l-orange-500'
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-orange-500'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`truncate transition-all duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'lg:opacity-100 lg:w-auto lg:ml-3'}`}>{item.label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
