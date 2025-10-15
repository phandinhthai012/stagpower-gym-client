import React, { useState } from 'react';
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
  Printer, 
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
  Trash2,
  Edit
} from 'lucide-react';
import { 
  useInvoices, 
  useInvoiceStats, 
  useDeleteInvoice, 
  useSendPaymentReminder, 
  useBulkSendReminders,
  useExportInvoices 
} from '../hooks/useInvoices';
import { Invoice } from '../types/invoice.types';
import { ModalCreateInvoice, ModalViewInvoice, ModalRecordPayment } from '../components/invoices-management';

export function AdminInvoicePayment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  // API hooks
  const { data: invoices = [], isLoading, error } = useInvoices();
  const { data: stats } = useInvoiceStats();
  const deleteInvoiceMutation = useDeleteInvoice();
  const sendReminderMutation = useSendPaymentReminder();
  const bulkSendRemindersMutation = useBulkSendReminders();
  const exportInvoicesMutation = useExportInvoices();


  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || invoice.packageType === packageFilter;
    
    let matchesDate = true;
    if (startDate && endDate) {
      const invoiceDate = new Date(invoice.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDate = invoiceDate >= start && invoiceDate <= end;
    }
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case '0-500k':
          matchesPrice = invoice.amount < 500000;
          break;
        case '500k-1M':
          matchesPrice = invoice.amount >= 500000 && invoice.amount < 1000000;
          break;
        case '1M-2M':
          matchesPrice = invoice.amount >= 1000000 && invoice.amount < 2000000;
          break;
        case '2M+':
          matchesPrice = invoice.amount >= 2000000;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesPackage && matchesDate && matchesPrice;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
      case 'Refunded':
        return <Badge className="bg-gray-100 text-gray-800">Đã hoàn tiền</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter((id: string) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((invoice: Invoice) => invoice._id));
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn ${invoice.invoiceNumber}?`)) {
      try {
        await deleteInvoiceMutation.mutateAsync(invoice._id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleSendReminder = async (invoice: Invoice) => {
    try {
      await sendReminderMutation.mutateAsync(invoice._id);
    } catch (error) {
      console.error('Error sending reminder:', error);
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
      console.error('Error exporting invoices:', error);
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // TODO: Implement print functionality
    console.log('Print invoice:', invoice.invoiceNumber);
  };

  if (isLoading) {
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
                    {formatPrice(stats.totalRevenue)}
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
                  <p className="text-2xl font-bold text-blue-600">{stats.paidInvoices}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvoices}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Quá hạn</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm hóa đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                Đã chọn {selectedInvoices.length} hóa đơn
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
                  <Trash2 className="w-4 h-4 mr-2" />
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
            Danh sách hóa đơn ({filteredInvoices.length})
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 font-medium text-gray-600">Mã HĐ</th>
                  <th className="text-left p-3 font-medium text-gray-600">Hội Viên</th>
                  <th className="text-left p-3 font-medium text-gray-600">Gói Dịch Vụ</th>
                  <th className="text-left p-3 font-medium text-gray-600">Số Tiền</th>
                  <th className="text-left p-3 font-medium text-gray-600">Ngày Tạo</th>
                  <th className="text-left p-3 font-medium text-gray-600">Hạn Thanh Toán</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng Thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice._id)}
                        onChange={() => handleSelectInvoice(invoice._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-blue-600">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {invoice.memberName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.memberName}</p>
                          <p className="text-sm text-gray-500">{invoice.memberEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.packageName}</p>
                        <p className="text-sm text-gray-500">{invoice.packageType}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{formatPrice(invoice.amount)}</p>
                        {invoice.originalAmount !== invoice.amount && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(invoice.originalAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-3">
                      {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice)}
                          title="In hóa đơn"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        {invoice.status === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleRecordPayment(invoice)}
                            title="Ghi nhận thanh toán"
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                        {invoice.status === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700"
                            onClick={() => handleSendReminder(invoice)}
                            title="Gửi nhắc nhở"
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa hóa đơn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onRecordPayment={(invoice) => {
          setShowViewModal(false);
          setSelectedInvoice(invoice);
          setShowPaymentModal(true);
        }}
        onSendReminder={handleSendReminder}
      />

      <ModalRecordPayment
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSuccess={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
}
