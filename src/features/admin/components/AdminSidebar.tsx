import React, { useState } from 'react';
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
  DollarSign,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  hasSubmenu?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['staff-pt']));

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'members', label: 'Quản Lý Hội Viên', icon: Users, path: '/admin/members' },
    { id: 'packages', label: 'Quản Lý Gói Tập', icon: Package, path: '/admin/packages' },
    { id: 'access-control', label: 'Kiểm Soát Ra Vào', icon: QrCode, path: '/admin/access-control' },
    { 
      id: 'staff-pt', 
      label: 'Quản Lý Nhân Viên/PT', 
      icon: Users, 
      hasSubmenu: true,
      subItems: [
        { id: 'staff-pt-management', label: 'Quản Lý Nhân Viên/PT', icon: Users, path: '/admin/staff-pt-management' },
        { id: 'schedules', label: 'Lịch làm việc NV/PT', icon: Calendar, path: '/admin/schedules' }
      ]
    },
    { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: BarChart3, path: '/admin/reports' },
    { id: 'invoice-payment', label: 'Hóa Đơn & Thanh Toán', icon: DollarSign, path: '/admin/invoice-payment' },
    { id: 'branch-management', label: 'Quản Lý Chi Nhánh', icon: Building2, path: '/admin/branch-management' },
    { id: 'discounts', label: 'Quản Lý Ưu Đãi', icon: Percent, path: '/admin/discounts' },
    { id: 'exercises', label: 'Quản Lý Bài Tập', icon: Dumbbell, path: '/admin/exercises' },
    { id: 'complaints', label: 'Quản Lý Khiếu Nại', icon: MessageSquare, path: '/admin/complaints' },
    { id: 'settings', label: 'Cài Đặt Tài Khoản', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (subItems: SubMenuItem[]) => {
    return subItems.some(item => isActive(item.path));
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
                className={`w-24 h-24 object-contain transition-all duration-300 ${!sidebarOpen ? 'lg:w-8 lg:h-8' : 'lg:w-24 lg:h-24'}`}
              />
              <div className={`transition-all duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'lg:opacity-100 lg:w-auto'}`}>
                <h2 className="text-lg font-semibold text-white">StagPower</h2>
                <p className="text-xs text-blue-200">Admin Dashboard</p>
              </div>
              
              {/* Tooltip for logo - only show when sidebar is collapsed */}
              {!sidebarOpen && (
                <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[60] whitespace-nowrap font-medium">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-blue-600 rotate-45"></div>
                  StagPower Admin Dashboard
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <div className="px-0 py-6 flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide transition-all duration-300">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus.has(item.id);
              const hasSubmenu = item.hasSubmenu;
              const isParentActiveState = hasSubmenu && item.subItems ? isParentActive(item.subItems) : false;
              
              if (hasSubmenu) {
                return (
                  <div key={item.id} className="relative group">
                    {/* Parent Menu Item */}
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`
                        w-full flex items-center justify-center lg:justify-between px-5 py-3 text-sm font-medium transition-all duration-300 ease-in-out
                        border-l-3 border-transparent
                        ${isParentActiveState
                          ? 'bg-blue-700 text-white border-l-orange-500'
                          : 'text-blue-200 hover:bg-blue-700 hover:text-white hover:border-l-orange-500'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className={`truncate transition-all duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'lg:opacity-100 lg:w-auto lg:ml-3'}`}>{item.label}</span>
                      </div>
                      <div className={`transition-all duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'lg:opacity-100 lg:w-auto'}`}>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                    
                    {/* Tooltip for collapsed state - only show when sidebar is collapsed */}
                    {!sidebarOpen && (
                      <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[60] whitespace-nowrap font-medium">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-blue-600 rotate-45"></div>
                        {item.label}
                      </div>
                    )}
                    
                    {/* Sub Menu Items - Only show when expanded and sidebar is open */}
                    {isExpanded && item.subItems && sidebarOpen && (
                      <div className="ml-4 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                navigate(subItem.path);
                              }}
                              className={`
                                w-full flex items-center px-5 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                                border-l-3 border-transparent rounded-r-md
                                ${isActive(subItem.path)
                                  ? 'bg-teal-600 text-white border-l-green-500'
                                  : 'text-blue-200 hover:bg-blue-600 hover:text-white hover:border-l-green-400'
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                              <span className="truncate">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
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
                    
                    {/* Tooltip for collapsed state - only show when sidebar is collapsed */}
                    {!sidebarOpen && (
                      <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[60] whitespace-nowrap font-medium">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-blue-600 rotate-45"></div>
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              }
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
