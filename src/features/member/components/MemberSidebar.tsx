import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  QrCode, 
  Calendar, 
  History, 
  Lightbulb, 
  CreditCard, 
  Bell, 
  X
} from 'lucide-react';

interface MemberSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function MemberSidebar({ sidebarOpen, setSidebarOpen }: MemberSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard, path: '/member/dashboard' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, path: '/member/profile' },
    { id: 'packages', label: 'Gói tập của tôi', icon: Package, path: '/member/packages' },
    { id: 'checkin', label: 'Check-in', icon: QrCode, path: '/member/checkin' },
    { id: 'schedule', label: 'Đặt lịch PT', icon: Calendar, path: '/member/schedule' },
    { id: 'history', label: 'Lịch sử tập luyện', icon: History, path: '/member/history' },
    { id: 'suggestions', label: 'Gợi ý tập luyện', icon: Lightbulb, path: '/member/suggestions' },
    { id: 'payments', label: 'Thanh toán', icon: CreditCard, path: '/member/payments' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, path: '/member/notifications' },
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
                <p className="text-xs text-blue-200">Bảng Điều Hướng Hội Viên</p>
              </div>
            </div>
          </div>
          {/* Mobile close button */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="px-0 py-4 sm:py-6 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide transition-all duration-300">
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
                        ? 'bg-blue-700 text-white border-l-green-500'
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-green-500'
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
