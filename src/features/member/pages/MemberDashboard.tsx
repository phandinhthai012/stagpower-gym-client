import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Settings,
  RefreshCcw,
  CheckCircle,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { 
  mockCheckIns, 
  mockSchedules, 
  mockPayments, 
  mockBranches 
} from '../../../mockdata';
import { 
  mockSubscriptions,
  mockAISuggestions
} from '../../../mockdata';

export function MemberDashboard() {
  const { user } = useAuth();

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

  type ActivityItem = {
    id: string;
    type: 'checkin' | 'schedule' | 'payment';
    title: string;
    subtitle: string;
    at: string; // ISO date
  };

  const formatCurrencyVND = (amount: number) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const getBranchName = (branchId?: string) =>
    mockBranches.find(b => b.id === branchId)?.name || 'Chi nhánh';

  const formatRelative = (iso: string) => {
    const now = new Date();
    const d = new Date(iso);
    const diffMs = now.getTime() - d.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 1) return 'Hôm qua';
    return `${days} ngày trước`;
  };

  const recentActivities: ActivityItem[] = useMemo(() => {
    if (!user) return [];
    const uid = user.id;
    const checkins: ActivityItem[] = mockCheckIns
      .filter(c => c.member_id === uid)
      .map(c => ({
        id: `ci_${c.id}`,
        type: 'checkin',
        title: 'Check-in thành công',
        subtitle: getBranchName(c.branch_id),
        at: c.created_at || c.check_in_time,
      }));

    const schedules: ActivityItem[] = mockSchedules
      .filter(s => s.member_id === uid && (s.status === 'Completed' || s.status === 'Confirmed'))
      .map(s => ({
        id: `sc_${s.id}`,
        type: 'schedule',
        title: 'Buổi PT với huấn luyện viên',
        subtitle: s.note,
        at: s.updated_at || s.date_time,
      }));

    const payments: ActivityItem[] = mockPayments
      .filter(p => p.member_id === uid)
      .map(p => ({
        id: `pm_${p.id}`,
        type: 'payment',
        title: 'Thanh toán gói tập',
        subtitle: formatCurrencyVND(p.amount),
        at: p.payment_date,
      }));

    return [...checkins, ...schedules, ...payments]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 5);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Member Content */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Hội Viên</h1>
          
          {/* QR Code Check-in */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 text-center mb-6">QR Code Check-in</h3>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-3xl h-72 sm:h-80 md:h-96 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                <div className="w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">Hiển thị mã QR này tại cửa để check-in</p>
          </div>

          {/* Quick Actions (moved below QR) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-5">Thao Tác Nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/member/checkin" className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow cursor-pointer block">
                <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Check-in</h4>
                <p className="text-sm text-gray-600">Hiển thị QR code để check-in</p>
              </Link>

              <Link to="/member/schedule" className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow cursor-pointer block">
                <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Đặt lịch PT</h4>
                <p className="text-sm text-gray-600">Đặt lịch với huấn luyện viên</p>
              </Link>

              <Link to="/member/payments" className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow cursor-pointer block">
                <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCcw className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Gia hạn gói</h4>
                <p className="text-sm text-gray-600">Gia hạn hoặc nâng cấp gói tập</p>
              </Link>

              <Link to="/member/history" className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow cursor-pointer block">
                <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartLine className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Xem tiến độ</h4>
                <p className="text-sm text-gray-600">Theo dõi tiến độ tập luyện</p>
              </Link>
            </div>
          </div>

          {/* Recent Activities (from mockdata) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Hoạt Động Gần Đây</h3>
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((item) => (
                <li key={item.id} className="py-4 flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    item.type === 'checkin' ? 'bg-green-100' : item.type === 'payment' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {item.type === 'checkin' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {item.type === 'schedule' && <Calendar className="w-5 h-5 text-blue-600" />}
                    {item.type === 'payment' && <CreditCardIcon className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.subtitle}</div>
                  </div>
                  <div className="text-sm text-gray-500">{formatRelative(item.at)}</div>
                </li>
              ))}
            </ul>
          </div>

        </div>
    </div>
  );
}