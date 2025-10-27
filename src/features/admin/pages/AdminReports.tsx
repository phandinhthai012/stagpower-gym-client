import React, { useState } from 'react';
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

export function AdminReports() {
  const { data: packageStats, isLoading: isLoadingPackageStats } = usePackageStats();
  const { data: topMembers, isLoading: isLoadingTopMembers } = useTopActiveMembers(10);
  const { data: revenueStats, isLoading: isLoadingRevenueStats } = useRevenueStats();
  const { data: peakHours, isLoading: isLoadingPeakHours } = usePeakHours();
  
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
  
  // Export report modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');

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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất và doanh thu</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
                {viewMode === 'year' ? 'Biểu đồ doanh thu' : `Doanh thu tháng ${selectedMonth}/${selectedYear}`}
          </CardTitle>
              <div className="flex items-center gap-3">
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

            <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
              </Button>
                  <Button variant="ghost" size="sm">
                    <Printer className="w-4 h-4" />
              </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              {viewMode === 'year' ? (
                /* Year View - Monthly Revenue */
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 600 300"
                  onMouseLeave={() => setHoveredRevenuePoint(null)}
                >
                {/* Y-axis labels */}
                <text x="10" y="30" className="text-xs fill-gray-500">15M</text>
                <text x="10" y="90" className="text-xs fill-gray-500">10M</text>
                <text x="10" y="150" className="text-xs fill-gray-500">5M</text>
                <text x="10" y="210" className="text-xs fill-gray-500">0M</text>
                
                {/* Grid lines */}
                <line x1="50" y1="30" x2="580" y2="30" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="90" x2="580" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="150" x2="580" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="210" x2="580" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                
                {/* Revenue line */}
                {revenueStats?.monthlyRevenue && (
                  <>
                    <polyline
                      points={revenueStats.monthlyRevenue.map((data: any, i: number) => {
                        const x = 50 + (i * 44);
                        const y = 210 - (data.revenue / 15 * 180);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {revenueStats.monthlyRevenue.map((data: any, i: number) => {
                      const x = 50 + (i * 44);
                      const y = 210 - (data.revenue / 15 * 180);
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
                {revenueStats?.monthlyRevenue.map((data: any, i: number) => (
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
              ) : (
                /* Month View - Daily Revenue */
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 600 300"
                  onMouseLeave={() => setHoveredRevenuePoint(null)}
                >
                  {/* Y-axis labels */}
                  <text x="10" y="30" className="text-xs fill-gray-500">3M</text>
                  <text x="10" y="90" className="text-xs fill-gray-500">2M</text>
                  <text x="10" y="150" className="text-xs fill-gray-500">1M</text>
                  <text x="10" y="210" className="text-xs fill-gray-500">0</text>
                  
                  {/* Grid lines */}
                  <line x1="50" y1="30" x2="580" y2="30" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="90" x2="580" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="150" x2="580" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="210" x2="580" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Generate daily revenue data for the selected month */}
                  {(() => {
                    const daysInMonth = new Date(selectedYear, selectedMonth || 0, 0).getDate();
                    const monthRevenue = revenueStats?.monthlyRevenue[selectedMonth! - 1]?.revenue || 0;
                    
                    // Generate daily data (simulated - distribute monthly revenue across days)
                    const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
                      // Simulate variation in daily revenue
                      const baseRevenue = monthRevenue / daysInMonth;
                      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
                      return {
                        day: i + 1,
                        revenue: baseRevenue * (1 + variation)
                      };
                    });
                    
                    const maxRevenue = Math.max(...dailyData.map(d => d.revenue)) * 1.2 || 3;
                    const spacing = 530 / daysInMonth;
                    
                    return (
                      <>
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
                        
                        {/* Data points - show every 5th day to avoid crowding */}
                        {dailyData.map((data, i) => {
                          if ((i + 1) % 5 !== 0 && i !== 0 && i !== daysInMonth - 1) return null;
                          const x = 50 + (i * spacing);
                          const y = 210 - (data.revenue / maxRevenue * 180);
                          return (
                            <g key={i}>
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#10b981"
                                stroke="white"
                                strokeWidth="2"
                                className="cursor-pointer transition-all"
                                onMouseEnter={(e) => {
                                  e.currentTarget.setAttribute('r', '6');
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredRevenuePoint({
                                    day: data.day,
                                    revenue: data.revenue * 1000000,
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
                                  e.currentTarget.setAttribute('r', '4');
                                  setHoveredRevenuePoint(null);
                                }}
                              />
                            </g>
                          );
                        })}
                        
                        {/* X-axis labels - show every 5th day */}
                        {dailyData.map((data, i) => {
                          if ((i + 1) % 5 !== 0 && i !== 0 && i !== daysInMonth - 1) return null;
                          return (
                            <text
                              key={i}
                              x={50 + (i * spacing)}
                              y="240"
                              className="text-xs fill-gray-500"
                              textAnchor="middle"
                            >
                              {data.day}
                            </text>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              )}
              
          </div>
        </CardContent>
      </Card>

        {/* Package Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Phân bố gói dịch vụ
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Donut Chart Placeholder */}
              <div className="h-64 flex items-center justify-center relative">
                <div className="relative w-48 h-48">
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
                      <p className="text-3xl font-bold text-gray-900">{totalSold}</p>
                      <p className="text-xs text-gray-600 font-medium">Lượt đăng ký</p>
                    </div>
                  </div>
                </div>
          </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="text-center pb-2 border-b">
                  <p className="text-xs text-gray-500">
                    {packageStats?.packageStats.length || 0} loại gói • {totalSold} lượt đăng ký
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {packageStats?.packageStats.slice(0, 5).map((pkg: any, index: number) => {
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500'];
              return (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${colors[index]}`} />
                        <span className="text-xs text-gray-700 truncate" title={pkg.packageName}>
                          {pkg.packageName}
                          </span>
                      </div>
                    );
                  })}
                </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Active Members */}
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Top 10 hội viên tích cực
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Hạng</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Hội viên</th>
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

        {/* Package Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Hiệu quả gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Gói dịch vụ</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Đã bán</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Doanh thu</th>
                    <th className="text-left p-3 font-medium text-gray-600 text-sm">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {packageStats?.packageStats.map((pkg: any, index: number) => {
                    const percentage = ((pkg.count / totalSold) * 100).toFixed(1);
                    const revenuePercentage = ((pkg.revenue / totalRevenue) * 100).toFixed(1);
                    
              return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {index === 0 && <TrendingUp className="w-4 h-4 text-green-600" />}
                            {index === packageStats.packageStats.length - 1 && <TrendingDown className="w-4 h-4 text-red-600" />}
                            <span className="text-sm font-medium text-gray-900">{pkg.packageName}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-semibold text-gray-900">{pkg.count}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-medium text-green-600">
                            {formatRevenue(pkg.revenue)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
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
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có dữ liệu</p>
                </div>
              )}
              </div>

            {/* Insights */}
            {packageStats && packageStats.packageStats.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                      <span className="font-medium text-gray-900">Gói phổ biến nhất: </span>
                      <span className="text-green-600 font-semibold">
                        {packageStats.mostPopular?.packageName} ({packageStats.mostPopular?.count} lượt)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Gói cần cải thiện: </span>
                      <span className="text-red-600 font-semibold">
                        {packageStats.leastPopular?.packageName} ({packageStats.leastPopular?.count} lượt)
                      </span>
                </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Tỷ lệ giữ chân tốt nhất: </span>
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
                  <div className="flex items-start gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Doanh thu cao nhất: </span>
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
              </div>
            )}
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
              <div className="space-y-6">
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
            <div className="space-y-4">
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
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{pkg.activeCount} đang dùng / {pkg.count} tổng</span>
                      <span>
                        {pkg.expiredCount > 0 && `${pkg.expiredCount} hết hạn`}
                      </span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-300"
              onClick={() => {
                setSelectedReportType('summary');
                setIsExportModalOpen(true);
              }}
            >
              <FileText className="w-8 h-8 text-indigo-600" />
              <span className="text-xs font-medium">Báo cáo tổng hợp</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-400"
              onClick={() => {
                setSelectedReportType('custom');
                setIsExportModalOpen(true);
              }}
            >
              <Settings className="w-8 h-8 text-gray-600" />
              <span className="text-xs font-medium">Báo cáo tùy chỉnh</span>
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
                    {selectedReportType === 'summary' && 'Xuất báo cáo tổng hợp'}
                    {selectedReportType === 'custom' && 'Xuất báo cáo tùy chỉnh'}
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
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng thời gian
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Định dạng file
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                    PDF
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Excel
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    CSV
                  </button>
                </div>
              </div>

              {/* Additional Options for Custom Report */}
              {selectedReportType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn nội dung báo cáo
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Thống kê doanh thu</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Danh sách hội viên</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Lịch sử check-in</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Thống kê gói dịch vụ</span>
                    </label>
                  </div>
                </div>
              )}
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
                  // TODO: Implement export logic
                  alert('Chức năng xuất báo cáo sẽ được triển khai sau');
                  setIsExportModalOpen(false);
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
