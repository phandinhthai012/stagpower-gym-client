import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  QrCode, 
  Calendar, 
  BarChart3, 
  CreditCard, 
  Building2, 
  Percent, 
  Dumbbell, 
  MessageSquare, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'members', label: 'Quản Lý Hội Viên', icon: Users, path: '/admin/members' },
    { id: 'packages', label: 'Quản Lý Gói Tập', icon: Package, path: '/admin/packages' },
    { id: 'access-control', label: 'Kiểm Soát Ra Vào', icon: QrCode, path: '/admin/access-control' },
    { id: 'schedules', label: 'Quản Lý Lịch PT', icon: Calendar, path: '/admin/schedules' },
    { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: BarChart3, path: '/admin/reports' },
    { id: 'payments', label: 'Quản Lý Thanh Toán', icon: CreditCard, path: '/admin/payments' },
    { id: 'branches', label: 'Quản Lý Chi Nhánh', icon: Building2, path: '/admin/branches' },
    { id: 'discounts', label: 'Quản Lý Ưu Đãi', icon: Percent, path: '/admin/discounts' },
    { id: 'exercises', label: 'Quản Lý Bài Tập', icon: Dumbbell, path: '/admin/exercises' },
    { id: 'complaints', label: 'Quản Lý Khiếu Nại', icon: MessageSquare, path: '/admin/complaints' },
    { id: 'settings', label: 'Cài Đặt Tài Khoản', icon: Settings, path: '/admin/settings' },
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
                <p className="text-xs text-blue-200">Admin Dashboard</p>
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

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.fullName?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{user?.fullName || 'Admin'}</h3>
              <p className="text-xs text-blue-200">Quản trị viên</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-0 py-6 flex-1 overflow-y-auto">
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
                      ? 'bg-blue-700 text-white border-l-orange-500'
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-orange-500'
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
        <div className="p-4 border-t border-blue-700">
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
