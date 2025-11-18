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

