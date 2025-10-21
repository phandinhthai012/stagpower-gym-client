import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { LoadingSpinner } from '../../../components/common';
import { 
  Package as PackageIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Crown,
  Pause
} from 'lucide-react';
import { usePackages } from '../hooks/usePackages';
import { useSubscriptionsByMemberId } from '../hooks/useSubscriptions';
import { formatDate } from '../../../lib/date-utils';
import { ModalRegisPackage } from '../components/member-package/ModalRegisPackage';

export function MemberPackages() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'All' | 'Membership' | 'Combo' | 'PT'>('All');
  const [filterTier, setFilterTier] = useState<'All' | 'Basic' | 'VIP'>('All');
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [isRegisModalOpen, setIsRegisModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | undefined>();

  // API hooks
  const { data: packagesResponse, isLoading: packagesLoading, isError: packagesError } = usePackages();
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading, isError: subscriptionsError } = useSubscriptionsByMemberId(user?.id || '');
  console.log(subscriptionsResponse);
  // Get data from API responses
  const packages: any[] = Array.isArray(packagesResponse) ? packagesResponse : [];
  const subscriptions: any[] = subscriptionsResponse?.data || [];

  // ===== LOGIC XỬ LÝ CÁC GÓI ACTIVE =====
  // Theo nghiệp vụ mới: Member có thể có 2 loại gói đồng thời:
  // 1. GÓI GYM (Membership/Combo): Cho phép vào phòng gym - CHỈ CÓ 1 GÓI
  // 2. GÓI PT (PT hoặc Combo có PT): Buổi tập với PT - CÓ THỂ NHIỀU GÓI

  // Lấy gói GYM đang active (Membership hoặc Combo)
  // Member chỉ có thể có 1 gói gym active tại một thời điểm
  const activeGymSubscription = useMemo(() => {
    return subscriptions.find(sub => 
      sub.status === 'Active' && 
      (sub.type === 'Membership' || sub.type === 'Combo')
    );
  }, [subscriptions]);

  // Lấy TẤT CẢ gói PT đang active
  // Member có thể có nhiều gói PT chạy đồng thời (sau khi thanh toán thành công)
  // Bao gồm: gói PT thuần túy HOẶC gói Combo có buổi PT
  const activePTSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => 
      sub.status === 'Active' && 
      (sub.type === 'PT' || (sub.type === 'Combo' && sub.ptsessionsRemaining > 0))
    );
  }, [subscriptions]);

  // Tính tổng số buổi PT còn lại từ TẤT CẢ gói PT đang active
  const totalPTSessionsRemaining = useMemo(() => {
    return activePTSubscriptions.reduce((total, sub) => {
      return total + (sub.ptsessionsRemaining || 0);
    }, 0);
  }, [activePTSubscriptions]);

  // Tính tổng số buổi PT đã sử dụng từ TẤT CẢ gói PT đang active
  const totalPTSessionsUsed = useMemo(() => {
    return activePTSubscriptions.reduce((total, sub) => {
      return total + (sub.ptsessionsUsed || 0);
    }, 0);
  }, [activePTSubscriptions]);

  // Lịch sử tất cả gói tập (sắp xếp theo ngày bắt đầu)
  const subscriptionHistory = useMemo(() => {
    return subscriptions
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [subscriptions]);

  // Get package info
  const getPackageInfo = (packageId: string) => {
    return packages.find(pkg => pkg._id === packageId);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubscriptionProgress = (subscription: any) => {
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(Math.max((usedDays / totalDays) * 100, 0), 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'PendingPayment':
        return 'bg-orange-100 text-orange-800';
      case 'NotStarted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type: string) => {
    return type === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const handleOpenRegisModal = (pkg?: any) => {
    setSelectedPackage(pkg);
    setIsRegisModalOpen(true);
  };

  const handleCloseRegisModal = () => {
    setIsRegisModalOpen(false);
    setSelectedPackage(undefined);
  };

  const handleRegisSuccess = () => {
    // Refresh data after successful registration
    window.location.reload();
  };

  // Loading state
  if (packagesLoading || subscriptionsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (packagesError || subscriptionsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500">Không thể tải dữ liệu gói tập. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gói tập của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý gói tập và đăng ký mới</p>
        </div>
        <Button onClick={() => handleOpenRegisModal()}>
          <PackageIcon className="h-4 w-4 mr-2" />
          Đăng ký gói mới
        </Button>
      </div>

      {/* ===== CARD 1: GÓI GYM (MEMBERSHIP/COMBO) ===== */}
      {/* Card này hiển thị gói cho phép vào phòng gym */}
      {/* Member chỉ có thể có 1 gói gym active tại một thời điểm */}
      {activeGymSubscription ? (
        <Card className="border-blue-200">
          <CardContent className="p-6">
            {(() => {
              const packageInfo = getPackageInfo(activeGymSubscription.packageId);
              const daysLeft = getDaysUntilExpiry(activeGymSubscription.endDate);
              return (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900">
                          {packageInfo?.name || 'Gói tập Gym'}
                        </h3>
                        <p className="text-gray-600">
                          Quyền vào phòng gym • {activeGymSubscription.membershipType === 'VIP' ? 'Tất cả chi nhánh' : '1 chi nhánh'}
                        </p>
                        <Badge className="mt-2 bg-green-100 text-green-700">
                          Đang hoạt động
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-blue-100">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Ngày bắt đầu</div>
                      <div className="text-gray-700">{formatDate(activeGymSubscription.startDate)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-blue-100">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Ngày hết hạn</div>
                      <div className="text-gray-700">{formatDate(activeGymSubscription.endDate)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-blue-100">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Trạng thái</div>
                      <div className="text-gray-700">{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiến độ sử dụng</span>
                      <span className="text-gray-600">{getSubscriptionProgress(activeGymSubscription).toFixed(0)}%</span>
                    </div>
                    <Progress value={getSubscriptionProgress(activeGymSubscription)} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Gia hạn
                    </Button>
                    <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Nâng cấp
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Pause className="h-4 w-4 mr-2" />
                      Tạm ngưng
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Chưa có gói tập gym</h3>
                <p className="text-yellow-600">Bạn cần đăng ký gói để có quyền vào phòng gym</p>
              </div>
              <Button className="ml-auto" onClick={() => handleOpenRegisModal()}>
                <PackageIcon className="h-4 w-4 mr-2" />
                Đăng ký ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== CARD 2: GÓI PT (PERSONAL TRAINING) ===== */}
      {/* Card này hiển thị TẤT CẢ gói PT đang active và tổng số buổi */}
      {/* Member có thể có NHIỀU gói PT chạy đồng thời */}
      {activePTSubscriptions.length > 0 && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header với tổng số buổi PT */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900">Buổi tập PT</h3>
                    <p className="text-purple-600">
                      {activePTSubscriptions.length} gói PT đang hoạt động
                    </p>
                    <Badge className="mt-2 bg-purple-100 text-purple-700">
                      {totalPTSessionsRemaining} buổi còn lại
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-purple-900">
                    {totalPTSessionsRemaining}
                  </div>
                  <div className="text-sm text-purple-600">buổi khả dụng</div>
                </div>
              </div>

              {/* Progress bar tổng hợp */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Đã sử dụng: {totalPTSessionsUsed} buổi</span>
                  <span className="text-purple-700">
                    Tổng: {totalPTSessionsUsed + totalPTSessionsRemaining} buổi
                  </span>
                </div>
                <Progress 
                  value={(totalPTSessionsUsed / (totalPTSessionsUsed + totalPTSessionsRemaining)) * 100} 
                  className="h-3 bg-purple-200"
                />
              </div>

              {/* Chi tiết từng gói PT */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-purple-900">Chi tiết các gói:</h4>
                <div className="space-y-2">
                  {activePTSubscriptions.map((sub) => {
                    const packageInfo = getPackageInfo(sub.packageId);
                    const daysLeft = getDaysUntilExpiry(sub.endDate);
                    return (
                      <div 
                        key={sub._id} 
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {packageInfo?.name || 'Gói PT'}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {sub.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Còn {daysLeft} ngày
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-900">
                            {sub.ptsessionsRemaining || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            / {(sub.ptsessionsRemaining || 0) + (sub.ptsessionsUsed || 0)} buổi
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions cho PT */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" className="border-purple-600 text-purple-700 hover:bg-purple-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Đặt lịch PT
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-700 hover:bg-purple-50"
                  onClick={() => handleOpenRegisModal()}
                >
                  <PackageIcon className="h-4 w-4 mr-2" />
                  Mua thêm buổi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Gói tập có sẵn</span>
          </CardTitle>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-wrap gap-2">
              {(['All','Membership','Combo','PT'] as const).map(t => (
                <Button
                  key={t}
                  variant={filterType === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(t)}
                >
                  {t === 'All' ? 'Tất cả loại' : t}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['All','Basic','VIP'] as const).map(tier => (
                <Button
                  key={tier}
                  variant={filterTier === tier ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterTier(tier)}
                >
                  {tier === 'All' ? 'Tất cả hạng' : tier}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const filtered = packages
              .filter(pkg => pkg.status === 'Active')
              .filter(pkg => (filterType === 'All' ? true : pkg.type === filterType))
              .filter(pkg => (filterTier === 'All' ? true : pkg.membershipType === filterTier));
            const items = filtered.slice(0, visibleCount);
            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((pkg) => (
              <Card key={pkg._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.isTrial && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        Thử nghiệm
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(pkg.price)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                            <span>{pkg.durationMonths > 0 ? `${pkg.durationMonths} tháng` : (pkg.maxTrialDays ? `${pkg.maxTrialDays} ngày` : 'Theo buổi')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{pkg.branchAccess === 'All' ? 'Tất cả chi nhánh' : '1 chi nhánh'}</span>
                    </div>
                    {pkg.ptSessions && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{pkg.ptSessions} buổi PT</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleOpenRegisModal(pkg)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Đăng ký
                  </Button>
                </CardContent>
              </Card>
                  ))}
                </div>
                {filtered.length > visibleCount && (
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={() => setVisibleCount(c => c + 3)}>Xem thêm</Button>
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>

      {/* Subscription History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Lịch sử gói tập</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionHistory.length > 0 ? (
            <div className="space-y-4">
              {subscriptionHistory.map((subscription) => {
                const packageInfo = getPackageInfo(subscription.packageId);
                return (
                  <div key={subscription._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(subscription.status)}`}>
                        <PackageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{packageInfo?.name || 'Gói tập'}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getMembershipTypeColor(subscription.membershipType)}>
                            {subscription.membershipType}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {subscription.durationDays} ngày
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <PackageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gói tập</h3>
              <p className="text-gray-500">Đăng ký gói tập đầu tiên để bắt đầu tập luyện</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Modal */}
      <ModalRegisPackage
        isOpen={isRegisModalOpen}
        onClose={handleCloseRegisModal}
        onSuccess={handleRegisSuccess}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}
