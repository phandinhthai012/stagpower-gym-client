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
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');

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
      setIsCheckingOut(true);
      setInfoMessage('');
      // Giả lập gọi API check-out
      setTimeout(() => {
        setIsCheckingOut(false);
        setCheckinStatus('success');
        setInfoMessage('Đã check-out thành công. Cảm ơn bạn đã tập luyện!');
        console.log('Check-out successful');
      }, 1500);
    }
  };

  const handleExtendSession = () => {
    // Giả lập gia hạn 30 phút trước auto check-out
    const extendMinutes = 30;
    const until = new Date(Date.now() + extendMinutes * 60000);
    setInfoMessage(`Đã gia hạn phiên thêm ${extendMinutes} phút (đến ${until.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}).`);
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
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">QR Code Check-in</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Hiển thị mã QR này tại cửa để check-in tự động</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* QR Code Section */}
        <Card className="lg:col-span-3">
          <CardContent className="p-4 md:p-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl rounded-2xl border-2 border-dashed border-gray-300 p-4 md:p-8 text-center">
                <div className="mx-auto mb-4 w-40 h-40 md:w-64 md:h-64 bg-white rounded-xl shadow flex items-center justify-center">
                  <QrCode className="w-20 h-20 md:w-32 md:h-32 text-blue-900" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm md:text-base text-gray-700">
                    <span className="font-semibold">Mã hội viên:</span> {user?.id || 'MEM001'}
                  </p>
                  <p className="text-sm md:text-base text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Trạng thái:</span>
                    <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
                  </p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  {activeCheckIn ? (
                    <>
                      <Button onClick={handleCheckOut} disabled={isCheckingOut} className="bg-red-600 hover:bg-red-700">
                        {isCheckingOut ? 'Đang check-out...' : 'Check-out'}
                      </Button>
                      <Button variant="outline" onClick={handleExtendSession}>Tôi vẫn còn tập</Button>
                    </>
                  ) : (
                    <Button onClick={handleCheckIn} disabled={isScanning}>
                      {isScanning ? 'Đang quét...' : 'Quét QR để Check-in'}
                    </Button>
                  )}
                </div>
                {infoMessage && (
                  <div className="mt-3 text-xs md:text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 inline-block">
                    {infoMessage}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Lịch sử ra/vào</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCheckIns.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {(showAllHistory ? recentCheckIns : recentCheckIns.slice(0, 5)).map((checkIn) => {
                  const branch = getBranchInfo(checkIn.branch_id);
                  return (
                    <div key={checkIn.id} className="p-3 md:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${getStatusColor(checkIn.status)}`}>
                          {getStatusIcon(checkIn.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm md:text-base">{checkIn.status === 'Active' ? 'Đang tập' : 'Đã hoàn thành'}</h4>
                            <Badge variant="outline" className={`${getStatusColor(checkIn.status)} px-2 py-0.5 text-[10px] md:text-xs`}>{checkIn.status}</Badge>
                            {checkIn.auto_checkout && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-[10px] md:text-xs">Auto</Badge>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(checkIn.check_in_time)}</span>
                            {checkIn.check_out_time && (
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{checkIn.duration ? `${checkIn.duration} phút` : 'Đã hoàn thành'}</span>
                            )}
                            {branch && (
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{branch.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {recentCheckIns.length > 5 && (
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setShowAllHistory((v) => !v)}>
                      {showAllHistory ? 'Thu gọn' : 'Xem tất cả'}
                    </Button>
                  </div>
                )}
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
    </div>
  );
}
  