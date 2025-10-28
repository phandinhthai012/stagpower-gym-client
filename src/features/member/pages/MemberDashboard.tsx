import React, { useMemo } from 'react';
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
  CreditCard as CreditCardIcon,
  Loader2
} from 'lucide-react';
import { 
  useCheckInMember,
  useMySchedules,
  useSubscriptionsByMemberId,
  useBranches
} from '../hooks';
import { usePaymentsByMemberId } from '../hooks/usePayments';

export function MemberDashboard() {
  const { user } = useAuth();
  const memberId = user?._id || user?.id;

  // Fetch data from APIs
  const {
    qrCodeDataUrl,
    isLoadingQR,
    checkInHistory,
    isLoadingHistory
  } = useCheckInMember(memberId || '');

  const { data: schedulesData, isLoading: isLoadingSchedules } = useMySchedules();
  const schedules = schedulesData || [];

  const { data: subscriptionsResponse, isLoading: isLoadingSubscriptions } = useSubscriptionsByMemberId(memberId || '');
  const subscriptions = subscriptionsResponse?.data || [];

  const { data: paymentsResponse, isLoading: isLoadingPayments } = usePaymentsByMemberId(memberId || '');
  const payments = paymentsResponse?.data || [];

  const { data: branches, isLoading: isLoadingBranches } = useBranches();
  const branchesList = branches || [];

  // Derived data
  const activeSubscription = useMemo(() => {
    return subscriptions.find((sub: any) => sub.status === 'Active');
  }, [subscriptions]);

  const recentCheckIns = useMemo(() => {
    return (checkInHistory || [])
      .sort((a: any, b: any) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
      .slice(0, 5);
  }, [checkInHistory]);

  const upcomingSchedules = useMemo(() => {
    return schedules.filter((schedule: any) => {
      const scheduleDate = new Date(schedule.dateTime);
      const now = new Date();
      return scheduleDate > now && schedule.status === 'Confirmed';
    }).slice(0, 5);
  }, [schedules]);

  const recentPayments = useMemo(() => {
    return (payments || [])
      .sort((a: any, b: any) => new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime())
      .slice(0, 3);
  }, [payments]);

  const isLoading = isLoadingQR || isLoadingHistory || isLoadingSchedules || isLoadingSubscriptions || isLoadingPayments || isLoadingBranches;

  type ActivityItem = {
    id: string;
    type: 'checkin' | 'schedule' | 'payment';
    title: string;
    subtitle: string;
    at: string; // ISO date
  };

  const formatCurrencyVND = (amount: number) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const getBranchName = useMemo(() => {
    return (branchId?: string) => {
      if (!branchId) return 'Chi nhánh';
      const branch = branchesList.find((b: any) => b._id === branchId || b.id === branchId);
      return branch?.name || 'Chi nhánh';
    };
  }, [branchesList]);

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
    const checkins: ActivityItem[] = (checkInHistory || [])
      .map((c: any) => ({
        id: `ci_${c._id}`,
        type: 'checkin' as const,
        title: 'Check-in thành công',
        subtitle: getBranchName(c.branchId),
        at: c.checkInTime || c.createdAt,
      }));

    const scheduleItems: ActivityItem[] = schedules
      .filter((s: any) => s.status === 'Completed' || s.status === 'Confirmed')
      .map((s: any) => ({
        id: `sc_${s._id}`,
        type: 'schedule' as const,
        title: 'Buổi PT với huấn luyện viên',
        subtitle: s.notes || 'Buổi tập cá nhân',
        at: s.updatedAt || s.dateTime,
      }));

    const paymentItems: ActivityItem[] = (payments || [])
      .map((p: any) => ({
        id: `pm_${p._id}`,
        type: 'payment' as const,
        title: 'Thanh toán gói tập',
        subtitle: formatCurrencyVND(p.amount || 0),
        at: p.paymentDate || p.createdAt,
      }));

    return [...checkins, ...scheduleItems, ...paymentItems]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 5);
  }, [checkInHistory, schedules, payments, getBranchName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-900 mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
                {isLoadingQR ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code Check-in" 
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              {qrCodeDataUrl ? 'Hiển thị mã QR này tại cửa để check-in' : 'Không thể tạo QR code. Vui lòng thử lại.'}
            </p>
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

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Hoạt Động Gần Đây</h3>
            {recentActivities.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>

          </div>
    </div>
  );
}