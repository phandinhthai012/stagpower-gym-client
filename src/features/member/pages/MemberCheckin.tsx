import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  mockCheckIns, 
  mockBranches,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberCheckin() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get member's check-in data
  const memberCheckIns = useMemo(() => {
    if (!user?.id) return [];
    return getMockDataByMemberId('checkIns', user.id);
  }, [user?.id]);

  // Get current active check-in
  const activeCheckIn = useMemo(() => {
    return memberCheckIns.find(checkIn => checkIn.status === 'Active');
  }, [memberCheckIns]);

  // Get recent check-ins (last 10)
  const recentCheckIns = useMemo(() => {
    return memberCheckIns
      .filter(checkIn => checkIn.status === 'Completed')
      .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())
      .slice(0, 10);
  }, [memberCheckIns]);

  // Get branch info
  const getBranchInfo = (branchId: string) => {
    return mockBranches.find(branch => branch.id === branchId);
  };

  const handleCheckIn = () => {
    setIsScanning(true);
    setCheckinStatus('idle');
    setErrorMessage('');

    // Simulate QR code scanning
    setTimeout(() => {
      if (activeCheckIn) {
        setCheckinStatus('error');
        setErrorMessage('Bạn đã check-in rồi. Vui lòng check-out trước khi check-in lại.');
      } else {
        // Simulate successful check-in
        setCheckinStatus('success');
        // In a real app, this would make an API call
        console.log('Check-in successful');
      }
      setIsScanning(false);
    }, 2000);
  };

  const handleCheckOut = () => {
    if (activeCheckIn) {
      // Simulate check-out
      console.log('Check-out successful');
      // In a real app, this would make an API call
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
          <p className="text-gray-600 mt-1">Quét QR code để check-in vào phòng gym</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={activeCheckIn ? 'default' : 'secondary'}>
            {activeCheckIn ? 'Đang tập' : 'Chưa check-in'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check-in Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Check-in ngay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCheckIn ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600">Đã check-in</h3>
                  <p className="text-sm text-gray-600">
                    Bắt đầu lúc: {formatDate(activeCheckIn.check_in_time)}
                  </p>
                </div>
                <Button 
                  onClick={handleCheckOut}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Check-out
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sẵn sàng check-in</h3>
                  <p className="text-sm text-gray-600">
                    Quét QR code để bắt đầu tập luyện
                  </p>
                </div>
                <Button 
                  onClick={handleCheckIn}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Đang quét...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Quét QR Code
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Status Messages */}
            {checkinStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Check-in thành công!</span>
                </div>
              </div>
            )}

            {checkinStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* QR Code Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">QR Code của bạn</p>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  QR_001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Lịch sử check-in</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCheckIns.length > 0 ? (
              <div className="space-y-4">
                {recentCheckIns.map((checkIn) => {
                  const branch = getBranchInfo(checkIn.branch_id);
                  return (
                    <div key={checkIn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(checkIn.status)}`}>
                          {getStatusIcon(checkIn.status)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {checkIn.status === 'Active' ? 'Đang tập' : 'Đã hoàn thành'}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(checkIn.status)}>
                              {checkIn.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(checkIn.check_in_time)}</span>
                            </div>
                            {checkIn.check_out_time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {checkIn.duration ? `${checkIn.duration} phút` : 'Đã hoàn thành'}
                                </span>
                              </div>
                            )}
                            {branch && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{branch.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {checkIn.check_in_time && (
                          <p className="text-sm font-medium">
                            {new Date(checkIn.check_in_time).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        {checkIn.check_out_time && (
                          <p className="text-xs text-gray-500">
                            Kết thúc: {new Date(checkIn.check_out_time).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử check-in</h3>
                <p className="text-gray-500">Bắt đầu tập luyện để xem lịch sử check-in của bạn</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{memberCheckIns.length}</p>
                <p className="text-sm text-gray-600">Tổng số lần check-in</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {memberCheckIns
                    .filter(c => c.duration)
                    .reduce((total, c) => total + (c.duration || 0), 0)
                  } phút
                </p>
                <p className="text-sm text-gray-600">Tổng thời gian tập</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {memberCheckIns.filter(c => {
                    const checkInDate = new Date(c.check_in_time);
                    const today = new Date();
                    return checkInDate.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Lần tập hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
