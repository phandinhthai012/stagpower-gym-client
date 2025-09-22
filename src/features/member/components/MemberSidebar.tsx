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
  LogOut, 
  X
} from 'lucide-react';

interface MemberSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function MemberSidebar({ sidebarOpen, setSidebarOpen }: MemberSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard, path: '/member/dashboard' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, path: '/member/profile' },
    { id: 'packages', label: 'Gói tập của tôi', icon: Package, path: '/member/packages' },
    { id: 'checkin', label: 'Check-in', icon: QrCode, path: '/member/checkin' },
    { id: 'schedule', label: 'Đặt lịch PT', icon: Calendar, path: '/member/schedule' },
    { id: 'history', label: 'Lịch sử tập luyện', icon: History, path: '/member/history' },
    { id: 'suggestions', label: 'Gợi ý tập luyện', icon: Lightbulb, path: '/member/suggestions' },
    { id: 'payments', label: 'Lịch sử thanh toán', icon: CreditCard, path: '/member/payments' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, path: '/member/notifications' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:fixed lg:translate-x-0 lg:flex-shrink-0
      `}>
        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/Logo_StagPower_4x.png" 
                alt="StagPower Logo" 
                className="w-24 h-24 object-contain"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">StagPower</h2>
                <p className="text-xs text-blue-200">Bảng Điều Hướng Hội Viên </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Navigation Menu */}
        <div className="px-0 py-6">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-5 py-3 text-sm font-medium transition-all duration-300 ease-in-out
                    border-l-3 border-transparent
                    ${isActive(item.path)
                      ? 'bg-blue-700 text-white border-l-green-500'
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-green-500'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-blue-200 hover:bg-blue-700 hover:text-white transition-all duration-300 ease-in-out border-l-3 border-transparent hover:border-l-red-500"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Đăng Xuất</span>
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
