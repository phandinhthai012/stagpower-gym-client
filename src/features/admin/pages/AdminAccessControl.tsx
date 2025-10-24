import React, { useState } from 'react';
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
  Package,
  Users,
  Activity,
  Eye,
  RefreshCw
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

export function AdminAccessControl() {
  const [isModalManualCheckInOpen, setIsModalManualCheckInOpen] = useState(false);
  const [isModalQRCheckInOpen, setIsModalQRCheckInOpen] = useState(false);
  const [displayedCheckInsCount, setDisplayedCheckInsCount] = useState(5);

  // ===== USE HOOK - GET ALL CHECK-INS =====
  const { data: response, isLoading, isError } = useAdminManageCheckInList();
  const { data: branchesData } = useBranches();
  const { data: membersData } = useMembers();
  const { data: membersWithActiveSubscriptionsData } = useMembersWithActiveSubscriptions();
  const checkInsData: CheckIn[] = response?.data || [];
  const branches = branchesData;
  const members = membersData?.success ? membersData?.data : [];
  const membersWithActiveSubscriptions = membersWithActiveSubscriptionsData;
  // Get active check-ins
  // const activeCheckIns = mockCheckIns.filter(checkIn => checkIn.status === 'Active');
  const activeCheckIns = checkInsData.filter(checkIn => checkIn.status === 'Active');

  // Get recent check-ins (last 10)
  const recentCheckIns = checkInsData
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, displayedCheckInsCount);

  const totalCheckInInWeek = checkInsData
    .filter(checkIn => new Date(checkIn.checkInTime).getTime() >= new Date().setDate(new Date().getDate() - 7))
    .length;

  const handleLoadMore = () => {
    setDisplayedCheckInsCount(prev => Math.min(prev + 5, checkInsData.length));
  };
  const handleShowLess = () => {
    setDisplayedCheckInsCount(5);
  };

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
  const findMemberById = (memberId: string) => {
    return members?.find(m => m._id === memberId);
  };

  // Helper function to find branch by ID
  const findBranchById = (branchId: string) => {
    return branches?.find(b => b._id === branchId);
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active': return 'Đang tập';
      case 'Completed': return 'Đã hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
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
                <p className="text-2xl font-bold text-blue-600">{members.length}</p>
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
                {/* <p className="text-sm font-medium text-gray-600">Chi nhánh</p>
                <p className="text-2xl font-bold text-orange-600">Gò Vấp</p> */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner & Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              Kiểm soát ra vào
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Search Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Check-in hội viên</h4>
                <div className="grid grid-cols-2 gap-3">
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

        {/* Active Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Hội viên đang tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCheckIns.length > 0 ? (
                activeCheckIns.map((checkIn) => {
                  // const member = members.find(user => user._id === checkIn.memberId);
                  const member = findMemberById(checkIn.memberId);
                  const branch = findBranchById(checkIn.branchId);
                  return member ? (
                    <div key={checkIn._id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.fullName}</h4>
                        <p className="text-sm text-gray-600">
                          Check-in: {formatDateTime(checkIn.checkInTime)}
                        </p>
                        {branch && (
                          <p className="text-xs text-gray-500">{branch.name}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null;
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <QrCode className="w-6 h-6" />
              <span className="text-xs">Tạo QR Code</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-xs">Danh sách hội viên</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span className="text-xs">Lịch sử check-in</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              <span className="text-xs">Làm mới dữ liệu</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Lịch sử check-in gần đây
            <Badge variant="outline" className="ml-2">
              {recentCheckIns.length}/{checkInsData.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCheckIns.length > 0 ? (
              <>
                {recentCheckIns.map((checkIn) => {
                  const member = findMemberById(checkIn.memberId);
                  const branch = findBranchById(checkIn.branchId);

                  return member ? (
                    <div key={checkIn._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.fullName}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(checkIn.checkInTime)}
                        </p>
                        {branch && (
                          <p className="text-xs text-gray-500">{branch.name}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(checkIn.status)}>
                        {getStatusText(checkIn.status)}
                      </Badge>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-center gap-2 pt-4">
                  {displayedCheckInsCount < checkInsData.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadMore}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Hiển thị thêm 5
                    </Button>
                  )}
                  {displayedCheckInsCount > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShowLess}
                    >
                      Thu gọn
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch sử check-in</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ModalManualCheckIn
        isOpen={isModalManualCheckInOpen}
        onClose={handleCloseModalManualCheckIn}
      />
      <ModalQRCheckIn
        isOpen={isModalQRCheckInOpen}
        onClose={handleCloseModalQRCheckIn}
      />
    </div>
  );
}
