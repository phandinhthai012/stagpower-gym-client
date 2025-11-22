import * as XLSX from 'xlsx';

export interface WorkoutHistoryRow {
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: number;
  status?: string;
  scheduleDate?: string;
  scheduleDuration?: number;
  scheduleStatus?: string;
  type: 'checkin' | 'schedule';
}

export const exportWorkoutHistoryToExcel = (
  checkIns: any[],
  schedules: any[],
  memberName: string
): void => {
  // Prepare data
  const rows: WorkoutHistoryRow[] = [];

  // Add check-ins
  checkIns.forEach((checkIn) => {
    const checkInTime = checkIn.check_in_time || checkIn.checkInTime;
    const checkOutTime = checkIn.check_out_time || checkIn.checkOutTime;
    let duration = 0;
    if (checkInTime && checkOutTime) {
      const start = new Date(checkInTime).getTime();
      const end = new Date(checkOutTime).getTime();
      duration = Math.round((end - start) / (1000 * 60));
    }

    rows.push({
      date: checkInTime ? new Date(checkInTime).toLocaleDateString('vi-VN') : '',
      checkInTime: checkInTime ? new Date(checkInTime).toLocaleTimeString('vi-VN') : '',
      checkOutTime: checkOutTime ? new Date(checkOutTime).toLocaleTimeString('vi-VN') : '',
      duration: duration || undefined,
      status: checkIn.status === 'checked_in' ? 'Đang tập' : checkIn.status === 'checked_out' ? 'Đã check-out' : checkIn.status || '',
      type: 'checkin',
    });
  });

  // Add schedules
  schedules.forEach((schedule) => {
    const dateTime = schedule.date_time || schedule.dateTime;
    rows.push({
      date: dateTime ? new Date(dateTime).toLocaleDateString('vi-VN') : '',
      scheduleDate: dateTime ? new Date(dateTime).toLocaleString('vi-VN') : '',
      scheduleDuration: schedule.duration_minutes || schedule.durationMinutes || undefined,
      scheduleStatus: schedule.status === 'Confirmed' ? 'Đã xác nhận' : 
                      schedule.status === 'Pending' ? 'Chờ xác nhận' :
                      schedule.status === 'Completed' ? 'Hoàn thành' :
                      schedule.status === 'Cancelled' ? 'Đã hủy' : schedule.status || '',
      type: 'schedule',
    });
  });

  // Sort by date (most recent first)
  rows.sort((a, b) => {
    const dateA = a.type === 'checkin' ? a.checkInTime : a.scheduleDate;
    const dateB = b.type === 'checkin' ? b.checkInTime : b.scheduleDate;
    if (!dateA || !dateB) return 0;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Check-ins sheet
  const checkInData = rows
    .filter(r => r.type === 'checkin')
    .map(r => ({
      'Ngày': r.date,
      'Giờ check-in': r.checkInTime || '',
      'Giờ check-out': r.checkOutTime || '',
      'Thời gian tập (phút)': r.duration || 0,
      'Trạng thái': r.status || '',
    }));

  if (checkInData.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(checkInData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Lịch sử Check-in');
  }

  // Schedules sheet
  const scheduleData = rows
    .filter(r => r.type === 'schedule')
    .map(r => ({
      'Ngày giờ': r.scheduleDate || '',
      'Thời lượng (phút)': r.scheduleDuration || 0,
      'Trạng thái': r.scheduleStatus || '',
    }));

  if (scheduleData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(scheduleData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Lịch sử PT');
  }

  // Summary sheet
  const totalCheckIns = checkIns.length;
  const totalSchedules = schedules.length;
  const completedSchedules = schedules.filter(s => 
    s.status === 'Completed' || s.status === 'Hoàn thành'
  ).length;
  const totalWorkoutTime = checkIns
    .filter(c => {
      const checkInTime = c.check_in_time || c.checkInTime;
      const checkOutTime = c.check_out_time || c.checkOutTime;
      return checkInTime && checkOutTime;
    })
    .reduce((sum, c) => {
      const checkInTime = new Date(c.check_in_time || c.checkInTime).getTime();
      const checkOutTime = new Date(c.check_out_time || c.checkOutTime).getTime();
      return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
    }, 0);

  const summaryData = [
    { 'Chỉ số': 'Tổng lần check-in', 'Giá trị': totalCheckIns },
    { 'Chỉ số': 'Tổng thời gian tập (phút)', 'Giá trị': totalWorkoutTime },
    { 'Chỉ số': 'Tổng thời gian tập (giờ)', 'Giá trị': Math.round((totalWorkoutTime / 60) * 10) / 10 },
    { 'Chỉ số': 'Tổng buổi PT', 'Giá trị': totalSchedules },
    { 'Chỉ số': 'Buổi PT hoàn thành', 'Giá trị': completedSchedules },
  ];

  const ws3 = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Tổng hợp');

  // Generate filename
  const fileName = `BaoCaoLichSuTapLuyen-${memberName}-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Write file
  XLSX.writeFile(wb, fileName);
};

export interface RevenueReportData {
  payments: any[];
  dateRange1: { from: string; to: string };
  dateRange2?: { from: string; to: string };
}

export const exportRevenueReportToExcel = (
  data: RevenueReportData
): void => {
  const { payments, dateRange1, dateRange2 } = data;

  // Helper function to filter payments by date range
  const filterByDateRange = (paymentList: any[], from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // Include entire end date
    
    return paymentList.filter((payment: any) => {
      const paymentDate = new Date(payment.paymentDate || payment.createdAt || payment.payment_date);
      return paymentDate >= fromDate && paymentDate <= toDate;
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper function to format date short (for sheet names)
  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`; // Remove / to avoid Excel sheet name restrictions
  };

  // Helper function to sanitize sheet name (remove invalid characters)
  const sanitizeSheetName = (name: string): string => {
    // In character class [], only \ and ] need escaping
    return name.replace(/[:\\/?*[\]]/g, '_');
  };

  // Helper function to truncate sheet name to max 31 characters
  const truncateSheetName = (name: string, maxLength: number = 31): string => {
    const sanitized = sanitizeSheetName(name);
    if (sanitized.length <= maxLength) return sanitized;
    return sanitized.substring(0, maxLength - 3) + '...';
  };

  // Filter payments for each date range
  const paymentsRange1 = filterByDateRange(payments, dateRange1.from, dateRange1.to);
  const paymentsRange2 = dateRange2 
    ? filterByDateRange(payments, dateRange2.from, dateRange2.to)
    : [];

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Khoảng thời gian 1
  const range1Data = paymentsRange1
    .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
    .map((payment: any) => ({
      'Ngày thanh toán': formatDate(payment.paymentDate || payment.createdAt || payment.payment_date),
      'Mã hóa đơn': payment.invoiceNumber || payment.invoice_number || payment._id || '',
      'Mã giao dịch': payment.transactionId || payment.transaction_id || '',
      'Hội viên': payment.memberId?.fullName || payment.memberName || 'N/A',
      'Email': payment.memberId?.email || payment.memberEmail || '',
      'Số điện thoại': payment.memberId?.phone || payment.memberPhone || '',
      'Gói dịch vụ': payment.subscriptionId?.packageId?.name || payment.packageName || 'N/A',
      'Loại thanh toán': payment.paymentType === 'NEW_SUBSCRIPTION' ? 'Đăng ký mới' :
                        payment.paymentType === 'RENEWAL' ? 'Gia hạn' :
                        payment.paymentType === 'PT_PURCHASE' ? 'Mua PT' : 'Khác',
      'Phương thức': payment.paymentMethod === 'momo' ? 'Ví MoMo' :
                    payment.paymentMethod === 'zalopay' ? 'Ví ZaloPay' :
                    payment.paymentMethod === 'cash' ? 'Tiền mặt' :
                    payment.paymentMethod === 'card' ? 'Thẻ' :
                    payment.paymentMethod === 'banktransfer' || payment.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : payment.paymentMethod || 'Khác',
      'Số tiền': payment.amount || 0,
      'Trạng thái': payment.paymentStatus === 'Completed' ? 'Hoàn thành' :
                   payment.paymentStatus === 'Pending' ? 'Đang chờ' :
                   payment.paymentStatus === 'Failed' ? 'Thất bại' : payment.paymentStatus || 'N/A',
    }));

  if (range1Data.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(range1Data);
    // Set column widths
    ws1['!cols'] = [
      { wch: 15 }, // Ngày thanh toán
      { wch: 15 }, // Mã hóa đơn
      { wch: 20 }, // Mã giao dịch
      { wch: 20 }, // Hội viên
      { wch: 25 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 20 }, // Gói dịch vụ
      { wch: 15 }, // Loại thanh toán
      { wch: 15 }, // Phương thức
      { wch: 15 }, // Số tiền
      { wch: 12 }, // Trạng thái
    ];
    const sheetName1 = truncateSheetName(`K1_${formatDateShort(dateRange1.from)}_${formatDateShort(dateRange1.to)}`);
    XLSX.utils.book_append_sheet(wb, ws1, sheetName1);
  }

  // Sheet 2: Khoảng thời gian 2 (nếu có)
  if (dateRange2 && paymentsRange2.length > 0) {
    const range2Data = paymentsRange2
      .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
      .map((payment: any) => ({
        'Ngày thanh toán': formatDate(payment.paymentDate || payment.createdAt || payment.payment_date),
        'Mã hóa đơn': payment.invoiceNumber || payment.invoice_number || payment._id || '',
        'Mã giao dịch': payment.transactionId || payment.transaction_id || '',
        'Hội viên': payment.memberId?.fullName || payment.memberName || 'N/A',
        'Email': payment.memberId?.email || payment.memberEmail || '',
        'Số điện thoại': payment.memberId?.phone || payment.memberPhone || '',
        'Gói dịch vụ': payment.subscriptionId?.packageId?.name || payment.packageName || 'N/A',
        'Loại thanh toán': payment.paymentType === 'NEW_SUBSCRIPTION' ? 'Đăng ký mới' :
                          payment.paymentType === 'RENEWAL' ? 'Gia hạn' :
                          payment.paymentType === 'PT_PURCHASE' ? 'Mua PT' : 'Khác',
        'Phương thức': payment.paymentMethod === 'momo' ? 'Ví MoMo' :
                      payment.paymentMethod === 'zalopay' ? 'Ví ZaloPay' :
                      payment.paymentMethod === 'cash' ? 'Tiền mặt' :
                      payment.paymentMethod === 'card' ? 'Thẻ' :
                      payment.paymentMethod === 'banktransfer' || payment.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : payment.paymentMethod || 'Khác',
        'Số tiền': payment.amount || 0,
        'Trạng thái': payment.paymentStatus === 'Completed' ? 'Hoàn thành' :
                     payment.paymentStatus === 'Pending' ? 'Đang chờ' :
                     payment.paymentStatus === 'Failed' ? 'Thất bại' : payment.paymentStatus || 'N/A',
      }));

    const ws2 = XLSX.utils.json_to_sheet(range2Data);
    ws2['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
    ];
    const sheetName2 = truncateSheetName(`K2_${formatDateShort(dateRange2.from)}_${formatDateShort(dateRange2.to)}`);
    XLSX.utils.book_append_sheet(wb, ws2, sheetName2);
  }

  // Sheet 3: Tổng hợp và so sánh
  const totalRevenue1 = paymentsRange1
    .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  
  const totalRevenue2 = dateRange2 
    ? paymentsRange2
        .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    : 0;

  const count1 = paymentsRange1.filter((p: any) => (p.paymentStatus || p.status) === 'Completed').length;
  const count2 = dateRange2 
    ? paymentsRange2.filter((p: any) => (p.paymentStatus || p.status) === 'Completed').length
    : 0;

  const summaryData = [
    { 'Chỉ số': 'Khoảng thời gian 1', 'Giá trị': `${formatDate(dateRange1.from)} - ${formatDate(dateRange1.to)}` },
    { 'Chỉ số': 'Tổng doanh thu (Khoảng 1)', 'Giá trị': totalRevenue1 },
    { 'Chỉ số': 'Số giao dịch (Khoảng 1)', 'Giá trị': count1 },
    { 'Chỉ số': 'Doanh thu trung bình (Khoảng 1)', 'Giá trị': count1 > 0 ? Math.round(totalRevenue1 / count1) : 0 },
  ];

  if (dateRange2) {
    summaryData.push(
      { 'Chỉ số': 'Khoảng thời gian 2', 'Giá trị': `${formatDate(dateRange2.from)} - ${formatDate(dateRange2.to)}` },
      { 'Chỉ số': 'Tổng doanh thu (Khoảng 2)', 'Giá trị': totalRevenue2 },
      { 'Chỉ số': 'Số giao dịch (Khoảng 2)', 'Giá trị': count2 },
      { 'Chỉ số': 'Doanh thu trung bình (Khoảng 2)', 'Giá trị': count2 > 0 ? Math.round(totalRevenue2 / count2) : 0 },
      { 'Chỉ số': 'Chênh lệch doanh thu', 'Giá trị': totalRevenue2 - totalRevenue1 },
      { 'Chỉ số': 'Tỷ lệ tăng trưởng (%)', 'Giá trị': totalRevenue1 > 0 ? (((totalRevenue2 - totalRevenue1) / totalRevenue1) * 100).toFixed(2) + '%' : 'N/A' },
      { 'Chỉ số': 'Chênh lệch số giao dịch', 'Giá trị': count2 - count1 }
    );
  }

  const ws3 = XLSX.utils.json_to_sheet(summaryData);
  ws3['!cols'] = [
    { wch: 30 },
    { wch: 25 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Tổng hợp');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `BaoCaoDoanhThu-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting revenue report:', error);
    throw new Error('Không thể xuất báo cáo doanh thu');
  }
};

export interface MemberReportData {
  members: any[];
  subscriptions: any[];
  checkIns: any[];
  payments: any[];
  schedules?: any[];
  dateRange?: { from: string; to: string };
}

export const exportMemberReportToExcel = (
  data: MemberReportData
): void => {
  const { members, subscriptions, checkIns, payments, schedules = [], dateRange } = data;

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Filter data by date range if provided
  const filterByDateRange = (items: any[], dateField: string) => {
    if (!dateRange) return items;
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    
    return items.filter((item: any) => {
      const itemDate = new Date(item[dateField] || item.createdAt || item.created_at);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách hội viên chi tiết
  const memberData = filterByDateRange(members, 'createdAt').map((member: any) => {
    // Find active subscription
    const activeSub = subscriptions.find((sub: any) => {
      const subMemberId = sub.memberId?._id || sub.memberId;
      const memberId = member._id || member.id;
      return String(subMemberId) === String(memberId) && sub.status === 'Active';
    });

    // Count check-ins
    const memberCheckIns = checkIns.filter((ci: any) => {
      const ciMemberId = ci.memberId?._id || ci.memberId;
      const memberId = member._id || member.id;
      return String(ciMemberId) === String(memberId);
    });

    // Calculate total workout time
    const totalWorkoutTime = memberCheckIns
      .filter((ci: any) => {
        const checkInTime = ci.checkInTime || ci.check_in_time;
        const checkOutTime = ci.checkOutTime || ci.check_out_time;
        return checkInTime && checkOutTime;
      })
      .reduce((sum: number, ci: any) => {
        const checkInTime = new Date(ci.checkInTime || ci.check_in_time).getTime();
        const checkOutTime = new Date(ci.checkOutTime || ci.check_out_time).getTime();
        return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
      }, 0);

    // Count PT schedules
    const memberSchedules = schedules.filter((s: any) => {
      const sMemberId = s.memberId?._id || s.memberId;
      const memberId = member._id || member.id;
      return String(sMemberId) === String(memberId);
    });

    // Calculate total spending
    const memberPayments = payments.filter((p: any) => {
      const pMemberId = p.memberId?._id || p.memberId;
      const memberId = member._id || member.id;
      return String(pMemberId) === String(memberId) && (p.paymentStatus || p.status) === 'Completed';
    });

    const totalSpending = memberPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return {
      'Mã hội viên': member.uid || member._id || '',
      'Họ tên': member.fullName || '',
      'Email': member.email || '',
      'Số điện thoại': member.phone || '',
      'Giới tính': member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : member.gender || '',
      'Ngày sinh': formatDate(member.dateOfBirth || member.date_of_birth),
      'CCCD': member.cccd || '',
      'Ngày đăng ký': formatDate(member.createdAt || member.created_at || member.joinDate),
      'Trạng thái': member.status === 'active' ? 'Hoạt động' :
                   member.status === 'inactive' ? 'Không hoạt động' :
                   member.status === 'pending' ? 'Chờ duyệt' :
                   member.status === 'Banned' || member.status === 'banned' ? 'Bị cấm' : member.status || '',
      'Cấp độ': member.memberInfo?.membership_level || member.member_info?.membership_level || '',
      'Học sinh/Sinh viên': (member.memberInfo?.is_hssv || member.member_info?.is_hssv || member.memberInfo?.is_student) ? 'Có' : 'Không',
      'Gói hiện tại': activeSub?.packageId?.name || activeSub?.type || 'Không có',
      'Ngày bắt đầu gói': formatDate(activeSub?.startDate || activeSub?.start_date),
      'Ngày hết hạn': formatDate(activeSub?.endDate || activeSub?.end_date),
      'Số lần check-in': memberCheckIns.length,
      'Tổng thời gian tập (phút)': totalWorkoutTime,
      'Tổng thời gian tập (giờ)': Math.round((totalWorkoutTime / 60) * 10) / 10,
      'Số buổi PT': memberSchedules.length,
      'Buổi PT hoàn thành': memberSchedules.filter((s: any) => s.status === 'Completed').length,
      'Tổng chi tiêu': totalSpending,
      'Số giao dịch': memberPayments.length,
    };
  });

  if (memberData.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(memberData);
    ws1['!cols'] = [
      { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Danh sach hoi vien');
  }

  // Sheet 2: Thống kê theo gói tập
  const packageStats: Record<string, any> = {};
  
  subscriptions.forEach((sub: any) => {
    const pkgName = sub.packageId?.name || sub.type || 'Không xác định';
    if (!packageStats[pkgName]) {
      packageStats[pkgName] = {
        packageName: pkgName,
        total: 0,
        active: 0,
        expired: 0,
        pending: 0,
      };
    }
    packageStats[pkgName].total += 1;
    if (sub.status === 'Active') packageStats[pkgName].active += 1;
    else if (sub.status === 'Expired') packageStats[pkgName].expired += 1;
    else packageStats[pkgName].pending += 1;
  });

  const packageStatsData = Object.values(packageStats).map((pkg: any) => ({
    'Gói tập': pkg.packageName,
    'Tổng số': pkg.total,
    'Đang hoạt động': pkg.active,
    'Hết hạn': pkg.expired,
    'Khác': pkg.pending,
    'Tỷ lệ hoạt động (%)': pkg.total > 0 ? ((pkg.active / pkg.total) * 100).toFixed(1) : 0,
  }));

  if (packageStatsData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(packageStatsData);
    ws2['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Thong ke goi tap');
  }

  // Sheet 3: Thống kê theo trạng thái
  const statusStats: Record<string, number> = {};
  members.forEach((member: any) => {
    const status = member.status || 'unknown';
    statusStats[status] = (statusStats[status] || 0) + 1;
  });

  const statusStatsData = Object.entries(statusStats).map(([status, count]) => ({
    'Trạng thái': status === 'active' ? 'Hoạt động' :
                  status === 'inactive' ? 'Không hoạt động' :
                  status === 'pending' ? 'Chờ duyệt' :
                  status === 'Banned' || status === 'banned' ? 'Bị cấm' : status,
    'Số lượng': count,
    'Tỷ lệ (%)': members.length > 0 ? ((count / members.length) * 100).toFixed(1) : 0,
  }));

  if (statusStatsData.length > 0) {
    const ws3 = XLSX.utils.json_to_sheet(statusStatsData);
    ws3['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Thong ke trang thai');
  }

  // Sheet 4: Top hội viên tích cực
  const memberActivity: Array<{ member: any; checkInCount: number; workoutTime: number }> = [];
  
  members.forEach((member: any) => {
    const memberId = member._id || member.id;
    const memberCheckIns = checkIns.filter((ci: any) => {
      const ciMemberId = ci.memberId?._id || ci.memberId;
      return String(ciMemberId) === String(memberId);
    });

    const workoutTime = memberCheckIns
      .filter((ci: any) => {
        const checkInTime = ci.checkInTime || ci.check_in_time;
        const checkOutTime = ci.checkOutTime || ci.check_out_time;
        return checkInTime && checkOutTime;
      })
      .reduce((sum: number, ci: any) => {
        const checkInTime = new Date(ci.checkInTime || ci.check_in_time).getTime();
        const checkOutTime = new Date(ci.checkOutTime || ci.check_out_time).getTime();
        return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
      }, 0);

    if (memberCheckIns.length > 0) {
      memberActivity.push({
        member,
        checkInCount: memberCheckIns.length,
        workoutTime,
      });
    }
  });

  const topMembersData = memberActivity
    .sort((a, b) => b.checkInCount - a.checkInCount)
    .slice(0, 50)
    .map((item, index) => ({
      'Hạng': index + 1,
      'Họ tên': item.member.fullName || '',
      'Email': item.member.email || '',
      'Số lần check-in': item.checkInCount,
      'Tổng thời gian tập (phút)': item.workoutTime,
      'Tổng thời gian tập (giờ)': Math.round((item.workoutTime / 60) * 10) / 10,
    }));

  if (topMembersData.length > 0) {
    const ws4 = XLSX.utils.json_to_sheet(topMembersData);
    ws4['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Top hoi vien tich cuc');
  }

  // Sheet 5: Tổng hợp
  const totalMembers = members.length;
  const activeMembers = members.filter((m: any) => m.status === 'active').length;
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'Active').length;
  const totalCheckIns = checkIns.length;
  const totalPayments = payments.filter((p: any) => (p.paymentStatus || p.status) === 'Completed').length;
  const totalRevenue = payments
    .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const summaryData = [
    { 'Chỉ số': 'Tổng số hội viên', 'Giá trị': totalMembers },
    { 'Chỉ số': 'Hội viên đang hoạt động', 'Giá trị': activeMembers },
    { 'Chỉ số': 'Tỷ lệ hoạt động (%)', 'Giá trị': totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 0 },
    { 'Chỉ số': 'Tổng số gói đăng ký', 'Giá trị': totalSubscriptions },
    { 'Chỉ số': 'Gói đang hoạt động', 'Giá trị': activeSubscriptions },
    { 'Chỉ số': 'Tổng số lần check-in', 'Giá trị': totalCheckIns },
    { 'Chỉ số': 'Tổng số giao dịch', 'Giá trị': totalPayments },
    { 'Chỉ số': 'Tổng doanh thu', 'Giá trị': totalRevenue },
    { 'Chỉ số': 'Doanh thu trung bình/hội viên', 'Giá trị': totalMembers > 0 ? Math.round(totalRevenue / totalMembers) : 0 },
  ];

  if (dateRange) {
    summaryData.unshift(
      { 'Chỉ số': 'Khoảng thời gian', 'Giá trị': `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}` }
    );
  }

  const ws5 = XLSX.utils.json_to_sheet(summaryData);
  ws5['!cols'] = [{ wch: 30 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws5, 'Tong hop');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `BaoCaoHoiVien-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting member report:', error);
    throw new Error('Không thể xuất báo cáo hội viên');
  }
};

export interface AttendanceReportData {
  checkIns: any[];
  schedules: any[];
  members: any[];
  dateRange1: { from: string; to: string };
  dateRange2?: { from: string; to: string };
}

export const exportAttendanceReportToExcel = (
  data: AttendanceReportData
): void => {
  const { checkIns, schedules, members, dateRange1, dateRange2 } = data;

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Helper function to format date short (for sheet names)
  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`;
  };

  // Helper function to sanitize sheet name (remove invalid characters)
  const sanitizeSheetName = (name: string): string => {
    return name.replace(/[:\\/?*[\]]/g, '_');
  };

  // Helper function to truncate sheet name to max 31 characters
  const truncateSheetName = (name: string, maxLength: number = 31): string => {
    const sanitized = sanitizeSheetName(name);
    if (sanitized.length <= maxLength) return sanitized;
    return sanitized.substring(0, maxLength - 3) + '...';
  };

  // Filter data by date range
  const filterByDateRange = (items: any[], dateField: string) => {
    const fromDate = new Date(dateRange1.from);
    const toDate = new Date(dateRange1.to);
    toDate.setHours(23, 59, 59, 999);
    
    return items.filter((item: any) => {
      const itemDate = new Date(item[dateField] || item.createdAt || item.created_at);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const filterByDateRange2 = (items: any[], dateField: string) => {
    if (!dateRange2) return [];
    const fromDate = new Date(dateRange2.from);
    const toDate = new Date(dateRange2.to);
    toDate.setHours(23, 59, 59, 999);
    
    return items.filter((item: any) => {
      const itemDate = new Date(item[dateField] || item.createdAt || item.created_at);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Lịch sử check-in chi tiết (Khoảng 1)
  const checkInsRange1 = filterByDateRange(checkIns, 'checkInTime');
  const checkInData1 = checkInsRange1.map((checkIn: any) => {
    const member = members.find((m: any) => {
      const memberId = m._id || m.id;
      const ciMemberId = checkIn.memberId?._id || checkIn.memberId;
      return String(memberId) === String(ciMemberId);
    });

    const checkInTime = checkIn.checkInTime || checkIn.check_in_time;
    const checkOutTime = checkIn.checkOutTime || checkIn.check_out_time;
    let duration = 0;
    if (checkInTime && checkOutTime) {
      const start = new Date(checkInTime).getTime();
      const end = new Date(checkOutTime).getTime();
      duration = Math.round((end - start) / (1000 * 60));
    }

    return {
      'Ngày': formatDate(checkInTime),
      'Giờ check-in': checkInTime ? new Date(checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
      'Giờ check-out': checkOutTime ? new Date(checkOutTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
      'Thời gian tập (phút)': duration || 0,
      'Thời gian tập (giờ)': duration > 0 ? Math.round((duration / 60) * 10) / 10 : 0,
      'Hội viên': member?.fullName || 'N/A',
      'Email': member?.email || '',
      'Số điện thoại': member?.phone || '',
      'Trạng thái': checkIn.status === 'checked_in' ? 'Đang tập' :
                    checkIn.status === 'checked_out' ? 'Đã check-out' :
                    checkIn.status || 'N/A',
      'Phương thức check-in': checkIn.checkInMethod || checkIn.check_in_method || 'N/A',
    };
  });

  if (checkInData1.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(checkInData1);
    ws1['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 12 }, { wch: 18 },
    ];
    const sheetName1 = truncateSheetName(`CheckIn_${formatDateShort(dateRange1.from)}_${formatDateShort(dateRange1.to)}`);
    XLSX.utils.book_append_sheet(wb, ws1, sheetName1);
  }

  // Sheet 2: Lịch sử check-in chi tiết (Khoảng 2 - nếu có)
  if (dateRange2) {
    const checkInsRange2 = filterByDateRange2(checkIns, 'checkInTime');
    const checkInData2 = checkInsRange2.map((checkIn: any) => {
      const member = members.find((m: any) => {
        const memberId = m._id || m.id;
        const ciMemberId = checkIn.memberId?._id || checkIn.memberId;
        return String(memberId) === String(ciMemberId);
      });

      const checkInTime = checkIn.checkInTime || checkIn.check_in_time;
      const checkOutTime = checkIn.checkOutTime || checkIn.check_out_time;
      let duration = 0;
      if (checkInTime && checkOutTime) {
        const start = new Date(checkInTime).getTime();
        const end = new Date(checkOutTime).getTime();
        duration = Math.round((end - start) / (1000 * 60));
      }

      return {
        'Ngày': formatDate(checkInTime),
        'Giờ check-in': checkInTime ? new Date(checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
        'Giờ check-out': checkOutTime ? new Date(checkOutTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
        'Thời gian tập (phút)': duration || 0,
        'Thời gian tập (giờ)': duration > 0 ? Math.round((duration / 60) * 10) / 10 : 0,
        'Hội viên': member?.fullName || 'N/A',
        'Email': member?.email || '',
        'Số điện thoại': member?.phone || '',
        'Trạng thái': checkIn.status === 'checked_in' ? 'Đang tập' :
                      checkIn.status === 'checked_out' ? 'Đã check-out' :
                      checkIn.status || 'N/A',
        'Phương thức check-in': checkIn.checkInMethod || checkIn.check_in_method || 'N/A',
      };
    });

    if (checkInData2.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(checkInData2);
      ws2['!cols'] = [
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
        { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
        { wch: 12 }, { wch: 18 },
      ];
      const sheetName2 = truncateSheetName(`CheckIn2_${formatDateShort(dateRange2.from)}_${formatDateShort(dateRange2.to)}`);
      XLSX.utils.book_append_sheet(wb, ws2, sheetName2);
    }
  }

  // Sheet 3: Thống kê check-in theo ngày (Khoảng 1)
  const dailyStats1: Record<string, { count: number; totalDuration: number; uniqueMembers: Set<string> }> = {};
  
  checkInsRange1.forEach((checkIn: any) => {
    const checkInTime = checkIn.checkInTime || checkIn.check_in_time;
    if (!checkInTime) return;
    
    const date = formatDate(checkInTime);
    if (!dailyStats1[date]) {
      dailyStats1[date] = { count: 0, totalDuration: 0, uniqueMembers: new Set() };
    }
    
    dailyStats1[date].count += 1;
    
    const memberId = checkIn.memberId?._id || checkIn.memberId;
    if (memberId) {
      dailyStats1[date].uniqueMembers.add(String(memberId));
    }
    
    const checkOutTime = checkIn.checkOutTime || checkIn.check_out_time;
    if (checkInTime && checkOutTime) {
      const start = new Date(checkInTime).getTime();
      const end = new Date(checkOutTime).getTime();
      const duration = Math.round((end - start) / (1000 * 60));
      dailyStats1[date].totalDuration += duration;
    }
  });

  const dailyStatsData1 = Object.entries(dailyStats1)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, stats]) => ({
      'Ngày': date,
      'Số lần check-in': stats.count,
      'Số hội viên': stats.uniqueMembers.size,
      'Tổng thời gian tập (phút)': stats.totalDuration,
      'Tổng thời gian tập (giờ)': Math.round((stats.totalDuration / 60) * 10) / 10,
      'Thời gian trung bình/lần (phút)': stats.count > 0 ? Math.round(stats.totalDuration / stats.count) : 0,
    }));

  if (dailyStatsData1.length > 0) {
    const ws3 = XLSX.utils.json_to_sheet(dailyStatsData1);
    ws3['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 25 }];
    const sheetName3 = truncateSheetName(`ThongKeNgay_${formatDateShort(dateRange1.from)}_${formatDateShort(dateRange1.to)}`);
    XLSX.utils.book_append_sheet(wb, ws3, sheetName3);
  }

  // Sheet 4: Thống kê theo khung giờ (Khoảng 1)
  const hourStats1: Record<number, number> = {};
  checkInsRange1.forEach((checkIn: any) => {
    const checkInTime = checkIn.checkInTime || checkIn.check_in_time;
    if (!checkInTime) return;
    const hour = new Date(checkInTime).getHours();
    hourStats1[hour] = (hourStats1[hour] || 0) + 1;
  });

  const hourStatsData1 = Object.entries(hourStats1)
    .map(([hour, count]) => ({
      'Giờ': `${hour}:00 - ${parseInt(hour) + 1}:00`,
      'Số lần check-in': count,
      'Tỷ lệ (%)': checkInsRange1.length > 0 ? ((count / checkInsRange1.length) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => {
      const hourA = parseInt(a['Giờ'].split(':')[0]);
      const hourB = parseInt(b['Giờ'].split(':')[0]);
      return hourA - hourB;
    });

  if (hourStatsData1.length > 0) {
    const ws4 = XLSX.utils.json_to_sheet(hourStatsData1);
    ws4['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Thong ke khung gio');
  }

  // Sheet 5: Thống kê theo hội viên (Khoảng 1)
  const memberStats1: Record<string, { member: any; count: number; totalDuration: number }> = {};
  
  checkInsRange1.forEach((checkIn: any) => {
    const memberId = checkIn.memberId?._id || checkIn.memberId;
    if (!memberId) return;
    
    const memberIdStr = String(memberId);
    if (!memberStats1[memberIdStr]) {
      const member = members.find((m: any) => String(m._id || m.id) === memberIdStr);
      memberStats1[memberIdStr] = { member: member || null, count: 0, totalDuration: 0 };
    }
    
    memberStats1[memberIdStr].count += 1;
    
    const checkInTime = checkIn.checkInTime || checkIn.check_in_time;
    const checkOutTime = checkIn.checkOutTime || checkIn.check_out_time;
    if (checkInTime && checkOutTime) {
      const start = new Date(checkInTime).getTime();
      const end = new Date(checkOutTime).getTime();
      const duration = Math.round((end - start) / (1000 * 60));
      memberStats1[memberIdStr].totalDuration += duration;
    }
  });

  const memberStatsData1 = Object.values(memberStats1)
    .sort((a, b) => b.count - a.count)
    .map((stats) => ({
      'Hội viên': stats.member?.fullName || 'N/A',
      'Email': stats.member?.email || '',
      'Số lần check-in': stats.count,
      'Tổng thời gian tập (phút)': stats.totalDuration,
      'Tổng thời gian tập (giờ)': Math.round((stats.totalDuration / 60) * 10) / 10,
      'Thời gian trung bình/lần (phút)': stats.count > 0 ? Math.round(stats.totalDuration / stats.count) : 0,
    }));

  if (memberStatsData1.length > 0) {
    const ws5 = XLSX.utils.json_to_sheet(memberStatsData1);
    ws5['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws5, 'Thong ke theo hoi vien');
  }

  // Sheet 6: Thống kê PT Schedules (Khoảng 1)
  const schedulesRange1 = filterByDateRange(schedules, 'dateTime');
  const scheduleData1 = schedulesRange1.map((schedule: any) => {
    const member = members.find((m: any) => {
      const memberId = m._id || m.id;
      const sMemberId = schedule.memberId?._id || schedule.memberId;
      return String(memberId) === String(sMemberId);
    });

    const trainer = schedule.trainerId?.fullName || schedule.trainer?.fullName || 'N/A';

    return {
      'Ngày giờ': formatDateTime(schedule.dateTime || schedule.date_time),
      'Hội viên': member?.fullName || 'N/A',
      'Email': member?.email || '',
      'Huấn luyện viên': trainer,
      'Thời lượng (phút)': schedule.durationMinutes || schedule.duration_minutes || 0,
      'Trạng thái': schedule.status === 'Confirmed' ? 'Đã xác nhận' :
                    schedule.status === 'Pending' ? 'Chờ xác nhận' :
                    schedule.status === 'Completed' ? 'Hoàn thành' :
                    schedule.status === 'Cancelled' ? 'Đã hủy' : schedule.status || 'N/A',
    };
  });

  if (scheduleData1.length > 0) {
    const ws6 = XLSX.utils.json_to_sheet(scheduleData1);
    ws6['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws6, 'Lich su PT');
  }

  // Sheet 7: Tổng hợp và so sánh
  const totalCheckIns1 = checkInsRange1.length;
  const totalCheckIns2 = dateRange2 ? filterByDateRange2(checkIns, 'checkInTime').length : 0;
  
  const totalDuration1 = checkInsRange1
    .filter((ci: any) => {
      const checkInTime = ci.checkInTime || ci.check_in_time;
      const checkOutTime = ci.checkOutTime || ci.check_out_time;
      return checkInTime && checkOutTime;
    })
    .reduce((sum: number, ci: any) => {
      const checkInTime = new Date(ci.checkInTime || ci.check_in_time).getTime();
      const checkOutTime = new Date(ci.checkOutTime || ci.check_out_time).getTime();
      return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
    }, 0);

  const totalDuration2 = dateRange2
    ? filterByDateRange2(checkIns, 'checkInTime')
        .filter((ci: any) => {
          const checkInTime = ci.checkInTime || ci.check_in_time;
          const checkOutTime = ci.checkOutTime || ci.check_out_time;
          return checkInTime && checkOutTime;
        })
        .reduce((sum: number, ci: any) => {
          const checkInTime = new Date(ci.checkInTime || ci.check_in_time).getTime();
          const checkOutTime = new Date(ci.checkOutTime || ci.check_out_time).getTime();
          return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
        }, 0)
    : 0;

  const uniqueMembers1 = new Set(
    checkInsRange1
      .map((ci: any) => ci.memberId?._id || ci.memberId)
      .filter(Boolean)
  ).size;

  const uniqueMembers2 = dateRange2
    ? new Set(
        filterByDateRange2(checkIns, 'checkInTime')
          .map((ci: any) => ci.memberId?._id || ci.memberId)
          .filter(Boolean)
      ).size
    : 0;

  const totalSchedules1 = schedulesRange1.length;
  const completedSchedules1 = schedulesRange1.filter((s: any) => s.status === 'Completed').length;

  const summaryData = [
    { 'Chỉ số': 'Khoảng thời gian 1', 'Giá trị': `${formatDate(dateRange1.from)} - ${formatDate(dateRange1.to)}` },
    { 'Chỉ số': 'Tổng số lần check-in (Khoảng 1)', 'Giá trị': totalCheckIns1 },
    { 'Chỉ số': 'Số hội viên tham gia (Khoảng 1)', 'Giá trị': uniqueMembers1 },
    { 'Chỉ số': 'Tổng thời gian tập (phút) (Khoảng 1)', 'Giá trị': totalDuration1 },
    { 'Chỉ số': 'Tổng thời gian tập (giờ) (Khoảng 1)', 'Giá trị': Math.round((totalDuration1 / 60) * 10) / 10 },
    { 'Chỉ số': 'Thời gian trung bình/lần (phút) (Khoảng 1)', 'Giá trị': totalCheckIns1 > 0 ? Math.round(totalDuration1 / totalCheckIns1) : 0 },
    { 'Chỉ số': 'Tổng số buổi PT (Khoảng 1)', 'Giá trị': totalSchedules1 },
    { 'Chỉ số': 'Buổi PT hoàn thành (Khoảng 1)', 'Giá trị': completedSchedules1 },
  ];

  if (dateRange2) {
    summaryData.push(
      { 'Chỉ số': 'Khoảng thời gian 2', 'Giá trị': `${formatDate(dateRange2.from)} - ${formatDate(dateRange2.to)}` },
      { 'Chỉ số': 'Tổng số lần check-in (Khoảng 2)', 'Giá trị': totalCheckIns2 },
      { 'Chỉ số': 'Số hội viên tham gia (Khoảng 2)', 'Giá trị': uniqueMembers2 },
      { 'Chỉ số': 'Tổng thời gian tập (phút) (Khoảng 2)', 'Giá trị': totalDuration2 },
      { 'Chỉ số': 'Tổng thời gian tập (giờ) (Khoảng 2)', 'Giá trị': Math.round((totalDuration2 / 60) * 10) / 10 },
      { 'Chỉ số': 'Thời gian trung bình/lần (phút) (Khoảng 2)', 'Giá trị': totalCheckIns2 > 0 ? Math.round(totalDuration2 / totalCheckIns2) : 0 },
      { 'Chỉ số': 'Chênh lệch số lần check-in', 'Giá trị': totalCheckIns2 - totalCheckIns1 },
      { 'Chỉ số': 'Tỷ lệ tăng trưởng check-in (%)', 'Giá trị': totalCheckIns1 > 0 ? (((totalCheckIns2 - totalCheckIns1) / totalCheckIns1) * 100).toFixed(2) + '%' : 'N/A' },
      { 'Chỉ số': 'Chênh lệch thời gian tập (phút)', 'Giá trị': totalDuration2 - totalDuration1 },
      { 'Chỉ số': 'Chênh lệch số hội viên', 'Giá trị': uniqueMembers2 - uniqueMembers1 }
    );
  }

  const ws7 = XLSX.utils.json_to_sheet(summaryData);
  ws7['!cols'] = [{ wch: 35 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws7, 'Tong hop');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `BaoCaoThamGia-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting attendance report:', error);
    throw new Error('Không thể xuất báo cáo tham gia');
  }
};

export interface PackageReportData {
  packages: any[];
  subscriptions: any[];
  payments: any[];
  members: any[];
  dateRange?: { from: string; to: string };
}

export const exportPackageReportToExcel = (
  data: PackageReportData
): void => {
  const { packages, subscriptions, payments, members, dateRange } = data;

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Filter data by date range if provided
  const filterByDateRange = (items: any[], dateField: string) => {
    if (!dateRange) return items;
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    
    return items.filter((item: any) => {
      const itemDate = new Date(item[dateField] || item.createdAt || item.created_at);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách gói dịch vụ
  const packageData = packages.map((pkg: any) => {
    // Count subscriptions for this package
    const pkgSubscriptions = subscriptions.filter((sub: any) => {
      const subPkgId = sub.packageId?._id || sub.packageId;
      const pkgId = pkg._id || pkg.id;
      return String(subPkgId) === String(pkgId);
    });

    const activeSubscriptions = pkgSubscriptions.filter((s: any) => s.status === 'Active').length;
    const expiredSubscriptions = pkgSubscriptions.filter((s: any) => s.status === 'Expired').length;
    const totalSubscriptions = pkgSubscriptions.length;

    // Calculate revenue from payments
    const pkgRevenue = payments
      .filter((p: any) => {
        if ((p.paymentStatus || p.status) !== 'Completed') return false;
        const subId = p.subscriptionId?._id || p.subscriptionId;
        const matchingSub = pkgSubscriptions.find((s: any) => String(s._id || s.id) === String(subId));
        return !!matchingSub;
      })
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return {
      'Mã gói': pkg._id || pkg.id || '',
      'Tên gói': pkg.name || '',
      'Loại': pkg.type === 'Membership' ? 'Gói tập' :
              pkg.type === 'PT' ? 'Gói PT' :
              pkg.type === 'Combo' ? 'Combo' : pkg.type || '',
      'Cấp độ': pkg.membershipType || pkg.membership_type || '',
      'Thời hạn (tháng)': pkg.durationMonths || pkg.duration_months || 0,
      'Giá': pkg.price || 0,
      'Số buổi PT': pkg.ptSessions || pkg.pt_sessions || 0,
      'Mô tả': pkg.description || '',
      'Trạng thái': pkg.status === 'Active' ? 'Hoạt động' :
                    pkg.status === 'Inactive' ? 'Không hoạt động' : pkg.status || '',
      'Tổng số đăng ký': totalSubscriptions,
      'Đang hoạt động': activeSubscriptions,
      'Hết hạn': expiredSubscriptions,
      'Tỷ lệ giữ chân (%)': totalSubscriptions > 0 ? ((activeSubscriptions / totalSubscriptions) * 100).toFixed(1) : 0,
      'Tổng doanh thu': pkgRevenue,
    };
  });

  if (packageData.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(packageData);
    ws1['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 30 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Danh sach goi dich vu');
  }

  // Sheet 2: Chi tiết đăng ký theo gói
  const subscriptionData: any[] = [];
  
  subscriptions.forEach((sub: any) => {
    const pkg = packages.find((p: any) => {
      const subPkgId = sub.packageId?._id || sub.packageId;
      const pkgId = p._id || p.id;
      return String(subPkgId) === String(pkgId);
    });

    const member = members.find((m: any) => {
      const subMemberId = sub.memberId?._id || sub.memberId;
      const memberId = m._id || m.id;
      return String(subMemberId) === String(memberId);
    });

    // Find payment for this subscription
    const subPayment = payments.find((p: any) => {
      const pSubId = p.subscriptionId?._id || p.subscriptionId;
      const subId = sub._id || sub.id;
      return String(pSubId) === String(subId) && (p.paymentStatus || p.status) === 'Completed';
    });

    subscriptionData.push({
      'Mã đăng ký': sub._id || sub.id || '',
      'Tên gói': pkg?.name || 'N/A',
      'Loại gói': pkg?.type || 'N/A',
      'Hội viên': member?.fullName || 'N/A',
      'Email': member?.email || '',
      'Ngày bắt đầu': formatDate(sub.startDate || sub.start_date),
      'Ngày hết hạn': formatDate(sub.endDate || sub.end_date),
      'Trạng thái': sub.status === 'Active' ? 'Hoạt động' :
                    sub.status === 'Expired' ? 'Hết hạn' :
                    sub.status === 'Pending' ? 'Chờ duyệt' :
                    sub.status === 'Cancelled' ? 'Đã hủy' : sub.status || '',
      'Số tiền đã thanh toán': subPayment?.amount || 0,
      'Ngày thanh toán': formatDate(subPayment?.paymentDate || subPayment?.createdAt),
      'Phương thức thanh toán': subPayment?.paymentMethod === 'momo' ? 'Ví MoMo' :
                               subPayment?.paymentMethod === 'zalopay' ? 'Ví ZaloPay' :
                               subPayment?.paymentMethod === 'cash' ? 'Tiền mặt' :
                               subPayment?.paymentMethod === 'card' ? 'Thẻ' :
                               subPayment?.paymentMethod === 'banktransfer' || subPayment?.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : subPayment?.paymentMethod || 'N/A',
    });
  });

  if (subscriptionData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(subscriptionData);
    ws2['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 20 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 18 }, { wch: 12 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiet dang ky');
  }

  // Sheet 3: Thống kê theo loại gói
  const typeStats: Record<string, any> = {};
  
  packages.forEach((pkg: any) => {
    const type = pkg.type || 'Khác';
    if (!typeStats[type]) {
      typeStats[type] = {
        type,
        totalPackages: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
      };
    }
    typeStats[type].totalPackages += 1;

    const pkgSubscriptions = subscriptions.filter((sub: any) => {
      const subPkgId = sub.packageId?._id || sub.packageId;
      const pkgId = pkg._id || pkg.id;
      return String(subPkgId) === String(pkgId);
    });

    typeStats[type].totalSubscriptions += pkgSubscriptions.length;
    typeStats[type].activeSubscriptions += pkgSubscriptions.filter((s: any) => s.status === 'Active').length;

    // Calculate revenue
    const pkgRevenue = payments
      .filter((p: any) => {
        if ((p.paymentStatus || p.status) !== 'Completed') return false;
        const subId = p.subscriptionId?._id || p.subscriptionId;
        const matchingSub = pkgSubscriptions.find((s: any) => String(s._id || s.id) === String(subId));
        return !!matchingSub;
      })
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    typeStats[type].totalRevenue += pkgRevenue;
  });

  const typeStatsData = Object.values(typeStats).map((stats: any) => ({
    'Loại gói': stats.type === 'Membership' ? 'Gói tập' :
                stats.type === 'PT' ? 'Gói PT' :
                stats.type === 'Combo' ? 'Combo' : stats.type,
    'Số lượng gói': stats.totalPackages,
    'Tổng số đăng ký': stats.totalSubscriptions,
    'Đang hoạt động': stats.activeSubscriptions,
    'Tỷ lệ hoạt động (%)': stats.totalSubscriptions > 0 ? ((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1) : 0,
    'Tổng doanh thu': stats.totalRevenue,
    'Doanh thu trung bình/gói': stats.totalPackages > 0 ? Math.round(stats.totalRevenue / stats.totalPackages) : 0,
  }));

  if (typeStatsData.length > 0) {
    const ws3 = XLSX.utils.json_to_sheet(typeStatsData);
    ws3['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Thong ke theo loai');
  }

  // Sheet 4: Top gói dịch vụ phổ biến
  const packagePopularity: Array<{ pkg: any; count: number; revenue: number }> = [];
  
  packages.forEach((pkg: any) => {
    const pkgSubscriptions = subscriptions.filter((sub: any) => {
      const subPkgId = sub.packageId?._id || sub.packageId;
      const pkgId = pkg._id || pkg.id;
      return String(subPkgId) === String(pkgId);
    });

    const pkgRevenue = payments
      .filter((p: any) => {
        if ((p.paymentStatus || p.status) !== 'Completed') return false;
        const subId = p.subscriptionId?._id || p.subscriptionId;
        const matchingSub = pkgSubscriptions.find((s: any) => String(s._id || s.id) === String(subId));
        return !!matchingSub;
      })
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    if (pkgSubscriptions.length > 0) {
      packagePopularity.push({
        pkg,
        count: pkgSubscriptions.length,
        revenue: pkgRevenue,
      });
    }
  });

  const topPackagesData = packagePopularity
    .sort((a, b) => b.count - a.count)
    .map((item, index) => ({
      'Hạng': index + 1,
      'Tên gói': item.pkg.name || '',
      'Loại': item.pkg.type === 'Membership' ? 'Gói tập' :
              item.pkg.type === 'PT' ? 'Gói PT' :
              item.pkg.type === 'Combo' ? 'Combo' : item.pkg.type || '',
      'Giá': item.pkg.price || 0,
      'Số lượt đăng ký': item.count,
      'Tổng doanh thu': item.revenue,
      'Doanh thu trung bình/lượt': item.count > 0 ? Math.round(item.revenue / item.count) : 0,
    }));

  if (topPackagesData.length > 0) {
    const ws4 = XLSX.utils.json_to_sheet(topPackagesData);
    ws4['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Top goi pho bien');
  }

  // Sheet 5: Thống kê theo cấp độ (Membership level)
  const levelStats: Record<string, any> = {};
  
  packages
    .filter((pkg: any) => pkg.type === 'Membership' || pkg.type === 'Combo')
    .forEach((pkg: any) => {
      const level = pkg.membershipType || pkg.membership_type || 'Khác';
      if (!levelStats[level]) {
        levelStats[level] = {
          level,
          totalPackages: 0,
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          totalRevenue: 0,
        };
      }
      levelStats[level].totalPackages += 1;

      const pkgSubscriptions = subscriptions.filter((sub: any) => {
        const subPkgId = sub.packageId?._id || sub.packageId;
        const pkgId = pkg._id || pkg.id;
        return String(subPkgId) === String(pkgId);
      });

      levelStats[level].totalSubscriptions += pkgSubscriptions.length;
      levelStats[level].activeSubscriptions += pkgSubscriptions.filter((s: any) => s.status === 'Active').length;

      const pkgRevenue = payments
        .filter((p: any) => {
          if ((p.paymentStatus || p.status) !== 'Completed') return false;
          const subId = p.subscriptionId?._id || p.subscriptionId;
          const matchingSub = pkgSubscriptions.find((s: any) => String(s._id || s.id) === String(subId));
          return !!matchingSub;
        })
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      levelStats[level].totalRevenue += pkgRevenue;
    });

  const levelStatsData = Object.values(levelStats).map((stats: any) => ({
    'Cấp độ': stats.level,
    'Số lượng gói': stats.totalPackages,
    'Tổng số đăng ký': stats.totalSubscriptions,
    'Đang hoạt động': stats.activeSubscriptions,
    'Tỷ lệ hoạt động (%)': stats.totalSubscriptions > 0 ? ((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1) : 0,
    'Tổng doanh thu': stats.totalRevenue,
  }));

  if (levelStatsData.length > 0) {
    const ws5 = XLSX.utils.json_to_sheet(levelStatsData);
    ws5['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws5, 'Thong ke theo cap do');
  }

  // Sheet 6: Tổng hợp
  const totalPackages = packages.length;
  const activePackages = packages.filter((p: any) => p.status === 'Active').length;
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'Active').length;
  const totalRevenue = payments
    .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const summaryData = [
    { 'Chỉ số': 'Tổng số gói dịch vụ', 'Giá trị': totalPackages },
    { 'Chỉ số': 'Gói đang hoạt động', 'Giá trị': activePackages },
    { 'Chỉ số': 'Tỷ lệ gói hoạt động (%)', 'Giá trị': totalPackages > 0 ? ((activePackages / totalPackages) * 100).toFixed(1) : 0 },
    { 'Chỉ số': 'Tổng số đăng ký', 'Giá trị': totalSubscriptions },
    { 'Chỉ số': 'Đăng ký đang hoạt động', 'Giá trị': activeSubscriptions },
    { 'Chỉ số': 'Tỷ lệ đăng ký hoạt động (%)', 'Giá trị': totalSubscriptions > 0 ? ((activeSubscriptions / totalSubscriptions) * 100).toFixed(1) : 0 },
    { 'Chỉ số': 'Tổng doanh thu từ gói', 'Giá trị': totalRevenue },
    { 'Chỉ số': 'Doanh thu trung bình/gói', 'Giá trị': totalPackages > 0 ? Math.round(totalRevenue / totalPackages) : 0 },
    { 'Chỉ số': 'Doanh thu trung bình/đăng ký', 'Giá trị': totalSubscriptions > 0 ? Math.round(totalRevenue / totalSubscriptions) : 0 },
  ];

  if (dateRange) {
    summaryData.unshift(
      { 'Chỉ số': 'Khoảng thời gian', 'Giá trị': `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}` }
    );
  }

  const ws6 = XLSX.utils.json_to_sheet(summaryData);
  ws6['!cols'] = [{ wch: 30 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws6, 'Tong hop');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `BaoCaoGoiDichVu-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting package report:', error);
    throw new Error('Không thể xuất báo cáo gói dịch vụ');
  }
};

export interface PaymentsExportData {
  payments: any[];
  title?: string;
}

export const exportPaymentsToExcel = (
  data: PaymentsExportData
): void => {
  const { payments, title = 'Danh sách hóa đơn' } = data;

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusText = (status: string | undefined): string => {
    switch (status) {
      case 'Completed':
        return 'Đã thanh toán';
      case 'Pending':
        return 'Chờ thanh toán';
      case 'Failed':
        return 'Thất bại';
      case 'Refunded':
        return 'Đã hoàn tiền';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status || 'N/A';
    }
  };

  const getPaymentMethodText = (method: string | undefined): string => {
    switch (method) {
      case 'Cash':
      case 'cash':
        return 'Tiền mặt';
      case 'Card':
      case 'card':
        return 'Thẻ';
      case 'Momo':
      case 'momo':
        return 'Ví MoMo';
      case 'ZaloPay':
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'BankTransfer':
      case 'banktransfer':
      case 'bank_transfer':
        return 'Chuyển khoản';
      case 'VNPay':
      case 'vnpay':
        return 'VNPay';
      default:
        return method || 'N/A';
    }
  };

  const getPaymentTypeText = (type: string | undefined): string => {
    switch (type) {
      case 'NEW_SUBSCRIPTION':
        return 'Đăng ký gói mới';
      case 'RENEWAL':
        return 'Gia hạn gói tập';
      case 'PT_PURCHASE':
        return 'Mua buổi tập PT';
      default:
        return type || 'Khác';
    }
  };

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Main data sheet
  const paymentData = payments.map((payment: any) => ({
    'Mã hóa đơn': payment.invoiceNumber || `#${payment._id?.slice(-8).toUpperCase() || ''}`,
    'Mã giao dịch': payment.transactionId || payment.transaction_id || '',
    'Hội viên': payment.memberId?.fullName || payment.memberName || 'N/A',
    'Email': payment.memberId?.email || payment.memberEmail || '',
    'Số điện thoại': payment.memberId?.phone || payment.memberPhone || '',
    'Gói dịch vụ': payment.subscriptionId?.packageId?.name || payment.packageName || 'N/A',
    'Loại gói': payment.subscriptionId?.packageId?.type || 'N/A',
    'Loại thanh toán': getPaymentTypeText(payment.paymentType || payment.payment_type),
    'Phương thức thanh toán': getPaymentMethodText(payment.paymentMethod || payment.payment_method),
    'Số tiền': payment.amount || 0,
    'Giá gốc': payment.subscriptionId?.packageId?.price || payment.originalAmount || payment.original_amount || '',
    'Giảm giá': payment.subscriptionId?.packageId?.price && payment.amount
      ? (payment.subscriptionId.packageId.price - payment.amount)
      : payment.discountAmount || payment.discount_amount || '',
    'Ngày tạo': formatDateTime(payment.createdAt || payment.created_at),
    'Ngày thanh toán': formatDateTime(payment.paymentDate || payment.payment_date),
    'Trạng thái': getStatusText(payment.paymentStatus || payment.status),
    'Ghi chú': payment.notes || payment.note || '',
  }));

  if (paymentData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(paymentData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Mã hóa đơn
      { wch: 20 }, // Mã giao dịch
      { wch: 25 }, // Hội viên
      { wch: 30 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 25 }, // Gói dịch vụ
      { wch: 15 }, // Loại gói
      { wch: 18 }, // Loại thanh toán
      { wch: 20 }, // Phương thức thanh toán
      { wch: 15 }, // Số tiền
      { wch: 15 }, // Giá gốc
      { wch: 15 }, // Giảm giá
      { wch: 20 }, // Ngày tạo
      { wch: 20 }, // Ngày thanh toán
      { wch: 15 }, // Trạng thái
      { wch: 30 }, // Ghi chú
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách hóa đơn');
  }

  // Summary sheet
  const totalAmount = payments
    .filter((p: any) => (p.paymentStatus || p.status) === 'Completed')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const totalTransactions = payments.length;
  const completedTransactions = payments.filter((p: any) => (p.paymentStatus || p.status) === 'Completed').length;
  const pendingTransactions = payments.filter((p: any) => (p.paymentStatus || p.status) === 'Pending').length;
  const failedTransactions = payments.filter((p: any) => (p.paymentStatus || p.status) === 'Failed').length;

  const summaryData = [
    { 'Chỉ số': 'Tổng số giao dịch', 'Giá trị': totalTransactions },
    { 'Chỉ số': 'Đã thanh toán', 'Giá trị': completedTransactions },
    { 'Chỉ số': 'Chờ thanh toán', 'Giá trị': pendingTransactions },
    { 'Chỉ số': 'Thất bại', 'Giá trị': failedTransactions },
    { 'Chỉ số': 'Tổng doanh thu', 'Giá trị': totalAmount },
    { 'Chỉ số': 'Doanh thu trung bình', 'Giá trị': completedTransactions > 0 ? Math.round(totalAmount / completedTransactions) : 0 },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary['!cols'] = [
    { wch: 25 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng hợp');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `BaoCaoHoaDon-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting payments:', error);
    throw new Error('Không thể xuất báo cáo hóa đơn');
  }
};

export interface SelectedMembersExportData {
  members: any[];
  subscriptions: any[];
  checkIns: any[];
  payments?: any[];
}

export const exportSelectedMembersToExcel = (
  data: SelectedMembersExportData
): void => {
  const { members, subscriptions, checkIns, payments = [] } = data;

  // Helper functions
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách hội viên được chọn
  const memberData = members.map((member: any) => {
    // Find active subscription
    const activeSub = subscriptions.find((sub: any) => {
      const subMemberId = sub.memberId?._id || sub.memberId;
      const memberId = member._id || member.id;
      return String(subMemberId) === String(memberId) && sub.status === 'Active';
    });

    // Count check-ins
    const memberCheckIns = checkIns.filter((ci: any) => {
      const ciMemberId = ci.memberId?._id || ci.memberId;
      const memberId = member._id || member.id;
      return String(ciMemberId) === String(memberId);
    });

    // Calculate total workout time
    const totalWorkoutTime = memberCheckIns
      .filter((ci: any) => {
        const checkInTime = ci.checkInTime || ci.check_in_time;
        const checkOutTime = ci.checkOutTime || ci.check_out_time;
        return checkInTime && checkOutTime;
      })
      .reduce((sum: number, ci: any) => {
        const checkInTime = new Date(ci.checkInTime || ci.check_in_time).getTime();
        const checkOutTime = new Date(ci.checkOutTime || ci.check_out_time).getTime();
        return sum + Math.round((checkOutTime - checkInTime) / (1000 * 60));
      }, 0);

    // Get member status
    let memberStatus = 'Không có gói';
    if (activeSub) {
      const now = new Date();
      const endDate = new Date(activeSub.endDate || activeSub.end_date);
      if (now > endDate) {
        memberStatus = 'Hết hạn';
      } else if (activeSub.isSuspended) {
        memberStatus = 'Tạm ngưng';
      } else {
        memberStatus = 'Đang hoạt động';
      }
    }

    // Calculate total spending
    const memberPayments = payments.filter((p: any) => {
      const pMemberId = p.memberId?._id || p.memberId;
      const memberId = member._id || member.id;
      return String(pMemberId) === String(memberId) && (p.paymentStatus || p.status) === 'Completed';
    });

    const totalSpending = memberPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return {
      'Mã hội viên': member.uid || member._id || '',
      'Họ tên': member.fullName || '',
      'Email': member.email || '',
      'Số điện thoại': member.phone || '',
      'Giới tính': member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : member.gender || '',
      'Ngày sinh': formatDate(member.dateOfBirth || member.date_of_birth),
      'CCCD': member.cccd || '',
      'Ngày đăng ký': formatDate(member.createdAt || member.created_at || member.joinDate),
      'Trạng thái': memberStatus,
      'Cấp độ': member.memberInfo?.membership_level || member.member_info?.membership_level || '',
      'Học sinh/Sinh viên': (member.memberInfo?.is_hssv || member.member_info?.is_hssv || member.memberInfo?.is_student) ? 'Có' : 'Không',
      'Gói hiện tại': activeSub?.packageId?.name || activeSub?.type || 'Không có',
      'Ngày bắt đầu gói': formatDate(activeSub?.startDate || activeSub?.start_date),
      'Ngày hết hạn': formatDate(activeSub?.endDate || activeSub?.end_date),
      'Số lần check-in': memberCheckIns.length,
      'Tổng thời gian tập (phút)': totalWorkoutTime,
      'Tổng thời gian tập (giờ)': Math.round((totalWorkoutTime / 60) * 10) / 10,
      'Tổng chi tiêu': totalSpending,
      'Số giao dịch': memberPayments.length,
    };
  });

  if (memberData.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(memberData);
    ws1['!cols'] = [
      { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 },
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Danh sach hoi vien');
  }

  // Sheet 2: Tổng hợp
  const totalMembers = members.length;
  const activeMembers = members.filter((m: any) => {
    const activeSub = subscriptions.find((sub: any) => {
      const subMemberId = sub.memberId?._id || sub.memberId;
      const memberId = m._id || m.id;
      return String(subMemberId) === String(memberId) && sub.status === 'Active';
    });
    if (!activeSub) return false;
    const now = new Date();
    const endDate = new Date(activeSub.endDate || activeSub.end_date);
    return now <= endDate && !activeSub.isSuspended;
  }).length;

  const totalCheckIns = checkIns.filter((ci: any) => {
    const ciMemberId = ci.memberId?._id || ci.memberId;
    return members.some((m: any) => String(m._id || m.id) === String(ciMemberId));
  }).length;

  const totalSpending = payments
    .filter((p: any) => {
      const pMemberId = p.memberId?._id || p.memberId;
      return members.some((m: any) => String(m._id || m.id) === String(pMemberId)) && 
             (p.paymentStatus || p.status) === 'Completed';
    })
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const summaryData = [
    { 'Chỉ số': 'Tổng số hội viên được chọn', 'Giá trị': totalMembers },
    { 'Chỉ số': 'Hội viên đang hoạt động', 'Giá trị': activeMembers },
    { 'Chỉ số': 'Tỷ lệ hoạt động (%)', 'Giá trị': totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 0 },
    { 'Chỉ số': 'Tổng số lần check-in', 'Giá trị': totalCheckIns },
    { 'Chỉ số': 'Tổng chi tiêu', 'Giá trị': totalSpending },
    { 'Chỉ số': 'Chi tiêu trung bình/hội viên', 'Giá trị': totalMembers > 0 ? Math.round(totalSpending / totalMembers) : 0 },
  ];

  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  ws2['!cols'] = [{ wch: 30 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Tong hop');

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `DanhSachHoiVienDuocChon-${dateStr}.xlsx`;
  
  // Write file
  try {
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting selected members:', error);
    throw new Error('Không thể xuất danh sách hội viên được chọn');
  }
};

