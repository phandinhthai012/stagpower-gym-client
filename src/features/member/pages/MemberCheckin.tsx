import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Activity,
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { formatDateTime } from '../../../lib/date-utils';
import { useCheckInMember } from '../hooks';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export function MemberCheckin() {
  const { user } = useAuth();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');

  // ===== USE HOOK - FETCH DATA TỪ BACKEND =====
  const {
    qrCodeDataUrl,
    isLoadingQR,
    qrError,
    refetchQRCode,
    checkInHistory,
    isLoadingHistory,
    activeCheckIn,
    isLoadingActive,
    checkOut,
    isCheckingOut,
  } = useCheckInMember(user?._id || user?.id || '');

  const completedCheckIns = useMemo(() => {
    return (checkInHistory || [])
      .sort((a: any, b: any) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
  }, [checkInHistory]);

  const handleCheckOut = () => {
    if (activeCheckIn) {
      checkOut(activeCheckIn._id);

    }
  };
  const handleRefreshQR = () => {
    refetchQRCode();
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

  if (isLoadingQR || isLoadingActive) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

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
                  {/* QR Code Display */}
                  <div className="mx-auto mb-4 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-xl flex items-center justify-center">
                    {qrError ? (
                      <div className="text-center p-4">
                        <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-2" />
                        <p className="text-sm text-red-600">
                          {(qrError as any)?.response?.data?.message || 'Không thể tạo QR Code'}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={handleRefreshQR}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Thử lại
                        </Button>
                      </div>
                    ) : qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl.toString()}
                        alt="QR Code Check-in"
                        className="w-full h-full object-contain"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto'
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Đang tạo QR Code...</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Member Info */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm md:text-base text-gray-700">
                    <span className="font-semibold">Mã hội viên:</span> {user?.id || 'MEM001'}
                  </p>
                  <p className="text-sm md:text-base text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Trạng thái:</span>
                    {/* <Badge className="bg-green-100 text-green-700">Hoạt động</Badge> */}
                    {activeCheckIn ? <Badge className="bg-green-100 text-green-700">Đang luyện tập</Badge> : <Badge className="bg-red-100 text-red-700">Chưa check-in</Badge>}
                  </p>
                </div>
                {/* Check-in/Check-out Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  {activeCheckIn ? (
                    <>
                      <Button
                        onClick={handleCheckOut}
                        disabled={isCheckingOut}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang check-out...
                          </>
                        ) : 'Check-out'}
                      </Button>
                      <Button variant="outline" onClick={handleExtendSession}>Tôi vẫn còn tập</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleRefreshQR}
                        disabled={isLoadingQR}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {isLoadingQR ? 'Đang tải...' : 'Làm mới QR Code'}
                      </Button>
                    </>
                  )}
                </div>
                <div className="mt-4 text-xs md:text-sm text-gray-500">
                  <p>💡 Mã QR hết hạn sau 30 phút</p>
                  <p>📱 Quét mã tại máy check-in để vào phòng tập</p>
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
            {isLoadingHistory ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : completedCheckIns.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {(showAllHistory ? completedCheckIns : completedCheckIns.slice(0, 5)).map((checkIn) => (
                  <div key={checkIn._id} className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(checkIn.status)}`}>
                        {getStatusIcon(checkIn.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">
                            {checkIn.status === 'Active' ? 'Đang tập' : 'Đã hoàn thành'}
                          </h4>
                          <Badge className={`${getStatusColor(checkIn.status)} text-xs`}>
                            {checkIn.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {checkIn.checkInMethod}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(checkIn.checkInTime)}
                          </span>
                          {checkIn.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {checkIn.duration} phút
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {completedCheckIns.length > 5 && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllHistory(!showAllHistory)}
                    >
                      {showAllHistory ? 'Thu gọn' : `Xem thêm ${completedCheckIns.length - 5} lần check-in`}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có lịch sử check-in
                </h3>
                <p className="text-gray-500">
                  Bắt đầu tập luyện để xem lịch sử check-in của bạn
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
