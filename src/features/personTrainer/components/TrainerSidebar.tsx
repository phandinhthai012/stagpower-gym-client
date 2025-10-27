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
    { id: 'members', label: 'Quản lý hội viên', icon: Users, path: '/trainer/member-management' },
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
        fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-all duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'} 
        lg:fixed lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}
      `}>
        {/* Sidebar Header */}
        <div className={`border-b border-blue-700 transition-all duration-300 ${sidebarOpen ? 'px-4 py-4 sm:px-5 sm:py-5' : 'lg:px-2 lg:py-4 px-0 py-0'}`}>
          <div className="flex items-center justify-center lg:justify-start">
            {/* Logo - Hidden on mobile when sidebar closed via CSS, always visible on desktop */}
            <div className={`flex items-center gap-2 sm:gap-3 relative group ${!sidebarOpen ? 'hidden lg:flex' : 'flex'}`}>
              <img 
                src="/Logo_StagPower_4x.png" 
                alt="StagPower Logo" 
                className={`object-contain transition-all duration-300 ${
                  !sidebarOpen 
                    ? 'w-10 h-10' 
                    : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20'
                }`}
              />
              <div className={`transition-all duration-300 ${
                !sidebarOpen 
                  ? 'opacity-0 w-0 overflow-hidden' 
                  : 'opacity-100 w-auto'
              }`}>
                <h2 className="text-base sm:text-lg font-semibold text-white">StagPower</h2>
                <p className="text-xs text-blue-200">PT Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-0 py-4 sm:py-6 flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide transition-all duration-300">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }
                    }}
                    className={`
                      w-full flex items-center transition-all duration-300 ease-in-out
                      border-l-4 border-transparent relative
                      ${sidebarOpen ? 'justify-start px-4 sm:px-5 py-3' : 'lg:justify-center lg:px-2 lg:py-3 justify-start px-4 py-3'}
                      ${active
                        ? 'bg-blue-700 text-white border-l-orange-500'
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-orange-500'
                      }
                    `}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon className={`flex-shrink-0 ${sidebarOpen ? 'w-5 h-5' : 'lg:w-6 lg:h-6 w-5 h-5'}`} />
                    <span className={`
                      text-sm font-medium truncate transition-all duration-300
                      ${!sidebarOpen 
                        ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0 opacity-100 w-auto ml-3' 
                        : 'opacity-100 w-auto ml-3'
                      }
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Tooltip for collapsed desktop sidebar */}
                    {!sidebarOpen && (
                      <div className="hidden lg:group-hover:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer - Version info (only when expanded on desktop) */}
        <div className={`
          hidden lg:block border-t border-blue-700 transition-all duration-300
          ${sidebarOpen ? 'px-4 py-3 opacity-100' : 'px-2 py-2 opacity-0'}
        `}>
          <div className={`text-center text-xs text-blue-300 ${!sidebarOpen ? 'hidden' : ''}`}>
            <p>Version 1.0.0</p>
            <p className="text-blue-400">© 2025 StagPower</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
