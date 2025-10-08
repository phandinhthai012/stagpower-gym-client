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
  XCircle
} from 'lucide-react';
import { mockUsers } from '../../../mockdata/users';
import { mockPayments } from '../../../mockdata/payments';
import { mockSubscriptions } from '../../../mockdata/subscriptions';
import { mockPackages } from '../../../mockdata/packages';

export function AdminInvoicePayment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Calculate statistics from mock data
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidInvoices = mockPayments.filter(payment => payment.payment_status === 'Completed').length;
  const pendingInvoices = mockPayments.filter(payment => payment.payment_status === 'Pending').length;
  const overdueInvoices = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    const now = new Date();
    return payment.payment_status === 'Pending' && paymentDate < now;
  }).length;


  // Create invoice data from payments
  const invoices = mockPayments.map(payment => {
    const member = mockUsers.find(user => user.id === payment.member_id);
    const subscription = mockSubscriptions.find(sub => sub.id === payment.subscription_id);
    const packageInfo = mockPackages.find(pkg => subscription?.package_id === pkg.id);
    
    return {
      id: payment.invoice_number,
      member: member?.fullName || 'Unknown',
      package: packageInfo?.name || 'Unknown Package',
      amount: payment.amount,
      originalAmount: payment.original_amount,
      paymentDate: payment.payment_date,
      dueDate: new Date(new Date(payment.payment_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: payment.payment_status,
      paymentMethod: payment.payment_method,
      memberId: payment.member_id
    };
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

  const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleRecordPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleViewInvoice = (invoice: any) => {
    alert(`Xem chi tiết hóa đơn: ${invoice.id}`);
  };

  const handlePrintInvoice = (invoice: any) => {
    alert(`In hóa đơn: ${invoice.id}`);
  };

  const handleSendReminder = (invoice: any) => {
    alert(`Gửi nhắc nhở thanh toán cho hóa đơn: ${invoice.id}`);
  };

  return (
    <div className="space-y-6">

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hóa đơn mới
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Gửi nhắc nhở hàng loạt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Danh sách hóa đơn
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm hóa đơn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
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
                {invoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <span className="font-medium text-blue-600">{invoice.id}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {invoice.member.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{invoice.member}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.package}</p>
                        <p className="text-sm text-gray-500">{invoice.paymentMethod}</p>
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
                      {new Date(invoice.paymentDate).toLocaleDateString('vi-VN')}
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
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        {invoice.status === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleRecordPayment(invoice)}
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
                          >
                            <Bell className="w-4 h-4" />
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tạo Hóa Đơn Mới</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberSelect">Chọn hội viên</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hội viên..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.filter(user => user.role === 'Member').map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.fullName} - {member.id.slice(-4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="packageType">Loại gói</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn gói..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membership">Gói tập</SelectItem>
                        <SelectItem value="PT">Gói PT</SelectItem>
                        <SelectItem value="Combo">Gói Combo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specificPackage">Gói cụ thể</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn gói cụ thể..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPackages.slice(0, 5).map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - {formatPrice(pkg.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Số tiền</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Nhập số tiền..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="createDate">Ngày tạo</Label>
                    <Input
                      id="createDate"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Hạn thanh toán</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Nhập ghi chú..."
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo hóa đơn
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ghi Nhận Thanh Toán</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPaymentModal(false)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Mã hóa đơn</Label>
                    <Input
                      id="invoiceNumber"
                      value={selectedInvoice.id}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Tiền mặt</SelectItem>
                        <SelectItem value="Card">Thẻ tín dụng</SelectItem>
                        <SelectItem value="BankTransfer">Chuyển khoản</SelectItem>
                        <SelectItem value="Momo">Ví MoMo</SelectItem>
                        <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentAmount">Số tiền thanh toán</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      placeholder="Nhập số tiền..."
                      defaultValue={selectedInvoice.amount}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentDate">Ngày thanh toán</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentNotes">Ghi chú thanh toán</Label>
                  <textarea
                    id="paymentNotes"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Nhập ghi chú về thanh toán..."
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ghi nhận thanh toán
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
