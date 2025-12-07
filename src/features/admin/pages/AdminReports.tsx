import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  FileText,
  Settings,
  PieChart,
  Activity,
  Package,
  Printer,
  CheckSquare,
  Clock,
  Target,
  Percent,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePackageStats, useTopActiveMembers, useRevenueStats, usePeakHours } from '../hooks/useReports';
import { usePayments } from '../../member/hooks/usePayments';
import { exportRevenueReportToExcel, exportMemberReportToExcel, exportAttendanceReportToExcel, exportPackageReportToExcel } from '../../../lib/excel-utils';
import { useMembers } from '../../member/hooks/useMembers';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useCheckIns } from '../hooks/useCheckIns';
import { useAllSchedules } from '../hooks/useSchedules';
import { usePackages } from '../hooks/usePackages';
import { useBranches } from '../hooks/useBranches';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';

export function AdminReports() {
  const { user } = useAuth();
  
  // Package stats filters
  const [packageStatsBranch, setPackageStatsBranch] = useState<string>('all');
  const [packageStatsYear, setPackageStatsYear] = useState<number>(new Date().getFullYear());
  const [packageStatsMonth, setPackageStatsMonth] = useState<number | null>(null); // null = cả năm
  
  const { data: packageStats, isLoading: isLoadingPackageStats } = usePackageStats(
    packageStatsBranch,
    packageStatsYear,
    packageStatsMonth
  );
  
  // Top members filters
  const [topMembersYear, setTopMembersYear] = useState<number>(new Date().getFullYear());
  const [topMembersMonth, setTopMembersMonth] = useState<number | null>(null); // null = cả năm
  
  const { data: topMembers, isLoading: isLoadingTopMembers } = useTopActiveMembers(
    10,
    topMembersYear,
    topMembersMonth
  );
  const { data: revenueStats, isLoading: isLoadingRevenueStats } = useRevenueStats();
  const { data: peakHours, isLoading: isLoadingPeakHours } = usePeakHours();
  const { data: paymentsResponse } = usePayments();
  const payments = paymentsResponse?.data || [];
  const { data: membersResponse } = useMembers();
  const { data: subscriptionsResponse } = useSubscriptions();
  const { data: checkInsResponse } = useCheckIns();
  
  const members = (membersResponse && 'success' in membersResponse && membersResponse.success)
    ? membersResponse.data || []
    : Array.isArray(membersResponse) ? membersResponse : [];
  const subscriptions = subscriptionsResponse?.data || [];
  const checkIns = checkInsResponse?.data || [];
  const { data: schedulesResponse } = useAllSchedules();
  const schedules = Array.isArray(schedulesResponse) 
    ? schedulesResponse 
    : (schedulesResponse as any)?.data || [];
  const { data: packagesResponse } = usePackages();
  const packages = packagesResponse?.data || [];
  
  // Tooltip state for donut chart
  const [hoveredPackage, setHoveredPackage] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Tooltip state for revenue chart
  const [hoveredRevenuePoint, setHoveredRevenuePoint] = useState<any>(null);
  const [revenueTooltipPosition, setRevenueTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Year and month selection for revenue chart
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  
  // Branch filter for revenue chart
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const { data: branches = [] } = useBranches();
  
  // Get branch ID from user based on role
  const getUserBranchId = (user: any): string | null => {
    if (!user) return null;
    const role = user.role?.toLowerCase() || user.role;
    
    if (role === 'admin' && user.adminInfo?.branchId) {
      // Admin: branchId can be string or object
      return typeof user.adminInfo.branchId === 'object' 
        ? user.adminInfo.branchId._id 
        : user.adminInfo.branchId;
    }
    
    if ((role === 'staff' || role === 'trainer') && user.staffInfo?.brand_id) {
      // Staff/Trainer: brand_id can be string or object
      return typeof user.staffInfo.brand_id === 'object'
        ? user.staffInfo.brand_id._id
        : user.staffInfo.brand_id;
    }
    
    return null;
  };

  const userBranchId = getUserBranchId(user);
  
  // Branch filter for export revenue report
  const [exportBranchId, setExportBranchId] = useState<string>('all');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  
  // Export report modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  // Auto-select branch when modal opens and userBranchId is provided (similar to ModalQRCheckIn)
  useEffect(() => {
    if (isExportModalOpen && userBranchId && selectedReportType === 'revenue') {
      // Check if user's branch exists in branches list
      const branchExists = branches.some((branch: any) => String(branch._id) === String(userBranchId));
      if (branchExists) {
        setExportBranchId(userBranchId);
      }
    }
  }, [isExportModalOpen, userBranchId, branches, selectedReportType]);
  
  // View mode for each branch (default to year)
  const [branchViewModes, setBranchViewModes] = useState<Record<string, 'year' | 'month'>>({});
  const [branchSelectedMonths, setBranchSelectedMonths] = useState<Record<string, number | null>>({});
  
  // Get first and last day of current month
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  const [dateRange1From, setDateRange1From] = useState<string>(getFirstDayOfMonth());
  const [dateRange1To, setDateRange1To] = useState<string>(getLastDayOfMonth());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000000) {
      return (revenue / 1000000000).toFixed(1) + 'B';
    } else if (revenue >= 1000000) {
      return (revenue / 1000000).toFixed(1) + 'M';
    } else if (revenue >= 1000) {
      return (revenue / 1000).toFixed(1) + 'K';
    }
    return revenue.toString();
  };

  // Calculate total for percentage
  const totalSold = packageStats?.packageStats.reduce((sum: number, pkg: any) => sum + pkg.count, 0) || 1;
  const totalRevenue = packageStats?.packageStats.reduce((sum: number, pkg: any) => sum + pkg.revenue, 0) || 0;

  // Helper function to get branchId from payment
  const getPaymentBranchId = (payment: any): string | null => {
    // Try to get branchId from subscription
    const subId = payment.subscriptionId?._id || payment.subscriptionId;
    if (!subId) return null;
    
    const subscription = subscriptions.find((sub: any) => 
      String(sub._id) === String(subId)
    );
    
    if (subscription) {
      return subscription.branchId?._id || subscription.branchId || null;
    }
    return null;
  };

  // Filter payments by branch
  const filteredPayments = selectedBranch === 'all' 
    ? payments 
    : payments.filter((payment: any) => {
        const paymentBranchId = getPaymentBranchId(payment);
        return String(paymentBranchId) === String(selectedBranch);
      });

  // Calculate revenue stats for filtered payments
  const calculateRevenueByBranch = (branchId: string | 'all', paymentList: any[]) => {
    const branchPayments = branchId === 'all' 
      ? paymentList 
      : paymentList.filter((payment: any) => {
          const paymentBranchId = getPaymentBranchId(payment);
          return String(paymentBranchId) === String(branchId);
        });

    const monthlyData: Record<string, number> = {};
    const currentYear = selectedYear;
    
    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }
    
    // Sum payments by month
    branchPayments
      .filter((payment: any) => (payment.paymentStatus || payment.status) === 'Completed')
      .forEach((payment: any) => {
        const date = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
        if (date.getFullYear() === currentYear) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[monthKey] += payment.amount || 0;
        }
      });
    
    // Convert to array format for chart
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue], index) => ({
        month: `T${index + 1}`,
        revenue: revenue / 1000000, // Convert to millions
        fullDate: key,
      }));
  };

  // Calculate revenue stats for current selection
  const currentRevenueStats = React.useMemo(() => {
    const monthlyRevenue = calculateRevenueByBranch(selectedBranch, payments);
    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const averageRevenue = monthlyRevenue.length > 0 ? totalRevenue / monthlyRevenue.length : 0;

    // Calculate revenue growth
    const lastMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
    const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
    const revenueGrowth = prevMonth > 0 ? (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1) : '0';

    // Calculate completed vs total payments
    const branchPayments = selectedBranch === 'all' 
      ? payments 
      : payments.filter((payment: any) => {
          const paymentBranchId = getPaymentBranchId(payment);
          return String(paymentBranchId) === String(selectedBranch);
        });
    const completedPayments = branchPayments.filter((p: any) => (p.paymentStatus || p.status) === 'Completed').length;
    const totalPayments = branchPayments.length;
    const successRate = totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0;

    return {
      monthlyRevenue,
      totalRevenue,
      averageRevenue,
      revenueGrowth,
      completedPayments,
      totalPayments,
      successRate,
    };
  }, [selectedBranch, payments, subscriptions, selectedYear]);

  // Handle export package report
  const handleExportPackageReport = () => {
    try {
      // Validate date range if provided
      if (dateRange1From && dateRange1To) {
        if (new Date(dateRange1From) > new Date(dateRange1To)) {
          toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
          return;
        }
      }

      exportPackageReportToExcel({
        packages,
        subscriptions,
        payments,
        members,
        dateRange: dateRange1From && dateRange1To ? {
          from: dateRange1From,
          to: dateRange1To,
        } : undefined,
      });
      toast.success('Đã xuất báo cáo gói dịch vụ thành công');
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting package report:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  // Handle export attendance report
  const handleExportAttendanceReport = () => {
    try {
      // Validate date range
      if (!dateRange1From || !dateRange1To) {
        toast.error('Vui lòng chọn khoảng thời gian');
        return;
      }

      if (new Date(dateRange1From) > new Date(dateRange1To)) {
        toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return;
      }

      exportAttendanceReportToExcel({
        checkIns,
        schedules,
        members,
        dateRange1: {
          from: dateRange1From,
          to: dateRange1To,
        },
      });
      toast.success('Đã xuất báo cáo tham gia thành công');
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting attendance report:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  // Handle export member report
  const handleExportMemberReport = () => {
    try {
      // Validate date range if provided
      if (dateRange1From && dateRange1To) {
        if (new Date(dateRange1From) > new Date(dateRange1To)) {
          toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
          return;
        }
      }

      exportMemberReportToExcel({
        members,
        subscriptions,
        checkIns,
        payments,
        dateRange: dateRange1From && dateRange1To ? {
          from: dateRange1From,
          to: dateRange1To,
        } : undefined,
      });
      toast.success('Đã xuất báo cáo hội viên thành công');
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting member report:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  // Handle export revenue report
  const handleExportRevenueReport = () => {
    try {
      // Validate date range
      if (!dateRange1From || !dateRange1To) {
        toast.error('Vui lòng chọn khoảng thời gian');
        return;
      }

      if (new Date(dateRange1From) > new Date(dateRange1To)) {
        toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return;
      }

      exportRevenueReportToExcel({
        payments,
        branches,
        branchId: exportBranchId,
        dateRange1: {
          from: dateRange1From,
          to: dateRange1To,
        },
      });
      toast.success('Đã xuất báo cáo doanh thu thành công');
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Error exporting revenue report:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất và doanh thu</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedReportType('revenue');
              setIsExportModalOpen(true);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Revenue Chart - Conditional Layout */}
      {selectedBranch === 'all' ? (
        // Layout 2 cột khi chọn "Tất cả chi nhánh"
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biểu đồ tổng - Bên trái (1/3 width) */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {viewMode === 'year' ? 'Tổng doanh thu' : `Tổng T${selectedMonth}/${selectedYear}`}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Branch Filter */}
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                        {branches.map((branch: any) => (
                          <SelectItem key={branch._id} value={branch._id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {viewMode === 'year' ? (
                    (() => {
                      const monthlyRevenues = currentRevenueStats?.monthlyRevenue || [];
                      const maxMonthlyRevenue = monthlyRevenues.length > 0
                        ? Math.max(...monthlyRevenues.map((data: any) => data.revenue || 0))
                        : 1;
                      const maxRevenue = maxMonthlyRevenue * 1.2 || 1;
                      
                      const yAxisLabels = [];
                      const yAxisPositions = [];
                      const numLabels = 4;
                      
                      for (let i = 0; i < numLabels; i++) {
                        const value = (maxRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                        const yPos = 30 + (i * 50);
                        yAxisLabels.push(value);
                        yAxisPositions.push(yPos);
                      }
                      
                      const formatYLabel = (value: number): string => {
                        if (value >= 1000) {
                          return (value / 1000).toFixed(1) + 'B';
                        } else if (value >= 1) {
                          return value.toFixed(1) + 'M';
                        } else if (value >= 0.001) {
                          return (value * 1000).toFixed(0) + 'K';
                        }
                        return value.toFixed(0);
                      };
                      
                      return (
                        <svg 
                          className="w-full h-full" 
                          viewBox="0 0 400 250"
                          onMouseLeave={() => setHoveredRevenuePoint(null)}
                        >
                          {yAxisLabels.map((label, i) => (
                            <text key={i} x="8" y={yAxisPositions[i]} className="text-xs fill-gray-500" style={{ fontSize: '10px' }}>
                              {formatYLabel(label)}
                            </text>
                          ))}
                          
                          {yAxisPositions.map((yPos, i) => (
                            <line 
                              key={i}
                              x1="35" 
                              y1={yPos} 
                              x2="380" 
                              y2={yPos} 
                              stroke="#e5e7eb" 
                              strokeWidth="1" 
                            />
                          ))}
                          
                          {currentRevenueStats?.monthlyRevenue && (
                            <>
                              <polyline
                                points={currentRevenueStats.monthlyRevenue.map((data: any, i: number) => {
                                  const x = 35 + (i * 30);
                                  const y = 190 - ((data.revenue || 0) / maxRevenue * 160);
                                  return `${x},${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {currentRevenueStats.monthlyRevenue.map((data: any, i: number) => {
                                const x = 35 + (i * 30);
                                const y = 190 - ((data.revenue || 0) / maxRevenue * 160);
                                return (
                                  <g key={i}>
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="4"
                                      fill="#3b82f6"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      className="cursor-pointer"
                                      onClick={() => {
                                        setSelectedMonth(i + 1);
                                        setViewMode('month');
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.setAttribute('r', '5');
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setHoveredRevenuePoint({
                                          month: data.month,
                                          revenue: data.revenue * 1000000,
                                          type: 'month'
                                        });
                                        setRevenueTooltipPosition({
                                          x: rect.left + rect.width / 2,
                                          y: rect.top - 10
                                        });
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.setAttribute('r', '4');
                                        setHoveredRevenuePoint(null);
                                      }}
                                    />
                                  </g>
                                );
                              })}
                            </>
                          )}
                          
                          {currentRevenueStats?.monthlyRevenue.map((data: any, i: number) => (
                            <text
                              key={i}
                              x={35 + (i * 30)}
                              y="220"
                              className="text-xs fill-gray-500 cursor-pointer"
                              textAnchor="middle"
                              style={{ fontSize: '9px' }}
                              onClick={() => {
                                setSelectedMonth(i + 1);
                                setViewMode('month');
                              }}
                            >
                              {data.month}
                            </text>
                          ))}
                        </svg>
                      );
                    })()
                  ) : (
                    (() => {
                      const daysInMonth = new Date(selectedYear, selectedMonth || 0, 0).getDate();
                      const dailyRevenueMap: Record<number, number> = {};
                      
                      for (let day = 1; day <= daysInMonth; day++) {
                        dailyRevenueMap[day] = 0;
                      }
                      
                      const monthPayments = filteredPayments.filter((payment: any) => {
                        const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                        return paymentDate.getFullYear() === selectedYear &&
                               paymentDate.getMonth() === (selectedMonth! - 1) &&
                               (payment.paymentStatus || payment.status) === 'Completed';
                      });
                      
                      monthPayments.forEach((payment: any) => {
                        const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                        const day = paymentDate.getDate();
                        if (day >= 1 && day <= daysInMonth) {
                          dailyRevenueMap[day] = (dailyRevenueMap[day] || 0) + (payment.amount || 0);
                        }
                      });
                      
                      const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        return {
                          day,
                          revenue: (dailyRevenueMap[day] || 0) / 1000000
                        };
                      });
                      
                      const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 0.1) * 1.2 || 1;
                      const spacing = 350 / daysInMonth;
                      
                      const yAxisLabels = [];
                      const yAxisPositions = [];
                      const numLabels = 4;
                      
                      for (let i = 0; i < numLabels; i++) {
                        const value = (maxRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                        const yPos = 30 + (i * 50);
                        yAxisLabels.push(value);
                        yAxisPositions.push(yPos);
                      }
                      
                      const formatYLabel = (value: number): string => {
                        if (value >= 1000) {
                          return (value / 1000).toFixed(1) + 'B';
                        } else if (value >= 1) {
                          return value.toFixed(1) + 'M';
                        } else if (value >= 0.001) {
                          return (value * 1000).toFixed(0) + 'K';
                        }
                        return value.toFixed(0);
                      };
                      
                      return (
                        <svg 
                          className="w-full h-full" 
                          viewBox="0 0 400 250"
                          onMouseLeave={() => setHoveredRevenuePoint(null)}
                        >
                          {yAxisLabels.map((label, i) => (
                            <text key={i} x="8" y={yAxisPositions[i]} className="text-xs fill-gray-500" style={{ fontSize: '10px' }}>
                              {formatYLabel(label)}
                            </text>
                          ))}
                          
                          {yAxisPositions.map((yPos, i) => (
                            <line 
                              key={i}
                              x1="35" 
                              y1={yPos} 
                              x2="380" 
                              y2={yPos} 
                              stroke="#e5e7eb" 
                              strokeWidth="1" 
                            />
                          ))}
                          
                          <polyline
                            points={dailyData.map((data, i) => {
                              const x = 35 + (i * spacing);
                              const y = 190 - (data.revenue / maxRevenue * 160);
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          <polygon
                            points={`35,190 ${dailyData.map((data, i) => {
                              const x = 35 + (i * spacing);
                              const y = 190 - (data.revenue / maxRevenue * 160);
                              return `${x},${y}`;
                            }).join(' ')} ${35 + ((daysInMonth - 1) * spacing)},190`}
                            fill="url(#gradient-small)"
                            opacity="0.3"
                          />
                          
                          <defs>
                            <linearGradient id="gradient-small" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>
                          
                          {dailyData.map((data, i) => {
                            const x = 35 + (i * spacing);
                            const y = 190 - (data.revenue / maxRevenue * 160);
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="2.5"
                                fill="#10b981"
                                stroke="white"
                                strokeWidth="1"
                                className="cursor-pointer"
                                onMouseEnter={(e) => {
                                  e.currentTarget.setAttribute('r', '4');
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const actualRevenue = data.revenue * 1000000;
                                  setHoveredRevenuePoint({
                                    day: data.day,
                                    revenue: actualRevenue,
                                    month: selectedMonth,
                                    year: selectedYear,
                                    type: 'day'
                                  });
                                  setRevenueTooltipPosition({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 10
                                  });
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.setAttribute('r', '2.5');
                                  setHoveredRevenuePoint(null);
                                }}
                              />
                            );
                          })}
                          
                          {dailyData.map((data, i) => {
                            const x = 35 + (i * spacing);
                            return (
                              <text
                                key={i}
                                x={x}
                                y="220"
                                className="text-xs fill-gray-500"
                                textAnchor="middle"
                                style={{ fontSize: '8px' }}
                              >
                                {data.day}
                              </text>
                            );
                          })}
                        </svg>
                      );
                    })()
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biểu đồ từng branch - Bên phải (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Doanh thu theo từng chi nhánh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto overflow-x-hidden pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    {branches.map((branch: any) => {
                  const branchRevenue = calculateRevenueByBranch(branch._id, payments);
                  const maxBranchRevenue = branchRevenue.length > 0
                    ? Math.max(...branchRevenue.map((data: any) => data.revenue || 0))
                    : 1;
                  const maxRevenue = maxBranchRevenue * 1.2 || 1;

                  const yAxisLabels = [];
                  const yAxisPositions = [];
                  const numLabels = 4;
                  
                  for (let i = 0; i < numLabels; i++) {
                    const value = (maxRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                    const yPos = 25 + (i * 45);
                    yAxisLabels.push(value);
                    yAxisPositions.push(yPos);
                  }
                  
                  const formatYLabel = (value: number): string => {
                    if (value >= 1000) {
                      return (value / 1000).toFixed(1) + 'B';
                    } else if (value >= 1) {
                      return value.toFixed(1) + 'M';
                    } else if (value >= 0.001) {
                      return (value * 1000).toFixed(0) + 'K';
                    }
                    return value.toFixed(0);
                  };

                  const branchViewMode = branchViewModes[branch._id] || 'year';
                  const branchSelectedMonth = branchSelectedMonths[branch._id] || null;
                  
                  // Filter payments for this branch
                  const branchPayments = payments.filter((payment: any) => {
                    const paymentBranchId = getPaymentBranchId(payment);
                    return String(paymentBranchId) === String(branch._id);
                  });

                  return (
                    <Card key={branch._id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            {branch.name}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            {branchViewMode === 'month' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setBranchViewModes(prev => ({ ...prev, [branch._id]: 'year' }));
                                  setBranchSelectedMonths(prev => ({ ...prev, [branch._id]: null }));
                                }}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </Button>
                            )}
                            {branchViewMode === 'month' && branchSelectedMonth && (
                              <span className="text-xs font-medium text-gray-700 min-w-[50px] text-center">
                                T{branchSelectedMonth}/{selectedYear}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="h-48 relative">
                          {branchViewMode === 'year' ? (
                            <svg 
                              className="w-full h-full" 
                              viewBox="0 0 350 200"
                            >
                              {yAxisLabels.map((label, i) => (
                                <text key={i} x="8" y={yAxisPositions[i]} className="text-xs fill-gray-500" style={{ fontSize: '9px' }}>
                                  {formatYLabel(label)}
                                </text>
                              ))}
                              
                              {yAxisPositions.map((yPos, i) => (
                                <line 
                                  key={i}
                                  x1="30" 
                                  y1={yPos} 
                                  x2="330" 
                                  y2={yPos} 
                                  stroke="#e5e7eb" 
                                  strokeWidth="1" 
                                />
                              ))}
                              
                              {branchRevenue.length > 0 && (
                                <>
                                  <polyline
                                    points={branchRevenue.map((data: any, i: number) => {
                                      const x = 30 + (i * 25);
                                      const y = 170 - ((data.revenue || 0) / maxRevenue * 145);
                                      return `${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  {branchRevenue.map((data: any, i: number) => {
                                    const x = 30 + (i * 25);
                                    const y = 170 - ((data.revenue || 0) / maxRevenue * 145);
                                    return (
                                      <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="3"
                                        fill="#3b82f6"
                                        stroke="white"
                                        strokeWidth="1"
                                        className="cursor-pointer"
                                        onClick={() => {
                                          setBranchViewModes(prev => ({ ...prev, [branch._id]: 'month' }));
                                          setBranchSelectedMonths(prev => ({ ...prev, [branch._id]: i + 1 }));
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}
                              
                              {branchRevenue.map((data: any, i: number) => (
                                <text
                                  key={i}
                                  x={30 + (i * 25)}
                                  y="190"
                                  className="text-xs fill-gray-500 cursor-pointer hover:fill-blue-600"
                                  textAnchor="middle"
                                  style={{ fontSize: '8px' }}
                                  onClick={() => {
                                    setBranchViewModes(prev => ({ ...prev, [branch._id]: 'month' }));
                                    setBranchSelectedMonths(prev => ({ ...prev, [branch._id]: i + 1 }));
                                  }}
                                >
                                  {data.month}
                                </text>
                              ))}
                            </svg>
                          ) : (
                            (() => {
                              const daysInMonth = new Date(selectedYear, branchSelectedMonth || 0, 0).getDate();
                              const dailyRevenueMap: Record<number, number> = {};
                              
                              for (let day = 1; day <= daysInMonth; day++) {
                                dailyRevenueMap[day] = 0;
                              }
                              
                              const monthPayments = branchPayments.filter((payment: any) => {
                                const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                                return paymentDate.getFullYear() === selectedYear &&
                                       paymentDate.getMonth() === (branchSelectedMonth! - 1) &&
                                       (payment.paymentStatus || payment.status) === 'Completed';
                              });
                              
                              monthPayments.forEach((payment: any) => {
                                const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                                const day = paymentDate.getDate();
                                if (day >= 1 && day <= daysInMonth) {
                                  dailyRevenueMap[day] = (dailyRevenueMap[day] || 0) + (payment.amount || 0);
                                }
                              });
                              
                              const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
                                const day = i + 1;
                                return {
                                  day,
                                  revenue: (dailyRevenueMap[day] || 0) / 1000000
                                };
                              });
                              
                              const maxDailyRevenue = Math.max(...dailyData.map(d => d.revenue), 0.1) * 1.2 || 1;
                              const spacing = 310 / daysInMonth;
                              
                              const dailyYAxisLabels = [];
                              const dailyYAxisPositions = [];
                              const numLabels = 4;
                              
                              for (let i = 0; i < numLabels; i++) {
                                const value = (maxDailyRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                                const yPos = 25 + (i * 45);
                                dailyYAxisLabels.push(value);
                                dailyYAxisPositions.push(yPos);
                              }
                              
                              return (
                                <svg 
                                  className="w-full h-full" 
                                  viewBox="0 0 350 200"
                                >
                                  {dailyYAxisLabels.map((label, i) => (
                                    <text key={i} x="8" y={dailyYAxisPositions[i]} className="text-xs fill-gray-500" style={{ fontSize: '9px' }}>
                                      {formatYLabel(label)}
                                    </text>
                                  ))}
                                  
                                  {dailyYAxisPositions.map((yPos, i) => (
                                    <line 
                                      key={i}
                                      x1="30" 
                                      y1={yPos} 
                                      x2="330" 
                                      y2={yPos} 
                                      stroke="#e5e7eb" 
                                      strokeWidth="1" 
                                    />
                                  ))}
                                  
                                  <polyline
                                    points={dailyData.map((data, i) => {
                                      const x = 30 + (i * spacing);
                                      const y = 170 - (data.revenue / maxDailyRevenue * 145);
                                      return `${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  
                                  <defs>
                                    <linearGradient id={`gradient-branch-${branch._id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                                    </linearGradient>
                                  </defs>
                                  
                                  <polygon
                                    points={`30,170 ${dailyData.map((data, i) => {
                                      const x = 30 + (i * spacing);
                                      const y = 170 - (data.revenue / maxDailyRevenue * 145);
                                      return `${x},${y}`;
                                    }).join(' ')} ${30 + ((daysInMonth - 1) * spacing)},170`}
                                    fill={`url(#gradient-branch-${branch._id})`}
                                    opacity="0.3"
                                  />
                                  
                                  {dailyData.map((data, i) => {
                                    const x = 30 + (i * spacing);
                                    const y = 170 - (data.revenue / maxDailyRevenue * 145);
                                    return (
                                      <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        fill="#10b981"
                                        stroke="white"
                                        strokeWidth="1"
                                      />
                                    );
                                  })}
                                  
                                  {dailyData.map((data, i) => {
                                    const x = 30 + (i * spacing);
                                    return (
                                      <text
                                        key={i}
                                        x={x}
                                        y="190"
                                        className="text-xs fill-gray-500"
                                        textAnchor="middle"
                                        style={{ fontSize: '7px' }}
                                      >
                                        {data.day}
                                      </text>
                                    );
                                  })}
                                </svg>
                              );
                            })()
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Full width khi chọn branch cụ thể
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
                {viewMode === 'year' ? 'Biểu đồ doanh thu' : `Doanh thu tháng ${selectedMonth}/${selectedYear}`}
          </CardTitle>
              <div className="flex items-center gap-3">
                {/* Branch Filter */}
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Back to Year View Button */}
                {viewMode === 'month' && (
                  <div className="relative group">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setViewMode('year');
                        setSelectedMonth(null);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {/* Tooltip */}
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Quay lại xem năm
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Year Selector */}
                {viewMode === 'year' && (
                  <div className="flex items-center gap-2 border rounded-lg px-2 py-1 bg-white">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-gray-100"
                      onClick={() => setSelectedYear(prev => prev - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-semibold text-gray-700 min-w-[60px] text-center">
                      Năm {selectedYear}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-gray-100"
                      onClick={() => setSelectedYear(prev => prev + 1)}
                      disabled={selectedYear >= new Date().getFullYear()}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {/* Month Selector (when in month view) */}
                {viewMode === 'month' && (
                  <div className="flex items-center gap-2 border rounded-lg px-2 py-1 bg-white">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-gray-100"
                      onClick={() => {
                        if (selectedMonth && selectedMonth > 1) {
                          setSelectedMonth(selectedMonth - 1);
                        } else {
                          setSelectedMonth(12);
                          setSelectedYear(selectedYear - 1);
                        }
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-semibold text-gray-700 min-w-[90px] text-center">
                      T{selectedMonth}/{selectedYear}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-gray-100"
                      onClick={() => {
                        if (selectedMonth && selectedMonth < 12) {
                          setSelectedMonth(selectedMonth + 1);
                        } else {
                          setSelectedMonth(1);
                          setSelectedYear(selectedYear + 1);
                        }
                      }}
                      disabled={selectedYear === new Date().getFullYear() && selectedMonth && selectedMonth >= new Date().getMonth() + 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {viewMode === 'year' ? (
                (() => {
                  // Calculate max revenue from actual data
                  const monthlyRevenues = currentRevenueStats?.monthlyRevenue || [];
                  const maxMonthlyRevenue = monthlyRevenues.length > 0
                    ? Math.max(...monthlyRevenues.map((data: any) => data.revenue || 0))
                    : 1;
                  const maxRevenue = maxMonthlyRevenue * 1.2 || 1; // Add 20% padding
                  
                  // Create Y-axis labels based on actual data
                  const yAxisLabels = [];
                  const yAxisPositions = [];
                  const numLabels = 4; // 4 labels on Y-axis
                  
                  for (let i = 0; i < numLabels; i++) {
                    const value = (maxRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                    const yPos = 30 + (i * 60); // 30, 90, 150, 210
                    yAxisLabels.push(value);
                    yAxisPositions.push(yPos);
                  }
                  
                  // Format Y-axis label
                  const formatYLabel = (value: number): string => {
                    if (value >= 1000) {
                      return (value / 1000).toFixed(1) + 'B';
                    } else if (value >= 1) {
                      return value.toFixed(1) + 'M';
                    } else if (value >= 0.001) {
                      return (value * 1000).toFixed(0) + 'K';
                    }
                    return value.toFixed(0);
                  };
                  
                  return (
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 600 300"
                      onMouseLeave={() => setHoveredRevenuePoint(null)}
                    >
                      {/* Y-axis labels - dynamic based on actual data */}
                      {yAxisLabels.map((label, i) => (
                        <text key={i} x="10" y={yAxisPositions[i]} className="text-xs fill-gray-500">
                          {formatYLabel(label)}
                        </text>
                      ))}
                      
                      {/* Grid lines */}
                      {yAxisPositions.map((yPos, i) => (
                        <line 
                          key={i}
                          x1="50" 
                          y1={yPos} 
                          x2="580" 
                          y2={yPos} 
                          stroke="#e5e7eb" 
                          strokeWidth="1" 
                        />
                      ))}
                      
                      {/* Revenue line */}
                      {currentRevenueStats?.monthlyRevenue && (
                        <>
                          <polyline
                            points={currentRevenueStats.monthlyRevenue.map((data: any, i: number) => {
                              const x = 50 + (i * 44);
                              const y = 210 - ((data.revenue || 0) / maxRevenue * 180);
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Data points */}
                          {currentRevenueStats.monthlyRevenue.map((data: any, i: number) => {
                            const x = 50 + (i * 44);
                            const y = 210 - ((data.revenue || 0) / maxRevenue * 180);
                            return (
                              <g key={i}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="6"
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="2"
                                  className="cursor-pointer transition-all"
                                  style={{ transition: 'all 0.2s' }}
                                  onClick={() => {
                                    setSelectedMonth(i + 1);
                                    setViewMode('month');
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.setAttribute('r', '8');
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setHoveredRevenuePoint({
                                      month: data.month,
                                      revenue: data.revenue * 1000000,
                                      type: 'month'
                                    });
                                    setRevenueTooltipPosition({
                                      x: rect.left + rect.width / 2,
                                      y: rect.top - 10
                                    });
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.setAttribute('r', '6');
                                    setHoveredRevenuePoint(null);
                                  }}
                                />
                              </g>
                            );
                          })}
                        </>
                      )}
                      
                      {/* X-axis labels */}
                      {currentRevenueStats?.monthlyRevenue.map((data: any, i: number) => (
                        <text
                          key={i}
                          x={50 + (i * 44)}
                          y="240"
                          className="text-xs fill-gray-500 cursor-pointer hover:fill-blue-600"
                          textAnchor="middle"
                          onClick={() => {
                            setSelectedMonth(i + 1);
                            setViewMode('month');
                          }}
                        >
                          {data.month}
                        </text>
                      ))}
                    </svg>
                  );
                })()
              ) : (
                (() => {
                  const daysInMonth = new Date(selectedYear, selectedMonth || 0, 0).getDate();
                  
                  // Calculate actual daily revenue from payments
                  const dailyRevenueMap: Record<number, number> = {};
                  
                  // Initialize all days with 0
                  for (let day = 1; day <= daysInMonth; day++) {
                    dailyRevenueMap[day] = 0;
                  }
                  
                  // Filter payments for the selected month and year
                  const monthPayments = filteredPayments.filter((payment: any) => {
                    const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                    return paymentDate.getFullYear() === selectedYear &&
                           paymentDate.getMonth() === (selectedMonth! - 1) &&
                           (payment.paymentStatus || payment.status) === 'Completed';
                  });
                  
                  // Group payments by day
                  monthPayments.forEach((payment: any) => {
                    const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
                    const day = paymentDate.getDate();
                    if (day >= 1 && day <= daysInMonth) {
                      dailyRevenueMap[day] = (dailyRevenueMap[day] || 0) + (payment.amount || 0);
                    }
                  });
                  
                  // Convert to array format
                  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    return {
                      day,
                      revenue: (dailyRevenueMap[day] || 0) / 1000000 // Convert to millions for display
                    };
                  });
                  
                  // Calculate max revenue and create Y-axis scale
                  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 0.1) * 1.2 || 1;
                  const spacing = 530 / daysInMonth;
                  
                  // Create Y-axis labels based on actual data
                  const yAxisLabels = [];
                  const yAxisPositions = [];
                  const numLabels = 4; // 4 labels on Y-axis
                  
                  for (let i = 0; i < numLabels; i++) {
                    const value = (maxRevenue / (numLabels - 1)) * (numLabels - 1 - i);
                    const yPos = 30 + (i * 60); // 30, 90, 150, 210
                    yAxisLabels.push(value);
                    yAxisPositions.push(yPos);
                  }
                  
                  // Format Y-axis label
                  const formatYLabel = (value: number): string => {
                    if (value >= 1000) {
                      return (value / 1000).toFixed(1) + 'B';
                    } else if (value >= 1) {
                      return value.toFixed(1) + 'M';
                    } else if (value >= 0.001) {
                      return (value * 1000).toFixed(0) + 'K';
                    }
                    return value.toFixed(0);
                  };
                  
                  return (
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 600 300"
                      onMouseLeave={() => setHoveredRevenuePoint(null)}
                    >
                      {/* Y-axis labels - dynamic based on actual data */}
                      {yAxisLabels.map((label, i) => (
                        <text key={i} x="10" y={yAxisPositions[i]} className="text-xs fill-gray-500">
                          {formatYLabel(label)}
                        </text>
                      ))}
                      
                      {/* Grid lines */}
                      {yAxisPositions.map((yPos, i) => (
                        <line 
                          key={i}
                          x1="50" 
                          y1={yPos} 
                          x2="580" 
                          y2={yPos} 
                          stroke="#e5e7eb" 
                          strokeWidth="1" 
                        />
                      ))}
                      
                      {/* Revenue line */}
                      <polyline
                        points={dailyData.map((data, i) => {
                          const x = 50 + (i * spacing);
                          const y = 210 - (data.revenue / maxRevenue * 180);
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Area fill */}
                      <polygon
                        points={`50,210 ${dailyData.map((data, i) => {
                          const x = 50 + (i * spacing);
                          const y = 210 - (data.revenue / maxRevenue * 180);
                          return `${x},${y}`;
                        }).join(' ')} ${50 + ((daysInMonth - 1) * spacing)},210`}
                        fill="url(#gradient)"
                        opacity="0.3"
                      />
                      
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      
                      {/* Data points - show all days */}
                      {dailyData.map((data, i) => {
                        const x = 50 + (i * spacing);
                        const y = 210 - (data.revenue / maxRevenue * 180);
                        return (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#10b981"
                              stroke="white"
                              strokeWidth="1.5"
                              className="cursor-pointer transition-all"
                              onMouseEnter={(e) => {
                                e.currentTarget.setAttribute('r', '5');
                                const rect = e.currentTarget.getBoundingClientRect();
                                // Calculate actual revenue in VND (convert back from millions)
                                const actualRevenue = data.revenue * 1000000;
                                setHoveredRevenuePoint({
                                  day: data.day,
                                  revenue: actualRevenue,
                                  month: selectedMonth,
                                  year: selectedYear,
                                  type: 'day'
                                });
                                setRevenueTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.setAttribute('r', '3');
                                setHoveredRevenuePoint(null);
                              }}
                            />
                          </g>
                        );
                      })}
                      
                      {/* X-axis labels - show all days */}
                      {dailyData.map((data, i) => {
                        const x = 50 + (i * spacing);
                        return (
                          <text
                            key={i}
                            x={x}
                            y="240"
                            className="text-xs fill-gray-500"
                            textAnchor="middle"
                            style={{ fontSize: '9px' }}
                          >
                            {data.day}
                          </text>
                        );
                      })}
                    </svg>
                  );
                })()
              )}
              
          </div>
        </CardContent>
      </Card>
      )}

      {/* Package Stats & Top Members Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Distribution & Effectiveness - Bên trái */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Thống kê gói dịch vụ
              </CardTitle>
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Select value={packageStatsBranch} onValueChange={setPackageStatsBranch}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={packageStatsYear.toString()} 
                  onValueChange={(value) => setPackageStatsYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={packageStatsMonth?.toString() || 'all'} 
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setPackageStatsMonth(null);
                    } else {
                      setPackageStatsMonth(parseInt(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Chọn tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cả năm</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        Tháng {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Layout: Chart bên trái, Insights bên phải */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phân bố gói dịch vụ - Bên trái */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-600" />
                    Phân bố gói dịch vụ
                  </h3>
                  <div className="h-48 flex items-center justify-center relative">
                    <div className="relative w-40 h-40">
                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full transform -rotate-90"
                    onMouseLeave={() => setHoveredPackage(null)}
                  >
                    {packageStats?.packageStats.slice(0, 5).map((pkg: any, index: number) => {
                      const percentage = (pkg.count / totalSold) * 100;
                      const colors = ['#10b981', '#3b82f6', '#f97316', '#a855f7', '#ef4444'];
                      const startAngle = packageStats.packageStats
                        .slice(0, index)
                        .reduce((sum: number, p: any) => sum + (p.count / totalSold) * 360, 0);
                      const endAngle = startAngle + (percentage / 100) * 360;
                      
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);
                      
                      const largeArc = percentage > 50 ? 1 : 0;
                      
              return (
                        <path
                          key={index}
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={colors[index]}
                          opacity={hoveredPackage?.packageName === pkg.packageName ? "1" : "0.9"}
                          className="cursor-pointer transition-all duration-200 hover:opacity-100"
                          style={{
                            filter: hoveredPackage?.packageName === pkg.packageName ? 'brightness(1.1)' : 'none',
                            transform: hoveredPackage?.packageName === pkg.packageName ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center',
                          }}
                          onMouseEnter={(e) => {
                            setHoveredPackage(pkg);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10
                            });
                          }}
                        />
                      );
                    })}
                    {/* Inner circle for donut effect */}
                    <circle cx="100" cy="100" r="50" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center transform rotate-0">
                          <p className="text-2xl font-bold text-gray-900">{totalSold}</p>
                      <p className="text-xs text-gray-600 font-medium">Lượt đăng ký</p>
                        </div>
                    </div>
                  </div>
                </div>
          </div>

                {/* Insights */}
                <div className="pt-18">
                  {packageStats && packageStats.packageStats.length > 0 && (
              <div className="space-y-3">
                      <div className="flex items-start gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Phổ biến nhất: </span>
                          <span className="text-green-600 font-semibold">
                            {packageStats.mostPopular?.packageName} ({packageStats.mostPopular?.count} lượt)
                          </span>
                </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <TrendingDown className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Cần cải thiện: </span>
                          <span className="text-red-600 font-semibold">
                            {packageStats.leastPopular?.packageName} ({packageStats.leastPopular?.count} lượt)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Target className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Giữ chân tốt: </span>
                          <span className="text-blue-600 font-semibold">
                            {(() => {
                              const bestRetention = [...packageStats.packageStats].sort((a: any, b: any) => 
                                parseFloat(b.retentionRate) - parseFloat(a.retentionRate)
                              )[0];
                              return `${bestRetention?.packageName} (${bestRetention?.retentionRate}%)`;
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <DollarSign className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Doanh thu cao: </span>
                          <span className="text-purple-600 font-semibold">
                            {(() => {
                              const highestRevenue = [...packageStats.packageStats].sort((a: any, b: any) => 
                                b.revenue - a.revenue
                              )[0];
                              return `${highestRevenue?.packageName} (${formatRevenue(highestRevenue?.revenue)})`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hiệu quả gói dịch vụ - Table ở dưới */}
              <div className="pt-4 border-t">
                <div className="overflow-x-auto overflow-y-auto max-h-64">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Màu</th>
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Gói dịch vụ</th>
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Đã đăng ký</th>
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Đã thanh toán</th>
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Doanh thu</th>
                        <th className="text-left p-2 font-medium text-gray-600 text-xs">Tỷ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageStats?.packageStats.map((pkg: any, index: number) => {
                        const percentage = ((pkg.count / totalSold) * 100).toFixed(1);
                        const colors = ['#10b981', '#3b82f6', '#f97316', '#a855f7', '#ef4444'];
                        const color = colors[index] || '#9ca3af';
                        
              return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                {index === 0 && <TrendingUp className="w-3 h-3 text-green-600" />}
                                {index === packageStats.packageStats.length - 1 && <TrendingDown className="w-3 h-3 text-red-600" />}
                                <span className="text-xs font-medium text-gray-900 truncate max-w-[100px]" title={pkg.packageName}>
                          {pkg.packageName}
                          </span>
                      </div>
                            </td>
                            <td className="p-2">
                              <span className="text-xs font-semibold text-gray-900">{pkg.count}</span>
                            </td>
                            <td className="p-2">
                              <span className="text-xs font-semibold text-blue-600">{pkg.paidCount || 0}</span>
                            </td>
                            <td className="p-2">
                              <span className="text-xs font-medium text-green-600">
                                {formatRevenue(pkg.revenue)}
                              </span>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[50px]">
                                  <div 
                                    className="h-1.5 rounded-full" 
                                    style={{ width: `${percentage}%`, backgroundColor: color }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                    );
                  })}
                    </tbody>
                  </table>
                  {!packageStats || packageStats.packageStats.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs">Chưa có dữ liệu</p>
                    </div>
                  )}
                </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

        {/* Top 10 Active Members - Bên phải */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Top 10 hội viên tích cực
                </CardTitle>
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Select 
                    value={topMembersYear.toString()} 
                    onValueChange={(value) => setTopMembersYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={topMembersMonth?.toString() || 'all'} 
                    onValueChange={(value) => {
                      if (value === 'all') {
                        setTopMembersMonth(null);
                      } else {
                        setTopMembersMonth(parseInt(value));
                      }
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Chọn tháng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cả năm</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          Tháng {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto overflow-y-auto max-h-96">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Hạng</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Hội viên</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Chi nhánh</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Lượt check-in</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Gói hiện tại</th>
                  </tr>
                </thead>
                <tbody>
                  {topMembers?.map((member: any, index: number) => (
                    <tr key={member.memberId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-gray-900 text-sm">{member.memberName}</p>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-700">{member.branchName}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-900 font-semibold">{member.checkInCount}</span>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {member.currentPackage}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!topMembers || topMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có dữ liệu</p>
                </div>
              )}
              </div>
              </CardContent>
            </Card>
          </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Phân bố khung giờ tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPeakHours ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : peakHours ? (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Time distribution bars */}
            <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Sáng (6:00 - 12:00)</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {peakHours.timeDistribution.morning} lượt
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-yellow-500 h-3 rounded-full transition-all" 
                        style={{ 
                          width: `${(peakHours.timeDistribution.morning / (peakHours.timeDistribution.morning + peakHours.timeDistribution.afternoon + peakHours.timeDistribution.evening)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Chiều (12:00 - 18:00)</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {peakHours.timeDistribution.afternoon} lượt
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all" 
                        style={{ 
                          width: `${(peakHours.timeDistribution.afternoon / (peakHours.timeDistribution.morning + peakHours.timeDistribution.afternoon + peakHours.timeDistribution.evening)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tối (18:00 - 22:00)</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {peakHours.timeDistribution.evening} lượt
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all" 
                        style={{ 
                          width: `${(peakHours.timeDistribution.evening / (peakHours.timeDistribution.morning + peakHours.timeDistribution.afternoon + peakHours.timeDistribution.evening)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Peak insights */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Giờ cao điểm</p>
                    <p className="text-lg font-bold text-green-600">{peakHours.peakHour.label}</p>
                    <p className="text-xs text-gray-500">{peakHours.peakHour.count} check-in</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Giờ vắng nhất</p>
                    <p className="text-lg font-bold text-blue-600">{peakHours.quietHour.label}</p>
                    <p className="text-xs text-gray-500">{peakHours.quietHour.count} check-in</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-yellow-900 mb-2 flex items-center gap-1">
                    <span className="text-base">💡</span>
                    Gợi ý quản lý
                  </p>
                  <ul className="text-xs text-yellow-800 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>
                        <strong>Giờ cao điểm ({peakHours.peakHour.label}):</strong> Tăng cường nhân viên và kiểm tra thiết bị để đảm bảo chất lượng phục vụ.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        <strong>Giờ vắng ({peakHours.quietHour.label}):</strong> Áp dụng ưu đãi đặc biệt hoặc khuyến khích PT cá nhân để tận dụng tối đa cơ sở.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có dữ liệu check-in</p>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Package Retention Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              Tỷ lệ giữ chân khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPackageStats ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : packageStats && packageStats.packageStats.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {packageStats.packageStats.slice(0, 5).map((pkg: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{pkg.packageName}</span>
                      <span className="text-sm font-bold text-blue-600">{pkg.retentionRate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            parseFloat(pkg.retentionRate) >= 70 ? 'bg-green-500' :
                            parseFloat(pkg.retentionRate) >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${pkg.retentionRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{pkg.activeCount} người đang sử dụng</span>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                  <p className="text-xs font-semibold text-blue-900 mb-1">💡 Phân tích</p>
                  <p className="text-xs text-blue-800">
                    {(() => {
                      const avgRetention = packageStats.packageStats.reduce((sum: number, pkg: any) => 
                        sum + parseFloat(pkg.retentionRate), 0) / packageStats.packageStats.length;
                      return avgRetention >= 60 
                        ? `Tỷ lệ giữ chân trung bình ${avgRetention.toFixed(1)}% - Tốt! Tiếp tục duy trì chất lượng dịch vụ.`
                        : `Tỷ lệ giữ chân ${avgRetention.toFixed(1)}% - Cần cải thiện chất lượng dịch vụ và chăm sóc khách hàng.`;
                    })()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Percent className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có dữ liệu</p>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Xuất báo cáo
          </CardTitle>
        </CardHeader>
        <CardContent>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   <Button 
                     variant="outline" 
                     className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                     onClick={() => {
                       setSelectedReportType('revenue');
                       setIsExportModalOpen(true);
                     }}
                   >
                     <DollarSign className="w-8 h-8 text-blue-600" />
                     <span className="text-xs font-medium">Báo cáo doanh thu</span>
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300"
                     onClick={() => {
                       setSelectedReportType('member');
                       setIsExportModalOpen(true);
                     }}
                   >
                     <Users className="w-8 h-8 text-green-600" />
                     <span className="text-xs font-medium">Báo cáo hội viên</span>
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                     onClick={() => {
                       setSelectedReportType('attendance');
                       setIsExportModalOpen(true);
                     }}
                   >
                     <CheckSquare className="w-8 h-8 text-purple-600" />
                     <span className="text-xs font-medium">Báo cáo tham gia</span>
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                     onClick={() => {
                       setSelectedReportType('package');
                       setIsExportModalOpen(true);
                     }}
                   >
                     <Package className="w-8 h-8 text-orange-600" />
                     <span className="text-xs font-medium">Báo cáo gói dịch vụ</span>
                   </Button>
                 </div>
        </CardContent>
      </Card>

      {/* Global Tooltips - Rendered at root level to prevent layout shift */}
      {/* Revenue Chart Tooltip */}
      {hoveredRevenuePoint && (
        <div 
          className="fixed bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm pointer-events-none"
          style={{
            left: `${revenueTooltipPosition.x}px`,
            top: `${revenueTooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            maxWidth: '250px',
          }}
        >
          <div className="space-y-1.5">
            {hoveredRevenuePoint.type === 'month' ? (
              <>
                <p className="font-bold text-white border-b border-gray-700 pb-1.5">
                  {hoveredRevenuePoint.month} {selectedYear}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Doanh thu:</span>
                  <span className="font-semibold text-green-300">
                    {formatPrice(hoveredRevenuePoint.revenue)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 pt-1">Click để xem chi tiết</p>
              </>
            ) : (
              <>
                <p className="font-bold text-white border-b border-gray-700 pb-1.5">
                  Ngày {hoveredRevenuePoint.day}/{hoveredRevenuePoint.month}/{hoveredRevenuePoint.year}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Doanh thu:</span>
                  <span className="font-semibold text-green-300">
                    {formatPrice(hoveredRevenuePoint.revenue)}
                  </span>
                </div>
              </>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}

      {/* Package Chart Tooltip */}
      {hoveredPackage && (
        <div 
          className="fixed bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            maxWidth: '250px',
          }}
        >
          <div className="space-y-1.5">
            <p className="font-bold text-white border-b border-gray-700 pb-1.5">{hoveredPackage.packageName}</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Số lượt:</span>
              <span className="font-semibold text-white">{hoveredPackage.count}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Tỷ lệ:</span>
              <span className="font-semibold text-blue-300">{((hoveredPackage.count / totalSold) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Doanh thu:</span>
              <span className="font-semibold text-green-300">
                {hoveredPackage.revenue ? formatRevenue(hoveredPackage.revenue) : '0 VND'}
              </span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsExportModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                      {selectedReportType === 'revenue' && 'Xuất báo cáo doanh thu'}
                      {selectedReportType === 'member' && 'Xuất báo cáo hội viên'}
                      {selectedReportType === 'attendance' && 'Xuất báo cáo tham gia'}
                      {selectedReportType === 'package' && 'Xuất báo cáo gói dịch vụ'}
                    </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Chọn thông tin để xuất báo cáo
                  </p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Branch Selection - Only for revenue report */}
              {selectedReportType === 'revenue' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi nhánh
                  </label>
                  <Select value={exportBranchId} onValueChange={setExportBranchId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng thời gian <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
                    <input
                      type="date"
                      value={dateRange1From}
                      onChange={(e) => setDateRange1From(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
                    <input
                      type="date"
                      value={dateRange1To}
                      onChange={(e) => setDateRange1To(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (selectedReportType === 'revenue') {
                    handleExportRevenueReport();
                  } else if (selectedReportType === 'member') {
                    handleExportMemberReport();
                  } else if (selectedReportType === 'attendance') {
                    handleExportAttendanceReport();
                  } else if (selectedReportType === 'package') {
                    handleExportPackageReport();
                  } else {
                    toast.info('Chức năng xuất báo cáo này sẽ được triển khai sau');
                    setIsExportModalOpen(false);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
