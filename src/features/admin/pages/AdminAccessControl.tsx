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
import { mockUsers } from '../../../mockdata/users';
import { mockCheckIns } from '../../../mockdata/checkIns';
import { mockSubscriptions } from '../../../mockdata/subscriptions';

export function AdminAccessControl() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  // Get active check-ins
  const activeCheckIns = mockCheckIns.filter(checkIn => checkIn.status === 'Active');
  
  // Get members with active subscriptions
  const membersWithActiveSubs = mockUsers.filter(user => {
    if (user.role !== 'Member') return false;
    const activeSub = mockSubscriptions.find(sub => 
      sub.member_id === user.id && sub.status === 'Active'
    );
    return !!activeSub;
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      const foundMember = membersWithActiveSubs.find(member => 
        member.full_name.toLowerCase().includes(term.toLowerCase()) ||
        member.email.toLowerCase().includes(term.toLowerCase()) ||
        member.phone.includes(term)
      );
      if (foundMember) {
        setSelectedMember(foundMember);
        setCheckInStatus('idle');
        setValidationMessage('');
      }
    } else {
      setSelectedMember(null);
    }
  };

  const handleCheckIn = () => {
    if (!selectedMember) return;

    const activeSub = mockSubscriptions.find(sub => 
      sub.member_id === selectedMember.id && sub.status === 'Active'
    );

    if (!activeSub) {
      setCheckInStatus('error');
      setValidationMessage('Hội viên không có gói tập đang hoạt động');
      return;
    }

    const now = new Date();
    const endDate = new Date(activeSub.end_date);
    
    if (now > endDate) {
      setCheckInStatus('error');
      setValidationMessage('Gói tập đã hết hạn');
      return;
    }

    if (activeSub.is_suspended) {
      setCheckInStatus('warning');
      setValidationMessage('Gói tập đang bị tạm ngưng');
      return;
    }

    setCheckInStatus('success');
    setValidationMessage('Check-in thành công! Chào mừng hội viên đến phòng gym.');
  };

  const handleManualCheckIn = () => {
    setCheckInStatus('success');
    setValidationMessage('Check-in thủ công thành công!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidationMessageColor = () => {
    switch (checkInStatus) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
                <p className="text-2xl font-bold text-blue-600">{membersWithActiveSubs.length}</p>
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
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chi nhánh</p>
                <p className="text-2xl font-bold text-orange-600">Gò Vấp</p>
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
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tìm kiếm hội viên</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">Quét QR Code</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs">Nhập thủ công</span>
                  </Button>
                </div>
              </div>

              {/* Search Input */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Member Details */}
              {selectedMember && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {selectedMember.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedMember.full_name}</h3>
                      <p className="text-sm text-gray-600">{selectedMember.email}</p>
                      <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Thông tin gói tập</h4>
                    {(() => {
                      const activeSub = mockSubscriptions.find(sub => 
                        sub.member_id === selectedMember.id && sub.status === 'Active'
                      );
                      return activeSub ? (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Loại gói:</span>
                            <span className="font-medium">{activeSub.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trạng thái:</span>
                            <Badge className={getStatusColor(activeSub.status)}>
                              {activeSub.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Hết hạn:</span>
                            <span>{new Date(activeSub.end_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">Không có gói tập đang hoạt động</p>
                      );
                    })()}
                  </div>

                  {/* Validation Actions */}
                  <div className="flex gap-3 mt-4">
                    <Button 
                      onClick={handleCheckIn}
                      className="flex-1"
                      disabled={!selectedMember}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Xác nhận Check-in
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleManualCheckIn}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Check-in thủ công
                    </Button>
                  </div>

                  {/* Validation Message */}
                  {validationMessage && (
                    <div className={`mt-4 p-3 rounded-lg border ${getValidationMessageColor()}`}>
                      <div className="flex items-center gap-2">
                        {checkInStatus === 'success' && <CheckCircle className="w-4 h-4" />}
                        {checkInStatus === 'error' && <XCircle className="w-4 h-4" />}
                        {checkInStatus === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        <span className="text-sm font-medium">{validationMessage}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  const member = mockUsers.find(user => user.id === checkIn.member_id);
                  return member ? (
                    <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                        <p className="text-sm text-gray-600">
                          Check-in: {new Date(checkIn.check_in_time).toLocaleTimeString('vi-VN')}
                        </p>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCheckIns.slice(0, 5).map((checkIn) => {
              const member = mockUsers.find(user => user.id === checkIn.member_id);
              return member ? (
                <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {member.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(checkIn.check_in_time).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <Badge className={checkIn.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {checkIn.status === 'Active' ? 'Đang tập' : 'Đã ra'}
                  </Badge>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
