import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Dumbbell,
  BarChart3,
  Clock,
  Bell
} from 'lucide-react';
import { useMembers as useAdminMembers, useStaffs } from '../hooks/useUsers';
import { useMembersWithActiveSubscriptions } from '../hooks/useMember';
import { useCheckIns } from '../hooks/useCheckIns';
import { usePayments } from '../../member/hooks/usePayments';
import { useBranches } from '../hooks/useBranches';
import type { Payment } from '../../member/types';
import type { Branch } from '../api/branch.api';
import type { User as AppUser } from '../../member/api/user.api';
import type { CheckIn as AdminCheckIn } from '../../member/api/checkin.api';
import socketService from '../../../services/socket';
import { queryKeys } from '../../../constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: membersResponse, isLoading: membersLoading } = useAdminMembers();
  const { data: staffsResponse = [], isLoading: staffsLoading } = useStaffs();
  const { data: activeMembersResponse = [], isLoading: activeMembersLoading } = useMembersWithActiveSubscriptions();
  const { data: checkInsResponse, isLoading: checkInsLoading } = useCheckIns();
  const { data: paymentsResponse, isLoading: paymentsLoading } = usePayments();
  const { data: branchesResponse = [] } = useBranches();

  const members = useMemo<AppUser[]>(() => {
    const raw = (membersResponse as any)?.data;
    return Array.isArray(raw) ? raw : [];
  }, [membersResponse]);

  const activeSubscriptionMembers = useMemo<AppUser[]>(() => {
    return Array.isArray(activeMembersResponse) ? activeMembersResponse : [];
  }, [activeMembersResponse]);

  const staffs = useMemo<AppUser[]>(() => Array.isArray(staffsResponse) ? staffsResponse : [], [staffsResponse]);
  const trainers = useMemo(() => staffs.filter(user => user.role === 'trainer'), [staffs]);
  const topTrainers = useMemo(() => trainers.slice(0, 3), [trainers]);

  const branches = useMemo<Branch[]>(() => Array.isArray(branchesResponse) ? branchesResponse : [], [branchesResponse]);
  const branchMap = useMemo(() => new Map<string, Branch>(branches.map(branch => [String(branch._id), branch])), [branches]);
  const memberMap = useMemo(() => new Map<string, AppUser>(members.map(member => [String(member._id), member])), [members]);

  const checkIns = useMemo<AdminCheckIn[]>(() => {
    const raw = (checkInsResponse as any)?.data;
    return Array.isArray(raw) ? raw : [];
  }, [checkInsResponse]);

  const payments = useMemo<Payment[]>(() => {
    const raw = (paymentsResponse as any)?.data;
    return Array.isArray(raw) ? raw : [];
  }, [paymentsResponse]);

  const parseDate = useCallback((value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }, []);

  const formatNumber = useCallback((value: number) => new Intl.NumberFormat('vi-VN').format(value), []);

  const formatCurrency = useCallback((value: number) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value), []);

  const totalMembers = members.length;
  const activeMembersCount = activeSubscriptionMembers.length > 0
    ? activeSubscriptionMembers.length
    : members.filter(member => member.status?.toLowerCase() === 'active').length;

  const [socketCheckIns, setSocketCheckIns] = useState<AdminCheckIn[]>([]);
  const [socketLoading, setSocketLoading] = useState(true);

  const activeCheckInsListRaw = useMemo(() => socketCheckIns.length > 0 ? socketCheckIns : checkIns, [socketCheckIns, checkIns]);

  const activeCheckInsList = useMemo(() => activeCheckInsListRaw.filter(checkIn => {
    const status = (checkIn.status || '').toLowerCase();
    return status === 'active' || status === 'checked_in';
  }), [activeCheckInsListRaw]);
  const activeCheckInCount = activeCheckInsList.length;

  const now = useMemo(() => new Date(), []);
  const startOfToday = useMemo(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()), [now]);
  const startOfWeek = useMemo(() => {
    const date = new Date(startOfToday);
    date.setDate(date.getDate() - 6);
    return date;
  }, [startOfToday]);
  const startOfMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now]);

  const checkInsTodayCount = useMemo(() => checkIns.filter(checkIn => {
    const date = parseDate(checkIn.checkInTime);
    return date && date >= startOfToday;
  }).length, [checkIns, parseDate, startOfToday]);

  const checkInsThisWeekCount = useMemo(() => checkIns.filter(checkIn => {
    const date = parseDate(checkIn.checkInTime);
    return date && date >= startOfWeek;
  }).length, [checkIns, parseDate, startOfWeek]);

  const checkInsThisMonthCount = useMemo(() => checkIns.filter(checkIn => {
    const date = parseDate(checkIn.checkInTime);
    return date && date >= startOfMonth;
  }).length, [checkIns, parseDate, startOfMonth]);

  const completedPayments = useMemo(() => payments.filter(payment =>
    (payment.paymentStatus || '').toLowerCase() === 'completed'
  ), [payments]);

  const currentMonthRevenue = useMemo(() => {
    return completedPayments.reduce((sum, payment) => {
      const date = parseDate(payment.paymentDate || payment.createdAt);
      if (!date) return sum;
      const sameMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      return sameMonth ? sum + (payment.amount || 0) : sum;
    }, 0);
  }, [completedPayments, now, parseDate]);

  const summaryLoading = membersLoading || activeMembersLoading || paymentsLoading || checkInsLoading;

  const formatTimeAgo = useCallback((dateString: string) => {
    const date = parseDate(dateString);
    if (!date) return 'Không xác định';
    const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }, [parseDate]);

  const resolveMemberName = useCallback((value: any) => {
    if (!value) return 'Hội viên';
    if (typeof value === 'string') {
      return memberMap.get(value)?.fullName || 'Hội viên';
    }
    return value.fullName || memberMap.get(value._id || '')?.fullName || 'Hội viên';
  }, [memberMap]);

  const resolveBranchName = useCallback((value: any) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      return branchMap.get(value)?.name;
    }
    return value.name || branchMap.get(value._id || '')?.name;
  }, [branchMap]);

  const getStatusMeta = useCallback((status?: string) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'active' || normalized === 'checked_in') {
      return { color: 'bg-green-500', label: 'Hội viên check-in' };
    }
    if (normalized === 'completed' || normalized === 'checked_out') {
      return { color: 'bg-blue-500', label: 'Hoàn tất check-in' };
    }
    if (normalized === 'cancelled') {
      return { color: 'bg-yellow-500', label: 'Check-in bị hủy' };
    }
    return { color: 'bg-gray-400', label: status || 'Cập nhật check-in' };
  }, []);

  const recentActivities = useMemo(() => {
    return [...activeCheckInsListRaw]
      .sort((a, b) => {
        const dateA = parseDate(a.checkInTime)?.getTime() || 0;
        const dateB = parseDate(b.checkInTime)?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(checkIn => ({
        id: checkIn._id,
        memberName: resolveMemberName(checkIn.memberId),
        branchName: resolveBranchName(checkIn.branchId),
        status: checkIn.status,
        time: checkIn.checkInTime
      }));
  }, [activeCheckInsListRaw, parseDate, resolveBranchName, resolveMemberName]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || undefined;
    const socket = socketService.connect(token);

    const handleActiveMembers = (payload: AdminCheckIn[] | { error: string }) => {
      if (Array.isArray(payload)) {
        setSocketCheckIns(payload);
        setSocketLoading(false);
      } else {
        console.error('Socket check-in error:', payload.error);
      }
    };

    const handleCheckInChange = () => {
      socket.emit('get-active-members-checkIn', {});
      queryClient.invalidateQueries({ queryKey: queryKeys.checkIns });
    };

    socket.on('active-members-checkIn-response', handleActiveMembers);
    socket.on('checkIn_created', handleCheckInChange);
    socket.on('checkIn_checked_out', handleCheckInChange);

    socket.emit('get-active-members-checkIn', {});

    return () => {
      socket.off('active-members-checkIn-response', handleActiveMembers);
      socket.off('checkIn_created', handleCheckInChange);
      socket.off('checkIn_checked_out', handleCheckInChange);
    };
  }, [queryClient]);

  const quickActions = [
    { 
      title: 'Thêm Hội Viên Mới', 
      icon: Users, 
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/members')
    },
    { 
      title: 'Tạo Gói Tập', 
      icon: Dumbbell, 
      color: 'bg-green-500',
      onClick: () => navigate('/admin/packages')
    },
    { 
      title: 'Xem Báo Cáo', 
      icon: BarChart3, 
      color: 'bg-orange-500',
      onClick: () => navigate('/admin/reports')
    },
    { 
      title: 'Quản Lý Lịch PT', 
      icon: Calendar, 
      color: 'bg-purple-500',
      onClick: () => navigate('/admin/pt-schedule')
    }
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Chào mừng trở lại, Admin!
              </h1>
              <p className="text-blue-100 max-w-2xl">
                Đây là trung tâm quản lý phòng gym của bạn. Quản lý hội viên, PT, gói tập, doanh thu và check-in một cách dễ dàng. 
                Theo dõi báo cáo chi tiết và tùy chỉnh hệ thống với giao diện thân thiện, bảo mật cao!
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trainers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Huấn Luyện Viên
              {!staffsLoading && (
                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 border-0">
                  {formatNumber(trainers.length)} PT
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffsLoading ? (
                <div className="text-sm text-gray-500">Đang tải dữ liệu huấn luyện viên...</div>
              ) : topTrainers.length > 0 ? (
                topTrainers.map((trainer) => (
                  <div key={trainer._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {trainer.fullName?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{trainer.fullName || 'Huấn luyện viên'}</h4>
                      <p className="text-sm text-gray-600">
                        {Array.isArray((trainer as any).trainerInfo?.specialty)
                          ? (trainer as any).trainerInfo?.specialty.join(', ')
                          : (trainer as any).trainerInfo?.specialty || 'PT'}
                      </p>
                    </div>
                    <Badge variant={trainer.status?.toLowerCase() === 'active' ? 'secondary' : 'outline'}>
                      {trainer.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  Chưa có huấn luyện viên nào trong hệ thống.
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/admin/staff-pt-management')}
              >
                Xem tất cả huấn luyện viên
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Trạng Thái Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {checkInsLoading ? '...' : formatNumber(activeCheckInCount)}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {checkInsLoading ? 'Đang tải...' : formatNumber(activeCheckInCount)}
              </h3>
              <p className="text-gray-600 mb-4">Hội viên đang tập</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hôm nay</span>
                  <span className="font-medium">
                    {checkInsLoading ? '...' : formatNumber(checkInsTodayCount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tuần này</span>
                  <span className="font-medium">
                    {checkInsLoading ? '...' : formatNumber(checkInsThisWeekCount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tháng này</span>
                  <span className="font-medium">
                    {checkInsLoading ? '...' : formatNumber(checkInsThisMonthCount)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Thao Tác Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                    onClick={action.onClick}
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-center">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Hoạt Động Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkInsLoading ? (
              <div className="text-sm text-gray-500">Đang tải hoạt động...</div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map(activity => {
                const meta = getStatusMeta(activity.status);
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${meta.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{meta.label}</p>
                      <p className="text-sm text-gray-600">
                        {activity.memberName}
                        {activity.branchName ? ` • ${activity.branchName}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500">
                Chưa có hoạt động check-in gần đây.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}