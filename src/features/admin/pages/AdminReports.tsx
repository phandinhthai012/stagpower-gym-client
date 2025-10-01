import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Package,
  Clock,
  MapPin
} from 'lucide-react';
import { mockUsers } from '../../../mockdata/users';
import { mockPayments } from '../../../mockdata/payments';
import { mockCheckIns } from '../../../mockdata/checkIns';
import { mockSubscriptions } from '../../../mockdata/subscriptions';
import { mockPackages } from '../../../mockdata/packages';

export function AdminReports() {
  const [reportType, setReportType] = useState('revenue');
  const [timeRange, setTimeRange] = useState('month');
  const [branchFilter, setBranchFilter] = useState('all');

  // Calculate revenue data
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyRevenue = mockPayments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate member statistics
  const totalMembers = mockUsers.filter(user => user.role === 'Member').length;
  const activeMembers = mockUsers.filter(user => user.role === 'Member' && user.status === 'Active').length;
  const newMembersThisMonth = mockUsers.filter(user => {
    const joinDate = new Date(user.join_date);
    const now = new Date();
    return user.role === 'Member' && 
           joinDate.getMonth() === now.getMonth() && 
           joinDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate check-in statistics
  const totalCheckIns = mockCheckIns.length;
  const activeCheckIns = mockCheckIns.filter(checkIn => checkIn.status === 'Active').length;
  const todayCheckIns = mockCheckIns.filter(checkIn => {
    const checkInDate = new Date(checkIn.check_in_time);
    const today = new Date();
    return checkInDate.toDateString() === today.toDateString();
  }).length;

  // Calculate package statistics
  const activePackages = mockPackages.filter(pkg => pkg.status === 'Active').length;
  const membershipPackages = mockPackages.filter(pkg => pkg.type === 'Membership').length;
  const comboPackages = mockPackages.filter(pkg => pkg.type === 'Combo').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const revenueCards = [
    {
      title: 'Tổng doanh thu',
      value: formatPrice(totalRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Doanh thu tháng này',
      value: formatPrice(monthlyRevenue),
      change: '+8.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Giao dịch thành công',
      value: mockPayments.filter(p => p.payment_status === 'Completed').length,
      change: '+5.1%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Trung bình giao dịch',
      value: formatPrice(totalRevenue / mockPayments.length),
      change: '+2.3%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  const memberCards = [
    {
      title: 'Tổng hội viên',
      value: totalMembers,
      change: '+15.2%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Hội viên hoạt động',
      value: activeMembers,
      change: '+8.7%',
      changeType: 'positive',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Hội viên mới tháng này',
      value: newMembersThisMonth,
      change: '+22.1%',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Tỷ lệ duy trì',
      value: `${((activeMembers / totalMembers) * 100).toFixed(1)}%`,
      change: '+3.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const checkInCards = [
    {
      title: 'Tổng check-in',
      value: totalCheckIns,
      change: '+18.5%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Đang tập hôm nay',
      value: todayCheckIns,
      change: '+12.3%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Hội viên đang tập',
      value: activeCheckIns,
      change: '+6.8%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Tần suất trung bình',
      value: `${(totalCheckIns / totalMembers).toFixed(1)}`,
      change: '+4.2%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  const packageStats = [
    { name: 'Membership', value: membershipPackages, color: 'bg-blue-500' },
    { name: 'Combo', value: comboPackages, color: 'bg-orange-500' },
    { name: 'PT riêng', value: mockPackages.filter(pkg => pkg.type === 'PT').length, color: 'bg-purple-500' },
    { name: 'Gói thử', value: mockPackages.filter(pkg => pkg.is_trial).length, color: 'bg-green-500' }
  ];

  const recentPayments = mockPayments.slice(0, 5);
  const recentCheckIns = mockCheckIns.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Báo cáo & Thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Doanh thu</SelectItem>
                <SelectItem value="members">Hội viên</SelectItem>
                <SelectItem value="checkins">Check-in</SelectItem>
                <SelectItem value="packages">Gói tập</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="quarter">Quý này</SelectItem>
                <SelectItem value="year">Năm này</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                <SelectItem value="govap">Gò Vấp</SelectItem>
                <SelectItem value="district1">Quận 1</SelectItem>
                <SelectItem value="district7">Quận 7</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Reports */}
      {reportType === 'revenue' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-sm font-medium ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Member Reports */}
      {reportType === 'members' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-sm font-medium ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Member Growth Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Tăng trưởng hội viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ tăng trưởng hội viên sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Check-in Reports */}
      {reportType === 'checkins' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checkInCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-sm font-medium ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Check-in Activity Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Biểu đồ hoạt động check-in sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Package Reports */}
      {reportType === 'packages' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng gói tập</p>
                    <p className="text-2xl font-bold text-gray-900">{mockPackages.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Gói đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900">{activePackages}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Gói phổ biến</p>
                    <p className="text-2xl font-bold text-gray-900">VIP 12 tháng</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu từ gói</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Package Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố gói tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packageStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${stat.color}`} />
                      <span className="text-sm font-medium">{stat.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{stat.value} gói</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Giao dịch gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => {
                const member = mockUsers.find(user => user.id === payment.member_id);
                return (
                  <div key={payment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {member?.full_name || 'Hội viên'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(payment.amount)} • {payment.payment_method}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {payment.payment_status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Check-in gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCheckIns.map((checkIn) => {
                const member = mockUsers.find(user => user.id === checkIn.member_id);
                return (
                  <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {member?.full_name || 'Hội viên'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(checkIn.check_in_time).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <Badge className={checkIn.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {checkIn.status === 'Active' ? 'Đang tập' : 'Đã ra'}
                    </Badge>
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
