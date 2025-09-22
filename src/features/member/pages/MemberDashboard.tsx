import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  QrCode, 
  Package,
  CreditCard,
  Activity,
  Target,
  Award,
  Dumbbell,
  LogIn,
  ChartLine,
  User,
  Bell,
  Settings
} from 'lucide-react';
import { 
  mockSubscriptions, 
  mockCheckIns, 
  mockSchedules, 
  mockPayments,
  mockAISuggestions,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('member');

  // Get member-specific data
  const memberData = {
    activeSubscription: mockSubscriptions.find(sub => sub.status === 'Active'),
    recentCheckIns: mockCheckIns.slice(0, 5),
    upcomingSchedules: mockSchedules.filter(schedule => 
      new Date(schedule.date_time) > new Date() && schedule.status === 'Confirmed'
    ),
    recentPayments: mockPayments.slice(0, 3),
    latestAISuggestion: mockAISuggestions[0]
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">StagPower</div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-medium">
            Chi nhánh Quận 1
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>{date}</div>
            <div className="font-medium">{time}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-5 flex">
        <button
          onClick={() => setActiveTab('member')}
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${
            activeTab === 'member'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
          }`}
        >
          Hội Viên
        </button>
        <button
          onClick={() => setActiveTab('pt')}
          className={`flex-1 px-5 py-4 text-base font-medium transition-all duration-300 border-b-3 ${
            activeTab === 'pt'
              ? 'text-blue-900 border-b-blue-900 bg-blue-50'
              : 'text-gray-600 border-b-transparent hover:text-blue-900'
          }`}
        >
          Huấn Luyện Viên
        </button>
      </div>

      {/* Member Tab Content */}
      {activeTab === 'member' && (
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Hội Viên</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">VIP</h3>
                <p className="text-gray-600 text-sm">Gói hiện tại</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Còn 45 ngày
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-orange-100 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600 text-sm">Buổi PT còn lại</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  2 buổi/tuần
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-green-100 rounded-xl flex items-center justify-center">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">24</h3>
                <p className="text-gray-600 text-sm">Lần check-in tháng này</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +6 so với tháng trước
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-purple-100 rounded-xl flex items-center justify-center">
                <ChartLine className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">75%</h3>
                <p className="text-gray-600 text-sm">Tiến độ mục tiêu</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% so với tuần trước
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-5">Thao Tác Nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Check-in</h4>
                <p className="text-sm text-gray-600">Hiển thị QR code để check-in</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Đặt lịch PT</h4>
                <p className="text-sm text-gray-600">Đặt lịch với huấn luyện viên</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Gói tập</h4>
                <p className="text-sm text-gray-600">Xem và gia hạn gói tập</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Thanh toán</h4>
                <p className="text-sm text-gray-600">Lịch sử và thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PT Tab Content */}
      {activeTab === 'pt' && (
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Huấn Luyện Viên</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <p className="text-gray-600 text-sm">Hội viên phụ trách</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2 hội viên mới
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600 text-sm">Buổi dạy hôm nay</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  6 buổi đã hoàn thành
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">156</h3>
                <p className="text-gray-600 text-sm">Giờ dạy tháng này</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12 giờ so với tháng trước
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
              <div className="w-15 h-15 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
                <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +0.2 so với tháng trước
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-5">Thao Tác Nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Xem lịch dạy</h4>
                <p className="text-sm text-gray-600">Lịch dạy hôm nay và tuần này</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Quản lý hội viên</h4>
                <p className="text-sm text-gray-600">Xem danh sách hội viên phụ trách</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                  <ChartLine className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Theo dõi tiến độ</h4>
                <p className="text-sm text-gray-600">Xem tiến độ của hội viên</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Thông báo</h4>
                <p className="text-sm text-gray-600">Xem thông báo mới</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}