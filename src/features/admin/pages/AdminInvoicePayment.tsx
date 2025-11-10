import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  CreditCard,
  Bell,
  Download,
  Calendar,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Printer
} from 'lucide-react';
import {
  useSendPaymentReminder,
  useBulkSendReminders,
  useExportInvoices
} from '../hooks/useInvoices';
import { usePayments, usePaymentStats, useUpdatePayment } from '../../member/hooks/usePayments';
import { Invoice } from '../types/invoice.types';
import { Payment } from '../../member/types';
import { ModalCreateInvoice, ModalViewInvoice } from '../components/invoices-management';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';
import socketService from '../../../services/socket';
import { useQueryClient } from '@tanstack/react-query';

export function AdminInvoicePayment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  // API hooks
  const { data: paymentsResponse, isLoading, error } = usePayments();
  const payments = paymentsResponse?.data || [];
  const { data: statsResponse } = usePaymentStats();
  const stats = statsResponse?.data;
  const updatePaymentMutation = useUpdatePayment();
  const sendReminderMutation = useSendPaymentReminder();
  const bulkSendRemindersMutation = useBulkSendReminders();
  const exportInvoicesMutation = useExportInvoices();
  const queryClient = useQueryClient();
  const [isRealtimeLoading, setIsRealtimeLoading] = useState(false);


  // Filter payments based on search and filters
  const filteredPayments = React.useMemo(() => {
    return payments.filter((payment: any) => {
      const matchesSearch = (payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.memberId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.memberId?.email?.toLowerCase().includes(searchTerm.toLowerCase())) || false;
      const matchesStatus = statusFilter === 'all' || (payment.paymentStatus || payment.status) === statusFilter;
      const matchesPackage = packageFilter === 'all' || payment.subscriptionId?.packageId?.type === packageFilter;
      
      let matchesDate = true;
      if (startDate && endDate && payment.createdAt) {
        const paymentDate = new Date(payment.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchesDate = paymentDate >= start && paymentDate <= end;
      }
      
      let matchesPrice = true;
      if (priceFilter !== 'all' && payment.amount) {
        switch (priceFilter) {
          case '0-500k':
            matchesPrice = payment.amount < 500000;
            break;
          case '500k-1M':
            matchesPrice = payment.amount >= 500000 && payment.amount < 1000000;
            break;
          case '1M-2M':
            matchesPrice = payment.amount >= 1000000 && payment.amount < 2000000;
            break;
          case '2M+':
            matchesPrice = payment.amount >= 2000000;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPackage && matchesDate && matchesPrice;
    });
  }, [payments, searchTerm, statusFilter, packageFilter, startDate, endDate, priceFilter]);

  // Sort payments - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: filteredPayments,
    initialSort: { key: 'createdAt', direction: 'desc' }
  });

  // Reset selected invoices when filters or sort changes
  React.useEffect(() => {
    setSelectedInvoices([]);
  }, [searchTerm, statusFilter, packageFilter, startDate, endDate, priceFilter]);

  // Reset selected invoices when sort changes
  const handleSort = (key: string) => {
    setSelectedInvoices([]);
    requestSort(key);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || undefined;
    const socket = socketService.connect(token);

    const invalidatePayments = () => {
      setIsRealtimeLoading(true);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentStats'] });
    };

    const handleComplete = () => {
      invalidatePayments();
    };

    const handleCreated = () => {
      invalidatePayments();
    };

    const handleSubscriptionPayment = () => {
      invalidatePayments();
    };

    socket.on('payment_created', handleCreated);
    socket.on('payment_completed', handleComplete);
    socket.on('subscription_payment_created', handleSubscriptionPayment);

    return () => {
      socket.off('payment_created', handleCreated);
      socket.off('payment_completed', handleComplete);
      socket.off('subscription_payment_created', handleSubscriptionPayment);
    };
  }, [queryClient]);

  useEffect(() => {
    if (isRealtimeLoading && !isLoading) {
      setIsRealtimeLoading(false);
    }
  }, [isRealtimeLoading, isLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 text-xs">Đã thanh toán</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Chờ thanh toán</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800 text-xs">Thất bại</Badge>;
      case 'Refunded':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Đã hoàn tiền</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Đã hủy</Badge>;
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 text-xs">Đang hoạt động</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-800 text-xs">Đã hết hạn</Badge>;
      case 'Suspended':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Tạm dừng</Badge>;
      case 'PendingPayment':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Chờ thanh toán</Badge>;
      case 'NotStarted':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Chờ bắt đầu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Không xác định</Badge>;
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(paymentId)
        ? prev.filter((id: string) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === sortedData.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(sortedData.map((payment: any) => payment._id));
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleViewInvoice = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleRecordPayment = async (payment: Payment) => {
    try {
      await updatePaymentMutation.mutateAsync({
        paymentId: payment._id,
        data: {
          paymentStatus: 'Completed',
          paymentDate: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleSendReminder = async (payment: Payment) => {
    try {
      await sendReminderMutation.mutateAsync(payment._id);
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const handlePrintInvoice = (payment: Payment) => {
    window.print();
  };

  const handleBulkSendReminders = async () => {
    if (selectedInvoices.length === 0) return;
    try {
      await bulkSendRemindersMutation.mutateAsync(selectedInvoices);
      setSelectedInvoices([]);
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
    }
  };

  const handleExportInvoices = async () => {
    try {
      await exportInvoicesMutation.mutateAsync({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        packageType: packageFilter !== 'all' ? packageFilter : undefined,
        startDate,
        endDate,
        priceRange: priceFilter !== 'all' ? priceFilter : undefined,
        search: searchTerm
      });
    } catch (error) {
      console.error('Error exporting payments:', error);
    }
  };

  if (isLoading && !isRealtimeLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">
      Có lỗi xảy ra khi tải danh sách hóa đơn
    </div>;
  }

  return (
    <div className="space-y-6">

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(stats?.totalAmount || 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.completedPayments || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats?.pendingPayments || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Thất bại</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.failedPayments || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hóa đơn mới
            </Button>
            <Button
              variant="outline"
              onClick={handleExportInvoices}
              disabled={exportInvoicesMutation.isPending}
            >
              <Download className="w-4 h-4 mr-2" />
              {exportInvoicesMutation.isPending ? 'Đang xuất...' : 'Xuất báo cáo'}
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkSendReminders}
              disabled={selectedInvoices.length === 0 || bulkSendRemindersMutation.isPending}
            >
              <Bell className="w-4 h-4 mr-2" />
              {bulkSendRemindersMutation.isPending ? 'Đang gửi...' : 'Gửi nhắc nhở hàng loạt'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invoiceSearch">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="invoiceSearch"
                  placeholder="Tìm kiếm theo mã hóa đơn, tên hội viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statusFilter">Trạng thái thanh toán</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Completed">Đã thanh toán</SelectItem>
                  <SelectItem value="Pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="Failed">Thất bại</SelectItem>
                  <SelectItem value="Refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="packageFilter">Loại gói</Label>
              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Membership">Gói tập</SelectItem>
                  <SelectItem value="PT">Gói PT</SelectItem>
                  <SelectItem value="Combo">Gói Combo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="priceFilter">Khoảng giá</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="0-500k">Dưới 500k</SelectItem>
                  <SelectItem value="500k-1M">500k - 1M</SelectItem>
                  <SelectItem value="1M-2M">1M - 2M</SelectItem>
                  <SelectItem value="2M+">Trên 2M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedInvoices.length} thanh toán
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkSendReminders}
                  disabled={bulkSendRemindersMutation.isPending}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Gửi nhắc nhở hàng loạt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportInvoices}
                  disabled={exportInvoicesMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Xóa hàng loạt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Danh sách hóa đơn ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <NonSortableHeader className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === sortedData.length && sortedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </NonSortableHeader>
                  <SortableTableHeader
                    label="Mã HĐ"
                    sortKey="invoiceNumber"
                    currentSortKey={getSortDirection('invoiceNumber') ? 'invoiceNumber' : ''}
                    sortDirection={getSortDirection('invoiceNumber')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <SortableTableHeader
                    label="Hội Viên"
                    sortKey="memberId.fullName"
                    currentSortKey={getSortDirection('memberId.fullName') ? 'memberId.fullName' : ''}
                    sortDirection={getSortDirection('memberId.fullName')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <NonSortableHeader label="Gói Dịch Vụ" align="left" className="p-2 text-xs" />
                  <SortableTableHeader
                    label="Số Tiền"
                    sortKey="amount"
                    currentSortKey={getSortDirection('amount') ? 'amount' : ''}
                    sortDirection={getSortDirection('amount')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <SortableTableHeader
                    label="Ngày Tạo"
                    sortKey="createdAt"
                    currentSortKey={getSortDirection('createdAt') ? 'createdAt' : ''}
                    sortDirection={getSortDirection('createdAt')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <SortableTableHeader
                    label="Ngày Thanh Toán"
                    sortKey="paymentDate"
                    currentSortKey={getSortDirection('paymentDate') ? 'paymentDate' : ''}
                    sortDirection={getSortDirection('paymentDate')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <SortableTableHeader
                    label="Phương Thức"
                    sortKey="paymentMethod"
                    currentSortKey={getSortDirection('paymentMethod') ? 'paymentMethod' : ''}
                    sortDirection={getSortDirection('paymentMethod')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <SortableTableHeader
                    label="Trạng Thái"
                    sortKey="paymentStatus"
                    currentSortKey={getSortDirection('paymentStatus') ? 'paymentStatus' : ''}
                    sortDirection={getSortDirection('paymentStatus')}
                    onSort={handleSort}
                    align="left"
                    className="p-2 text-xs"
                  />
                  <NonSortableHeader label="Thao Tác" align="left" className="p-2 text-xs" />
                </tr>
              </thead>
              <tbody>
                {sortedData.map((payment: any) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(payment._id)}
                        onChange={() => handleSelectPayment(payment._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-blue-600 text-xs">{payment.invoiceNumber || `#${payment._id.slice(-8).toUpperCase()}`}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {payment.memberId?.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{payment.memberId?.fullName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{payment.memberId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{payment.subscriptionId?.packageId?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{payment.subscriptionId?.packageId?.type || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">{formatPrice(payment.amount || 0)}</p>
                        {payment.subscriptionId?.packageId?.price && payment.subscriptionId?.packageId?.price !== payment.amount && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(payment.subscriptionId?.packageId?.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-xs">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-xs">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                        {payment.paymentMethod === 'Cash' ? 'Tiền mặt' :
                          payment.paymentMethod === 'Card' ? 'Thẻ' :
                            payment.paymentMethod === 'Momo' ? 'Momo' :
                              payment.paymentMethod === 'ZaloPay' ? 'ZaloPay' :
                                payment.paymentMethod === 'BankTransfer' ? 'Chuyển khoản' :
                                  payment.paymentMethod === 'VNPay' ? 'VNPay' :
                                    payment.paymentMethod || 'N/A'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {getStatusBadge(payment.paymentStatus || payment.status)}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(payment)}
                          title="Xem chi tiết"
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {(payment.paymentStatus || payment.status) === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 text-xs"
                            onClick={() => handleRecordPayment(payment)}
                            title="Ghi nhận thanh toán"
                          >
                            <CreditCard className="w-3 h-3" />
                          </Button>
                        )}
                        {(payment.paymentStatus || payment.status) === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700 text-xs"
                            onClick={() => handleSendReminder(payment)}
                            title="Gửi nhắc nhở"
                          >
                            <Bell className="w-3 h-3" />
                          </Button>
                        )}
                        {(payment.paymentStatus || payment.status) === 'Completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 text-xs"
                            onClick={() => handlePrintInvoice(payment)}
                            title="In hóa đơn"
                          >
                            <Printer className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ModalCreateInvoice
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
        }}
      />

      <ModalViewInvoice
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedPayment(null);
        }}
        invoice={selectedPayment}
        onRecordPayment={(payment) => {
          handleRecordPayment(payment as Payment);
          setShowViewModal(false);
        }}
        onSendReminder={handleSendReminder}
      />
    </div>
  );
}
