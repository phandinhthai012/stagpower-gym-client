import React, { useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { 
  mockPackages, 
  mockSubscriptions,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberPackages() {
  const { user } = useAuth();

  // Get member's subscription data
  const memberSubscriptions = useMemo(() => {
    if (!user?.id) return [];
    return getMockDataByMemberId('subscriptions', user.id);
  }, [user?.id]);

  // Get active subscription
  const activeSubscription = useMemo(() => {
    return memberSubscriptions.find(sub => sub.status === 'Active');
  }, [memberSubscriptions]);

  // Get subscription history
  const subscriptionHistory = useMemo(() => {
    return memberSubscriptions
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  }, [memberSubscriptions]);

  // Get package info
  const getPackageInfo = (packageId: string) => {
    return mockPackages.find(pkg => pkg.id === packageId);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubscriptionProgress = (subscription: any) => {
    const startDate = new Date(subscription.start_date);
    const endDate = new Date(subscription.end_date);
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type: string) => {
    return type === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gói tập của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý gói tập và đăng ký mới</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Đăng ký gói mới
        </Button>
      </div>

      {/* Current Package */}
      {activeSubscription ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Gói tập hiện tại</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const packageInfo = getPackageInfo(activeSubscription.package_id);
              const daysLeft = getDaysUntilExpiry(activeSubscription.end_date);
              const progress = getSubscriptionProgress(activeSubscription);
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">
                        {packageInfo?.name || 'Gói tập'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getMembershipTypeColor(activeSubscription.membership_type)}>
                          {activeSubscription.membership_type}
                        </Badge>
                        <Badge variant="outline">
                          {activeSubscription.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-800">
                        {daysLeft > 0 ? `${daysLeft} ngày` : 'Đã hết hạn'}
                      </div>
                      <p className="text-sm text-green-600">
                        Còn lại trong gói
                      </p>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-800">
                        {activeSubscription.pt_sessions_remaining || 0}
                      </div>
                      <p className="text-sm text-green-600">
                        Buổi PT còn lại
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Tiến độ sử dụng</span>
                      <span className="text-sm text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-green-600 mt-1">
                      <span>{formatDate(activeSubscription.start_date)}</span>
                      <span>{formatDate(activeSubscription.end_date)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Thời hạn</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activeSubscription.duration_days} ngày
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Quyền truy cập</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activeSubscription.membership_type === 'VIP' ? 'Tất cả chi nhánh' : '1 chi nhánh'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Gia hạn
                    </Button>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Nâng cấp
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
                <h3 className="text-lg font-semibold text-yellow-800">Chưa có gói tập</h3>
                <p className="text-yellow-600">Bạn cần đăng ký gói tập để sử dụng dịch vụ</p>
              </div>
              <Button className="ml-auto">
                <Package className="h-4 w-4 mr-2" />
                Đăng ký ngay
              </Button>
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPackages.filter(pkg => pkg.status === 'Active').map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.is_trial && (
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
                      <span>{pkg.duration_months} tháng</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{pkg.branch_access === 'All' ? 'Tất cả chi nhánh' : '1 chi nhánh'}</span>
                    </div>
                    {pkg.pt_sessions && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{pkg.pt_sessions} buổi PT</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  
                  <Button className="w-full" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Đăng ký
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
                const packageInfo = getPackageInfo(subscription.package_id);
                return (
                  <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(subscription.status)}`}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{packageInfo?.name || 'Gói tập'}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getMembershipTypeColor(subscription.membership_type)}>
                            {subscription.membership_type}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {subscription.duration_days} ngày
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gói tập</h3>
              <p className="text-gray-500">Đăng ký gói tập đầu tiên để bắt đầu tập luyện</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
