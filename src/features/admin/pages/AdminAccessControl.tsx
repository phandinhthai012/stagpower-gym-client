import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  QrCode,
  Search,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Smartphone,
  Clock,
  MapPin,
  Users,
  Activity,
  Eye,
  RefreshCw,
  LogOut
} from 'lucide-react';
// import { mockUsers } from '../../../mockdata/users';
// import { mockCheckIns } from '../../../mockdata/checkIns';
// import { mockSubscriptions } from '../../../mockdata/subscriptions';
import { useAdminManageCheckInList, useAdminCheckIn } from '../hooks/useAdminCheckIn';
import { useBranches } from '../hooks/useBranches';
import { useMembers } from '../../member/hooks/useMembers';
import { CheckIn } from '../../member/api/checkin.api';
import { formatDateTime } from '../../../lib/date-utils';
import { useMembersWithActiveSubscriptions } from '../hooks/useMember';
import { ModalManualCheckIn } from '../components/checkin-management';
import { ModalQRCheckIn } from '../components/checkin-management';
import socketService from '../../../services/socket';
import { queryKeys } from '../../../constants/queryKeys';

interface OnlineUsersSnapshot {
  totalOnlineUsers: number;
  totalOnlineMembers: number;
  byRole: Record<string, number>;
  users: Array<{
    userId: string;
    fullName: string;
    role: string;
    connectedAt: string;
    socketIds: string[];
  }>;
  members: Array<{
    userId: string;
    fullName: string;
    role: string;
    connectedAt: string;
    socketIds: string[];
  }>;
}

