import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  RefreshCw,
  Plus,
  Dumbbell,
  Star,
  QrCode,
  Loader2
} from 'lucide-react';
import { formatDate } from '../../../lib/date-utils';
import MemberPaymentModal from '../components/ModalPayment';
import { ModalPaymentDetail } from '../components/ModalPaymentDetail';
import { usePaymentsByMemberId, usePackages, useSubscriptionsByMemberId } from '../hooks';
import { useTableRowClick } from '../../../hooks/useTableRowClick';
import { ClickableTableRow, TableActions } from '../../../components/ui';

export function MemberPayments() {
  const { user } = useAuth();
  const memberId = user?._id || user?.id || '';
  const [activeTab, setActiveTab] = useState<'renew' | 'new' | 'pt'>('pt');
  const [selectedPkg, setSelectedPkg] = useState<undefined | { id: string; name: string; amount: number }>(undefined);
  const [selectedMethod, setSelectedMethod] = useState<undefined | 'momo' | 'zalopay' | 'bank'>(undefined);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Use reusable hook for table row click
  const {
    isModalOpen: openDetailModal,
    selectedId: selectedPaymentId,
    selectedData: selectedPaymentDetail,
    handleRowClick,
    handleButtonClick,
    closeModal: closeDetailModal,
  } = useTableRowClick<any>();

  // Fetch data from APIs
  const { data: paymentsResponse, isLoading: isLoadingPayments } = usePaymentsByMemberId(memberId);
  const { data: packagesData, isLoading: isLoadingPackages } = usePackages();
  const { data: subscriptionsResponse, isLoading: isLoadingSubscriptions } = useSubscriptionsByMemberId(memberId);

  // Process packages data first
  const packages = useMemo(() => {
    if (!packagesData || !Array.isArray(packagesData)) return [];
    return packagesData.map((pkg: any) => ({
      ...pkg,
      id: pkg._id,
      price: pkg.price || 0,
      name: pkg.name || '',
      type: pkg.type || '',
      membership_type: pkg.membershipType || pkg.membership_type || '',
      duration_months: pkg.durationMonths || pkg.duration_months || 0,
      description: pkg.description || '',
      pt_session_duration: pkg.ptSessionDuration || pkg.pt_session_duration || 90,
    }));
  }, [packagesData]);

  // Process subscriptions data
  const subscriptions = useMemo(() => {
    if (!subscriptionsResponse?.data) return [];
    return subscriptionsResponse.data || [];
  }, [subscriptionsResponse]);

  // Process payments data with package names
  const memberPayments = useMemo(() => {
    if (!paymentsResponse?.data) return [];
    
    return (paymentsResponse.data || [])
      .map((payment: any) => {
        // Find subscription from payment.subscriptionId
        const subscription = subscriptions.find((sub: any) => 
          (sub._id === payment.subscriptionId) || (sub.id === payment.subscriptionId)
        );
        
        // Find package from subscription.packageId
        let packageName = 'Gói tập'; // Default fallback
        if (subscription) {
          const packageIdValue = subscription.packageId;
          let packageId: string | undefined;
          
          if (packageIdValue && packageIdValue !== null) {
            if (typeof packageIdValue === 'object') {
              packageId = (packageIdValue as any)._id;
              // Check if package is populated with name
              if (packageIdValue && 'name' in packageIdValue) {
                packageName = (packageIdValue as any).name;
              }
            } else if (typeof packageIdValue === 'string') {
              packageId = packageIdValue;
            }
            
            // Try to find package by ID if we haven't found the name yet
            if ((!packageName || packageName === 'Gói tập') && packageId) {
              const pkg = packages.find((p: any) => 
                (p._id === packageId) || (p.id === packageId)
              );
              if (pkg?.name) {
                packageName = pkg.name;
              }
            }
          }
          
          // Final fallback: use subscription type + membership type
          if (!packageName || packageName === 'Gói tập') {
            const membershipType = subscription.membershipType;
            if (subscription.type) {
              packageName = `${subscription.type}${membershipType ? ' ' + membershipType : ''}`;
            }
          }
        }
        
        return {
          ...payment,
          id: payment._id,
          payment_date: payment.paymentDate || payment.createdAt,
          payment_status: payment.paymentStatus || payment.status || 'pending',
          payment_method: payment.paymentMethod || payment.payment_method || 'cash',
          invoice_number: payment.invoiceNumber || payment.invoice_number || payment._id,
          transaction_id: payment.transactionId || payment.transaction_id,
          original_amount: payment.originalAmount || payment.amount,
          amount: payment.amount || 0,
          package_name: packageName,
        };
      })
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [paymentsResponse, subscriptions, packages]);

  // Get subscription info
  const getSubscriptionInfo = (subscriptionId: string) => {
    return subscriptions.find((sub: any) => sub._id === subscriptionId || sub.id === subscriptionId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed' || statusLower === 'success') {
        return 'bg-green-100 text-green-800';
    }
    if (statusLower === 'pending' || statusLower === 'waiting') {
        return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower === 'failed' || statusLower === 'error') {
        return 'bg-red-100 text-red-800';
    }
    if (statusLower === 'refunded') {
        return 'bg-blue-100 text-blue-800';
    }
        return 'bg-gray-100 text-gray-800';
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
      case 'bank_transfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methodLower = method?.toLowerCase() || '';
    switch (methodLower) {
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'cash':
        return 'Tiền mặt';
      case 'card':
        return 'Thẻ';
      case 'banktransfer':
      case 'bank_transfer':
        return 'Chuyển khoản';
      default:
        return method || 'Khác';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = memberPayments
      .filter(p => {
        const status = (p.payment_status || '').toLowerCase();
        return status === 'completed' || status === 'success';
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const totalTransactions = memberPayments.length;
    const completedTransactions = memberPayments.filter(p => {
      const status = (p.payment_status || '').toLowerCase();
      return status === 'completed' || status === 'success';
    }).length;
    const pendingTransactions = memberPayments.filter(p => {
      const status = (p.payment_status || '').toLowerCase();
      return status === 'pending' || status === 'waiting';
    }).length;
    
    const methodStats = memberPayments.reduce((acc, payment) => {
      const status = (payment.payment_status || '').toLowerCase();
      if (status === 'completed' || status === 'success') {
        const method = payment.payment_method || 'cash';
        acc[method] = (acc[method] || 0) + 1;
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

  // Active subscription for Renew tab
  const activeSubscription = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return undefined as any;
    return subscriptions.find((s: any) => {
      const status = (s.status || s.subscription_status || '').toLowerCase();
      return status === 'active' || status === 'activated';
    }) || subscriptions[0];
  }, [subscriptions]);

  // Data from API for tabs
  const ptPackages = useMemo(() => {
    return packages.filter((p) => p.type === 'PT' || p.type === 'Personal Training');
  }, [packages]);

  const renewCandidates = useMemo(() => {
    const basic1 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'Basic' && p.duration_months === 1);
    const vip1 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'VIP' && p.duration_months === 1);
    const basic3 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'Basic' && p.duration_months === 3);
    const vip3 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'VIP' && p.duration_months === 3);
    return [basic1, vip1, basic3, vip3].filter(Boolean);
  }, [packages]);

  const newPackages = useMemo(() => {
    const basic1 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'Basic' && p.duration_months === 1);
    const vip1 = packages.find((p) => p.type === 'Membership' && p.membership_type === 'VIP' && p.duration_months === 1);
    const comboAny = packages.find((p) => p.type === 'Combo');
    return [basic1, vip1, comboAny].filter(Boolean);
  }, [packages]);

  // Loading state
  const isLoading = isLoadingPayments || isLoadingPackages || isLoadingSubscriptions;

  const handleSelectPackage = (id: string, name: string, amount: number) => {
    setSelectedPkg({ id, name, amount });
    setSelectedMethod('bank');
    setShowPaymentMethods(false);
    setOpenModal(true);
  };

  // Select a renew option but do not open modal yet
  const handleSelectRenewPackage = (id: string, name: string, amount: number) => {
    setSelectedPkg({ id, name, amount });
    setSelectedMethod('bank');
  };

  const proceedToPayment = () => {
    if (!selectedPkg || !selectedMethod) return;
    setOpenModal(true);
  };

  const paymentConfig = (method: 'momo' | 'zalopay' | 'bank' | undefined) => {
    if (method === 'momo') {
      return {
        title: 'Thanh toán Momo',
        steps: ['Mở ứng dụng Momo', 'Chọn Quét mã QR', 'Quét mã QR trên màn hình', 'Xác nhận thanh toán', 'Nhập mật khẩu để hoàn tất']
      };
    }
    if (method === 'zalopay') {
      return {
        title: 'Thanh toán ZaloPay',
        steps: ['Mở ứng dụng ZaloPay', 'Chọn Quét mã QR', 'Quét mã QR trên màn hình', 'Xác nhận thanh toán', 'Nhập mật khẩu để hoàn tất']
      };
    }
    return {
      title: 'Chuyển khoản ngân hàng',
      steps: ['Mở ứng dụng ngân hàng', 'Chọn Chuyển khoản/QR', 'Quét mã QR trên màn hình', 'Xác nhận thông tin', 'Nhập OTP để hoàn tất']
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span>Đang tải thông tin thanh toán...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top tabs like design */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
        <Button
          variant={activeTab === 'renew' ? 'default' : 'outline'}
          className={`flex-1 h-11 rounded-lg justify-center ${activeTab === 'renew' ? 'bg-blue-900 hover:bg-blue-900/90 text-white' : 'text-blue-900 border-blue-200'}`}
          onClick={() => setActiveTab('renew')}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Gia hạn gói tập
        </Button>
        <Button
          variant={activeTab === 'new' ? 'default' : 'outline'}
          className={`flex-1 h-11 rounded-lg justify-center ${activeTab === 'new' ? 'bg-blue-900 hover:bg-blue-900/90 text-white' : 'text-blue-900 border-blue-200'}`}
          onClick={() => setActiveTab('new')}
        >
          <Plus className="h-4 w-4 mr-2" /> Đăng ký gói mới
        </Button>
        <Button
          variant={activeTab === 'pt' ? 'default' : 'outline'}
          className={`flex-1 h-11 rounded-lg justify-center ${activeTab === 'pt' ? 'bg-blue-900 hover:bg-blue-900/90 text-white' : 'text-blue-900 border-blue-200'}`}
          onClick={() => setActiveTab('pt')}
        >
          <Dumbbell className="h-4 w-4 mr-2" /> Mua buổi tập PT
        </Button>
      </div>

      {/* Sub header actions */}
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
        </div>
      </div>

      {/* Statistics Cards removed as requested */}

      {/* Tab contents */}
      {activeTab === 'pt' && (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="h-5 w-5 text-blue-900" />
          <h2 className="text-xl font-semibold text-blue-900">Mua buổi tập PT</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ptPackages.slice(0,3).map((opt) => (
            <Card
              key={opt.id}
              className={`border-2 cursor-pointer select-none ${selectedPkg?.id === opt.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => handleSelectRenewPackage(opt.id, opt.name, opt.price)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{opt.name}
                  <span className="ml-3 text-green-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(opt.price).replace('₫','VNĐ')}
                  </span>
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-700" /> {opt.pt_session_duration || 90} phút/buổi</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-700" /> 1-1 với PT</div>
                  <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-700" /> Theo dõi tiến độ</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Button onClick={() => setOpenModal(true)} disabled={!selectedPkg}>Thanh toán</Button>
        </div>
      </div>
      )}

      {/* Payment methods section removed as requested */}

      {activeTab === 'renew' && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-900" />
                Gói hiện tại
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <span className="text-gray-600">Gói: </span>
                  <span className="font-semibold text-blue-900">{activeSubscription?.type || activeSubscription?.subscription_type || '—'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <span className="text-gray-600">Hết hạn: </span>
                  <span className="font-semibold text-blue-900">{activeSubscription?.endDate || activeSubscription?.end_date ? new Date(activeSubscription.endDate || activeSubscription.end_date).toLocaleDateString('vi-VN') : '—'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <span className="text-gray-600">Trạng thái: </span>
                  <span className="font-semibold text-green-600">Đang hoạt động</span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Tùy chọn gia hạn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renewCandidates.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-lg border-2 bg-gray-50 cursor-pointer select-none ${selectedPkg?.id === pkg.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => handleSelectRenewPackage(pkg.id, pkg.name, pkg.price)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-blue-900 text-sm md:text-base">{pkg.name}</h4>
                      <span className="text-green-600 font-bold">{new Intl.NumberFormat('vi-VN').format(pkg.price)} VNĐ</span>
                    </div>
                    <p className="text-gray-600 text-sm">Gia hạn gói hiện tại</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Button onClick={() => setOpenModal(true)} disabled={!selectedPkg}>Thanh toán</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'new' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-blue-900" />
            <h2 className="text-xl font-semibold text-blue-900">Gói tập mới</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`border-2 cursor-pointer select-none ${selectedPkg?.id === pkg.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleSelectRenewPackage(pkg.id, pkg.name, pkg.price)}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{pkg.name}</h3>
                  <div className="text-green-600 font-bold mb-3">{new Intl.NumberFormat('vi-VN').format(pkg.price)} VNĐ</div>
                  <div className="text-sm text-gray-700">{pkg.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Button onClick={() => setOpenModal(true)} disabled={!selectedPkg}>Thanh toán</Button>
          </div>
      </div>
      )}

      {/* Payment methods stats section removed as requested */}

      <MemberPaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        method={selectedMethod}
        packageName={selectedPkg?.name || ''}
        amount={selectedPkg?.amount || 0}
        getConfig={paymentConfig}
      />

      {/* Invoice History table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Hóa đơn đã thanh toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Mã hóa đơn</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Ngày thanh toán</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Gói tập</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Số tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Phương thức</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {memberPayments.map((p) => (
                  <ClickableTableRow
                    key={p.id}
                    onClick={handleRowClick(p.id || p._id, p)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-blue-900">{p.invoice_number || p.id}</div>
                      {p.transaction_id && (
                        <div className="text-xs text-gray-500">{p.transaction_id}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{new Date(p.payment_date).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs text-gray-500">{new Date(p.payment_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-blue-900">{(p as any).package_name || 'Gói tập'}</div>
                      {p.original_amount !== p.amount && (
                        <div className="text-xs text-green-600">Giảm {formatPrice((p.original_amount || 0) - (p.amount || 0))}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{formatPrice(p.amount)}</div>
                      {p.original_amount !== p.amount && (
                        <div className="text-xs text-gray-500 line-through">{formatPrice(p.original_amount)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{getPaymentMethodIcon(p.payment_method)}</span>
                        <span className="text-sm">{getPaymentMethodName(p.payment_method)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(p.payment_status)}`}>
                        {p.payment_status === 'completed' ? 'Hoàn thành' :
                         p.payment_status === 'pending' ? 'Đang chờ' :
                         p.payment_status === 'failed' ? 'Thất bại' :
                         p.payment_status === 'refunded' ? 'Đã hoàn tiền' :
                         p.payment_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <TableActions
                        actions={[
                          {
                            label: 'Chi tiết',
                            icon: <Download className="h-3 w-3 mr-1" />,
                            onClick: handleButtonClick(p.id || p._id, p),
                            variant: 'outline',
                            size: 'sm',
                          },
                        ]}
                      />
                    </td>
                  </ClickableTableRow>
                ))}
              </tbody>
            </table>
            {memberPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch</h3>
              <p className="text-gray-500">Bạn chưa có giao dịch thanh toán nào</p>
            </div>
          )}
          </div>
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
                  .filter(p => {
                    const status = (p.payment_status || '').toLowerCase();
                    return status === 'completed' || status === 'success';
                  })
                  .reduce((acc, payment) => {
                    const paymentDate = payment.payment_date || payment.createdAt;
                    if (!paymentDate) return acc;
                    
                    const month = new Date(paymentDate).toLocaleDateString('vi-VN', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                    acc[month] = (acc[month] || 0) + (payment.amount || 0);
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
                          <span className="text-sm font-medium">{getPaymentMethodName(method)}</span>
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

      {/* Payment Detail Modal */}
      <ModalPaymentDetail
        open={openDetailModal}
        onClose={closeDetailModal}
        paymentId={selectedPaymentId}
        paymentDetail={selectedPaymentDetail}
      />
    </div>
  );
}
