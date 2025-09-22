import React, { useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Eye, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  mockPayments, 
  mockSubscriptions,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberPayments() {
  const { user } = useAuth();

  // Get member's payment data
  const memberPayments = useMemo(() => {
    if (!user?.id) return [];
    return getMockDataByMemberId('payments', user.id)
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [user?.id]);

  // Get subscription info
  const getSubscriptionInfo = (subscriptionId: string) => {
    return mockSubscriptions.find(sub => sub.id === subscriptionId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Failed':
        return <XCircle className="h-4 w-4" />;
      case 'Refunded':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'momo':
        return '💜';
      case 'zalopay':
        return '💙';
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'banktransfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = memberPayments
      .filter(p => p.payment_status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalTransactions = memberPayments.length;
    const completedTransactions = memberPayments.filter(p => p.payment_status === 'Completed').length;
    const pendingTransactions = memberPayments.filter(p => p.payment_status === 'Pending').length;
    
    const methodStats = memberPayments.reduce((acc, payment) => {
      if (payment.payment_status === 'Completed') {
        acc[payment.payment_method] = (acc[payment.payment_method] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAmount,
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      methodStats
    };
  }, [memberPayments]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử thanh toán</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý các giao dịch thanh toán</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Thanh toán mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</p>
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedTransactions}</p>
                <p className="text-sm text-gray-600">Thành công</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Phương thức thanh toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.methodStats).map(([method, count]) => (
                <div key={method} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{getPaymentMethodIcon(method)}</div>
                  <div className="text-lg font-semibold">{count as number}</div>
                  <div className="text-sm text-gray-600 capitalize">{method}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Lịch sử thanh toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memberPayments.length > 0 ? (
            <div className="space-y-4">
              {memberPayments.map((payment) => {
                const subscription = getSubscriptionInfo(payment.subscription_id);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(payment.payment_status)}`}>
                        {getStatusIcon(payment.payment_status)}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {subscription ? `Thanh toán gói ${subscription.type}` : 'Thanh toán gói tập'}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {getPaymentMethodIcon(payment.payment_method)} {payment.payment_method}
                          </span>
                          <Badge variant="outline" className={getStatusColor(payment.payment_status)}>
                            {payment.payment_status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Mã giao dịch: {payment.transaction_id || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatPrice(payment.amount)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(payment.payment_date)}
                      </p>
                      {payment.original_amount !== payment.amount && (
                        <p className="text-xs text-gray-500">
                          Giảm: {formatPrice(payment.original_amount - payment.amount)}
                        </p>
                      )}
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch</h3>
              <p className="text-gray-500">Bạn chưa có giao dịch thanh toán nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Chi tiêu theo tháng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const monthlySpending = memberPayments
                  .filter(p => p.payment_status === 'Completed')
                  .reduce((acc, payment) => {
                    const month = new Date(payment.payment_date).toLocaleDateString('vi-VN', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                    acc[month] = (acc[month] || 0) + payment.amount;
                    return acc;
                  }, {} as Record<string, number>);

                return Object.entries(monthlySpending)
                  .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                  .slice(0, 6)
                  .map(([month, amount]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month}</span>
                      <span className="font-semibold">{formatPrice(amount as number)}</span>
                    </div>
                  ));
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Sử dụng phương thức</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.methodStats)
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .map(([method, count]) => {
                  const percentage = ((count as number) / stats.completedTransactions) * 100;
                  return (
                    <div key={method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPaymentMethodIcon(method)}</span>
                          <span className="text-sm font-medium capitalize">{method}</span>
                        </div>
                        <span className="text-sm text-gray-600">{count as number} lần</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