export function AdminAccessControl() {
  const { user } = useAuth();
  const [isModalManualCheckInOpen, setIsModalManualCheckInOpen] = useState(false);
  const [isModalQRCheckInOpen, setIsModalQRCheckInOpen] = useState(false);
  const [socketOnlineSnapshot, setSocketOnlineSnapshot] = useState<OnlineUsersSnapshot | null>(null);
  const [socketActiveCheckIns, setSocketActiveCheckIns] = useState<CheckIn[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const queryClient = useQueryClient();

  // Get branch ID from user based on role
  const getBranchId = (user: any): string | null => {
    if (!user) return null;
    const role = user.role?.toLowerCase() || user.role;
    
    if (role === 'admin' && user.adminInfo?.branchId) {
      // Admin: branchId can be string or object
      return typeof user.adminInfo.branchId === 'object' 
        ? user.adminInfo.branchId._id 
        : user.adminInfo.branchId;
    }
    
    if ((role === 'staff' || role === 'trainer') && user.staffInfo?.brand_id) {
      // Staff/Trainer: brand_id can be string or object
      return typeof user.staffInfo.brand_id === 'object'
        ? user.staffInfo.brand_id._id
        : user.staffInfo.brand_id;
    }
    
    return null;
  };

  const userBranchId = useMemo(() => getBranchId(user), [user]);

  // ===== USE HOOK - GET ALL CHECK-INS =====
  const { data: response, isLoading, isError } = useAdminManageCheckInList();
  const { adminCheckOut, isCheckingOut } = useAdminCheckIn();
  const { data: branchesData } = useBranches();
  const { data: membersData } = useMembers();
  const { data: membersWithActiveSubscriptionsData } = useMembersWithActiveSubscriptions();
  const checkInsData: CheckIn[] = response?.data || [];
  const branches = branchesData;
  const members = membersData?.success ? membersData?.data : [];
  const membersWithActiveSubscriptions = membersWithActiveSubscriptionsData;
  // Get active check-ins
  // const activeCheckIns = mockCheckIns.filter(checkIn => checkIn.status === 'Active');
  const fallbackActiveCheckIns = useMemo(
    () => checkInsData.filter(checkIn => checkIn.status === 'Active'),
    [checkInsData]
  );
  const activeCheckIns =
    socketActiveCheckIns.length > 0 ? socketActiveCheckIns : fallbackActiveCheckIns;

  // Get recent check-ins (last 75 for scrollable list)
  const recentCheckIns = checkInsData
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, 75);

  const totalCheckInInWeek = checkInsData
    .filter(checkIn => new Date(checkIn.checkInTime).getTime() >= new Date().setDate(new Date().getDate() - 7))
    .length;

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || undefined;
    const socket = socketService.connect(token);

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    const handleOnlineUsersUpdated = (payload: OnlineUsersSnapshot) => {
      setSocketOnlineSnapshot(payload);
    };

    const handleActiveMembers = (payload: CheckIn[] | { error: string }) => {
      if (Array.isArray(payload)) {
        setSocketActiveCheckIns(payload.filter(item => item.status === 'Active'));
      } else {
        console.error('Socket check-in error:', payload.error);
      }
    };

    const refreshActiveMembers = () => {
      socket.emit('get-active-members-checkIn', {});
    };

    const handleCheckInStateChange = () => {
      refreshActiveMembers();
      queryClient.invalidateQueries({ queryKey: queryKeys.checkIns });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('online-users-updated', handleOnlineUsersUpdated);
    socket.on('online-users-response', handleOnlineUsersUpdated);
    socket.on('active-members-checkIn-response', handleActiveMembers);
    socket.on('checkIn_created', handleCheckInStateChange);
    socket.on('checkIn_checked_out', handleCheckInStateChange);

    socket.emit('get-online-users');
    refreshActiveMembers();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('online-users-updated', handleOnlineUsersUpdated);
      socket.off('online-users-response', handleOnlineUsersUpdated);
      socket.off('active-members-checkIn-response', handleActiveMembers);
      socket.off('checkIn_created', handleCheckInStateChange);
      socket.off('checkIn_checked_out', handleCheckInStateChange);
    };
  }, [queryClient]);

  const onlineMemberCount = socketOnlineSnapshot?.totalOnlineMembers ?? 0;

  const handleManualCheckIn = () => {
    setIsModalManualCheckInOpen(true);
  };
  const handleCloseModalManualCheckIn = () => {
    setIsModalManualCheckInOpen(false);
  };

  const handleQRCheckIn = () => {
    setIsModalQRCheckInOpen(true);
  };
  const handleCloseModalQRCheckIn = () => {
    setIsModalQRCheckInOpen(false);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'PendingPayment': return 'bg-orange-100 text-orange-800';
      case 'NotStarted': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to find member by ID
  const getIdValue = (value: string | { _id?: string } | undefined | null) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    return value._id;
  };

  const findMemberById = (memberId: string | { _id?: string }) => {
    const id = getIdValue(memberId);
    if (!id) return undefined;
    return members?.find(m => m._id === id);
  };

  // Helper function to find branch by ID
  const findBranchById = (branchId: string | { _id?: string }) => {
    const id = getIdValue(branchId);
    if (!id) return undefined;
    return branches?.find(b => b._id === id);
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active': return 'Đang tập';
      case 'Completed': return 'Đã hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Component to display elapsed time (real-time)
  const ElapsedTime = ({ checkInTime }: { checkInTime: string }) => {
    const [elapsedTime, setElapsedTime] = useState('00:00');

    useEffect(() => {
      const calculateElapsed = () => {
        const start = new Date(checkInTime).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 1000); // seconds
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      };

      calculateElapsed();
      const interval = setInterval(calculateElapsed, 1000);

      return () => clearInterval(interval);
    }, [checkInTime]);

    return <span className="font-medium text-blue-600">{elapsedTime}</span>;
  };

  const handleCheckOut = async (checkInId: string) => {
    try {
      await adminCheckOut(checkInId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang tập hôm nay</p>
                <p className="text-2xl font-bold text-green-600">{activeCheckIns.length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hội viên hoạt động</p>
                <p className="text-2xl font-bold text-blue-600">
                  {socketOnlineSnapshot ? onlineMemberCount : members.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-in tuần này</p>
                <p className="text-2xl font-bold text-purple-600">{totalCheckInInWeek}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-in hôm nay</p>
                <p className="text-2xl font-bold text-orange-600">
                  {checkInsData.filter(ci => {
                    const today = new Date();
                    const checkInDate = new Date(ci.checkInTime);
                    return checkInDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kiểm soát ra vào */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Kiểm soát ra vào
            <Badge
              variant={socketConnected ? 'secondary' : 'outline'}
              className={socketConnected ? 'bg-green-100 text-green-700 border-none' : 'text-gray-500'}
            >
              {socketConnected ? 'Socket hoạt động' : 'Socket ngắt kết nối'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Check-in hội viên</h4>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <Button variant="outline" className="h-16 flex flex-col items-center gap-2" onClick={handleQRCheckIn}>
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Quét QR Code</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center gap-2" onClick={handleManualCheckIn}>
                  <Smartphone className="w-6 h-6" />
                  <span className="text-xs">Nhập thủ công</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hội viên đang tập và Lịch sử check-in gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Active Check-ins */}
        <Card className="flex flex-col max-h-[600px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Hội viên đang tập
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {activeCheckIns.length > 0 ? (
                activeCheckIns.map((checkIn) => {
                  // const member = members.find(user => user._id === checkIn.memberId);
                  const member = findMemberById(checkIn.memberId) || (typeof checkIn.memberId !== 'string' ? checkIn.memberId : undefined);
                  const branch = findBranchById(checkIn.branchId) || (typeof checkIn.branchId !== 'string' ? checkIn.branchId : undefined);
                  if (!member) return null;
                  const displayName = member.fullName;
                  const memberInitial = displayName?.charAt(0) || 'T';
                  return (
                    <div key={checkIn._id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {memberInitial}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{displayName}</h4>
                        <p className="text-sm text-gray-600">
                          Check-in: {formatDateTime(checkIn.checkInTime)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600">Đã tập:</span>
                          <ElapsedTime checkInTime={checkIn.checkInTime} />
                        </div>
                        {branch && (
                          <p className="text-xs text-gray-500 mt-1">{branch.name}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCheckOut(checkIn._id)}
                          disabled={isCheckingOut}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="hidden sm:inline">Check-out</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Không có hội viên nào đang tập</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="flex flex-col max-h-[600px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Lịch sử check-in gần đây
              <Badge variant="outline" className="ml-2">
                {recentCheckIns.length}/{checkInsData.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {recentCheckIns.length > 0 ? (
                recentCheckIns.map((checkIn) => {
                  const member = findMemberById(checkIn.memberId) || (typeof checkIn.memberId !== 'string' ? checkIn.memberId : undefined);
                  const branch = findBranchById(checkIn.branchId) || (typeof checkIn.branchId !== 'string' ? checkIn.branchId : undefined);
                  if (!member) return null;
                  const name = member.fullName;
                  const initial = name?.charAt(0) || 'U';
                  return (
                    <div key={checkIn._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {initial}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(checkIn.checkInTime)}
                        </p>
                        {branch && (
                          <p className="text-xs text-gray-500 truncate">{branch.name}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(checkIn.status)}>
                        {getStatusText(checkIn.status)}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có lịch sử check-in</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ModalManualCheckIn
        isOpen={isModalManualCheckInOpen}
        onClose={handleCloseModalManualCheckIn}
        defaultBranchId={userBranchId}
      />
      <ModalQRCheckIn
        isOpen={isModalQRCheckInOpen}
        onClose={handleCloseModalQRCheckIn}
        defaultBranchId={userBranchId}
      />
    </div>
  );
}
