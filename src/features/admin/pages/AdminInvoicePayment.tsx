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
import { generateInvoicePDF } from '../../../lib/pdf-utils';
import { exportPaymentsToExcel, exportSelectedPaymentsToExcel } from '../../../lib/excel-utils';
import { toast } from 'sonner';

export function AdminInvoicePayment() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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
  
  // Track dropdown open state to prevent scroll lock
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, packageFilter, startDate, endDate, priceFilter]);

  // Paginate sorted data
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedData.slice(start, end);
  }, [sortedData, page, limit]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / limit);
  const filteredRecords = sortedData.length;

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
    if (selectedInvoices.length === paginatedData.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(paginatedData.map((payment: any) => payment._id));
    }
  };

  // Prevent scroll lock when dropdowns are open
  useEffect(() => {
    if (!isDropdownOpen) return;

    let rafId: number;
    let lastCheck = 0;
    const preventScrollLock = () => {
      const now = Date.now();
      if (now - lastCheck < 100) {
        if (isDropdownOpen) {
          rafId = requestAnimationFrame(preventScrollLock);
        }
        return;
      }
      lastCheck = now;

      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.removeAttribute('data-scroll-locked');
        if (scrollY) {
          const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
          window.scrollTo(0, y);
        }
      }
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }

      if (isDropdownOpen) {
        rafId = requestAnimationFrame(preventScrollLock);
      }
    };

    rafId = requestAnimationFrame(preventScrollLock);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDropdownOpen]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPackageFilter('all');
    setStartDate('');
    setEndDate('');
    setPriceFilter('all');
    setPage(1);
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

  const handlePrintInvoice = async (payment: Payment) => {
    try {
      // Map payment data to InvoiceData format
      const invoiceData = {
        invoiceNumber: (payment as any).invoiceNumber || `#${payment._id.slice(-8).toUpperCase()}`,
        transactionId: (payment as any).transactionId || (payment as any).transaction_id,
        paymentDate: (payment as any).paymentDate || payment.createdAt || new Date().toISOString(),
        paymentStatus: (payment as any).paymentStatus || (payment as any).status || 'pending',
        paymentMethod: (payment as any).paymentMethod || (payment as any).payment_method || 'cash',
        paymentType: (payment as any).paymentType || (payment as any).payment_type,
        packageName: (payment as any).subscriptionId?.packageId?.name || 'Gói tập',
        amount: payment.amount || 0,
        originalAmount: (payment as any).subscriptionId?.packageId?.price,
        discountAmount: (payment as any).subscriptionId?.packageId?.price && payment.amount
          ? (payment as any).subscriptionId?.packageId?.price - payment.amount
          : undefined,
        memberName: (payment as any).memberId?.fullName || 'Khách hàng',
        memberEmail: (payment as any).memberId?.email,
        memberPhone: (payment as any).memberId?.phone,
        notes: (payment as any).notes || (payment as any).note,
      };

      await generateInvoicePDF(invoiceData);
      toast.success('Đã tải hóa đơn PDF thành công');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Có lỗi xảy ra khi tạo PDF');
    }
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

  const handleExportToExcel = () => {
    try {
      if (sortedData.length === 0) {
        toast.error('Không có dữ liệu để xuất báo cáo');
        return;
      }

      exportPaymentsToExcel({
        payments: sortedData,
        title: 'Danh sách hóa đơn'
      });
      
      toast.success('Đã xuất báo cáo Excel thành công');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo Excel');
    }
  };

  const handleExportSelectedPayments = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hóa đơn để xuất dữ liệu');
      return;
    }

    try {
      toast.loading('Đang tải dữ liệu...', { id: 'export-selected-loading' });
      
      // Lấy tất cả payments đã chọn từ sortedData (tất cả filtered payments, không chỉ trang hiện tại)
      // sortedData chứa tất cả payments đã được filter và sort, không bị giới hạn bởi pagination
      // Điều này đảm bảo lấy được tất cả payments đã chọn từ mọi trang
      const selectedPayments = sortedData.filter((payment: any) => 
        selectedInvoices.includes(payment._id)
      );

      // Validation: Kiểm tra số lượng payments tìm được có khớp với số lượng đã chọn không
      if (selectedPayments.length === 0) {
        toast.error('Không tìm thấy dữ liệu của các hóa đơn đã chọn', { id: 'export-selected-loading' });
        return;
      }

      // Cảnh báo nếu số lượng không khớp (có thể do filter thay đổi sau khi chọn)
      if (selectedPayments.length !== selectedInvoices.length) {
        console.warn(`Số lượng payments tìm được (${selectedPayments.length}) không khớp với số lượng đã chọn (${selectedInvoices.length})`);
        toast.warning(`Chỉ tìm thấy ${selectedPayments.length}/${selectedInvoices.length} hóa đơn. Có thể do bộ lọc đã thay đổi.`, { id: 'export-selected-loading' });
      }

      toast.success(`Đã tải ${selectedPayments.length} hóa đơn, đang xuất file...`, { id: 'export-selected-loading' });
      
      exportSelectedPaymentsToExcel({
        payments: selectedPayments,
        title: 'Danh sách hóa đơn được chọn'
      });

      toast.success(`Đã xuất dữ liệu của ${selectedPayments.length} hóa đơn thành công!`, { id: 'export-selected-loading' });
    } catch (error) {
      console.error('Error exporting selected payments:', error);
      toast.error('Có lỗi xảy ra khi xuất dữ liệu', { id: 'export-selected-loading' });
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

      {/* Action Buttons - Moved below table */}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invoiceSearch">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="invoiceSearch"
                  placeholder="Tìm kiếm theo mã hóa đơn, tên hội viên..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statusFilter">Trạng thái thanh toán</Label>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                requestAnimationFrame(() => {
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
              >
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
              <Select value={packageFilter} onValueChange={(value) => {
                setPackageFilter(value);
                setPage(1);
              }}
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                requestAnimationFrame(() => {
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
              >
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
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <Label htmlFor="priceFilter">Khoảng giá</Label>
              <Select value={priceFilter} onValueChange={(value) => {
                setPriceFilter(value);
                setPage(1);
              }}
              onOpenChange={(open) => {
                setIsDropdownOpen(open);
                requestAnimationFrame(() => {
                  if (document.body.style.position === 'fixed') {
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                    if (scrollY) {
                      const y = parseInt(scrollY.replace('px', '').replace('-', '') || '0');
                      window.scrollTo(0, y);
                    }
                  } else {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    document.body.removeAttribute('data-scroll-locked');
                  }
                });
              }}
              >
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
            
            <div className="flex items-end">
              <Button variant="outline" onClick={handleResetFilters} className="w-full">
                Đặt lại
              </Button>
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
                  onClick={handleExportSelectedPayments}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu được chọn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Danh sách hóa đơn ({filteredRecords})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleCreateInvoice}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo hóa đơn mới
              </Button>
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                disabled={sortedData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất toàn bộ hóa đơn
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <NonSortableHeader className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === paginatedData.length && paginatedData.length > 0}
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
                {paginatedData.map((payment: any) => (
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

          {/* Pagination */}
          {filteredRecords > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {totalPages > 1 
                    ? `Hiển thị ${((page - 1) * limit) + 1} - ${Math.min(page * limit, filteredRecords)} trong tổng số ${filteredRecords} kết quả`
                    : `Hiển thị ${filteredRecords} kết quả`
                  }
                </span>
              </div>
              {totalPages > 1 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1 || isLoading}
                    title="Trang đầu"
                  >
                    «
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    title="Trang trước"
                  >
                    ‹
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={isLoading}
                        className={page === pageNum ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                    title="Trang sau"
                  >
                    ›
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages || isLoading}
                    title="Trang cuối"
                  >
                    »
                  </Button>
                </div>
              )}
            </div>
          )}
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
